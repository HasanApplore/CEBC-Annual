const crudFactory = require("../utils/crudFactory");
const catchAsync = require("../utils/catchAsync");
const Sponsor = require("../models/Sponsor");

const base = crudFactory(Sponsor, "Sponsor");

const DEFAULT_TIERS = [
  "Platinum",
  "Gold",
  "Silver",
  "Sustainability Impact Partner",
  "Bronze",
  "Carbon Neutral Partner",
];

// Frontend consumes sponsors grouped by tier (matches the site's original
// `Record<string, Sponsor[]>` shape) — admin panel uses the flat
// `getAll` list from crudFactory instead.
const getGroupedByTier = catchAsync(async (req, res) => {
  const sponsors = await Sponsor.find().sort({ order: 1, createdAt: 1 });
  const grouped = {};
  for (const tier of DEFAULT_TIERS) {
    grouped[tier] = [];
  }
  for (const sponsor of sponsors) {
    if (!grouped[sponsor.tier]) {
      grouped[sponsor.tier] = [];
    }
    grouped[sponsor.tier].push(sponsor);
  }
  res.status(200).json({ success: true, data: grouped, message: "Sponsors grouped by tier" });
});

module.exports = { ...base, getGroupedByTier };
