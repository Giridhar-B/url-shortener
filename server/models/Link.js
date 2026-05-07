const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalUrl: {
    type: String,
    required: true
  },
  customAlias: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  name: {
    type: String,
    default: null
  },

}, { timestamps: true });

module.exports = mongoose.model("Link", linkSchema);