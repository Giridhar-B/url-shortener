const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Click", clickSchema);