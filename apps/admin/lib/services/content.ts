import { apiRequest } from "../api/client";

export interface SiteContent {
  _id?: string;
  eventInfo: {
    name: string;
    organizer: string;
    theme: string;
    dateLabel: string;
    timeLabel: string;
    venue: string;
    countdownTarget: string;
    logoUrl: string;
    heroImageUrl: string;
    heroVideoUrl: string;
    galleryHeroVideoUrl: string;
  };
  heroLogoStrip: { name: string; logo: string }[];
  sustainabilityFacts: string[];
  navLinks: { label: string; href: string }[];
  aboutContent: {
    heading: string;
    subheading: string;
    paragraphs: { text: string; bold?: boolean; image?: string }[];
  };
  galleryContent: { eyebrow: string; heading: string; subheading: string };
  footerContent: {
    about: string;
    email: string;
    address: string;
    backgroundVideoUrl: string;
    socials: { platform: string; href: string }[];
  };
  paymentLink: string;
}

export const contentService = {
  get: () => apiRequest<SiteContent>("/content", { auth: false }),
  update: (data: Partial<SiteContent>) =>
    apiRequest<SiteContent>("/content", { method: "PUT", body: data }),
};
