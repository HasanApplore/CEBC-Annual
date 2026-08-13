import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useEffect } from "react";

export interface DetailModalEntry {
  name: string;
  logo: string;
  description: string;
  website: string;
  /** Optional supporting label, e.g. "Platinum Sponsor". */
  eyebrow?: string;
  /**
   * Matches the `layoutId` on the card that opened this modal, so Framer
   * Motion morphs the card into the modal panel instead of just fading in.
   */
  layoutId: string;
}

interface DetailModalProps {
  entry: DetailModalEntry | null;
  onClose: () => void;
}

/** Click-to-detail modal shared by Sponsor and Partner cards, with a shared-element morph transition. */
export function DetailModal({ entry, onClose }: DetailModalProps) {
  useEffect(() => {
    if (!entry) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [entry, onClose]);

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/70 p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={entry.name}
        >
          <motion.div
            layoutId={entry.layoutId}
            transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-2xl"
          >
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              className="absolute right-4 top-4 rounded-full p-1.5 text-brand-navy/50 transition-colors hover:bg-brand-bg hover:text-brand-navy"
            >
              <X size={20} />
            </motion.button>

            <motion.div
              layoutId={`${entry.layoutId}-logo`}
              transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
              className="flex h-24 w-full items-center justify-center rounded-lg bg-brand-bg"
            >
              {entry.logo ? (
                <img src={entry.logo} alt={entry.name} className="max-h-16 max-w-[70%] rounded object-contain" />
              ) : (
                <span className="text-sm font-semibold text-brand-navy/30">Logo pending</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {entry.eyebrow && (
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-brand-green">
                  {entry.eyebrow}
                </p>
              )}
              <h3 className="mt-1 text-xl font-bold text-brand-navy">{entry.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-navy/70">
                {entry.description}
              </p>

              {entry.website ? (
                <a
                  href={entry.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-navy"
                >
                  Visit website
                  <ExternalLink size={15} />
                </a>
              ) : (
                <p className="mt-5 text-xs font-medium text-brand-navy/40">
                  Website link pending
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
