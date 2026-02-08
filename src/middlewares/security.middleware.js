// Security headers middleware for Angular integration
const securityHeaders = (req, res, next) => {
  // Set security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Allow Angular to access custom headers
  res.setHeader("Access-Control-Expose-Headers", "Authorization");

  next();
};

module.exports = securityHeaders;
