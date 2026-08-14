import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type MouseEvent } from "react";
import { aboutContent } from "../data/summit";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal, ScrollRevealGroup, staggerItemVariants } from "./ScrollReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

// Split into numbered rows (regular paragraphs) + a closing pull-quote (the bold line).
const rows = aboutContent.paragraphs.filter((p) => !p.bold);
const closingLine = aboutContent.paragraphs.find((p) => p.bold);

interface RowProps {
  index: number;
  text: string;
  image?: string;
}

/** A single numbered row with a cursor-tracked spotlight, a reveal-on-hover accent, and a thumbnail. */
function AboutRow({ index, text, image }: RowProps) {
  const spotX = useMotionValue(-9999);
  const spotY = useMotionValue(-9999);
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${spotX}px ${spotY}px, rgba(111,160,109,0.14), transparent 70%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      variants={staggerItemVariants}
      onMouseMove={handleMove}
      className="group relative flex flex-col gap-5 overflow-hidden border-b border-white/10 py-7 sm:flex-row sm:items-center sm:gap-8 sm:py-8"
    >
      {/* Cursor-tracked spotlight illusion */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* Left accent bar that grows in on hover */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 w-[2px] origin-top scale-y-0 bg-gradient-to-b from-brand-green-light to-brand-blue transition-transform duration-300 group-hover:scale-y-100"
        style={{ height: "100%" }}
      />

      <div className="relative flex flex-1 items-start gap-4 sm:gap-8">
        <motion.span
          className="mono-label pt-1 text-sm text-brand-green-light/70 transition-all duration-300 group-hover:pl-2 group-hover:text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #6fa06d, #004aad)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        <p className="max-w-3xl pl-3 text-base leading-relaxed text-white/80 transition-all duration-300 group-hover:pl-5 group-hover:text-white sm:text-lg">
          {text}
        </p>
      </div>

      {image && (
        <motion.div
          initial={{ opacity: 0, scale: 1.15 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-24 sm:w-36"
        >
          <img
            src={image}
            alt=""
            role="presentation"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy-dark/70 via-brand-navy-dark/0 to-transparent" />
          <span className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 translate-x-1 translate-y-1 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={13} />
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="bg-brand-navy-dark py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <ScrollReveal>
          <div className="group relative inline-block">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-full bg-brand-green/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-green/10"
            />
            <Eyebrow tone="light">About the Summit</Eyebrow>
            <h2 className="mt-6 flex items-start gap-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              <motion.span
                whileHover={{ rotate: 45, scale: 1.15 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-1 inline-flex shrink-0 text-brand-green-light sm:mt-2"
              >
                <ArrowUpRight size={32} />
              </motion.span>
              {aboutContent.heading}
            </h2>
          </div>
          <p className="mt-4 max-w-xl pl-11 text-base text-white/60 sm:pl-[52px] sm:text-lg">
            {aboutContent.subheading}
          </p>
        </ScrollReveal>

        <ScrollRevealGroup className="mt-14 border-t border-white/10">
          {rows.map((row, i) => (
            <AboutRow key={i} index={i} text={row.text} image={row.image} />
          ))}
        </ScrollRevealGroup>

        {closingLine && (
          <ScrollReveal delay={0.15} className="mt-14 sm:mt-16">
            <motion.div
              whileHover={{ x: 6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border-l-2 border-brand-green pl-6 sm:pl-8"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-y-4 left-0 -z-10 w-40 bg-brand-green/0 blur-2xl transition-colors duration-500 group-hover:bg-brand-green/20"
              />
              <p className="text-xl font-bold leading-snug text-brand-green-light transition-colors duration-300 group-hover:text-white sm:text-2xl">
                {closingLine.text}
              </p>
            </motion.div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
