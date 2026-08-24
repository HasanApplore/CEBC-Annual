/**
 * ============================================================================
 * SUMMIT CONTENT DATA
 * ----------------------------------------------------------------------------
 * Every editable piece of copy, agenda row, speaker, sponsor and partner for
 * the 14th CEBC Annual Summit site lives in this one file. Non-developers can
 * update the event by editing the arrays/objects below — no component code
 * needs to change.
 *
 * Image fields accept either an imported asset or a plain URL string. Leave
 * `photo` / `logo` as an empty string "" to fall back to the built-in
 * placeholder visuals (navy gradient + "?" for speakers, tier-labelled cards
 * for sponsors/partners).
 * ============================================================================
 */

export interface EventInfo {
  name: string;
  organizer: string;
  theme: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  /** ISO timestamp (with timezone offset) the countdown counts down to. */
  countdownTarget: string;
  /** Placeholder slot — drop the real CEBC logo URL in here. */
  logoUrl: string;
  /** Fallback/poster image — used under prefers-reduced-motion and while the video loads. */
  heroImageUrl: string;
  /** Background video for the homepage hero — leave empty to fall back to heroImageUrl only. */
  heroVideoUrl: string;
  /** Background video for the Gallery page hero — separate from heroVideoUrl by design. */
  galleryHeroVideoUrl: string;
}

export const eventInfo: EventInfo = {
  name: "The 14th CEBC Annual Summit",
  organizer: "Clean Energy Business Council MENA (CEBC)",
  theme:
    '"The Turning Point: Change, Resilience, and Economic Transformation in MENA"',
  dateLabel: "01 October 2026",
  timeLabel: "08:00 – 17:00 GST",
  venue: "DIFC Conference Centre, Dubai, UAE",
  countdownTarget: "2026-10-01T08:00:00+04:00",
  // TODO: replace with the real CEBC logo asset URL.
  logoUrl: "",
  heroImageUrl: "/images/Gemini_Generated_Image_dzsqoedzsqoedzsq.png",
  heroVideoUrl: "/videos/12443259_1920_1080_60fps.mp4",
  galleryHeroVideoUrl: "/videos/cebc_final_6adf8221ce.mp4",
};

export interface HeroLogo {
  name: string;
  /** Empty string falls back to a text placeholder chip. */
  logo: string;
}

// Shown in the hero's scrolling logo strip. Swap in confirmed partner/sponsor
// logos as they're finalised — this list is intentionally separate from the
// full Sponsors/Partners sections below so the hero strip can be curated.
export const heroLogoStrip: HeroLogo[] = Array.from({ length: 6 }, (_, i) => ({
  name: `Partner ${i + 1}`,
  logo: "",
}));

// Short sustainability statements shown alongside the hero logo strip.
// TODO: swap these editorial taglines for vetted, sourced statistics once
// CEBC's research/comms team confirms figures for the 14th edition.
export const sustainabilityFacts: string[] = [
  "Advancing MENA's clean energy transition",
  "Building resilient, net-zero economies",
  "Uniting government, finance & industry",
  "Powering the region's next chapter",
];

