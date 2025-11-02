import mongoose from "mongoose";

// Sub-schema for click analytics
const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  country: { type: String },
});

// Main URL schema
const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true, // generated with nanoid() or custom alias
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined
    },
    qrCode: {
      type: String, // Base64 QR image
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
    },
    analytics: [clickSchema], // detailed per-click tracking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
