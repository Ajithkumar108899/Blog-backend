const { body, validationResult } = require("express-validator");
const response = require("../utils/response.util");

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return response.error(res, 400, errorMessages.join(", "));
  }
  next();
};

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),

  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

const validateRefreshToken = [
  body("refreshToken")
    .optional()
    .notEmpty()
    .withMessage("Refresh token cannot be empty if provided"),
  
  body("token")
    .optional()
    .notEmpty()
    .withMessage("Token cannot be empty if provided"),
  
  body().custom((value) => {
    if (!value.refreshToken && !value.token) {
      throw new Error("Either refreshToken or token is required");
    }
    return true;
  }),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRefreshToken,
};