export interface NavLink {
  label: string;
  /**
   * `#section-id` scrolls to a section on the home page (navigating home
   * first if needed). Anything starting with `/` is a full route, rendered
   * with react-router's `Link` — e.g. the Gallery page.
   */
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Agenda", href: "#agenda" },
  { label: "Speakers", href: "#speakers" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Partners", href: "#partners" },
  { label: "About", href: "#about" },
  { label: "Past Event", href: "/gallery" },
];

export interface AboutParagraph {
  text: string;
  bold?: boolean;
  /** Thumbnail shown alongside this point — omitted on the closing pull-quote. */
  image?: string;
}

export const aboutContent = {
  heading: "The Turning Point: Change, Resilience, and Economic Transformation in MENA",
  subheading:
    "The people, partnerships and platforms driving MENA's transition.",
  paragraphs: [
    {
      text:
        "This year's 14th edition of the CEBC Annual Summit, themed “The Turning Point: Change, Resilience, and Economic Transformation in MENA,” serves as the definitive platform for the region's post-crisis recovery. We are bringing together the visionaries, capital, and frameworks essential to transforming adversity into a catalyst for sustainable growth.",
      image: "https://picsum.photos/seed/cebc-about-momentum/400/400",
    },
    {
      text:
        "From future-proofing cross-border energy infrastructure and securing supply chains to accelerating heavy industry decarbonization, maintaining climate finance under tighter economic conditions, and deploying grid resilience, alongside deepening regional economic integration, advancing in-country value creation, and embedding circularity across supply chains to build sovereign industrial capacity.",
      image: "https://picsum.photos/seed/cebc-about-strategy/400/400",
    },
    {
      text:
        "Energy resilience is the critical foundation for achieving UAE Net Zero by 2050, and it cannot be achieved in isolation. At this turning point, it must be forged, together, by a region ready to transform its future.",
      image: "https://picsum.photos/seed/cebc-about-voices/400/400",
    },
    {
      text: "The question is no longer just how to sustain the energy transition, how to turn disruption into its greatest driver.",
      bold: true,
    },
  ] satisfies AboutParagraph[],
};

export interface AgendaItem {
  time: string;
  title: string;
  detail: string;
  /** Short format/structure descriptors — keep generic until the real programme is confirmed. */
  highlights: string[];
  image: string;
}

// Provisional schedule — real agenda pending confirmation. Keep this array
// data-driven so rows can be added/edited without touching the Agenda component.
export const agendaItems: AgendaItem[] = [
  {
    time: "08:00 – 09:00",
    title: "Registration & Networking Breakfast",
    detail: "Speakers to be announced",
    highlights: [
      "Format: Open networking",
      "Includes: Breakfast & refreshments",
      "Badge collection & welcome kits",
    ],
    image: "https://picsum.photos/seed/cebc-agenda-breakfast/700/500",
  },
  {
    time: "09:00 – 09:30",
    title: "Opening Keynote: The Turning Point for MENA",
    detail: "Speakers to be announced",
    highlights: [
      "Format: Keynote address",
      "Focus: Regional energy transition outlook",
      "Duration: 30 minutes",
    ],
    image: "https://picsum.photos/seed/cebc-agenda-keynote/700/500",
  },
  {
    time: "09:30 – 10:30",
    title: "Panel: Financing the Energy Transition",
    detail: "Speakers to be announced",
    highlights: [
      "Format: Moderated panel discussion",
      "Focus: Climate finance & investment",
      "Includes: Audience Q&A",
    ],
    image: "https://picsum.photos/seed/cebc-agenda-panel/700/500",
  },
  {
    time: "Full Day",
    title: "Complete session schedule to be published soon",
    detail: "Speakers to be announced",
    highlights: [
      "Full-day programme across multiple tracks",
      "Breakout sessions & workshops",
      "Detailed timings coming soon",
    ],
    image: "https://picsum.photos/seed/cebc-agenda-fullday/700/500",
  },
];

export interface Speaker {
  name: string;
  title: string;
  org: string;
  /** Empty string falls back to the navy "?" placeholder tile. */
  photo: string;
  linkedin?: string;
}

// Placeholder line-up — swap in confirmed speakers as they are announced.
// Photos are stock placeholder portraits (pravatar.cc) purely so the layout
// previews with real imagery; replace with confirmed headshots.
export const speakers: Speaker[] = Array.from({ length: 6 }, (_, i) => ({
  name: "Speaker to be announced",
  title: "Job Title Pending",
  org: "Organization Pending",
  photo: `https://i.pravatar.cc/400?img=${[12, 33, 47, 5, 65, 25][i]}`,
  linkedin: undefined,
}));

export interface Sponsor {
  name: string;
  logo: string;
  description: string;
  website: string;
}

export type SponsorTier = "Platinum" | "Gold" | "Silver" | "Bronze";

// Generates a simple lettermark "logo" via ui-avatars.com so sponsor/partner
// cards preview with real imagery instead of empty tiles. Swap `logo` for a
// confirmed brand asset URL once available.
function placeholderLogo(label: string, bg: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${bg}&color=fff&size=256&bold=true&font-size=0.33&length=2`;
}

// Expand each tier's array as sponsors are confirmed — layout adapts automatically.
export const sponsors: Record<SponsorTier, Sponsor[]> = {
  Platinum: Array.from({ length: 2 }, (_, i) => ({
    name: `Platinum Sponsor ${i + 1}`,
    logo: placeholderLogo(`Platinum Sponsor ${i + 1}`, "004AAD"),
    description:
      "Sponsor details to be announced. This placeholder card will be replaced with confirmed partner branding and copy.",
    website: "",
  })),
  Gold: Array.from({ length: 3 }, (_, i) => ({
    name: `Gold Sponsor ${i + 1}`,
    logo: placeholderLogo(`Gold Sponsor ${i + 1}`, "1C2F5B"),
    description:
      "Sponsor details to be announced. This placeholder card will be replaced with confirmed partner branding and copy.",
    website: "",
  })),
  Silver: Array.from({ length: 3 }, (_, i) => ({
    name: `Silver Sponsor ${i + 1}`,
    logo: placeholderLogo(`Silver Sponsor ${i + 1}`, "5B8C5A"),
    description:
      "Sponsor details to be announced. This placeholder card will be replaced with confirmed partner branding and copy.",
    website: "",
  })),
  Bronze: [],
};

export interface Partner {
  name: string;
  logo: string;
  /** e.g. "Networking Partner", "Strategic Partner" — shown as a badge on the card. */
  type: string;
  description: string;
  website: string;
}

// Add/remove entries freely — the Partners row lays out responsively.
export const partners: Partner[] = Array.from({ length: 4 }, (_, i) => ({
  name: `Partner Organization ${i + 1}`,
  logo: placeholderLogo(`Partner Org ${i + 1}`, i % 2 === 0 ? "2A3F6E" : "6FA06D"),
  type: "",
  description:
    "Partner details to be announced. This placeholder card will be replaced with confirmed organization branding and copy.",
  website: "",
}));

export const galleryContent = {
  eyebrow: "Past Event",
  heading: "Moments from CEBC",
  subheading:
    "The 14th edition hasn't happened yet — this gallery will fill up with photos from the day itself. Until then, here's a preview of the kind of moments we'll be capturing.",
  reportUrl: "",
};

export interface GalleryImage {
  photo: string;
  caption: string;
  description: string;
}

// Picsum placeholders (deterministic via seed) stand in for real event
// photography, which doesn't exist yet — the summit hasn't happened. Swap
// each `photo` for a confirmed shot post-event; captions/descriptions can be edited freely.
function placeholderPhoto(seed: string) {
  return `https://picsum.photos/seed/${seed}/900/700`;
}

export const galleryImages: GalleryImage[] = [
  {
    photo: placeholderPhoto("cebc-keynote"),
    caption: "Opening Keynote",
    description: "Setting the tone for the day ahead.",
  },
  {
    photo: placeholderPhoto("cebc-panel"),
    caption: "Panel Discussion",
    description: "Industry leaders on the future of clean energy.",
  },
  {
    photo: placeholderPhoto("cebc-networking"),
    caption: "Networking Breakfast",
    description: "Where the real conversations begin.",
  },
  {
    photo: placeholderPhoto("cebc-audience"),
    caption: "Delegate Floor",
    description: "Hundreds of delegates from across the MENA region.",
  },
  {
    photo: placeholderPhoto("cebc-signing"),
    caption: "Partnership Signing",
    description: "New alliances formed on the summit floor.",
  },
  {
    photo: placeholderPhoto("cebc-awards"),
    caption: "Awards Moment",
    description: "Recognizing the sector's boldest contributors.",
  },
  {
    photo: placeholderPhoto("cebc-exhibition"),
    caption: "Exhibition Hall",
    description: "Innovation on display, booth by booth.",
  },
  {
    photo: placeholderPhoto("cebc-closing"),
    caption: "Closing Remarks",
    description: "Reflections before the next turning point.",
  },
];

export const footerContent = {
  about:
    "CEBC MENA is A platform to drive clean energy policy and the sustainable economy dialogue between the public and private sectors across the MENA region.",
  email: "info@cebcmena.com",
  address: "Abu Dhabi Global Market, ADGM",
  backgroundVideoUrl: "/videos/15791219_3840_2160_30fps.mp4",
  socials: [
    { platform: "Facebook", href: "https://www.facebook.com/CEBCMENA1" },
    { platform: "YouTube", href: "#" },
    { platform: "LinkedIn", href: "https://www.linkedin.com/company/cebcmena/?viewAsMember=true" },
    { platform: "Instagram", href: "https://www.instagram.com/cebc_mena?igsi=MW1wNXVuZGt6ZHg2MA%3D%3D&utm_source=qr" },
  ] as { platform: string; href: string }[],
};
