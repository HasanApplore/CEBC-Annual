"use client";

import { ResourceManager, type FieldConfig } from "../components/ResourceManager";
import { galleryService, type GalleryImage } from "../../../lib/services/gallery";

const fields: FieldConfig[] = [
  { key: "photo", label: "Photo", type: "media" },
  { key: "caption", label: "Caption (e.g. Opening Keynote, Panel Discussion)", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "order", label: "Order (1st to 4th appear in the top hero collage around Moments from CEBC)", type: "number" },
];

export default function GalleryPage() {
  return (
    <ResourceManager<GalleryImage>
      title="Moments from CEBC (Hero Showcase Photos)"
      description="Manage the 4 showcase Polaroid photos and captions that appear directly around the 'Moments from CEBC' header badge on the Past Event / Gallery page."
      service={galleryService}
      fields={fields}
      columns={[
        { key: "order", label: "#" },
        { key: "photo", label: "Photo" },
        { key: "caption", label: "Caption" },
      ]}
      emptyItem={{ photo: "", caption: "", description: "", order: 0 }}
      maxItems={4}
    />
  );
}
