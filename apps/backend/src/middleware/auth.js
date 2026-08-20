const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Admin = require("../models/Admin");

const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Not authenticated. Please log in.", 401));
  }

  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(new AppError("Invalid or expired session. Please log in again.", 401));
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) return next(new AppError("Admin account no longer exists.", 401));

  req.user = admin;
  next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
}
function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.BOOMRANG_API_KEY) {
    return next(new AppError("Invalid API key.", 401))
  }
  next();
}

module.exports = { protect, authorize, requireApiKey };
