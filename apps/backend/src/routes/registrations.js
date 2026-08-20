const express = require("express");
const { createRegistration, getAllRegistrations, getRegistrationsForBoomrang } = require("../controllers/registrationController");
const { protect, authorize } = require("../middleware/auth");
const { requireApiKey } = require("../middleware/auth");

const router = express.Router();

router.post("/", createRegistration);
router.get("/", protect, authorize("admin"), getAllRegistrations);
router.get("/boomrang", requireApiKey, getRegistrationsForBoomrang);

module.exports = router;
