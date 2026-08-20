import { Footer } from "../components/Footer";
import { GalleryHero } from "../components/GalleryHero";
import { PastEventsSection } from "../components/PastEventsSection";
import { useSiteData } from "../context/SiteDataContext";
import { usePastSummits } from "../hooks/usePastSummits";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Same navy + sustainability-video background the homepage footer sits on (see Home.tsx's ClosingSection). */
function FooterSection() {
  const { footerContent } = useSiteData();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="relative overflow-hidden bg-brand-navy-dark">
      {footerContent.backgroundVideoUrl && !reduceMotion && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
        >
          <source src={footerContent.backgroundVideoUrl} type="video/mp4" />
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-navy-dark/80 via-brand-navy-dark/55 to-brand-navy-dark/85" />
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}

export function GalleryPage() {
  const { summits } = usePastSummits();

  return (
    <main>
      <GalleryHero />

      <PastEventsSection summits={summits} />

      <FooterSection />
    </main>
  );
}
