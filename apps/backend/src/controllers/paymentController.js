const stripe = require("../config/stripe");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Registration = require("../models/Registration");
const SiteContent = require("../models/SiteContent");

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
    success_url: `${process.env.FRONTEND_URL}/?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL}/?payment=cancelled`,
  });

  await Registration.updateOne({ _id: registration._id }, { stripeSessionId: session.id });

  res.status(200).json({ success: true, data: { url: session.url }, message: "Checkout session created" });
});

// Stripe webhook — mounted with express.raw() in server.js so the signature
// can be verified against the exact bytes Stripe sent.
const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const registration = await Registration.findById(session.client_reference_id);
    if (registration) {
      const update = {
        paymentStatus: "paid",
        amount: (session.amount_total || 0) / 100,
      };

      if (session.total_details?.amount_discount) {
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["total_details.breakdown.discounts.discount.promotion_code"],
        });
        const promo = full.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code;
        if (promo && typeof promo === "object") update.discountCode = promo.code;
      }

      await Registration.updateOne({ _id: registration._id }, update);
      // TODO once ready: push this registration to Boomrang's webhook and
      // send the attendee confirmation email — both still pending client
      // credentials (Boomrang endpoint/auth, SMTP access for info@cebcmena.com).
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { createCheckoutSession, stripeWebhook };
