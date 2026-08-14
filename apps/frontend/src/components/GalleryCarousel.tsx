import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowButton } from "./ArrowButton";
import { Eyebrow } from "./Eyebrow";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Horizontal ticket-card carousel below the gallery grid — same layout beat as the
 * pizza-amici.nl reference (heading + copy + CTA on the left, arrow-driven scrolling
 * cards on the right), re-skinned with CEBC's navy/green palette and the dotted
 * perforated-ticket motif already established in GalleryHero instead of the
 * reference's literal Italian scrapbook styling.
 */
export function GalleryCarousel({ onSelect }: { onSelect: (index: number) => void }) {
  const { galleryImages } = useSiteData();
  const reduceMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 300) + 24;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-brand-navy-dark py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-lg"
          >
            <Eyebrow tone="light">Gallery</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Relive the moments
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
              A running scrapbook of the summit — keynotes, panels, and the conversations that
              happen between them. Browse the full set or step through the frames below.
            </p>
            <ArrowButton href="#gallery-grid" variant="solid" className="mt-7">
              Browse the gallery
            </ArrowButton>
          </motion.div>

          <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
            <span className="mono-label -rotate-3 text-xs italic text-brand-green-light/80">
              A glimpse of CEBC
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollByCard(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-white/30 text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollByCard(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-white/30 text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-12 flex gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {galleryImages.map((image, i) => (
          <motion.button
            key={i}
            data-card
            type="button"
            onClick={() => onSelect(i)}
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            className="group w-[240px] shrink-0 text-left sm:w-[280px]"
          >
            <div className="overflow-hidden rounded-2xl border-2 border-dotted border-white/25 bg-white shadow-2xl">
              <div className="px-5 pb-3 pt-5">
                <h3 className="truncate text-lg font-extrabold uppercase tracking-tight text-brand-navy">
                  {image.caption}
                </h3>
              </div>
              <div className="relative mx-3 mb-3 aspect-[4/5] overflow-hidden rounded-xl">
                <img
                  src={image.photo}
                  alt={image.caption}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="mono-label flex items-center justify-between px-5 pb-4 text-[10px] font-semibold text-brand-navy/50">
                <span>CEBC 2026</span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
