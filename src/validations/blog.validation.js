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

const validateCreateBlog = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),

  handleValidationErrors,
];

const validateUpdateBlog = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),

  handleValidationErrors,
];

module.exports = {
  validateCreateBlog,
  validateUpdateBlog,
};

