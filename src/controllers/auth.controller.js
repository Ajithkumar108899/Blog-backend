const response = require("../utils/response.util");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  const userResponse = await authService.registerUser(req.body);
  if (userResponse.error) { 
    return response.error(res, userResponse.statusCode, userResponse.message);
  }
  const registerData = userResponse.data;
  res.setHeader("X-Access-Token", registerData.token);
  res.setHeader("X-Refresh-Token", registerData.refreshToken);
  return response.success(res, userResponse.statusCode, userResponse.message, registerData);
};

exports.login = async (req, res, next) => {
    const userResponse = await authService.loginUser(req.body);
    if (userResponse.error) {
      return response.error(res, userResponse.statusCode, userResponse.message);
    }
    const loginData = userResponse.data;
    res.setHeader("X-Access-Token", loginData.token);
    res.setHeader("X-Refresh-Token", loginData.refreshToken);
    return response.success(res, userResponse.statusCode, userResponse.message, loginData);
};

exports.logout = async (req, res, next) => {
    const logoutResponse = await authService.logoutUser(req);
    if (logoutResponse.error) {
      return response.error(res, logoutResponse.statusCode, logoutResponse.message);
    }
    res.clearCookie("sessionId");
    return response.success(res, logoutResponse.statusCode, logoutResponse.message);
};

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken || req.body.token;
    const tokenResponse = await authService.refreshToken(refreshToken);
    if (tokenResponse.error) {
      return response.error(res, tokenResponse.statusCode, tokenResponse.message);
    }
    res.setHeader("X-Access-Token", tokenResponse.data.token);
    return response.success(res, tokenResponse.statusCode, tokenResponse.message, tokenResponse.data);
};

