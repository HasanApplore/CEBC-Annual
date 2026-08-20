require("dotenv").config();

const { connectDatabase } = require("../config/database");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const SiteContent = require("../models/SiteContent");
const AgendaItem = require("../models/AgendaItem");
const Speaker = require("../models/Speaker");
const Sponsor = require("../models/Sponsor");
const Partner = require("../models/Partner");
const GalleryImage = require("../models/GalleryImage");

// Values transcribed from apps/frontend/src/data/summit.ts so the site and
// admin panel aren't empty on first run.

function placeholderLogo(label, bg) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${bg}&color=fff&size=256&bold=true&font-size=0.33&length=2`;
}

function placeholderPhoto(seed) {
  return `https://picsum.photos/seed/${seed}/900/700`;
}

const siteContentSeed = {
  eventInfo: {
    name: "The 14th CEBC Annual Summit",
    organizer: "Clean Energy Business Council MENA (CEBC)",
    theme: '"The Turning Point: Change, Resilience, and Economic Transformation in MENA"',
    dateLabel: "01 October 2026",
    timeLabel: "08:00 – 17:00 GST",
    venue: "DIFC Conference Centre, Dubai, UAE",
    countdownTarget: "2026-10-01T08:00:00+04:00",
    logoUrl: "",
    heroImageUrl: "/images/Gemini_Generated_Image_dzsqoedzsqoedzsq.png",
    heroVideoUrl: "/videos/12443259_1920_1080_60fps.mp4",
    galleryHeroVideoUrl: "/videos/cebc_final_6adf8221ce.mp4",
  },
  heroLogoStrip: Array.from({ length: 6 }, (_, i) => ({ name: `Partner ${i + 1}`, logo: "" })),
  sustainabilityFacts: [
    "Advancing MENA's clean energy transition",
    "Building resilient, net-zero economies",
    "Uniting government, finance & industry",
    "Powering the region's next chapter",
  ],
  navLinks: [
    { label: "Agenda", href: "#agenda" },
    { label: "Speakers", href: "#speakers" },
    { label: "Sponsors", href: "#sponsors" },
    { label: "Partners", href: "#partners" },
    { label: "About", href: "#about" },
    { label: "Past Event", href: "/gallery" },
  ],
  aboutContent: {
    heading: "Built to Deliver",
    subheading: "The people, partnerships and platforms driving MENA's transition.",
    paragraphs: [
      {
        text: "The CEBC Annual Summit returns for its 14th edition at a defining moment for the region. As global pressure intensifies ahead of COP30, MENA is not just adapting, it's positioning itself to lead.",
        image: "https://picsum.photos/seed/cebc-about-momentum/400/400",
      },
      {
        text: "This year's summit explores what it really takes to deliver net-zero strategies in practice; from decarbonising heavy industry to deploying AI in energy systems, and from unlocking climate finance to integrating mobility, hydrogen, and digital solutions.",
        image: "https://picsum.photos/seed/cebc-about-strategy/400/400",
      },
      {
        text: "With voices from across government, finance and industry, the 14th CEBC Annual Summit is where the region's decision-makers come to confront complexity, share what's working and build what's next.",
        image: "https://picsum.photos/seed/cebc-about-voices/400/400",
      },
      {
        text: "Because when it comes to clean energy leadership, MENA is built for this.",
        bold: true,
      },
    ],
  },
  galleryContent: {
    eyebrow: "Past Event",
    heading: "Moments from CEBC",
    subheading:
      "The 14th edition hasn't happened yet — this gallery will fill up with photos from the day itself. Until then, here's a preview of the kind of moments we'll be capturing.",
  },
  footerContent: {
    about:
      "Registered as a Not for Profit Company in Abu Dhabi Global Market (ADGM), the Clean Energy Business Council is the pre-eminent organization representing the private sector involved in the clean energy sector across the MENA region.",
    email: "info@cebcmena.com",
    address: "Abu Dhabi Global Market, ADGM",
    backgroundVideoUrl: "/videos/15791219_3840_2160_30fps.mp4",
    socials: [
      { platform: "Facebook", href: "#" },
      { platform: "Twitter", href: "#" },
      { platform: "YouTube", href: "#" },
      { platform: "LinkedIn", href: "#" },
      { platform: "Instagram", href: "#" },
    ],
  },
};

