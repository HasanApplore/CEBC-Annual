const mongoose = require("mongoose");

// One document per past annual summit edition (e.g. "13th Annual Summit").
// Photos and agenda are embedded rather than separate collections since
// they're always managed and displayed together, scoped to their summit.
const pastSummitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g. "13th Annual Summit"
    year: { type: Number, required: true },
    reportUrl: { type: String, default: "" }, // PDF download link
    order: { type: Number, default: 0 },
    photos: [
      {
        _id: false,
        photo: String,
        caption: String,
        description: String,
      },
    ],
    agenda: [
      {
        _id: false,
        time: String,
        title: String,
        detail: String,
        highlights: [String],
        image: String,
      },
    ],
  },
  { timestamps: true }
);

pastSummitSchema.index({ order: 1 });

module.exports = mongoose.model("PastSummit", pastSummitSchema);
