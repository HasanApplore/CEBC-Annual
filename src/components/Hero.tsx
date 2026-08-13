import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Calendar, Clock, MapPin, MousePointer2, Sparkles } from "lucide-react";
import { type MouseEvent, useRef } from "react";
import { eventInfo } from "../data/summit";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowButton } from "./ArrowButton";
import { Eyebrow } from "./Eyebrow";

const headlineWords = eventInfo.name.split(" ");

const infoItems = [
  { icon: Calendar, label: eventInfo.dateLabel },
  { icon: MapPin, label: eventInfo.venue },
  { icon: Clock, label: eventInfo.timeLabel },
];

// Keywords for the scrolling marquee band — repeated twice below for a seamless loop.
const marqueeWords = [
  "THE TURNING POINT",
  "CLEAN ENERGY",
  "MENA",
  "NET ZERO",
  "RESILIENCE",
  "ECONOMIC TRANSFORMATION",
  "DIFC · DUBAI",
];

/**
 * Tracks the cursor relative to one element and exposes a CSS mask that
 * reveals a circle around the pointer. Paired with a coloured clone of an
 * element's content (see the `*Reveal` renders below), this makes the base
 * (white/muted) content switch to a gradient wherever the cursor hovers it.
 */
function useCursorReveal<T extends HTMLElement>(radius: number) {
  const ref = useRef<T>(null);
  const x = useSpring(useMotionValue(-9999), { stiffness: 250, damping: 25 });
  const y = useSpring(useMotionValue(-9999), { stiffness: 250, damping: 25 });
  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, black 0%, transparent 100%)`;
  return { ref, x, y, mask };
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Cursor-reveal gradient text, one per interactive element.
  const headlineReveal = useCursorReveal<HTMLHeadingElement>(130);
  const subheadingReveal = useCursorReveal<HTMLParagraphElement>(90);
  const infoRowReveal = useCursorReveal<HTMLDivElement>(90);
  const marqueeReveal = useCursorReveal<HTMLDivElement>(90);
  const registerReveal = useCursorReveal<HTMLAnchorElement>(60);
  const agendaReveal = useCursorReveal<HTMLAnchorElement>(60);
  const allReveals = [
    headlineReveal,
    subheadingReveal,
    infoRowReveal,
    marqueeReveal,
    registerReveal,
    agendaReveal,
  ];

  const handlePointerMove = (e: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;

    allReveals.forEach(({ ref, x, y }) => {
      const targetRect = ref.current?.getBoundingClientRect();
      if (targetRect) {
        x.set(e.clientX - targetRect.left);
        y.set(e.clientY - targetRect.top);
      }
    });
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      className="relative flex min-h-screen flex-col overflow-hidden bg-brand-navy-dark"
    >
      {/* Background video (with the poster image as fallback) + scroll parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduceMotion ? undefined : { y: bgY, scale: bgScale }}
      >
        {eventInfo.heroVideoUrl && !reduceMotion ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={eventInfo.heroImageUrl}
            aria-hidden
            className="h-full w-full object-cover"
          >
            <source src={eventInfo.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={eventInfo.heroImageUrl}
            alt=""
            role="presentation"
            className={`h-full w-full object-cover ${reduceMotion ? "" : "animate-ken-burns"}`}
          />
        )}
        {/* Deep editorial read — darker than a typical corporate overlay, closer to the reference's near-black frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-dark/75 via-brand-navy-dark/55 to-brand-navy-dark/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-transparent to-transparent" />
      </motion.div>

      {/* Floating ambient glow orbs */}
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-1/4 z-[1] h-72 w-72 rounded-full bg-brand-green/20 blur-[100px]"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-1/3 z-[1] h-80 w-80 rounded-full bg-brand-blue/20 blur-[110px]"
            animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </>
      )}

      {/* Main content — left-aligned, editorial, sits in the upper two-thirds */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-28 sm:px-8 lg:px-12">
        <motion.div
          style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Eyebrow tone="light">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={12} />
                14th Annual Summit
              </span>
            </Eyebrow>
          </motion.div>

          <h1
            ref={headlineReveal.ref}
            className="relative mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl lg:text-[4.2rem]"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.45 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-4 inline-block"
              >
                {word}
              </motion.span>
            ))}

            {/* Coloured clone revealed only inside a circle around the cursor */}
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-green-light via-emerald-300 to-brand-blue bg-clip-text text-transparent"
                style={{ WebkitMaskImage: headlineReveal.mask, maskImage: headlineReveal.mask }}
              >
                {headlineWords.map((word, i) => (
                  <span key={`glow-${word}-${i}`} className="mr-4 inline-block">
                    {word}
                  </span>
                ))}
              </motion.div>
            )}
          </h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-7 h-1 w-20 origin-left rounded-full bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green"
          />

          <motion.p
            ref={subheadingReveal.ref}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="relative mt-6 max-w-xl text-lg italic text-white/85 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-xl"
          >
            {eventInfo.theme}
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-blue via-sky-300 to-brand-green-light bg-clip-text text-transparent"
                style={{ WebkitMaskImage: subheadingReveal.mask, maskImage: subheadingReveal.mask }}
              >
                {eventInfo.theme}
              </motion.span>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <ArrowButton
              ref={registerReveal.ref}
              href="#register"
              variant="solid"
              className="relative w-full sm:w-auto"
            >
              Register Now
              {!reduceMotion && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-5 right-9 z-10 flex items-center bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-xs font-semibold text-transparent"
                  style={{ WebkitMaskImage: registerReveal.mask, maskImage: registerReveal.mask }}
                >
                  Register Now
                </motion.span>
              )}
            </ArrowButton>
            <ArrowButton
              ref={agendaReveal.ref}
              href="#agenda"
              variant="outline"
              className="relative w-full sm:w-auto"
            >
              View Agenda
              {!reduceMotion && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-5 right-9 z-10 flex items-center bg-gradient-to-r from-brand-green-light via-emerald-300 to-brand-blue bg-clip-text text-xs font-semibold text-transparent"
                  style={{ WebkitMaskImage: agendaReveal.mask, maskImage: agendaReveal.mask }}
                >
                  View Agenda
                </motion.span>
              )}
            </ArrowButton>
          </motion.div>

          {/* Date · venue · time — a tracked monospace row instead of a floating pill */}
          <motion.div
            ref={infoRowReveal.ref}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {infoItems.map(({ icon: Icon, label }, i) => (
              <span
                key={label}
                className="mono-label flex items-center gap-2 text-xs text-white/60"
              >
                {i > 0 && <span className="hidden text-white/25 sm:inline">/</span>}
                <Icon size={14} className="text-brand-green-light" />
                {label}
              </span>
            ))}

            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex flex-wrap items-center gap-x-6 gap-y-2"
                style={{ WebkitMaskImage: infoRowReveal.mask, maskImage: infoRowReveal.mask }}
              >
                {infoItems.map(({ icon: Icon, label }, i) => (
                  <span
                    key={`glow-${label}`}
                    className="mono-label flex items-center gap-2 bg-gradient-to-r from-brand-green-light via-emerald-300 to-brand-blue bg-clip-text text-xs text-transparent"
                  >
                    {i > 0 && <span className="hidden text-white/25 sm:inline">/</span>}
                    <Icon size={14} className="text-brand-green-light" />
                    {label}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom-right scroll cue */}
      <motion.a
        href="#agenda"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="mono-label absolute bottom-24 right-5 z-10 hidden items-center gap-2 text-xs text-white/60 transition-colors hover:text-white sm:right-8 sm:flex lg:right-12"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <MousePointer2 size={14} />
        </motion.span>
        Scroll to discover
      </motion.a>

      {/* Scrolling keyword marquee — the hero's bottom edge */}
      <motion.div
        ref={marqueeReveal.ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="relative z-10 mt-10 overflow-hidden border-t border-white/10 bg-black/20 py-3 backdrop-blur-sm"
      >
        <motion.div
          className="flex w-max items-center gap-10 whitespace-nowrap"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="mono-label flex items-center gap-10 text-xs text-white/45"
            >
              {word}
              <span className="text-brand-green-light">◆</span>
            </span>
          ))}
        </motion.div>

        {/* Coloured clone, animated in lockstep with the row above, revealed around the cursor */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex w-max items-center gap-10 whitespace-nowrap py-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ WebkitMaskImage: marqueeReveal.mask, maskImage: marqueeReveal.mask }}
          >
            {[...marqueeWords, ...marqueeWords].map((word, i) => (
              <span
                key={`glow-${word}-${i}`}
                className="mono-label flex items-center gap-10 bg-gradient-to-r from-brand-green-light via-emerald-300 to-brand-blue bg-clip-text text-xs text-transparent"
              >
                {word}
                <span className="text-brand-green-light">◆</span>
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
