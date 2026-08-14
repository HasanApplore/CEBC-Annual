import { createResourceService } from "./resourceService";

export interface AgendaItem {
  _id?: string;
  time: string;
  title: string;
  detail: string;
  highlights: string[];
  image: string;
  order: number;
}

export const agendaService = createResourceService<AgendaItem>("/agenda");
