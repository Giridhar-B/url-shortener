const Link = require("../models/Link");
const Click = require("../models/Click");
const generateShortCode = require("../utils/generateShortCode");
const { getRedisClient } = require("../config/redis");

const normalizeUrl = (url) => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

// CREATE SHORT URL
exports.createShortUrl = async (req, res) => {
  try {
    const { url, customAlias, expiresAt, name } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const formattedUrl = normalizeUrl(url);
    const shortCode = customAlias || generateShortCode();

    const existing = await Link.findOne({ shortCode });

    if (existing) {
      return res.status(400).json({ message: "Alias already taken" });
    }

    const newLink = await Link.create({
      name: name || null,
      shortCode,
      originalUrl: formattedUrl,
      user: req.user.userId,
      customAlias: customAlias || null,
      expiresAt: expiresAt || null,
    });

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    res.status(201).json({
      shortUrl,
      data: newLink,
    });

  } catch (error) {
    console.error("Create Short URL Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL LINKS
exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    const linksWithClicks = await Promise.all(
      links.map(async (link) => {
        const clickCount = await Click.countDocuments({
          linkId: link._id,
        });

        return {
          _id: link._id,
          name: link.name,
          shortId: link.shortCode,
          originalUrl: link.originalUrl,
          createdAt: link.createdAt,
          isActive: link.isActive,
          clicks: clickCount,
        };
      })
    );

    res.status(200).json(linksWithClicks);

  } catch (error) {
    console.error("Get Links Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE SINGLE LINK
exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    await Click.deleteMany({ linkId: id });
    await Link.findByIdAndDelete(id);

    res.json({ message: "Link deleted successfully" });

  } catch (error) {
    console.error("Delete Link Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE ACTIVE / INACTIVE
exports.toggleLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    link.isActive = !link.isActive;
    await link.save();

    res.json({
      message: "Link updated",
      isActive: link.isActive,
    });

  } catch (error) {
    console.error("Toggle Link Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ALL LINKS
exports.deleteAllLinks = async (req, res) => {
  try {
    const userLinks = await Link.find({ user: req.user.userId });

    const linkIds = userLinks.map((l) => l._id);

    await Link.deleteMany({ user: req.user.userId });
    await Click.deleteMany({ linkId: { $in: linkIds } });

    res.status(200).json({ message: "All links deleted successfully" });

  } catch (error) {
    console.error("Delete All Links Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GLOBAL ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userLinks = await Link.find({ user: userId });
    const linkIds = userLinks.map((l) => l._id);

    const totalLinks = userLinks.length;

    const totalClicks = await Click.countDocuments({
      linkId: { $in: linkIds },
    });

    const activeLinks = await Link.countDocuments({
      user: userId,
      isActive: true,
    });

    res.json({
      totalLinks,
      totalClicks,
      activeLinks,
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// PER LINK ANALYTICS
exports.getLinkAnalytics = async (req, res) => {
  try {
    const { code } = req.params;

    // IMPORTANT FIX
    let range = req.query.range || "7";

    // FETCH LINK
    const link = await Link.findOne({
      shortCode: code,
      user: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({
        message: "Link not found",
      });
    }

    // DETERMINE DAYS
    let days;

    if (range === "all") {
      const diffTime =
        new Date() - new Date(link.createdAt);

      days =
        Math.ceil(
          diffTime / (1000 * 60 * 60 * 24)
        ) || 1;
    } else if (
      range === "7" ||
      range === "30"
    ) {
      days = parseInt(range);
    } else {
      days = 7;
    }

    // TOTAL CLICKS
    const totalClicks =
      await Click.countDocuments({
        linkId: link._id,
      });

    // DATE RANGE
    const end = new Date();

    end.setHours(23, 59, 59, 999);

    const start = new Date();

    start.setDate(
      start.getDate() - days + 1
    );

    start.setHours(0, 0, 0, 0);

    // FILTERED AGGREGATION
    const clicksRaw = await Click.aggregate([
      {
        $match: {
          linkId: link._id,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },

          clicks: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // MAP
    const map = {};

    clicksRaw.forEach((item) => {
      map[item._id] = item.clicks;
    });

    // GENERATE FULL RANGE
    const result = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(start);

      d.setDate(start.getDate() + i);

      const dateStr =
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(d);

      result.push({
        date: dateStr,
        clicks: map[dateStr] || 0,
      });
    }

    res.json({
      totalClicks,

      createdAt: link.createdAt,

      isActive: link.isActive,

      name: link.name,

      originalUrl: link.originalUrl,

      shortCode: link.shortCode,

      range,

      data: result,
    });
  } catch (error) {
    console.error(
      "Link Analytics Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// REDIRECT SHORT URL
exports.redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const client = getRedisClient();

    // Redis cache check
    if (client) {
      try {
        const cachedUrl = await client.get(shortCode);

        if (cachedUrl) {
          const link = await Link.findOne({ shortCode });

          if (!link || !link.isActive) {
            return res.status(403).json({ message: "Link is inactive" });
          }

          await Click.create({ linkId: link._id }).catch(() => {});
          return res.redirect(cachedUrl);
        }
      } catch (err) {
        console.log("Redis read error:", err.message);
      }
    }

    // DB fetch
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (!link.isActive) {
      return res.status(403).json({ message: "Link is inactive" });
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Link expired" });
    }

    const redirectUrl = normalizeUrl(link.originalUrl);

    // cache store
    if (client) {
      try {
        await client.set(shortCode, redirectUrl, { EX: 3600 });
      } catch (err) {
        console.log("Redis write error:", err.message);
      }
    }

    // track click
    await Click.create({ linkId: link._id }).catch(() => {});

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};