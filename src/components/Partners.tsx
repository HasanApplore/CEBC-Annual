import { motion } from "framer-motion";
import { useState } from "react";
import { partners, type Partner } from "../data/summit";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { DetailModal, type DetailModalEntry } from "./DetailModal";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

interface PartnerLogoProps {
  partner: Partner;
  layoutId: string;
  onSelect: () => void;
}

/** A single logo chip within the marquee — pops up above the row on hover/click. */
function PartnerLogo({ partner, layoutId, onSelect }: PartnerLogoProps) {
  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      onClick={onSelect}
      whileHover={{ scale: 1.18, y: -10, zIndex: 30 }}
      whileTap={{ scale: 1.05, zIndex: 30 }}
      whileFocus={{ zIndex: 30 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      style={{ zIndex: 1 }}
      className="group relative mx-3 flex h-20 w-32 shrink-0 items-center justify-center rounded-lg border border-brand-navy/10 bg-white shadow-sm transition-shadow duration-300 hover:border-brand-green/40 hover:shadow-xl hover:shadow-brand-green/20 sm:h-24 sm:w-40"
    >
      <motion.div
        layoutId={`${layoutId}-logo`}
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-brand-navy/5 sm:h-14 sm:w-14"
      >
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-bg text-[10px] font-semibold text-brand-navy/30">
            Logo
          </div>
        )}
      </motion.div>

      {/* Name tooltip, revealed on pop-up */}
      <span className="mono-label pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-0.5 text-[10px] text-brand-navy/0 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:text-brand-navy/70">
        {partner.name}
      </span>
    </motion.button>
  );
}

interface MarqueeRowProps {
  rowIndex: number;
  direction: "left" | "right";
  reduceMotion: boolean;
  onSelect: (entry: DetailModalEntry) => void;
}

// Four copies back-to-back keep the strip wider than any viewport and make
// the loop point far less noticeable than a plain two-copy repeat — with
// only a handful of real partners, two copies looped every few seconds.
const REPEAT_COUNT = 4;
const LOOP_FRACTION = 100 / REPEAT_COUNT;

function MarqueeRow({ rowIndex, direction, reduceMotion, onSelect }: MarqueeRowProps) {
  const items = Array.from({ length: REPEAT_COUNT }, () => partners).flat();

  return (
    <div className="relative overflow-x-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max items-center"
        style={{ willChange: "transform" }}
        animate={{
          x: reduceMotion
            ? "0%"
            : direction === "left"
              ? ["0%", `-${LOOP_FRACTION}%`]
              : [`-${LOOP_FRACTION}%`, "0%"],
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 26, repeat: Infinity, ease: "linear" }
        }
      >
        {items.map((partner, i) => {
          const layoutId = `partner-${rowIndex}-${i}`;
          return (
            <PartnerLogo
              key={i}
              partner={partner}
              layoutId={layoutId}
              onSelect={() => onSelect({ ...partner, eyebrow: "Partner", layoutId })}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export function Partners() {
  const [selected, setSelected] = useState<DetailModalEntry | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section id="partners" className="bg-brand-bg py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="text-center">
          <Eyebrow tone="dark">Collaboration</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Partners
          </h2>
          <p className="mt-3 text-brand-navy/70">
            Working alongside the organisations driving MENA's clean energy agenda.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.1} className="mt-14 flex flex-col">
        <MarqueeRow rowIndex={0} direction="left" reduceMotion={reduceMotion} onSelect={setSelected} />
        <MarqueeRow rowIndex={1} direction="right" reduceMotion={reduceMotion} onSelect={setSelected} />
      </ScrollReveal>

      <DetailModal entry={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
