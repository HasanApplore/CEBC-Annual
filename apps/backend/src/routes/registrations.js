const express = require("express");
const { createRegistration, getAllRegistrations } = require("../controllers/registrationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", createRegistration);
router.get("/", protect, authorize("admin"), getAllRegistrations);

module.exports = router;
