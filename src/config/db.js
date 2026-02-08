const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables. Please set MONGO_URI in your Render environment variables.");
    }

    // Warn if trying to use localhost in production
    if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI.includes('localhost')) {
      console.warn("⚠️  WARNING: MONGO_URI contains 'localhost'. This will not work in production. Use MongoDB Atlas or a remote MongoDB instance.");
    }

    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs

    // Mongoose 9.x+ doesn't need useNewUrlParser or useUnifiedTopology
    // These are handled automatically by the driver
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Full error:", error);
    throw error; // Re-throw to let caller handle
  }
};

module.exports = connectDB;
