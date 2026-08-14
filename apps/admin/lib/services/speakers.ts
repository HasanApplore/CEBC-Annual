import { createResourceService } from "./resourceService";

export interface Speaker {
  _id?: string;
  name: string;
  title: string;
  org: string;
  photo: string;
  linkedin: string;
  order: number;
}

export const speakerService = createResourceService<Speaker>("/speakers");
