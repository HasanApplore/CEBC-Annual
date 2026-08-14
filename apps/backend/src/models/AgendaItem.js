const mongoose = require("mongoose");

const agendaItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    highlights: [{ type: String }],
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

agendaItemSchema.index({ order: 1 });

module.exports = mongoose.model("AgendaItem", agendaItemSchema);
