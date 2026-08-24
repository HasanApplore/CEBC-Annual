const Stripe = require("stripe");

// Pinned so behavior doesn't shift under us if the account's default API
// version changes — this account currently defaults to a preview version
// ("2026-07-29.dahlia") whose Discounts API renamed some parameters.
module.exports = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
