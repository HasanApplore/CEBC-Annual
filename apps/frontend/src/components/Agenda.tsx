import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { type MouseEvent, useRef } from "react";
import type { AgendaItem } from "../data/summit";
import { useSiteData } from "../context/SiteDataContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowButton } from "./ArrowButton";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

interface AgendaRowProps {
  item: AgendaItem;
  index: number;
  reduceMotion: boolean;
}

function AgendaRow({ item, index, reduceMotion }: AgendaRowProps) {
  const isRight = index % 2 === 1;
  const spotX = useMotionValue(-9999);
  const spotY = useMotionValue(-9999);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${spotX}px ${spotY}px, rgba(91,140,90,0.14), transparent 70%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className="group relative sm:grid sm:grid-cols-[1fr_2.5rem_1fr] sm:items-center sm:gap-6"
      initial={
        reduceMotion ? undefined : { opacity: 0, x: isRight ? 24 : -24 }
      }
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Timeline dot — centered precisely on the line at every breakpoint,
          brightens and grows whenever the card beside it is hovered */}
      <motion.span
        initial={reduceMotion ? undefined : { scale: 0 }}
        whileInView={reduceMotion ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, delay: index * 0.12 + 0.15, type: "spring", stiffness: 300, damping: 18 }}
        className="absolute -left-8 top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-green bg-white transition-all duration-300 group-hover:scale-125 group-hover:border-brand-blue group-hover:shadow-[0_0_16px_4px_rgba(0,74,173,0.35)] sm:relative sm:left-auto sm:top-auto sm:col-start-2 sm:row-start-1 sm:mx-auto"
      >
        {!reduceMotion && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-brand-green"
            animate={{ scale: [1, 2.1, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          />
        )}
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green transition-colors duration-300 group-hover:bg-brand-blue" />

        {/* Connector transition — draws a short line from the dot into the card */}
        {!reduceMotion && (
          <motion.span
            aria-hidden
            className={`absolute top-1/2 hidden h-0.5 w-6 -translate-y-1/2 sm:block ${
              isRight
                ? "left-full origin-left bg-gradient-to-r from-brand-green to-transparent"
                : "right-full origin-right bg-gradient-to-l from-brand-green to-transparent"
            }`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </motion.span>

      <motion.div
        onMouseMove={handleMove}
        whileHover={reduceMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden rounded-lg border border-brand-navy/10 bg-brand-bg p-5 shadow-sm transition-[border-color,box-shadow] duration-300 group-hover:border-brand-green/40 group-hover:shadow-xl group-hover:shadow-brand-green/15 sm:p-6 sm:row-start-1 ${
          isRight ? "sm:col-start-3" : "sm:col-start-1"
        }`}
      >
        {/* Cursor-tracked spotlight illusion */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />

        {/* Image banner — bleeds to the card's edges via negative margin, title/time overlaid on top */}
        <div className="relative -m-5 mb-4 h-36 overflow-hidden sm:-m-6 sm:mb-5 sm:h-40">
          <img
            src={item.image}
            alt=""
            role="presentation"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/85 via-brand-navy-dark/25 to-brand-navy-dark/10" />

          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
            <span className="mono-label flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              <motion.span
                whileHover={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex"
              >
                <Clock size={12} />
              </motion.span>
              {item.time}
            </span>
            <span className="mono-label text-[11px] font-semibold text-white/60 transition-colors duration-300 group-hover:text-brand-green-light">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="absolute inset-x-4 bottom-3 text-lg font-semibold leading-snug text-white">
            {item.title}
          </h3>
        </div>

        <ul className="relative mt-3 space-y-1.5">
          {item.highlights.map((highlight, hi) => (
            <motion.li
              key={hi}
              initial={reduceMotion ? undefined : { opacity: 0, x: isRight ? 10 : -10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.35,
                delay: index * 0.12 + 0.35 + hi * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-2 text-sm text-brand-navy/70"
            >
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-green" />
              {highlight}
            </motion.li>
          ))}
        </ul>

        <p className="relative mt-3 border-t border-brand-navy/10 pt-3 text-sm italic text-brand-navy/50">
          {item.detail}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function Agenda() {
  const { agendaItems, eventInfo } = useSiteData();
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section id="agenda" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:max-w-5xl sm:px-8">
        <ScrollReveal className="text-center">
          <Eyebrow tone="dark">Provisional Schedule</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Agenda
          </h2>
          <p className="mt-3 text-brand-navy/70">
            {eventInfo.dateLabel} · {eventInfo.venue}
          </p>
        </ScrollReveal>

        <div ref={timelineRef} className="relative mt-16 pl-8 sm:pl-0">
          {/* Track (background line) — left-aligned on mobile, centered on sm+ */}
          <div className="absolute left-[7px] top-0 h-full w-0.5 bg-brand-navy/10 sm:left-1/2 sm:-translate-x-1/2" />

          {/* Animated draw-in progress line, with a soft glow and a light pulse that travels down it */}
          <motion.div
            className="absolute left-[7px] top-0 w-0.5 origin-top overflow-visible bg-gradient-to-b from-brand-green via-brand-green to-brand-blue shadow-[0_0_8px_rgba(91,140,90,0.5)] sm:left-1/2 sm:-translate-x-1/2"
            style={{ height: "100%" }}
            initial={reduceMotion ? undefined : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="absolute left-1/2 h-16 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            )}
          </motion.div>

          <div className="flex flex-col gap-10 sm:gap-14">
            {agendaItems.map((item, i) => (
              <AgendaRow key={i} item={item} index={i} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>

        <ScrollReveal className="mt-14 flex justify-center" delay={0.15}>
          <ArrowButton href="#register" variant="solid" className="!border-brand-navy !bg-brand-navy hover:!bg-brand-navy-light">
            View Full Agenda
          </ArrowButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
