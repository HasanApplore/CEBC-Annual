import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { GalleryCarousel } from "../components/GalleryCarousel";
import { GalleryHero } from "../components/GalleryHero";
import { ScrollRevealGroup, staggerItemVariants } from "../components/ScrollReveal";
import { footerContent, galleryImages } from "../data/summit";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Same navy + sustainability-video background the homepage footer sits on (see Home.tsx's ClosingSection). */
function FooterSection() {
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

/** Full-screen viewer for the selected photo — morphs out of its grid tile via shared layoutId. */
function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number | null;
  onClose: () => void;
  onStep: (delta: 1 | -1) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onStep]);

  const image = index === null ? null : galleryImages[index];

  return (
    <AnimatePresence>
      {image && index !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy-dark/90 p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={image.caption}
        >
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            whileHover={{ rotate: 90, scale: 1.1 }}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </motion.button>

          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-card shadow-2xl"
          >
            <motion.img
              layoutId={`gallery-photo-${index}`}
              transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
              src={image.photo}
              alt={image.caption}
              className="max-h-[80vh] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
              <p className="mono-label text-xs font-semibold text-white">{image.caption}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const step = (delta: 1 | -1) => {
    setSelected((current) => {
      if (current === null) return current;
      return (current + delta + galleryImages.length) % galleryImages.length;
    });
  };

  return (
    <main>
      <GalleryHero />

      {/* Breathing room between the hero's collage and the carousel below — plain
          bg-brand-bg so the dark carousel section doesn't butt straight up against it. */}
      <div className="bg-brand-bg py-10 sm:py-16" />

      <GalleryCarousel onSelect={setSelected} />

      <section id="gallery-grid" className="bg-brand-bg py-20">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div className="max-w-2xl text-left">
            <span className="mono-label inline-block rounded border border-brand-green/30 bg-brand-green/10 px-3 py-1.5 text-[11px] font-semibold text-brand-green">
              The Grid
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Every angle, every moment
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-navy-dark/60">
              Hover a frame for a closer look, or click through to the full-size view.
            </p>
          </div>

          <ScrollRevealGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((image, i) => (
              <motion.button
                key={i}
                type="button"
                variants={staggerItemVariants}
                onClick={() => setSelected(i)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm"
              >
                <motion.img
                  layoutId={`gallery-photo-${i}`}
                  transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
                  src={image.photo}
                  alt={image.caption}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Gradient wash + expand icon fade in together on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 -translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Expand size={14} />
                </span>

                {/* Heading + description slide up and fade in on hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="mono-label text-[11px] font-semibold text-white">{image.caption}</p>
                  <p className="mt-1 text-xs leading-snug text-white/70">{image.description}</p>
                </div>
              </motion.button>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      <FooterSection />

      <Lightbox index={selected} onClose={() => setSelected(null)} onStep={step} />
    </main>
  );
}
