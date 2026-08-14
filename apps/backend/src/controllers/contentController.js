const catchAsync = require("../utils/catchAsync");
const SiteContent = require("../models/SiteContent");

const getContent = catchAsync(async (req, res) => {
  let content = await SiteContent.findById(SiteContent.SINGLETON_ID);
  if (!content) {
    content = await SiteContent.create({ _id: SiteContent.SINGLETON_ID });
  }
  res.status(200).json({ success: true, data: content, message: "Site content" });
});

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Shallow-merges each top-level section (eventInfo, aboutContent, ...) into
// the existing document instead of replacing it outright, so a client that
// only sends a subset of a section's fields doesn't wipe the rest. Arrays
// (heroLogoStrip, navLinks, socials, paragraphs, ...) are replaced wholesale,
// since partial array updates aren't meaningful here.
const updateContent = catchAsync(async (req, res) => {
  let content = await SiteContent.findById(SiteContent.SINGLETON_ID);
  if (!content) content = new SiteContent({ _id: SiteContent.SINGLETON_ID });

  for (const [key, value] of Object.entries(req.body)) {
    if (isPlainObject(value) && isPlainObject(content[key]?.toObject?.() ?? content[key])) {
      const current = content[key]?.toObject?.() ?? content[key] ?? {};
      content[key] = { ...current, ...value };
    } else {
      content[key] = value;
    }
  }

  await content.save();
  res.status(200).json({ success: true, data: content, message: "Site content updated" });
});

module.exports = { getContent, updateContent };
