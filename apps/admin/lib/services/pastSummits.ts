import { createResourceService } from "./resourceService";

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
  _id?: string;
  title: string;
  year: number;
  reportUrl: string;
  order: number;
  photos: PastSummitPhoto[];
  agenda: PastSummitAgendaItem[];
}

export const pastSummitService = createResourceService<PastSummit>("/past-summits");
