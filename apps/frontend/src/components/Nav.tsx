import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";
import { useSiteData } from "../context/SiteDataContext";
import { ArrowButton } from "./ArrowButton";

export function Nav() {
  const { eventInfo, navLinks } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = navLinks
    .filter((link) => link.href.startsWith("#"))
    .map((link) => link.href.replace("#", ""));
  const activeId = useActiveSection(sectionIds);
  const location = useLocation();
  const isHome = location.pathname === "/";

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

  // Section anchors (#agenda, #speakers, …) only work while already on the
  // home page — from anywhere else they need to route home first, hash and
  // all, so HomePage's scroll-to-hash effect can pick it up on arrival.
  const targetFor = (href: string) => (href.startsWith("#") && !isHome ? `/${href}` : href);

  const isActive = (href: string) =>
    href.startsWith("#") ? isHome && activeId === href.slice(1) : location.pathname === href;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-navy-dark/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
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
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={targetFor(link.href)}
                className={`mono-label relative text-xs font-medium transition-colors duration-200 ${
                  active ? "text-brand-green-light" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-brand-green-light"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </Link>
            );
          })}
          <ArrowButton href={targetFor("#register")} variant="outline">
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
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={targetFor(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className="mono-label block rounded-lg px-3 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
              >
                <Link
                  to={targetFor("#register")}
                  onClick={() => setMobileOpen(false)}
                  className="mono-label mt-2 block rounded-lg bg-brand-green px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
