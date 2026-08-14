const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

partnerSchema.index({ order: 1 });

module.exports = mongoose.model("Partner", partnerSchema);
