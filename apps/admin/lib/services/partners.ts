import { createResourceService } from "./resourceService";

export interface Partner {
  _id?: string;
  name: string;
  logo: string;
  type: string;
  description: string;
  website: string;
  order: number;
}

export const partnerService = createResourceService<Partner>("/partners");
