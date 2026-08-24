const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
    tier: { type: String, enum: ["Platinum", "Gold", "Silver", "Bronze"], required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

sponsorSchema.index({ tier: 1, order: 1 });

module.exports = mongoose.model("Sponsor", sponsorSchema);
