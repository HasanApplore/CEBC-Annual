const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    // Ticket/payment fields are unused while the payment gateway is
    // pending — kept here so adding payment later doesn't require a
    // schema migration.
    ticketType: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["not_required", "pending", "paid"],
      default: "not_required",
    },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
