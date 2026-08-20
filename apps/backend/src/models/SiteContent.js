const mongoose = require("mongoose");

// Singleton document holding every non-repeating homepage content block.
// Only one document should ever exist in this collection — enforced by
// always querying/upserting the well-known SINGLETON_ID below.
const siteContentSchema = new mongoose.Schema(
  {
    eventInfo: {
      name: { type: String, default: "" },
      organizer: { type: String, default: "" },
      theme: { type: String, default: "" },
      dateLabel: { type: String, default: "" },
      timeLabel: { type: String, default: "" },
      venue: { type: String, default: "" },
      countdownTarget: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
      heroImageUrl: { type: String, default: "" },
      heroVideoUrl: { type: String, default: "" },
      galleryHeroVideoUrl: { type: String, default: "" },
    },
    heroLogoStrip: [
      {
        _id: false,
        name: String,
        logo: String,
      },
    ],
    sustainabilityFacts: [{ type: String }],
    navLinks: [
      {
        _id: false,
        label: String,
        href: String,
      },
    ],
    aboutContent: {
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      paragraphs: [
        {
          _id: false,
          text: String,
          bold: Boolean,
          image: String,
        },
      ],
    },
    galleryContent: {
      eyebrow: { type: String, default: "" },
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      reportUrl: { type: String, default: "" },
    },
    footerContent: {
      about: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      backgroundVideoUrl: { type: String, default: "" },
      socials: [
        {
          _id: false,
          platform: String,
          href: String,
        },
      ],
    },
    // Hosted checkout link (e.g. a Stripe Payment Link) — the Register
    // form's payment step sends attendees here instead of collecting card
    // details directly, since there's no payment-gateway backend yet.
    paymentLink: { type: String, default: "" },
  },
  { timestamps: true }
);

const SINGLETON_ID = "000000000000000000000001";
siteContentSchema.statics.SINGLETON_ID = SINGLETON_ID;

module.exports = mongoose.model("SiteContent", siteContentSchema);
