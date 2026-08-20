"use client";

import { ResourceManager, type FieldConfig } from "../components/ResourceManager";
import { galleryService, type GalleryImage } from "../../../lib/services/gallery";

const fields: FieldConfig[] = [
  { key: "photo", label: "Photo", type: "media" },
  { key: "caption", label: "Caption", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "order", label: "Order", type: "number" },
];

export default function GalleryPage() {
  return (
    <ResourceManager<GalleryImage>
      title="Past Event"
      description="Manage the Past Event page's photos."
      service={galleryService}
      fields={fields}
      columns={[
        { key: "order", label: "#" },
        { key: "caption", label: "Caption" },
      ]}
      emptyItem={{ photo: "", caption: "", description: "", order: 0 }}
    />
  );
}
