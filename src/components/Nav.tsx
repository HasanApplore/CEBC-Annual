import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";
import { eventInfo, navLinks } from "../data/summit";
import { ArrowButton } from "./ArrowButton";

const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-navy-dark/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          {/* Placeholder slot — swap in the real CEBC logo URL via eventInfo.logoUrl */}
          {eventInfo.logoUrl ? (
            <img src={eventInfo.logoUrl} alt="CEBC logo" className="h-9 w-auto" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-green bg-white/10 text-xs font-bold tracking-wide text-white">
              CEBC
            </span>
          )}
          <span className="mono-label hidden text-xs font-semibold text-white sm:inline">
            Annual Summit
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeId === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`mono-label relative text-xs font-medium transition-colors duration-200 ${
                  isActive ? "text-brand-green-light" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-brand-green-light"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </a>
            );
          })}
          <ArrowButton href="#register" variant="outline">
            Register
          </ArrowButton>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="text-white md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-brand-navy-dark md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="mono-label rounded-lg px-3 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#register"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                className="mono-label mt-2 rounded-lg bg-brand-green px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Register
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
