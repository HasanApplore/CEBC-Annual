const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

const uploadFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file was uploaded.", 400));

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(req.file.originalname) || "";
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), req.file.buffer);

  res.status(201).json({
    success: true,
    data: { url: `/uploads/${filename}` },
    message: "File uploaded",
  });
});

module.exports = { uploadFile };
