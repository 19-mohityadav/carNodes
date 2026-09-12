const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const ALLOWED_ROLES = ['BUYER', 'SELLER', 'AUTHORITY'];

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password, role, phone }) => {
  if (!name || !email || !password || !role) {
    const error = new Error('Name, email, password, and role are required fields.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedRole = role.toUpperCase().trim();
  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    const error = new Error(`Invalid role. Allowed roles are: ${ALLOWED_ROLES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check duplicate email
  const existingUserResult = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existingUserResult.rows.length > 0) {
    const error = new Error('User with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert user
  const insertQuery = `
    INSERT INTO users (name, email, password_hash, role, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role, phone, created_at
  `;
  const result = await db.query(insertQuery, [
    name.trim(),
    normalizedEmail,
    passwordHash,
    normalizedRole,
    phone ? phone.trim() : null
  ]);

  const user = result.rows[0];

  // Sign JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'carnodes_super_secret_jwt_key_hackathon_2026',
    { expiresIn: '2h' }
  );

  return { user, token };
};

/**
 * Login user
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Find user
  const userResult = await db.query(
    'SELECT id, name, email, password_hash, role, phone, created_at FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (userResult.rows.length === 0) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const user = userResult.rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Remove password_hash from return object
  delete user.password_hash;

  // Sign JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'carnodes_super_secret_jwt_key_hackathon_2026',
    { expiresIn: '2h' }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser
};
