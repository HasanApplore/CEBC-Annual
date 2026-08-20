import { useEffect, useState } from "react";
import { apiGet, resolveMediaUrl } from "../lib/api";

export interface PastSummitPhoto {
  photo: string;
  caption: string;
  description: string;
}

export interface PastSummitAgendaItem {
  time: string;
  title: string;
  detail: string;
  highlights: string[];
  image: string;
}

export interface PastSummit {
  _id: string;
  title: string;
  year: number;
  reportUrl: string;
  order: number;
  photos: PastSummitPhoto[];
  agenda: PastSummitAgendaItem[];
}

function resolveSummitMedia(summit: PastSummit): PastSummit {
  return {
    ...summit,
    reportUrl: resolveMediaUrl(summit.reportUrl),
    photos: summit.photos.map((p) => ({ ...p, photo: resolveMediaUrl(p.photo) })),
    agenda: summit.agenda.map((a) => ({ ...a, image: resolveMediaUrl(a.image) })),
  };
}

/** Past annual summit editions — fetched independently of SiteDataContext since this data is only used on the Gallery ("Past Event") page. */
export function usePastSummits() {
  const [summits, setSummits] = useState<PastSummit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet<PastSummit[]>("/past-summits")
      .then((data) => {
        if (!cancelled) setSummits(data.map(resolveSummitMedia));
      })
      .catch(() => {
        // Leave summits empty — the section below renders nothing if there's none yet.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { summits, loading };
}
