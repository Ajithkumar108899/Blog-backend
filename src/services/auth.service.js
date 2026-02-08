const bcrypt = require("bcryptjs");
const user = require("../models/user.model");
const jwtUtil = require("../utils/jwt.util");
const { success } = require("../utils/response.util");

exports.registerUser = async (registerUser) => {
  try {
    const existingUser = await user.findOne({ email: registerUser.email });
    if (existingUser) {
      return { error: true, statusCode: 409, message: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(registerUser.password, 10);
    const newUser = new user({
      name: registerUser.name,
      email: registerUser.email,
      password: hashedPassword,
      role: registerUser.role || "user",
    });
    await newUser.save();
    
    // Generate tokens for auto-login after registration
    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    const token = jwtUtil.generateToken(payload);
    const refreshToken = jwtUtil.generateRefreshToken(payload);
    
    return {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: {
        token,
        refreshToken,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.loginUser = async (loginData) => {
  try {
    const existingUser = await user.findOne({ email: loginData.email });
    if (!existingUser) {
      return { error: true, statusCode: 401, message: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return { error: true, statusCode: 401, message: "Invalid credentials" };
    }

    // Generate Access Token and Refresh Token
    const payload = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    const token = jwtUtil.generateToken(payload);
    const refreshToken = jwtUtil.generateRefreshToken(payload);

    // Return response with tokens
    return {
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        refreshToken,
        user: {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      },
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.logoutUser = async (req) => {
  try {
    // For JWT-based auth, logout is handled client-side by removing tokens
    // If using sessions, destroy the session
    if (req.session) {
      return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            return reject({
              error: true,
              statusCode: 500,
              message: "Error logging out",
            });
          }
          resolve({
            success: true,
            statusCode: 200,
            message: "Logout successful",
          });
        });
      });
    }
    // For JWT, just return success (client removes tokens)
    return {
      success: true,
      statusCode: 200,
      message: "Logout successful",
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.refreshToken = async (refreshToken) => {
  try {
    const decoded = jwtUtil.verifyRefreshToken(refreshToken);

    const existingUser = await user.findById(decoded.id);
    if (!existingUser) {
      return { error: true, statusCode: 401, message: "User not found" };
    }

    const newAccessToken = jwtUtil.generateToken({
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    });

    return {
      success: true,
      statusCode: 200,
      message: "Token refreshed successfully",
      data: {
        token: newAccessToken,
        id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { error: true, statusCode: 401, message: "Refresh token expired" };
    }
    if (error.name === "JsonWebTokenError") {
      return { error: true, statusCode: 401, message: "Invalid refresh token" };
    }
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};
