import express from "express";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import Url from "../models/Url.js";
import authMiddleware from "../middleware/authMiddleware.js";
import geoip from "geoip-lite";

const router = express.Router();

/**
 * @route POST /api/url/shorten
 * @desc Create a short URL for a logged-in user (supports custom alias + QR code)
 */
router.post("/shorten", authMiddleware, async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    // Check if custom alias already exists
    if (customAlias) {
      const aliasExists = await Url.findOne({ customAlias });
      if (aliasExists) {
        return res.status(400).json({ message: "Custom alias already taken" });
      }
    }

    // Generate shortId (use alias if provided)
    const shortId = customAlias || nanoid(6);

    // Build full short URL
    const shortUrl = `${req.protocol}://${req.get("host")}/${shortId}`;

    // Generate QR Code
    const qrCode = await QRCode.toDataURL(shortUrl);

    // Create and save document
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      shortId,
      customAlias,
      qrCode,
      user: req.user.id,
      totalClicks: 0,
    });

    await newUrl.save();

    res.status(201).json({ message: "Short URL created", url: newUrl });
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route GET /api/url/user
 * @desc Get all URLs created by logged-in user
 */
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(urls);
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route DELETE /api/url/:id
 * @desc Delete a URL owned by the logged-in user
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Url.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "URL not found or unauthorized" });
    }

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting URL:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route GET /:shortId
 * @desc Redirect short URL to original URL + update click tracking
 */
router.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    // Find by either shortId or customAlias
    const urlDoc = await Url.findOne({
      $or: [{ shortId }, { customAlias: shortId }],
    });

    if (!urlDoc) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Capture click info
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ipAddress);
    const country = geo ? geo.country : "Unknown";

    // Update tracking
    urlDoc.totalClicks = (urlDoc.totalClicks || 0) + 1;
    urlDoc.lastClickedAt = new Date();

    // Optional: Add simple click record
    urlDoc.analytics.push({
      ipAddress,
      country,
      timestamp: new Date(),
    });

    await urlDoc.save();

    // Redirect
    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error("Error redirecting:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route GET /api/url/analytics/:shortId
 * @desc Get analytics for a short URL (total clicks + last click time)
 */
router.get("/analytics/:shortId", authMiddleware, async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlDoc = await Url.findOne({
      $or: [{ shortId }, { customAlias: shortId }],
      user: req.user.id,
    });

    if (!urlDoc) {
      return res.status(404).json({ message: "URL not found or unauthorized" });
    }

    res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      shortUrl: urlDoc.shortUrl,
      totalClicks: urlDoc.totalClicks,
      lastClickedAt: urlDoc.lastClickedAt,
      qrCode: urlDoc.qrCode,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
