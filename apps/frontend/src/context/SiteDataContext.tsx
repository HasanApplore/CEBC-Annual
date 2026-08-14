import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet } from "../lib/api";
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
  galleryContent: { eyebrow: string; heading: string; subheading: string };
  footerContent: {
    about: string;
    email: string;
    address: string;
    backgroundVideoUrl: string;
    socials: { platform: string; href: string }[];
  };
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
  agendaItems: fallback.agendaItems,
  speakers: fallback.speakers,
  sponsors: fallback.sponsors,
  partners: fallback.partners,
  galleryImages: fallback.galleryImages,
};

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
        ...(content.status === "fulfilled" ? content.value : {}),
        ...(agendaItems.status === "fulfilled" && agendaItems.value.length
          ? { agendaItems: agendaItems.value }
          : {}),
        ...(speakers.status === "fulfilled" && speakers.value.length ? { speakers: speakers.value } : {}),
        ...(sponsors.status === "fulfilled" ? { sponsors: sponsors.value } : {}),
        ...(partners.status === "fulfilled" && partners.value.length ? { partners: partners.value } : {}),
        ...(galleryImages.status === "fulfilled" && galleryImages.value.length
          ? { galleryImages: galleryImages.value }
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
