const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  getAllLinks,
  getLinkAnalytics,
  deleteAllLinks,
  getAnalytics,
  deleteLink,
  toggleLink,
} = require("../controllers/linkController");

const { protect } = require("../middleware/authMiddleware");

// CREATE SHORT URL
router.post("/links", protect, createShortUrl);

// GET ALL LINKS
router.get("/links", protect, getAllLinks);

// DELETE ALL LINKS
router.delete("/links", protect, deleteAllLinks);

// GLOBAL ANALYTICS
router.get("/analytics", protect, getAnalytics);

// PER LINK ANALYTICS
router.get("/analytics/:code", protect, getLinkAnalytics);

// DELETE SINGLE LINK
router.delete("/links/:id", protect, deleteLink);

// TOGGLE LINK
router.patch("/links/:id/toggle", protect, toggleLink);

module.exports = router;