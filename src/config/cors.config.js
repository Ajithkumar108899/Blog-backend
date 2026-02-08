const cors = require("cors");

// Allowed origins for Angular frontend
const allowedOrigins = [
  // "http://localhost:4200", // Angular default dev port
  // "http://localhost:5000", // Alternative Angular port
  "https://blog-frontend-nu-drab.vercel.app"
  // "http://localhost:5598/"
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);

    // In development, check against allowedOrigins
    if (process.env.NODE_ENV === "production") {
      return callback(null, true);
    } else {
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
