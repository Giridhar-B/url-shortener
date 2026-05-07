const { redisClient } = require("../config/redis");

const rateLimiter = async (req, res, next) => {
  try {
    if (!redisClient || !redisClient.isOpen) {
      return next();
    }

    // Get user IP
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const key = `rate:${ip}`;

    // Get current request count
    let requests = await redisClient.get(key);
    requests = requests ? Number(requests) : 0;

    // Get remaining time
    let ttl = await redisClient.ttl(key);

    // If limit exceeded
    if (requests >= 10) {
      const minutes = Math.ceil(ttl / 60);

      return res.status(429).json({
        message: `Too many requests. Try again after ${minutes} minute(s)`,
      });
    }

    // First request → set expiry
    if (requests === 0) {
      await redisClient.setEx(key, 3600, "1"); // 1 hour
    } else {
      await redisClient.incr(key);
    }

    next();

  } catch (error) {
    console.error("Rate limiter error:", error);

    next();
  }
};

module.exports = rateLimiter;