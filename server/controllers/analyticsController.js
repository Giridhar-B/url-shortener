const Link = require("../models/Link");
const Click = require("../models/Click");

// GLOBAL ANALYTICS
const getAnalytics = async (req, res) => {
  try {
    const now = new Date();

    const [
      totalLinks,
      totalClicks,
      activeLinks,
      expiredLinks,
      topLinks,
    ] = await Promise.all([
      // Total links
      Link.countDocuments(),

      // Total clicks
      Click.countDocuments(),

      // Active links
      Link.countDocuments({
        isActive: true,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: now } },
        ],
      }),

      // Expired links
      Link.countDocuments({
        expiresAt: { $ne: null, $lt: now },
      }),

      // Top 5 links
      Click.aggregate([
        {
          $group: {
            _id: "$linkId",
            clicks: { $sum: 1 },
          },
        },

        {
          $sort: {
            clicks: -1,
          },
        },

        {
          $limit: 5,
        },

        {
          $lookup: {
            from: "links",
            localField: "_id",
            foreignField: "_id",
            as: "linkDetails",
          },
        },

        {
          $unwind: "$linkDetails",
        },

        {
          $project: {
            _id: 0,
            shortCode: "$linkDetails.shortCode",
            originalUrl: "$linkDetails.originalUrl",
            clicks: 1,
          },
        },
      ]),
    ]);

    res.json({
      totalLinks,
      totalClicks,
      activeLinks,
      expiredLinks,
      topLinks,
    });
  } catch (error) {
    console.error("Global Analytics Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// PER-LINK ANALYTICS
const getLinkAnalytics = async (req, res) => {
  try {
    const { code } = req.params;

    const range = req.query.range || "7";

    const link = await Link.findOne({
      shortCode: code,
    });

    if (!link) {
      return res.status(404).json({
        message: "Link not found",
      });
    }

    // TOTAL CLICKS
    const totalClicks = await Click.countDocuments({
      linkId: link._id,
    });

    // DATE FILTER
    let startDate = null;

    if (range !== "all") {
      const days = parseInt(range);

      startDate = new Date();

      startDate.setHours(0, 0, 0, 0);

      startDate.setDate(
        startDate.getDate() - days + 1
      );
    }

    // MATCH CONDITION
    const matchCondition = {
      linkId: link._id,
    };

    if (startDate) {
      matchCondition.createdAt = {
        $gte: startDate,
      };
    }

    // RAW CLICKS
    const clicksRaw = await Click.aggregate([
      {
        $match: matchCondition,
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

    // CONVERT TO MAP
    const clicksMap = {};

    clicksRaw.forEach((item) => {
      clicksMap[item._id] = item.clicks;
    });

    // BUILD TIMELINE
    const result = [];

    let totalDays;

    let start;

    if (range === "all") {
      start = new Date(link.createdAt);

      start.setHours(0, 0, 0, 0);

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      totalDays =
        Math.ceil(
          (today - start) /
            (1000 * 60 * 60 * 24)
        ) + 1;
    } else {
      totalDays = parseInt(range);

      start = new Date(startDate);
    }

    for (let i = 0; i < totalDays; i++) {
      const current = new Date(start);

      current.setDate(start.getDate() + i);

      const dateStr = current
        .toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });

      result.push({
        date: dateStr,
        clicks: clicksMap[dateStr] || 0,
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

// CLICK TRENDS
const getClickTrends = async (req, res) => {
  try {
    const days =
      parseInt(req.query.days) || 7;

    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);

    startDate.setDate(
      startDate.getDate() - days + 1
    );

    const clicks = await Click.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
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

    const map = {};

    clicks.forEach((item) => {
      map[item._id] = item.clicks;
    });

    const result = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);

      d.setDate(startDate.getDate() + i);

      const dateStr = d.toLocaleDateString(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
        }
      );

      result.push({
        date: dateStr,
        clicks: map[dateStr] || 0,
      });
    }

    res.json({
      range: days,
      data: result,
    });
  } catch (error) {
    console.error("Trends Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getAnalytics,
  getLinkAnalytics,
  getClickTrends,
};