exports.success = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
