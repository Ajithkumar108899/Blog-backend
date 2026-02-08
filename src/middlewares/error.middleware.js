module.exports = (err, req, res, next) => {
  console.error("Error:", err);

  // Don't leak error details in production
  const errorMessage =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
