const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables. Please set MONGO_URI in your Render environment variables.");
    }

    // Block localhost in production - it will never work
    if (process.env.NODE_ENV === 'production') {
      const mongoUri = process.env.MONGO_URI.toLowerCase();
      if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1') || mongoUri.includes('::1')) {
        throw new Error(
          "❌ ERROR: MONGO_URI cannot use localhost in production!\n" +
          "   Please use MongoDB Atlas or a remote MongoDB instance.\n" +
          "   Get your connection string from: https://cloud.mongodb.com\n" +
          "   Format: mongodb+srv://username:password@cluster.mongodb.net/dbname"
        );
      }
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
