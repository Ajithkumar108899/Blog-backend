const jwt = require("jsonwebtoken");
const jwtUtil = require("../utils/jwt.util");
const authService = require("../services/auth.service");

// Define user roles
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

/**
 * Authenticate middleware with auto-refresh token
 * If access token expires, automatically refresh using refresh token
 */
const authenticate = async (req, res, next) => {
  // Check for session-based authentication first
  if (req.session && req.session.isAuthenticated) {
    req.user = {
      id: req.session.userId,
      email: req.session.email,
      userName: req.session.userName,
    };
    return next();
  }

  // JWT token authentication
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const refreshToken = req.header("X-Refresh-Token") || req.body?.refreshToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token or session provided.",
    });
  }

  try {
    // Try to verify access token
    const decoded = jwtUtil.verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    // If token expired and refresh token is available, auto-refresh
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        // Auto-refresh token
        const refreshResponse = await authService.refreshToken(refreshToken);

        if (refreshResponse.error) {
          return res.status(refreshResponse.statusCode).json({
            success: false,
            message: refreshResponse.message,
          });
        }

        // Set new access token in response header
        res.setHeader("X-New-Access-Token", refreshResponse.data.token);

        // Set user from refreshed token
        req.user = {
          id: refreshResponse.data.id,
          email: refreshResponse.data.email,
          name: refreshResponse.data.name,
          role: refreshResponse.data.role,
        };

        // Continue with the request
        return next();
      } catch (refreshError) {
        return res.status(401).json({
          success: false,
          message: "Token expired and refresh failed. Please login again.",
        });
      }
    }

    // If token is invalid (not just expired) or no refresh token
    return res.status(401).json({
      success: false,
      message:
        err.name === "TokenExpiredError"
          ? "Token expired. Please provide refresh token or login again."
          : "Invalid token.",
    });
  }
};

/**
 * Authorize Roles middleware
 * Usage: authorizeRoles(ROLES.ADMIN) or authorizeRoles(ROLES.ADMIN, ROLES.USER)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role || req.session?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = { authenticate, authorizeRoles, ROLES };
