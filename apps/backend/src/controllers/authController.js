const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Admin = require("../models/Admin");

function signToken(admin) {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password are required.", 400));
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  const token = signToken(admin);
  res.status(200).json({
    success: true,
    data: {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    },
    message: "Logged in successfully",
  });
});

const me = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    message: "Current admin",
  });
});

module.exports = { login, me };
