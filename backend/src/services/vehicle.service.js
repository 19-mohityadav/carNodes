const db = require('../db');

/**
 * Get vehicles with optional marketplace filters
 */
const getVehicles = async (filters = {}) => {
  let queryText = `
    SELECT 
      v.*,
      s.name AS seller_name, s.email AS seller_email, s.phone AS seller_phone,
      o.name AS owner_name, o.email AS owner_email,
      vb.name AS verifier_name
    FROM vehicles v
    JOIN users s ON v.seller_id = s.id
    JOIN users o ON v.current_owner_id = o.id
    LEFT JOIN users vb ON v.verified_by = vb.id
  `;

  const conditions = [];
  const params = [];

  if (filters.status) {
    params.push(filters.status.toUpperCase());
    conditions.push(`v.listing_status = $${params.length}`);
  }

  if (filters.verified !== undefined) {
    const isVerified = filters.verified === 'true' || filters.verified === true;
    if (isVerified) {
      params.push('VERIFIED');
      conditions.push(`v.verification_status = $${params.length}`);
    }
  }

  if (conditions.length > 0) {
    queryText += ' WHERE ' + conditions.join(' AND ');
  }

  queryText += ' ORDER BY v.created_at DESC';

  const result = await db.query(queryText, params);
  return result.rows;
};

/**
 * Get single vehicle by ID including seller, owner, verifier, and documents
 */
const getVehicleById = async (id) => {
  const vehicleQuery = `
    SELECT 
      v.*,
      s.name AS seller_name, s.email AS seller_email, s.phone AS seller_phone,
      o.name AS owner_name, o.email AS owner_email, o.phone AS owner_phone,
      vb.name AS verifier_name, vb.email AS verifier_email
    FROM vehicles v
    JOIN users s ON v.seller_id = s.id
    JOIN users o ON v.current_owner_id = o.id
    LEFT JOIN users vb ON v.verified_by = vb.id
    WHERE v.id = $1
  `;

  const result = await db.query(vehicleQuery, [id]);
  if (result.rows.length === 0) {
    const error = new Error('Vehicle not found.');
    error.statusCode = 404;
    throw error;
  }

  const vehicle = result.rows[0];

  // Fetch document metadata
  const docQuery = `
    SELECT id, document_type, file_name, ipfs_cid, verification_status, created_at
    FROM vehicle_documents
    WHERE vehicle_id = $1
    ORDER BY created_at ASC
  `;
  const docResult = await db.query(docQuery, [id]);

  vehicle.documents = docResult.rows;

  return vehicle;
};

/**
 * Create a new vehicle listing draft (Status: PENDING, UNLISTED)
 */
