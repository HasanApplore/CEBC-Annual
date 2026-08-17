const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    // Payment is tracked separately from registration (registering never
    // requires payment to succeed) — status starts "pending" and only
    // flips to "paid" once a real payment-gateway webhook confirms it.
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
