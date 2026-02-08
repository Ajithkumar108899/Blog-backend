const response = require("../utils/response.util");
const userService = require("../services/user.service");

exports.getAllUsers = async (req, res, next) => {
  const userResponse = await userService.getAllUsers();
  if (userResponse.error) {
    return response.error(res, userResponse.statusCode, userResponse.message);
  }
  return response.success(res, userResponse.statusCode, userResponse.message, userResponse.data);
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const userResponse = await userService.getUserById(userId);
  if (userResponse.error) {
    return response.error(res, userResponse.statusCode, userResponse.message);
  }
  return response.success(res, userResponse.statusCode, userResponse.message, userResponse.data);
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const userResponse = await userService.updateUser(userId, req.body);
  if (userResponse.error) {
    return response.error(res, userResponse.statusCode, userResponse.message);
  }
  return response.success(res, userResponse.statusCode, userResponse.message, userResponse.data);
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
  const userResponse = await userService.deleteUser(userId);
  if (userResponse.error) {
    return response.error(res, userResponse.statusCode, userResponse.message);
  }
  return response.success(res, userResponse.statusCode, userResponse.message, userResponse.data);
};
