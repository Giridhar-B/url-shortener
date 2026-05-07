const express = require("express");
const router = express.Router();

const {
  getAnalytics,
  getLinkAnalytics,
  getClickTrends
} = require("../controllers/analyticsController");

// Global analytics
router.get("/", getAnalytics);

// Existing
router.get("/", getAnalytics);

// Per-link analytics
router.get("/:shortCode", getLinkAnalytics);

// Trends
router.get("/trends", getClickTrends);



module.exports = router;


