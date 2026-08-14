const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { uploadBufferToS3 } = require("../utils/s3Upload");

const uploadFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file was uploaded.", 400));

  const url = await uploadBufferToS3(req.file.buffer, req.file.mimetype, req.file.originalname);

  res.status(201).json({
    success: true,
    data: { url },
    message: "File uploaded",
  });
});

module.exports = { uploadFile };
