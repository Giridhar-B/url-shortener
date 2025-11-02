import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import urlRoutes from "./routes/url.js";
import Url from "./models/Url.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Redirect handler (root level)
app.get("/:shortId", async (req, res) => {
  try {
    // Find URL whose shortUrl ends with shortId
    const urlDoc = await Url.findOne({
      shortUrl: { $regex: req.params.shortId + "$" },
    });

    if (!urlDoc) return res.status(404).send("URL not found");

    // Increment clicks
    urlDoc.clicks++;
    await urlDoc.save();

    // Redirect to original
    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
