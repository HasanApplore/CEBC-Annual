const crypto = require("crypto");

// This is CEBC's single, ongoing event — Boomrang's "event ID" field is a
// static identifier rather than something we look up per registration.
const EVENT_ID = "cebc-14th-annual-summit";

function buildPayload(registration, type) {
  return {
    event: type, // "registration.completed" | "registration.cancelled"
    eventId: EVENT_ID,
    registrationId: registration._id.toString(),
    data: {
      name: registration.name,
      email: registration.email,
      mobile: registration.phone,
      company: registration.company,
      jobTitle: registration.title,
      countryOfResidency: registration.countryOfResidency,
      nationality: registration.nationality,
      registrationStatus: registration.paymentStatus,
      amount: registration.amount,
      discountCode: registration.discountCode || null,
      registeredAt: registration.createdAt,
    },
  };
}

function sign(payload, timestamp) {
  const signedString = `${timestamp}.${JSON.stringify(payload)}`;
  return crypto.createHmac("sha256", process.env.BOOMRANG_WEBHOOK_SECRET).update(signedString).digest("hex");
}

// Fires the outbound webhook to Boomrang. Best-effort with retries — never
// throws, so it can never break the payment webhook that triggers it.
async function sendBoomrangWebhook(registration, type = "registration.completed") {
  const url = process.env.BOOMRANG_WEBHOOK_URL;
  if (!url) return; // not configured yet — Boomrang hasn't given us their endpoint

  const payload = buildPayload(registration, type);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign(payload, timestamp);

  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CEBC-Signature": `t=${timestamp},v1=${signature}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return;
      console.error(`Boomrang webhook attempt ${attempt} failed: HTTP ${res.status}`);
    } catch (err) {
      console.error(`Boomrang webhook attempt ${attempt} failed:`, err.message);
    }
    if (attempt < attempts) await new Promise((r) => setTimeout(r, attempt * 2000));
  }
}

module.exports = { sendBoomrangWebhook, buildPayload, sign, EVENT_ID };
