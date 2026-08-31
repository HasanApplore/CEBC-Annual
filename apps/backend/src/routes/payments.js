const express = require("express");
const { createCheckoutSession, sendTestBoomrangWebhook } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/boomrang-test-webhook", protect, authorize("admin"), sendTestBoomrangWebhook);

module.exports = router;
