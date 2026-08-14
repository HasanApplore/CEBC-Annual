const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Registration = require("../models/Registration");

// Public — called from the site's Register.tsx "details" step.
const createRegistration = catchAsync(async (req, res, next) => {
  const { name, email, title, company, country, phone } = req.body;
  if (!name || !email) {
    return next(new AppError("Name and email are required.", 400));
  }

  const registration = await Registration.create({ name, email, title, company, country, phone });
  res.status(201).json({
    success: true,
    data: registration,
    message: "Registration received",
  });
});

// Admin-only — list/export registrants.
const getAllRegistrations = catchAsync(async (req, res) => {
  const registrations = await Registration.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: registrations, message: "Registrations list" });
});

module.exports = { createRegistration, getAllRegistrations };
