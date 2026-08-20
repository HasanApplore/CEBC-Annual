import { motion } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import { ArrowButton } from "./ArrowButton";
import { useSiteData } from "../context/SiteDataContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;
const TICKET_CLIP = "polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%)";

interface PolaroidProps {
  src: string;
  caption: string;
  rotate: number;
  delay: number;
  className?: string;
}

/** A single tilted snapshot in a perforated ticket-stub frame — settles into place, straightens on hover. */
function Polaroid({ src, caption, rotate, delay, className = "" }: PolaroidProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 30, rotate: rotate * 2.4, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.06, zIndex: 30 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`pointer-events-auto relative rounded-md border-[3px] border-dotted border-brand-navy/50 bg-white p-2 pb-6 shadow-xl ${className}`}
    >
      {/* Ticket-stub tear notches */}
      <span
        aria-hidden
        className="absolute -left-[10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-brand-bg"
      />
      <span
        aria-hidden
        className="absolute -right-[10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-brand-bg"
      />
      <div className="h-32 w-28 overflow-hidden rounded-sm bg-brand-bg sm:h-48 sm:w-40">
        <img src={src} alt={caption} className="h-full w-full object-cover" />
      </div>
      <span className="mono-label absolute bottom-2 left-2 right-2 truncate text-[9px] text-brand-navy/50">
        {caption}
      </span>
    </motion.div>
  );
}

/** The centrepiece scalloped seal — headline + a short stat line, echoing a stamped ticket. */
function CollageBadge({
  delay,
  galleryContent,
}: {
  delay: number;
  galleryContent: { eyebrow: string; heading: string };
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.a
      href="#gallery-grid"
      aria-label="Browse the gallery"
      initial={reduceMotion ? undefined : { opacity: 0, y: 40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="pointer-events-auto relative z-20 block w-[360px] cursor-pointer bg-brand-navy p-[3px] shadow-2xl sm:w-[440px]"
      style={{ clipPath: TICKET_CLIP }}
    >
      {/* Nested clip-path layers stack outer stroke → gap → inner stroke → content, each sharing
          the same scalloped clip-path so the double-border ring stays clean at the notches
          (a real CSS border rendered on top of clip-path gets clipped unevenly there). */}
      <div className="bg-brand-bg p-[6px]" style={{ clipPath: TICKET_CLIP }}>
        <div className="bg-brand-navy p-[3px]" style={{ clipPath: TICKET_CLIP }}>
          <div
            className="flex flex-col items-center px-10 py-6 text-center bg-white"
            style={{ clipPath: TICKET_CLIP }}
          >
            <span className="mono-label rounded-full bg-brand-green-pale px-3 py-1 text-[10px] font-semibold text-brand-navy-dark">
              {galleryContent.eyebrow}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-none tracking-tight text-brand-navy sm:text-4xl">
              {galleryContent.heading}
            </h1>
            <span className="mono-label mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-brand-navy/50">
              Browse the gallery <ChevronDown size={11} className="-rotate-90" />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function DownloadReportButton({ reportUrl, delay }: { reportUrl: string; delay: number }) {
  const reduceMotion = usePrefersReducedMotion();

  if (!reportUrl) return null;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="pointer-events-auto relative z-10 mt-8 flex justify-center"
    >
      <ArrowButton href={reportUrl} target="_blank" rel="noreferrer" variant="solid">
        <Download size={14} />
        Download Summit Report
      </ArrowButton>
    </motion.div>
  );
}

export function GalleryHero() {
  const { eventInfo, galleryContent, galleryImages } = useSiteData();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-bg">
      {/* Full-bleed banner, extending behind the nav — same treatment as the home Hero,
          so the transparent nav reads white-on-image instead of white-on-page-background. */}
      <div className="absolute inset-x-0 top-0 h-[62vh] overflow-hidden sm:h-[72vh]">
        {eventInfo.galleryHeroVideoUrl && !reduceMotion ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={eventInfo.heroImageUrl}
            aria-hidden
            className="h-full w-full object-cover"
          >
            <source src={eventInfo.galleryHeroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={eventInfo.heroImageUrl}
            alt=""
            role="presentation"
            className={`h-full w-full object-cover ${reduceMotion ? "" : "animate-ken-burns"}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/85 via-brand-navy-dark/15 to-brand-navy-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-dark/50 via-transparent to-transparent" />
      </div>

      {/* Collage row — sits right below the banner, pulled up to overlap its bottom edge */}
      <div className="relative pt-[62vh] sm:pt-[72vh]">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div className="relative z-10 mx-auto -mt-14 flex flex-col items-center gap-8 px-2 pb-10 sm:-mt-20 sm:gap-10 sm:pb-14 lg:-mt-24 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-8 lg:gap-y-12 xl:gap-x-10">
            <div className="flex gap-4 lg:-rotate-2">
              <Polaroid src={galleryImages[0].photo} caption={galleryImages[0].caption} rotate={-6} delay={0.15} />
              <Polaroid
                src={galleryImages[1].photo}
                caption={galleryImages[1].caption}
                rotate={4}
                delay={0.25}
                className="hidden sm:block"
              />
            </div>

            <CollageBadge delay={0.35} galleryContent={galleryContent} />

            <div className="flex gap-4 lg:rotate-2">
              <Polaroid
                src={galleryImages[2].photo}
                caption={galleryImages[2].caption}
                rotate={-4}
                delay={0.6}
                className="hidden sm:block"
              />
              <Polaroid src={galleryImages[3].photo} caption={galleryImages[3].caption} rotate={6} delay={0.7} />
            </div>
          </div>

          <DownloadReportButton reportUrl={galleryContent.reportUrl} delay={0.8} />
        </div>
      </div>
    </section>
  );
}
