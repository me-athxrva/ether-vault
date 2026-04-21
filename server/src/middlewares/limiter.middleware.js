const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

const authLimiter = rateLimit({
  windowMs: 1000 * 10,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Too many attempts, try again later",
    });
  },
});

const docLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Too many attempts, try again later",
    });
  },
});

module.exports = {
  authLimiter,
  docLimiter,
};
