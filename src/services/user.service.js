const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { success } = require("../utils/response.util");

exports.getAllUsers = async () => {
  try {
    const users = await userModel.find({});
    if (!users) {
      return { error: true, statusCode: 404, message: "No users found" };
    }
    const userList = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    }));

    return {
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: userList,
    };
  } catch (error) {
    return { error: true, statusCode: 500, message: error.message || "Internal server error" };
  }
};

exports.getUserById = async (id) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return { error: true, statusCode: 404, message: "User not found" };
    }
    return { success: true, statusCode: 200, message: "User retrieved successfully", data: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (error) {
    return { error: true, statusCode: 500, message: error.message || "Internal server error" };
  }
};

exports.updateUser = async (id, updateDto) => {
  try {
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return { error: true, statusCode: 404, message: "User not found" };
    }

    // Check if email is being updated and if it already exists
    if (updateDto.email && updateDto.email !== existingUser.email) {
      const emailExists = await userModel.findOne({ email: updateDto.email });
      if (emailExists) {
        return { error: true, statusCode: 409, message: "Email already exists" };
      }
    }

    // Prepare update data
    const updateData = {
      name: updateDto.name,
      email: updateDto.email,
      password: updateDto.password ? await bcrypt.hash(updateDto.password, 10) : existingUser.password,
    };

    // Update user in database
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Return response
    return {
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
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

exports.deleteUser = async (id) => {
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return { error: true, statusCode: 404, message: "User not found" };
    }
    return { success: true, statusCode: 200, message: "User deleted successfully", data: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (error) {
    return { error: true, statusCode: 500, message: error.message || "Internal server error" };
  }
};
