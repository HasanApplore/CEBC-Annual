const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, default: "" },
    org: { type: String, default: "" },
    photo: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

speakerSchema.index({ order: 1 });

module.exports = mongoose.model("Speaker", speakerSchema);
