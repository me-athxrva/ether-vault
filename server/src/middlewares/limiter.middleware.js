const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 1000 * 5,
  max: 5,
  message: "Too many auth attempts, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const docLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 3,
  message: "Too many attempts, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  docLimiter,
};
