import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import type { SVGProps } from "react";
import { eventInfo, footerContent, navLinks } from "../data/summit";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * lucide-react no longer ships brand/social marks, so the footer's social
 * row uses small hand-drawn outline glyphs sized to match the lucide icons
 * used elsewhere on the page.
 */
const socialIcons: Record<string, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  Facebook: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 9h3V5.5h-3C11.79 5.5 10 7.29 10 9.5V12H7v3.5h3V21h3.5v-5.5H17l.5-3.5h-4V10c0-.55.45-1 1-1z" />
    </svg>
  ),
  Twitter: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l7.5 9.5L4.5 20H7l6-6.7L18 20h2l-8-10.2L19 4h-2.5l-5.3 6L8 4H4z" />
    </svg>
  ),
  YouTube: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10.5v6M7.5 7.75v.01M11.5 16.5v-3.5c0-1.1.9-2 2-2s2 .9 2 2v3.5M11.5 12.75V16.5" />
    </svg>
  ),
  Instagram: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/**
 * Renders inside the shared Register+Footer background wrapper (see App.tsx)
 * — it deliberately has no background of its own so the video/overlay behind
 * both sections shows through continuously across the seam between them.
 */
export function Footer() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <footer className="relative overflow-hidden pt-12 text-white/70">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-10 sm:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              {/* Placeholder slot — swap in the real CEBC logo URL via eventInfo.logoUrl */}
              {eventInfo.logoUrl ? (
                <img src={eventInfo.logoUrl} alt="CEBC logo" className="h-8 w-auto" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-green text-[10px] font-bold text-white">
                  CEBC
                </span>
              )}
              <span className="text-sm font-semibold text-white">
                Clean Energy Business Council MENA
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed">{footerContent.about}</p>

            <div className="mt-4 flex gap-3">
              {footerContent.socials.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green hover:bg-brand-green"
                  >
                    {Icon && <Icon width={16} height={16} />}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mono-label text-[11px] font-semibold text-white/40">Summit</h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#register" className="transition-colors hover:text-white">
                  Register
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mono-label text-[11px] font-semibold text-white/40">Contact</h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-brand-green-light" />
                <a href={`mailto:${footerContent.email}`} className="break-all transition-colors hover:text-white">
                  {footerContent.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-green-light" />
                {footerContent.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-3 py-4 text-xs text-white/40 sm:flex-row">
          <span>© 2026 Clean Energy Business Council MENA (CEBC). All rights reserved.</span>
          <a
            href="#top"
            className="mono-label flex items-center gap-1.5 transition-colors hover:text-white"
          >
            Back to top
            <ArrowUp size={12} />
          </a>
        </div>
      </div>

      {/* Oversized wordmark, swiping up into view as the footer scrolls in, bleeding off the bottom edge */}
      <motion.div
        aria-hidden
        initial={reduceMotion ? undefined : { y: 120, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative select-none text-center font-extrabold leading-none text-brand-green-light/15"
        style={{ fontSize: "clamp(6rem, 18vw, 14rem)" }}
      >
        <span className="block" style={{ transform: "translateY(22%)" }}>
          CEBC
        </span>
      </motion.div>
    </footer>
  );
}
