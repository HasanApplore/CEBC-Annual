import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { type MouseEvent, useRef, useState } from "react";
import { sponsors, type Sponsor, type SponsorTier } from "../data/summit";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowButton } from "./ArrowButton";
import { CursorOrb } from "./CursorOrb";
import { DetailModal, type DetailModalEntry } from "./DetailModal";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal, ScrollRevealGroup, staggerItemVariants } from "./ScrollReveal";

const tiers: { key: SponsorTier; cardSize: string; chipSize: string }[] = [
  { key: "Platinum", cardSize: "sm:grid-cols-2", chipSize: "h-20 w-20 sm:h-24 sm:w-24" },
  { key: "Gold", cardSize: "sm:grid-cols-3", chipSize: "h-16 w-16 sm:h-20 sm:w-20" },
  { key: "Silver", cardSize: "sm:grid-cols-3", chipSize: "h-14 w-14 sm:h-16 sm:w-16" },
];

function SponsorCard({
  sponsor,
  chipSize,
  layoutId,
  reduceMotion,
  onSelect,
}: {
  sponsor: Sponsor;
  chipSize: string;
  layoutId: string;
  reduceMotion: boolean;
  onSelect: () => void;
}) {
  // Pointer-driven 3D tilt — the card "pops out" toward the cursor on hover.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 250, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 250, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(160px circle at ${glowX}% ${glowY}%, rgba(91,140,90,0.18), transparent 70%)`;

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 22);
    rotateX.set((0.5 - py) * 22);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      variants={staggerItemVariants}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={reduceMotion ? undefined : { scale: 1.06, z: 40 }}
      whileTap={{ scale: 0.97 }}
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onSelect}
      className="group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-lg border border-brand-navy/10 bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/20"
    >
      {/* Cursor-tracked glow that pops with the tilt */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}

      {/* Gradient sheen sweeping across on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-green/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />

      <motion.div
        layoutId={`${layoutId}-logo`}
        style={{ transform: "translateZ(30px)" }}
        className={`relative ${chipSize} shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-brand-navy/5 group-hover:shadow-lg`}
      >
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-bg text-xs font-semibold text-brand-navy/30">
            Logo
          </div>
        )}
      </motion.div>

      <span
        style={{ transform: "translateZ(20px)" }}
        className="relative text-center text-xs font-semibold text-brand-navy/60 transition-colors duration-300 group-hover:text-brand-navy sm:text-sm"
      >
        {sponsor.name}
      </span>
    </motion.button>
  );
}

export function Sponsors() {
  const [selected, setSelected] = useState<DetailModalEntry | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24"
    >
      {/* Roaming glass orb — the same Three.js sphere from the hero, now drifting behind the sponsor grid */}
      {!reduceMotion && <CursorOrb containerRef={sectionRef} size={90} />}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="text-center">
          <Eyebrow tone="dark">Partnership</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Sponsors
          </h2>
          <p className="mt-3 text-brand-navy/70">
            Partner with the region's leading clean energy summit.
          </p>
        </ScrollReveal>

        <div className="mt-16 flex flex-col gap-16">
          {tiers.map(({ key, cardSize, chipSize }) => (
            <div
              key={key}
              className="sm:grid sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-10 md:grid-cols-[11rem_1fr]"
            >
              {/* Left side — tier label */}
              <ScrollReveal className="mb-6 flex items-center gap-3 sm:mb-0 sm:flex-col sm:items-start sm:gap-2">
                <span className="h-8 w-1 rounded-full bg-gradient-to-b from-brand-green to-brand-blue sm:h-1 sm:w-10" />
                <div>
                  <h3 className="mono-label text-sm font-bold text-brand-navy sm:text-base">
                    {key}
                  </h3>
                  <p className="mono-label text-[11px] text-brand-navy/40">
                    {sponsors[key].length} {sponsors[key].length === 1 ? "Partner" : "Partners"}
                  </p>
                </div>
              </ScrollReveal>

              {/* Right side — sponsor cards */}
              <ScrollRevealGroup className={`grid grid-cols-1 gap-5 ${cardSize}`}>
                {sponsors[key].map((sponsor, i) => {
                  const layoutId = `sponsor-${key}-${i}`;
                  return (
                    <SponsorCard
                      key={i}
                      sponsor={sponsor}
                      chipSize={chipSize}
                      layoutId={layoutId}
                      reduceMotion={reduceMotion}
                      onSelect={() =>
                        setSelected({ ...sponsor, eyebrow: `${key} Sponsor`, layoutId })
                      }
                    />
                  );
                })}
              </ScrollRevealGroup>
            </div>
          ))}
        </div>

        <ScrollReveal className="mt-16 flex justify-center" delay={0.1}>
          <ArrowButton href="#register" variant="solid">
            Become a Sponsor
          </ArrowButton>
        </ScrollReveal>
      </div>

      <DetailModal entry={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
