const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /^(image\/|video\/)/;
  if (allowed.test(file.mimetype)) return cb(null, true);
  cb(new Error("Only image or video files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB, covers hero/background video uploads
});

module.exports = upload;
