import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** "light" for use on dark backgrounds, "dark" for use on light backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}

/** Small tracked-uppercase pill label used above section headings. */
export function Eyebrow({ children, tone = "light", className = "" }: EyebrowProps) {
  const toneClasses =
    tone === "light"
      ? "bg-brand-green-pale text-brand-navy-dark"
      : "bg-brand-green/10 text-brand-green border border-brand-green/30";

  return (
    <span
      className={`mono-label inline-block rounded px-3 py-1.5 text-[11px] font-semibold ${toneClasses} ${className}`}
    >
      {children}
    </span>
  );
}
