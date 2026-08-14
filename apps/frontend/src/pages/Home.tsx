import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { About } from "../components/About";
import { Agenda } from "../components/Agenda";
import { Countdown } from "../components/Countdown";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Partners } from "../components/Partners";
import { Register } from "../components/Register";
import { Sponsors } from "../components/Sponsors";
import { Speakers } from "../components/Speakers";
import { useSiteData } from "../context/SiteDataContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Register and Footer share one continuous background (navy base + the
 * sustainability video + a legibility wash) instead of each owning its own,
 * so the video plays uninterrupted across the seam between the two sections.
 */
function ClosingSection() {
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
      {/* Lighter navy wash — lets the video read through while keeping text legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-navy-dark/80 via-brand-navy-dark/55 to-brand-navy-dark/85" />

      <div className="relative">
        <Register />
        <Footer />
      </div>
    </div>
  );
}

export function HomePage() {
  const location = useLocation();

  // Nav links to section anchors route here first (e.g. from the Gallery
  // page) and rely on the hash still being present once we land — scroll to
  // it manually since react-router doesn't do this on its own.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // Sections mount with the rest of the page; wait a tick so layout has
    // settled (fonts/images) before measuring scroll position.
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.hash]);

  return (
    <main>
      <Hero />
      <Countdown />
      <About />
      <Agenda />
      <Speakers />
      <Sponsors />
      <Partners />
      <ClosingSection />
    </main>
  );
}
