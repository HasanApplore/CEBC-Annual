import { createResourceService } from "./resourceService";

export interface GalleryImage {
  _id?: string;
  photo: string;
  caption: string;
  description: string;
  order: number;
}

export const galleryService = createResourceService<GalleryImage>("/gallery");
