const jwt = require("jsonwebtoken");

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - Token payload
 * @returns {String} - JWT access token
 */
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }); // 15 minutes
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - Token payload
 * @returns {String} - JWT refresh token
 */
exports.generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
};

/**
 * Verify Access Token
 * @param {String} token - JWT token
 * @returns {Object} - Decoded token payload
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 * @param {String} token - Refresh token
 * @returns {Object} - Decoded token payload
 */
exports.verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  );
};
