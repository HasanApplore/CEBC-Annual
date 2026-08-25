const stripe = require("../config/stripe");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Registration = require("../models/Registration");
const SiteContent = require("../models/SiteContent");
const sendConfirmationEmail = require("../utils/sendConfirmationEmail");
const { sendBoomrangWebhook } = require("../utils/sendBoomrangWebhook");

// Public — called from the Register form's "payment" step once details are saved.
// Creates a per-registration Stripe Checkout Session so the webhook can match
// the eventual payment back to the right registrant via client_reference_id.
const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { registrationId } = req.body;
  if (!registrationId) return next(new AppError("registrationId is required.", 400));

  const registration = await Registration.findById(registrationId);
  if (!registration) return next(new AppError("Registration not found.", 404));

  const content = await SiteContent.findById(SiteContent.SINGLETON_ID);
  const ticketPrice = content?.ticketPrice || 0;
  const ticketCurrency = content?.ticketCurrency || "aed";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: ticketCurrency,
          product_data: { name: content?.eventInfo?.name || "CEBC Annual Summit Ticket" },
          unit_amount: Math.round(ticketPrice * 100),
        },
        quantity: 1,
      },
    ],
    client_reference_id: registration._id.toString(),
    customer_email: registration.email,
    allow_promotion_codes: true,
    // name/email travel back in the redirect so the confirmation screen can
    // show them — the SPA state (the form) is gone after this full-page
    // round trip to Stripe and back.
    success_url: `${process.env.FRONTEND_URL}/?payment=success&name=${encodeURIComponent(registration.name)}&email=${encodeURIComponent(registration.email)}#register`,
    cancel_url: `${process.env.FRONTEND_URL}/?payment=cancelled&reg=${registration._id}#register`,
  });

  await Registration.updateOne({ _id: registration._id }, { stripeSessionId: session.id });

  res.status(200).json({ success: true, data: { url: session.url }, message: "Checkout session created" });
});

// Best-effort — the promotion code text isn't required to confirm payment,
// so any failure here must never take down the webhook itself.
async function lookupDiscountCode(sessionId) {
  try {
    const full = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["total_details.breakdown.discounts.discount.promotion_code"],
    });
    const promo = full.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code;
    return promo && typeof promo === "object" ? promo.code : "";
  } catch (err) {
    console.error("Discount code lookup failed:", err.message);
    return "";
  }
}

// Stripe webhook — mounted with express.raw() in server.js so the signature
// can be verified against the exact bytes Stripe sent. Wrapped in its own
// try/catch (not catchAsync, which forwards to an error page Stripe won't
// read) so a failure can't crash the process on an unhandled rejection —
// that took the whole backend down previously.
const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const registration = await Registration.findById(session.client_reference_id).catch(() => null);
      if (registration) {
        const update = {
          paymentStatus: "paid",
          amount: (session.amount_total || 0) / 100,
        };

        if (session.total_details?.amount_discount) {
          const discountCode = await lookupDiscountCode(session.id);
          if (discountCode) update.discountCode = discountCode;
        }

        await Registration.updateOne({ _id: registration._id }, update);
        await sendConfirmationEmail(registration);
        await sendBoomrangWebhook({ ...registration.toObject(), ...update });
      }
    }
  } catch (err) {
    // Log and still acknowledge receipt below — returning an error here
    // would make Stripe retry indefinitely without ever fixing itself.
    console.error("Stripe webhook processing failed:", err);
  }

  res.status(200).json({ received: true });
};

// Admin-only — lets Boomrang (or us) confirm the webhook integration works
// without waiting for a real payment. Sends a redacted sample payload.
const sendTestBoomrangWebhook = catchAsync(async (req, res, next) => {
  if (!process.env.BOOMRANG_WEBHOOK_URL) {
    return next(new AppError("BOOMRANG_WEBHOOK_URL is not configured yet.", 400));
  }
  const sample = {
    _id: "000000000000000000000000",
    toObject() {
      return this;
    },
    name: "Test Attendee",
    email: "test-webhook@cebcmena.com",
    phone: "+971500000000",
    company: "Sample Company",
    title: "Sample Job Title",
    countryOfResidency: "United Arab Emirates",
    nationality: "Emirati",
    paymentStatus: "paid",
    amount: 0,
    discountCode: null,
    createdAt: new Date(),
  };
  await sendBoomrangWebhook(sample, "registration.test");
  res.status(200).json({ success: true, message: "Test webhook sent" });
});

module.exports = { createCheckoutSession, stripeWebhook, sendTestBoomrangWebhook };