const createVehicle = async (vehicleData, user) => {
  const { vin, registrationNumber, registration_number, make, model, year, price, description } = vehicleData;

  const regNumber = registrationNumber || registration_number;

  if (!vin || !regNumber || !make || !model || !year || price === undefined) {
    const error = new Error('VIN, registration number, make, model, year, and price are required.');
    error.statusCode = 400;
    throw error;
  }

  const cleanVin = vin.trim().toUpperCase();
  const cleanRegNum = regNumber.trim().toUpperCase();

  // Check unique VIN
  const vinCheck = await db.query('SELECT id FROM vehicles WHERE vin = $1', [cleanVin]);
  if (vinCheck.rows.length > 0) {
    const error = new Error('Vehicle with this VIN already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Check unique registration number
  const regCheck = await db.query('SELECT id FROM vehicles WHERE registration_number = $1', [cleanRegNum]);
  if (regCheck.rows.length > 0) {
    const error = new Error('Vehicle with this registration number already exists.');
    error.statusCode = 409;
    throw error;
  }

  const query = `
    INSERT INTO vehicles (
      seller_id, current_owner_id, vin, registration_number,
      make, model, year, price, description,
      verification_status, listing_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', 'UNLISTED')
    RETURNING *
  `;

  const result = await db.query(query, [
    user.id,
    user.id,
    cleanVin,
    cleanRegNum,
    make.trim(),
    model.trim(),
    parseInt(year, 10),
    parseFloat(price),
    description ? description.trim() : null
  ]);

  return result.rows[0];
};

/**
 * Verify or Reject a vehicle by AUTHORITY
 */
const verifyVehicle = async (vehicleId, { verificationStatus, notes }, authorityUser) => {
  const ALLOWED_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'];
  if (!verificationStatus || !ALLOWED_STATUSES.includes(verificationStatus.toUpperCase())) {
    const error = new Error(`Invalid verification status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const status = verificationStatus.toUpperCase();

  const vehicleCheck = await db.query('SELECT id FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleCheck.rows.length === 0) {
    const error = new Error('Vehicle not found.');
    error.statusCode = 404;
    throw error;
  }

  const query = `
    UPDATE vehicles
    SET 
      verification_status = $1,
      verification_notes = $2,
      verified_by = $3,
      verified_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;

  const result = await db.query(query, [
    status,
    notes ? notes.trim() : null,
    authorityUser.id,
    vehicleId
  ]);

  return result.rows[0];
};

/**
 * List or Unlist a vehicle by SELLER
 */
const updateListingStatus = async (vehicleId, { listingStatus }, sellerUser) => {
  const ALLOWED_LISTING_STATUSES = ['LISTED', 'UNLISTED', 'SOLD'];
  if (!listingStatus || !ALLOWED_LISTING_STATUSES.includes(listingStatus.toUpperCase())) {
    const error = new Error(`Invalid listing status. Allowed: ${ALLOWED_LISTING_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const status = listingStatus.toUpperCase();

  const vehicleResult = await db.query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleResult.rows.length === 0) {
    const error = new Error('Vehicle not found.');
    error.statusCode = 404;
    throw error;
  }

  const vehicle = vehicleResult.rows[0];

  // Verify ownership
  if (vehicle.current_owner_id !== sellerUser.id && vehicle.seller_id !== sellerUser.id) {
    const error = new Error('Forbidden. You can only update listing status for vehicles you own.');
    error.statusCode = 403;
    throw error;
  }

  // Rules: Vehicle must be VERIFIED before it can be LISTED
  if (status === 'LISTED' && vehicle.verification_status !== 'VERIFIED') {
    const error = new Error('Vehicle must be VERIFIED by Authority before it can be LISTED.');
    error.statusCode = 400;
    throw error;
  }

  const query = `
    UPDATE vehicles
    SET listing_status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;

  const result = await db.query(query, [status, vehicleId]);
  return result.rows[0];
};

/**
 * Transfer vehicle ownership (Database MVP with transaction & row lock)
 */
const transferOwnership = async (vehicleId, buyerUser) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Select FOR UPDATE to lock vehicle row and prevent race conditions
    const vehicleResult = await client.query(
      'SELECT * FROM vehicles WHERE id = $1 FOR UPDATE',
      [vehicleId]
    );

    if (vehicleResult.rows.length === 0) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.verification_status !== 'VERIFIED') {
      const error = new Error('Cannot transfer ownership of an unverified vehicle.');
      error.statusCode = 400;
      throw error;
    }

    if (vehicle.listing_status !== 'LISTED') {
      const error = new Error('Vehicle is not currently listed for sale.');
      error.statusCode = 400;
      throw error;
    }

    if (vehicle.current_owner_id === buyerUser.id) {
      const error = new Error('Buyer is already the current owner of this vehicle.');
      error.statusCode = 400;
      throw error;
    }

    const fromUserId = vehicle.current_owner_id;

    // Record ownership transfer record
    const transferQuery = `
      INSERT INTO ownership_transfers (vehicle_id, from_user_id, to_user_id, status)
      VALUES ($1, $2, $3, 'COMPLETED')
      RETURNING *
    `;
    const transferResult = await client.query(transferQuery, [
      vehicleId,
      fromUserId,
      buyerUser.id
    ]);

    // Update vehicle ownership and status to SOLD
    const updateVehicleQuery = `
      UPDATE vehicles
      SET current_owner_id = $1, listing_status = 'SOLD', updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const updatedVehicleResult = await client.query(updateVehicleQuery, [
      buyerUser.id,
      vehicleId
    ]);

    await client.query('COMMIT');

    return {
      vehicle: updatedVehicleResult.rows[0],
      transfer: transferResult.rows[0],
      blockchainStatus: 'PENDING'
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  verifyVehicle,
  updateListingStatus,
  transferOwnership
};
