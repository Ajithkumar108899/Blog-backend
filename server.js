require("dotenv").config(); // 🔑 MUST BE FIRST

const express = require("express");
const cors = require("./src/config/cors.config");
const connectDB = require("./src/config/db");
const morgan = require("morgan");
const securityHeaders = require("./src/middlewares/security.middleware");
const authRoutes = require("./src/routes/auth.router");
const userRoutes = require("./src/routes/user.router");
const blogRoutes = require("./src/routes/blog.router");

const app = express();

app.use(express.json());
app.use(cors);
app.use(securityHeaders);
app.use(morgan("dev"));

// Health check endpoint (for Render and monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Error handling middleware (must be last)
const errorMiddleware = require("./src/middlewares/error.middleware");
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Render requires 0.0.0.0

// Connect to database and start server
const startServer = async () => {
  try {
    console.log("Starting server...");
    console.log("Environment variables check:");
    console.log("- PORT:", process.env.PORT || "5000 (default)");
    console.log("- NODE_ENV:", process.env.NODE_ENV || "development");
    console.log("- MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ NOT SET - This will cause an error!");
    
    if (!process.env.MONGO_URI) {
      console.error("\n❌ ERROR: MONGO_URI environment variable is not set!");
      console.error("Please add MONGO_URI to your Render environment variables.");
      console.error("Example: mongodb+srv://username:password@cluster.mongodb.net/dbname");
      process.exit(1);
    }

    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`\n🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
    });
  } catch (error) {
    console.error("\n❌ Failed to start server:", error.message);
    if (error.message.includes("ECONNREFUSED") || error.message.includes("localhost")) {
      console.error("\n💡 TIP: Make sure MONGO_URI points to a remote MongoDB instance (like MongoDB Atlas), not localhost.");
      console.error("   Localhost connections won't work in production deployments.");
    }
    process.exit(1);
  }
};

startServer();
