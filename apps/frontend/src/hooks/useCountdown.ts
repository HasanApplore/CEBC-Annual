import { useEffect, useState } from "react";

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function diffToParts(diffMs: number): TimeRemaining {
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: false,
  };
}

/** Live countdown to `targetIso`, ticking once per second. */
export function useCountdown(targetIso: string): TimeRemaining {
  const target = new Date(targetIso).getTime();
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    diffToParts(target - Date.now())
  );

  useEffect(() => {
    const tick = () => setRemaining(diffToParts(target - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return remaining;
}
