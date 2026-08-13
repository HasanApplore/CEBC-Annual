import { About } from "./components/About";
import { Agenda } from "./components/Agenda";
import { Countdown } from "./components/Countdown";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Partners } from "./components/Partners";
import { Register } from "./components/Register";
import { Sponsors } from "./components/Sponsors";
import { Speakers } from "./components/Speakers";
import { footerContent } from "./data/summit";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/**
 * Register and Footer share one continuous background (navy base + the
 * sustainability video + a legibility wash) instead of each owning its own,
 * so the video plays uninterrupted across the seam between the two sections.
 */
function ClosingSection() {
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

function App() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Nav />
      <main>
        <Hero />
        <Countdown />
        <About />
        <Agenda />
        <Speakers />
        <Sponsors />
        <Partners />
      </main>
      <ClosingSection />
    </div>
  );
}

export default App;
