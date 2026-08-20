const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /^(image\/|video\/)/;
  if (allowed.test(file.mimetype) || file.mimetype === "application/pdf") return cb(null, true);
  cb(new Error("Only image, video, or PDF files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB, covers hero/background video uploads
});

module.exports = upload;
