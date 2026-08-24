const crudFactory = require("../utils/crudFactory");
const catchAsync = require("../utils/catchAsync");
const Sponsor = require("../models/Sponsor");

const base = crudFactory(Sponsor, "Sponsor");

// Frontend consumes sponsors grouped by tier (matches the site's original
// `Record<SponsorTier, Sponsor[]>` shape) — admin panel uses the flat
// `getAll` list from crudFactory instead.
const getGroupedByTier = catchAsync(async (req, res) => {
  const sponsors = await Sponsor.find().sort({ order: 1, createdAt: 1 });
  const grouped = { Platinum: [], Gold: [], Silver: [], Bronze: [] };
  for (const sponsor of sponsors) {
    grouped[sponsor.tier]?.push(sponsor);
  }
  res.status(200).json({ success: true, data: grouped, message: "Sponsors grouped by tier" });
});

module.exports = { ...base, getGroupedByTier };
