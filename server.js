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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Error handling middleware (must be last)
const errorMiddleware = require("./src/middlewares/error.middleware");
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
