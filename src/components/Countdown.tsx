import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock3, Hourglass, Timer } from "lucide-react";
import { eventInfo } from "../data/summit";
import { useCountdown } from "../hooks/useCountdown";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

interface FlipDigitProps {
  value: number;
  reduceMotion: boolean;
}

function FlipDigit({ value, reduceMotion }: FlipDigitProps) {
  const padded = String(value).padStart(2, "0");

  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={padded}
          initial={reduceMotion ? undefined : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {padded}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
  icon: typeof Calendar;
  accent: boolean;
  reduceMotion: boolean;
}

function StatBox({ label, value, icon: Icon, accent, reduceMotion }: StatBoxProps) {
  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : { y: -10, scale: 1.035, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
      }
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-lg px-5 py-6 shadow-lg transition-shadow duration-300 sm:py-7 ${
        accent
          ? "border border-brand-green-light/40 bg-gradient-to-br from-brand-green via-brand-green to-brand-green-light shadow-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/50"
          : "border border-white/10 bg-gradient-to-br from-brand-navy-dark via-brand-navy-dark to-brand-navy shadow-black/20 hover:border-brand-green-light/40 hover:shadow-2xl hover:shadow-brand-blue/30"
      }`}
    >
      {/* Soft glow that blooms in behind the card on hover */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60 ${
          accent ? "bg-brand-green-light/50" : "bg-brand-blue/40"
        }`}
      />

      {/* Slow-rotating conic sheen for a "live data" feel — speeds up on hover */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute -inset-8 opacity-25 transition-opacity duration-300 group-hover:opacity-40 ${
            accent ? "mix-blend-overlay" : ""
          }`}
          style={{
            background: accent
              ? "conic-gradient(from 0deg, rgba(255,255,255,0.5), transparent 30%, transparent 70%, rgba(255,255,255,0.5))"
              : "conic-gradient(from 0deg, rgba(111,160,109,0.5), transparent 25%, transparent 75%, rgba(0,74,173,0.5))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="relative flex items-center justify-between">
        <motion.span
          whileHover={reduceMotion ? undefined : { rotate: -12, scale: 1.15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <Icon size={16} className={accent ? "text-white/80" : "text-brand-green-light"} />
        </motion.span>
        <span
          className={`h-2 w-2 rounded-full ${
            accent
              ? "bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"
              : "bg-brand-green-light shadow-[0_0_10px_2px_rgba(111,160,109,0.7)]"
          }`}
        >
          {!reduceMotion && (
            <motion.span
              className={`block h-full w-full rounded-full ${accent ? "bg-white" : "bg-brand-green-light"}`}
              animate={{ scale: [1, 1.9, 1], opacity: [0.9, 0, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
      </div>

      <span
        className={`relative mt-4 font-mono text-4xl font-extrabold tabular-nums text-white transition-colors duration-300 sm:text-5xl ${
          accent ? "" : "group-hover:text-brand-green-light"
        }`}
      >
        <FlipDigit value={value} reduceMotion={reduceMotion} />
      </span>
      <span
        className={`mono-label relative mt-3 text-[11px] transition-colors duration-300 ${
          accent ? "text-white/80" : "text-white/50 group-hover:text-white/80"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function Countdown() {
  const remaining = useCountdown(eventInfo.countdownTarget);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="bg-brand-bg py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <Eyebrow tone="dark">Countdown</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Summit Commences In
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {remaining.isComplete ? (
            <p className="mt-10 text-2xl font-bold text-brand-green">
              The Summit is here.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
              <StatBox
                label="Days"
                value={remaining.days}
                icon={Calendar}
                accent={false}
                reduceMotion={reduceMotion}
              />
              <StatBox
                label="Hours"
                value={remaining.hours}
                icon={Clock3}
                accent={false}
                reduceMotion={reduceMotion}
              />
              <StatBox
                label="Minutes"
                value={remaining.minutes}
                icon={Hourglass}
                accent={false}
                reduceMotion={reduceMotion}
              />
              <StatBox
                label="Seconds"
                value={remaining.seconds}
                icon={Timer}
                accent
                reduceMotion={reduceMotion}
              />
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