const agendaSeed = [
  {
    time: "08:00 – 09:00",
    title: "Registration & Networking Breakfast",
    detail: "Speakers to be announced",
    highlights: ["Format: Open networking", "Includes: Breakfast & refreshments", "Badge collection & welcome kits"],
    image: "https://picsum.photos/seed/cebc-agenda-breakfast/700/500",
    order: 0,
  },
  {
    time: "09:00 – 09:30",
    title: "Opening Keynote: The Turning Point for MENA",
    detail: "Speakers to be announced",
    highlights: ["Format: Keynote address", "Focus: Regional energy transition outlook", "Duration: 30 minutes"],
    image: "https://picsum.photos/seed/cebc-agenda-keynote/700/500",
    order: 1,
  },
  {
    time: "09:30 – 10:30",
    title: "Panel: Financing the Energy Transition",
    detail: "Speakers to be announced",
    highlights: ["Format: Moderated panel discussion", "Focus: Climate finance & investment", "Includes: Audience Q&A"],
    image: "https://picsum.photos/seed/cebc-agenda-panel/700/500",
    order: 2,
  },
  {
    time: "Full Day",
    title: "Complete session schedule to be published soon",
    detail: "Speakers to be announced",
    highlights: ["Full-day programme across multiple tracks", "Breakout sessions & workshops", "Detailed timings coming soon"],
    image: "https://picsum.photos/seed/cebc-agenda-fullday/700/500",
    order: 3,
  },
];

const speakerSeed = [12, 33, 47, 5, 65, 25].map((imgId, i) => ({
  name: "Speaker to be announced",
  title: "Job Title Pending",
  org: "Organization Pending",
  photo: `https://i.pravatar.cc/400?img=${imgId}`,
  order: i,
}));

const sponsorSeed = [
  ...Array.from({ length: 2 }, (_, i) => ({
    name: `Platinum Sponsor ${i + 1}`,
    logo: placeholderLogo(`Platinum Sponsor ${i + 1}`, "004AAD"),
    description: "Sponsor details to be announced. This placeholder card will be replaced with confirmed partner branding and copy.",
    website: "",
    tier: "Platinum",
    order: i,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Gold Sponsor ${i + 1}`,
    logo: placeholderLogo(`Gold Sponsor ${i + 1}`, "1C2F5B"),
    description: "Sponsor details to be announced. This placeholder card will be replaced with confirmed partner branding and copy.",
    website: "",
    tier: "Gold",
    order: i,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Silver Sponsor ${i + 1}`,
    logo: placeholderLogo(`Silver Sponsor ${i + 1}`, "5B8C5A"),
    description: "Sponsor details to be announced. This placeholder card will be replaced with confirmed partner branding and copy.",
    website: "",
    tier: "Silver",
    order: i,
  })),
];

const partnerSeed = Array.from({ length: 4 }, (_, i) => ({
  name: `Partner Organization ${i + 1}`,
  logo: placeholderLogo(`Partner Org ${i + 1}`, i % 2 === 0 ? "2A3F6E" : "6FA06D"),
  description: "Partner details to be announced. This placeholder card will be replaced with confirmed organization branding and copy.",
  website: "",
  order: i,
}));

const gallerySeed = [
  ["cebc-keynote", "Opening Keynote", "Setting the tone for the day ahead."],
  ["cebc-panel", "Panel Discussion", "Industry leaders on the future of clean energy."],
  ["cebc-networking", "Networking Breakfast", "Where the real conversations begin."],
  ["cebc-audience", "Delegate Floor", "Hundreds of delegates from across the MENA region."],
  ["cebc-signing", "Partnership Signing", "New alliances formed on the summit floor."],
  ["cebc-awards", "Awards Moment", "Recognizing the sector's boldest contributors."],
  ["cebc-exhibition", "Exhibition Hall", "Innovation on display, booth by booth."],
  ["cebc-closing", "Closing Remarks", "Reflections before the next turning point."],
].map(([seed, caption, description], i) => ({
  photo: placeholderPhoto(seed),
  caption,
  description,
  order: i,
}));

async function seed() {
  await connectDatabase();

  // Admin account
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@cebcmena.com").toLowerCase();
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "changeme123", 12);
    await Admin.create({
      name: process.env.SEED_ADMIN_NAME || "CEBC Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
    console.log(`Created admin account: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  // Site content singleton
  const existingContent = await SiteContent.findById(SiteContent.SINGLETON_ID);
  if (!existingContent) {
    await SiteContent.create({ _id: SiteContent.SINGLETON_ID, ...siteContentSeed });
    console.log("Seeded site content");
  } else {
    console.log("Site content already exists, skipping");
  }

  // List collections — only seed if empty, so re-running doesn't duplicate.
  const collections = [
    { Model: AgendaItem, data: agendaSeed, label: "agenda items" },
    { Model: Speaker, data: speakerSeed, label: "speakers" },
    { Model: Sponsor, data: sponsorSeed, label: "sponsors" },
    { Model: Partner, data: partnerSeed, label: "partners" },
    { Model: GalleryImage, data: gallerySeed, label: "gallery images" },
  ];

  for (const { Model, data, label } of collections) {
    const count = await Model.countDocuments();
    if (count === 0) {
      await Model.insertMany(data);
      console.log(`Seeded ${data.length} ${label}`);
    } else {
      console.log(`${label} already has ${count} documents, skipping`);
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
