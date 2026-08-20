import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Download, Expand, X } from "lucide-react";
import { useState } from "react";
import type { PastSummit } from "../hooks/usePastSummits";
import { ArrowButton } from "./ArrowButton";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal, ScrollRevealGroup, staggerItemVariants } from "./ScrollReveal";

/** Self-contained full-screen viewer for one summit's own photos array. */
function SummitLightbox({
  photos,
  index,
  onClose,
  onStep,
}: {
  photos: PastSummit["photos"];
  index: number | null;
  onClose: () => void;
  onStep: (delta: 1 | -1) => void;
}) {
  const image = index === null ? null : photos[index];

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
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>
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
            <img src={image.photo} alt={image.caption} className="max-h-[80vh] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
              <p className="mono-label text-xs font-semibold text-white">{image.caption}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SummitBlock({ summit, isFirst }: { summit: PastSummit; isFirst: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);

  const step = (delta: 1 | -1) => {
    setSelected((current) => {
      if (current === null) return current;
      return (current + delta + summit.photos.length) % summit.photos.length;
    });
  };

  return (
    <div className={isFirst ? "py-16 pt-0" : "border-t border-brand-navy/10 py-16"}>
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <ScrollReveal>
          <Eyebrow tone="dark">{summit.year}</Eyebrow>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            {summit.title}
          </h2>
        </ScrollReveal>

        {summit.agenda.length > 0 && (
          <ScrollRevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summit.agenda.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItemVariants}
                className="rounded-lg border border-brand-navy/10 bg-white p-4 shadow-sm"
              >
                <p className="mono-label flex items-center gap-1.5 text-[11px] font-semibold text-brand-green">
                  <Clock size={12} />
                  {item.time}
                </p>
                <h3 className="mt-1.5 text-sm font-bold text-brand-navy">{item.title}</h3>
                {item.detail && <p className="mt-1 text-xs text-brand-navy/60">{item.detail}</p>}
                {item.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-start gap-1.5 text-[11px] text-brand-navy/50">
                        <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-brand-green" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </ScrollRevealGroup>
        )}

        {summit.photos.length > 0 && (
          <ScrollRevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {summit.photos.map((photo, i) => (
              <motion.button
                key={i}
                type="button"
                variants={staggerItemVariants}
                onClick={() => setSelected(i)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm"
              >
                <img
                  src={photo.photo}
                  alt={photo.caption}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 -translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Expand size={14} />
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="mono-label text-[11px] font-semibold text-white">{photo.caption}</p>
                </div>
              </motion.button>
            ))}
          </ScrollRevealGroup>
        )}

        {summit.reportUrl && (
          <ScrollReveal className="mt-8 flex justify-start">
            <ArrowButton href={summit.reportUrl} target="_blank" rel="noreferrer" variant="solid">
              <Download size={14} />
              Download Summit Report
            </ArrowButton>
          </ScrollReveal>
        )}
      </div>

      <SummitLightbox
        photos={summit.photos}
        index={selected}
        onClose={() => setSelected(null)}
        onStep={step}
      />
    </div>
  );
}

export function PastEventsSection({ summits }: { summits: PastSummit[] }) {
  if (summits.length === 0) return null;

  return (
    <section id="past-events" className="bg-brand-bg pb-20 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <ScrollReveal className="max-w-2xl text-left">
          <span className="mono-label inline-block rounded border border-brand-green/30 bg-brand-green/10 px-3 py-1.5 text-[11px] font-semibold text-brand-green">
            Past Editions
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Every summit, every story
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-navy-dark/60">
            Browse previous editions of the CEBC Annual Summit — reports, photos, and agendas.
          </p>
        </ScrollReveal>
      </div>

      {summits.map((summit, i) => (
        <SummitBlock key={summit._id} summit={summit} isFirst={i === 0} />
      ))}
    </section>
  );
}
