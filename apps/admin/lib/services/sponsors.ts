import { createResourceService } from "./resourceService";

export interface Sponsor {
  _id?: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  order: number;
}

export const sponsorService = createResourceService<Sponsor>("/sponsors");
