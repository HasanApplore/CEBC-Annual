const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Registration = require("../models/Registration");

// Public — called from the site's Register.tsx "details" step.
const createRegistration = catchAsync(async (req, res, next) => {
  const { name, email, title, company, countryOfResidency, nationality, phone } = req.body;
  if (!name || !email) {
    return next(new AppError("Name and email are required.", 400));
  }
  if (!countryOfResidency || !nationality) {
    return next(new AppError("Country of residency and nationality are required.", 400));
  }
  if (!title || !company) {
    return next(new AppError("Job title and company are required.", 400));
  }

  const registration = await Registration.create({
    name,
    email,
    title,
    company,
    countryOfResidency,
    nationality,
    phone,
  });
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

const getRegistrationsForBoomrang = catchAsync(async (req, res, next) => {
  const registrations = await Registration.find({ paymentStatus: "paid" }).sort({ createdAt: -1 });
  const data = registrations.map((r) => ({
    id: r._id,
    name: r.name,
    email: r.email,
    title: r.title,
    company: r.company,
    countryOfResidency: r.countryOfResidency,
    nationality: r.nationality,
    phone: r.phone,
    amount: r.amount,
    registeredAt: r.createdAt,
  }));

  res.status(200).json({ success: true, data });
})

module.exports = { createRegistration, getAllRegistrations, getRegistrationsForBoomrang };
