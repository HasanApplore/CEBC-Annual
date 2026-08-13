import { useEffect, useState } from "react";

function getInitial(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Mirrors the `prefers-reduced-motion` media query so components can gate
 * heavy motion. Reads the real value synchronously on first render (rather
 * than defaulting to false and correcting a tick later in an effect) —
 * that mount-time flip briefly started full animations before switching
 * targets, which could leave `layoutId`-projected elements in a broken
 * (invisible) state.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}
