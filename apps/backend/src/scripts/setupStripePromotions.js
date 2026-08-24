require("dotenv").config();
const stripe = require("../config/stripe");

// One-time/idempotent setup — creates a Coupon + Promotion Code per discount
// the client provided. Safe to re-run: skips any code that already exists.
const DISCOUNTS = [
  { code: "CEBCMEMBERS", percentOff: 100, name: "CEBC Members (100%)" },
  { code: "CEBCFF25", percentOff: 25, name: "Friends of CEBC (25%)" },
  { code: "CEBCVIP", percentOff: 100, name: "Invited VIP guests (100%)" },
  { code: "EARLYBIRD20", percentOff: 20, name: "Early bird (20%)" },
  { code: "CEBCMEMBER50", percentOff: 50, name: "Member extra ticket (50%)" },
];

async function main() {
  for (const d of DISCOUNTS) {
    const existing = await stripe.promotionCodes.list({ code: d.code, limit: 1 });
    if (existing.data.length) {
      console.log(`Skip ${d.code} — already exists (promo ${existing.data[0].id})`);
      continue;
    }
    const coupon = await stripe.coupons.create({
      percent_off: d.percentOff,
      duration: "forever",
      name: d.name,
    });
    const promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: d.code,
    });
    console.log(`Created ${d.code} — coupon ${coupon.id}, promo ${promo.id}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
