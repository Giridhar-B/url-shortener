const Link = require("../models/Link");
const Click = require("../models/Click");
const { redisClient } = require("../config/redis");

exports.redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1. Check Redis cache
    const cachedUrl = await redisClient.get(`link:${shortCode}`);

    if (cachedUrl) {
      console.log("Cache hit");

      // increment clicks in DB (optional async)
      await Link.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } }
      );

      return res.redirect(cachedUrl);
    }

    console.log("Cache miss");

    // 2. Fetch from MongoDB
    const link = await Link.findOne({ shortCode });

    if (!link || !link.isActive) {
      return res.status(404).json({ message: "Link not found" });
    }

    // expiry check
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).json({ message: "Link expired" });
    }

    // 3. Store in Redis (24h)
    await redisClient.setEx(
      `link:${shortCode}`,
      86400,
      link.originalUrl
    );

    // 4. Increment clicks
    await Link.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } }
    );

    // 5. Store click analytics
    const today = new Date().toISOString().split("T")[0];

    await Click.create({
      shortCode,
      day: today
    });

    // 6. Redirect
    res.redirect(link.originalUrl);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};