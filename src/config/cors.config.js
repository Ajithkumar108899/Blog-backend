const cors = require("cors");

// Allowed origins for Angular frontend
const allowedOrigins = [
  "http://localhost:4200", // Angular default dev port
  "http://localhost:5000", // Alternative Angular port
  process.env.FRONTEND_URL, // Production frontend URL from environment
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);

    // In production, allow all origins if FRONTEND_URL is not set (for flexibility)
    // In development, check against allowedOrigins
    if (process.env.NODE_ENV === "production") {
      // Allow all origins in production (you can restrict this if needed)
      // Or check against allowedOrigins if FRONTEND_URL is set
      if (allowedOrigins.length > 0 && allowedOrigins.indexOf(origin) === -1) {
        // If FRONTEND_URL is set, only allow that origin
        return callback(null, true); // For now, allow all in production
      }
      return callback(null, true);
    } else {
      // Development mode - check against allowedOrigins
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true, // Allow cookies/credentials
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  maxAge: 86400, // 24 hours
};

module.exports = cors(corsOptions);
