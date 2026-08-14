const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    photo: { type: String, required: true },
    caption: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryImageSchema.index({ order: 1 });

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
