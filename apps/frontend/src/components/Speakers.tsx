import { motion } from "framer-motion";
import { Link2, User } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

export function Speakers() {
  const { speakers } = useSiteData();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section id="speakers" className="bg-brand-bg py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal className="text-center">
          <Eyebrow tone="dark">Line-Up</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Speakers
          </h2>
          <p className="mt-3 text-brand-navy/70">
            Our 2026 speaker line-up will be announced soon.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker, i) => (
            <motion.div
              key={speaker._id || `${speaker.name}-${i}`}
              initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : (i % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
              className="group overflow-hidden rounded-lg border border-brand-navy/10 bg-white shadow-sm transition-all duration-300 hover:border-brand-green/40 hover:shadow-xl hover:shadow-brand-green/10"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-navy to-brand-blue">
                {speaker.photo ? (
                  <>
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    {/* Gradient wash that recedes on hover, revealing full colour */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/10 to-transparent transition-opacity duration-500 group-hover:opacity-40" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-6xl font-black text-white/25">?</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-brand-navy">{speaker.name}</h3>
                <p className="mono-label mt-1.5 text-[11px] font-semibold text-brand-green">
                  {speaker.title}
                </p>
                <p className="mt-0.5 text-sm text-brand-navy/60">{speaker.org}</p>

                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${speaker.name} on LinkedIn`}
                    className="mono-label mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-blue transition-colors hover:text-brand-navy"
                  >
                    <Link2 size={16} />
                    LinkedIn
                  </a>
                )}
                {!speaker.linkedin && (
                  <span className="mono-label mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-navy/30">
                    <User size={14} />
                    Profile pending
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
