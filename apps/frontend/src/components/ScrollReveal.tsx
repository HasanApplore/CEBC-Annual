import { motion, type Variants } from "framer-motion";
import { Children, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Extra delay (seconds) before this element's reveal starts. */
  delay?: number;
  /** Element tag to render — defaults to a div. */
  as?: "div" | "section";
}

/** Fades + slides an element up as it scrolls into view. Use ScrollRevealGroup for staggered children. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const reduceMotion = usePrefersReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

// Same "hidden"/"show" keys, but with the stagger collapsed to zero — used
// under prefers-reduced-motion so children still receive the "show" trigger
// (and thus become visible) without a cascading reveal.
const containerVariantsReduced: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

interface ScrollRevealGroupProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrap a grid/list of `motion` children (using `staggerItemVariants`) to
 * reveal them one after another. `initial`/`whileInView`/`variants` stay
 * active even under reduced motion — children declare `variants` without
 * their own `initial`, so they rely on this parent to fire the "show"
 * trigger; disabling it here left them stuck at the "hidden" (invisible)
 * state forever. Only the stagger cascade itself is removed for reduced
 * motion, not the reveal.
 *
 * `viewport.once` means this only ever fires once per mounted node. If the
 * list is still empty (e.g. async data hasn't arrived yet) when it first
 * scrolls into view, that single check happens against a zero-height
 * container and the items that arrive moments later never get revealed —
 * they render stuck at `opacity: 0` forever, present and clickable but
 * invisible. Remounting via `key` the first time children go from none to
 * some forces a fresh viewport check against the now-real content.
 */
export function ScrollRevealGroup({ children, className }: ScrollRevealGroupProps) {
  const reduceMotion = usePrefersReducedMotion();
  const hasContent = Children.count(children) > 0;
  const everHadContentRef = useRef(false);
  if (hasContent) everHadContentRef.current = true;

  return (
    <motion.div
      key={everHadContentRef.current ? "populated" : "empty"}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={reduceMotion ? containerVariantsReduced : containerVariants}
    >
      {children}
    </motion.div>
  );
}
