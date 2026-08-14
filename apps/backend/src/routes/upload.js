const express = require("express");
const upload = require("../middleware/upload");
const { uploadFile } = require("../controllers/uploadController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("admin"), upload.single("file"), uploadFile);

module.exports = router;
