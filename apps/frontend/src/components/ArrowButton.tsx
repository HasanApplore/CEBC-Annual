import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

interface SharedProps {
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}

// framer-motion's onAnimation*/onDrag* handler types conflict with the raw
// DOM event handler types on these attribute interfaces — omit them since
// motion.a / motion.button already provide (and type) their own versions.
type ConflictingKeys =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd";

type ArrowButtonProps = SharedProps &
  (
    | ({ href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        ConflictingKeys
      >)
    | ({ href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        ConflictingKeys
      >)
  );

const base =
  "mono-label group relative inline-flex items-center gap-3 rounded-lg border pl-5 pr-1.5 py-1.5 text-xs font-semibold transition-all duration-300";

const variants = {
  solid: "border-brand-green bg-brand-green text-white hover:bg-brand-green-light",
  outline:
    "border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/5",
};

const iconBoxVariants = {
  solid: "bg-white/20 text-white",
  outline: "bg-brand-green text-white",
};

/**
 * The site's recurring CTA shape: tracked-uppercase label + a small square
 * icon box with a chevron, borrowed from the reference design's "LET'S TALK"
 * buttons. Renders as an <a> when `href` is passed, otherwise a <button>.
 */
export const ArrowButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ArrowButtonProps
>(({ children, variant = "outline", className = "", href, ...rest }, ref) => {
  const content = (
    <>
      {children}
      <span
        className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded transition-transform duration-300 group-hover:translate-x-0.5 ${iconBoxVariants[variant]}`}
      >
        <ChevronRight size={14} />
      </span>
    </>
  );

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        whileTap={{ scale: 0.97 }}
        className={classes}
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, ConflictingKeys>)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      whileTap={{ scale: 0.97 }}
      className={classes}
      {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingKeys>)}
    >
      {content}
    </motion.button>
  );
});

ArrowButton.displayName = "ArrowButton";
