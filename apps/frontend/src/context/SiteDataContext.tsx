import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet, resolveMediaUrl } from "../lib/api";
import * as fallback from "../data/summit";
import type {
  AboutParagraph,
  AgendaItem,
  EventInfo,
  GalleryImage,
  HeroLogo,
  NavLink,
  Partner,
  Speaker,
  Sponsor,
  SponsorTier,
} from "../data/summit";

interface SiteContentApi {
  eventInfo: EventInfo;
  heroLogoStrip: HeroLogo[];
  sustainabilityFacts: string[];
  navLinks: NavLink[];
  aboutContent: { heading: string; subheading: string; paragraphs: AboutParagraph[] };
  galleryContent: { eyebrow: string; heading: string; subheading: string; reportUrl: string };
  footerContent: {
    about: string;
    email: string;
    address: string;
    backgroundVideoUrl: string;
    socials: { platform: string; href: string }[];
  };
  paymentLink: string;
}

export interface SiteData extends SiteContentApi {
  agendaItems: AgendaItem[];
  speakers: Speaker[];
  sponsors: Record<SponsorTier, Sponsor[]>;
  partners: Partner[];
  galleryImages: GalleryImage[];
}

// Starts from the site's static defaults so nothing ever renders empty, then
// swaps in whatever the CMS API returns once each request resolves.
const initialData: SiteData = {
  eventInfo: fallback.eventInfo,
  heroLogoStrip: fallback.heroLogoStrip,
  sustainabilityFacts: fallback.sustainabilityFacts,
  navLinks: fallback.navLinks,
  aboutContent: fallback.aboutContent,
  galleryContent: fallback.galleryContent,
  footerContent: fallback.footerContent,
  paymentLink: "",
  agendaItems: fallback.agendaItems,
  speakers: fallback.speakers,
  sponsors: fallback.sponsors,
  partners: fallback.partners,
  galleryImages: fallback.galleryImages,
};

// Resolves every media field the API can return (backend "/uploads/..."
// paths become absolute) before it ever reaches a component.
function resolveContentMedia(content: SiteContentApi): SiteContentApi {
  return {
    ...content,
    heroLogoStrip: content.heroLogoStrip.map((h) => ({ ...h, logo: resolveMediaUrl(h.logo) })),
    eventInfo: {
      ...content.eventInfo,
      logoUrl: resolveMediaUrl(content.eventInfo.logoUrl),
      heroImageUrl: resolveMediaUrl(content.eventInfo.heroImageUrl),
      heroVideoUrl: resolveMediaUrl(content.eventInfo.heroVideoUrl),
      galleryHeroVideoUrl: resolveMediaUrl(content.eventInfo.galleryHeroVideoUrl),
    },
    aboutContent: {
      ...content.aboutContent,
      paragraphs: content.aboutContent.paragraphs.map((p) => ({
        ...p,
        image: p.image ? resolveMediaUrl(p.image) : p.image,
      })),
    },
    footerContent: {
      ...content.footerContent,
      backgroundVideoUrl: resolveMediaUrl(content.footerContent.backgroundVideoUrl),
    },
    galleryContent: {
      ...content.galleryContent,
      reportUrl: resolveMediaUrl(content.galleryContent.reportUrl),
    },
  };
}

function resolveAgendaMedia(items: AgendaItem[]): AgendaItem[] {
  return items.map((item) => ({ ...item, image: resolveMediaUrl(item.image) }));
}

function resolveSpeakerMedia(items: Speaker[]): Speaker[] {
  return items.map((item) => ({ ...item, photo: resolveMediaUrl(item.photo) }));
}

function resolveSponsorMedia(sponsors: Record<SponsorTier, Sponsor[]>): Record<SponsorTier, Sponsor[]> {
  const resolved = {} as Record<SponsorTier, Sponsor[]>;
  for (const tier of Object.keys(sponsors) as SponsorTier[]) {
    resolved[tier] = sponsors[tier].map((s) => ({ ...s, logo: resolveMediaUrl(s.logo) }));
  }
  return resolved;
}

function resolvePartnerMedia(items: Partner[]): Partner[] {
  return items.map((item) => ({ ...item, logo: resolveMediaUrl(item.logo) }));
}

function resolveGalleryMedia(items: GalleryImage[]): GalleryImage[] {
  return items.map((item) => ({ ...item, photo: resolveMediaUrl(item.photo) }));
}

const SiteDataContext = createContext<SiteData>(initialData);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(initialData);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const results = await Promise.allSettled([
        apiGet<SiteContentApi>("/content"),
        apiGet<AgendaItem[]>("/agenda"),
        apiGet<Speaker[]>("/speakers"),
        apiGet<Record<SponsorTier, Sponsor[]>>("/sponsors/grouped"),
        apiGet<Partner[]>("/partners"),
        apiGet<GalleryImage[]>("/gallery"),
      ]);
      if (cancelled) return;

      const [content, agendaItems, speakers, sponsors, partners, galleryImages] = results;

      setData((prev) => ({
        ...prev,
        ...(content.status === "fulfilled" ? resolveContentMedia(content.value) : {}),
        ...(agendaItems.status === "fulfilled" && agendaItems.value.length
          ? { agendaItems: resolveAgendaMedia(agendaItems.value) }
          : {}),
        ...(speakers.status === "fulfilled" && speakers.value.length
          ? { speakers: resolveSpeakerMedia(speakers.value) }
          : {}),
        ...(sponsors.status === "fulfilled" ? { sponsors: resolveSponsorMedia(sponsors.value) } : {}),
        ...(partners.status === "fulfilled" && partners.value.length
          ? { partners: resolvePartnerMedia(partners.value) }
          : {}),
        ...(galleryImages.status === "fulfilled" && galleryImages.value.length
          ? { galleryImages: resolveGalleryMedia(galleryImages.value) }
          : {}),
      }));

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length) {
        console.warn(`Site content API: ${failed.length} request(s) failed, using local defaults.`);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
