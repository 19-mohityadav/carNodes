const db = require('../db');

const ALLOWED_DOC_TYPES = ['RC', 'INSURANCE', 'POLLUTION', 'INVOICE', 'IDENTITY', 'OTHER'];

/**
 * Add document metadata for a vehicle
 */
const addDocumentMetadata = async (vehicleId, { documentType, fileName }, user) => {
  if (!documentType || !fileName) {
    const error = new Error('documentType and fileName are required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedDocType = documentType.toUpperCase().trim();
  if (!ALLOWED_DOC_TYPES.includes(normalizedDocType)) {
    const error = new Error(`Invalid documentType. Allowed types: ${ALLOWED_DOC_TYPES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  // Check vehicle exists and user is seller/owner
  const vehicleResult = await db.query('SELECT seller_id, current_owner_id FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleResult.rows.length === 0) {
    const error = new Error('Vehicle not found.');
    error.statusCode = 404;
    throw error;
  }

  const vehicle = vehicleResult.rows[0];
  if (user.role === 'SELLER' && vehicle.seller_id !== user.id && vehicle.current_owner_id !== user.id) {
    const error = new Error('Forbidden. You can only upload document metadata for vehicles you own.');
    error.statusCode = 403;
    throw error;
  }

  const query = `
    INSERT INTO vehicle_documents (vehicle_id, document_type, file_name, ipfs_cid, verification_status)
    VALUES ($1, $2, $3, NULL, 'PENDING')
    RETURNING *
  `;

  const result = await db.query(query, [vehicleId, normalizedDocType, fileName.trim()]);
  return result.rows[0];
};

/**
 * Get document metadata for a vehicle
 */
const getDocumentsByVehicleId = async (vehicleId) => {
  const vehicleResult = await db.query('SELECT id FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleResult.rows.length === 0) {
    const error = new Error('Vehicle not found.');
    error.statusCode = 404;
    throw error;
  }

  const query = `
    SELECT id, vehicle_id, document_type, file_name, ipfs_cid, verification_status, created_at
    FROM vehicle_documents
    WHERE vehicle_id = $1
    ORDER BY created_at ASC
  `;

  const result = await db.query(query, [vehicleId]);
  return result.rows;
};

module.exports = {
  addDocumentMetadata,
  getDocumentsByVehicleId
};
