"use client";

import { ResourceManager, type FieldConfig } from "../components/ResourceManager";
import { speakerService, type Speaker } from "../../../lib/services/speakers";

const fields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "title", label: "Job Title", type: "text" },
  { key: "org", label: "Organization", type: "text" },
  { key: "photo", label: "Photo", type: "media" },
  { key: "linkedin", label: "LinkedIn URL", type: "text" },
  { key: "order", label: "Order", type: "number" },
];

export default function SpeakersPage() {
  return (
    <ResourceManager<Speaker>
      title="Speakers"
      description="Manage the speaker line-up."
      service={speakerService}
      fields={fields}
      columns={[
        { key: "order", label: "#" },
        { key: "name", label: "Name" },
        { key: "title", label: "Title" },
        { key: "org", label: "Organization" },
      ]}
      emptyItem={{ name: "", title: "", org: "", photo: "", linkedin: "", order: 0 }}
    />
  );
}
