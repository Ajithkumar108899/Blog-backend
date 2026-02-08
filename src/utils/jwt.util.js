const jwt = require("jsonwebtoken");

/**
 * Validate JWT_SECRET is set
 */
const validateJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set. Please add JWT_SECRET to your Render environment variables.");
  }
};

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - Token payload
 * @returns {String} - JWT access token
 */
exports.generateToken = (payload) => {
  validateJWTSecret();
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }); // 15 minutes
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - Token payload
 * @returns {String} - JWT refresh token
 */
exports.generateRefreshToken = (payload) => {
  validateJWTSecret();
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  return jwt.sign(
    payload,
    secret,
    { expiresIn: "15m" },
  );
};

/**
 * Verify Access Token
 * @param {String} token - JWT token
 * @returns {Object} - Decoded token payload
 */
exports.verifyToken = (token) => {
  validateJWTSecret();
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 * @param {String} token - Refresh token
 * @returns {Object} - Decoded token payload
 */
exports.verifyRefreshToken = (token) => {
  validateJWTSecret();
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  return jwt.verify(
    token,
    secret,
  );
};
