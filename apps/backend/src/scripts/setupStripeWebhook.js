require("dotenv").config();
const stripe = require("../config/stripe");

const WEBHOOK_URL = "https://cebc-api.applore.in/api/payments/webhook";

async function main() {
  const existing = await stripe.webhookEndpoints.list({ limit: 20 });
  const already = existing.data.find((w) => w.url === WEBHOOK_URL);
  if (already) {
    console.log(`Webhook endpoint already exists: ${already.id} (secret not re-shown by Stripe).`);
    return;
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: ["checkout.session.completed"],
    description: "CEBC registration payment confirmation",
  });

  console.log(`Created webhook endpoint: ${endpoint.id}`);
  console.log(`Signing secret: ${endpoint.secret}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
