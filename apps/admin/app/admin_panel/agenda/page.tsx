"use client";

import { ResourceManager, type FieldConfig } from "../components/ResourceManager";
import { agendaService, type AgendaItem } from "../../../lib/services/agenda";

const fields: FieldConfig[] = [
  { key: "time", label: "Time", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "detail", label: "Detail", type: "text" },
  { key: "highlights", label: "Highlights", type: "stringArray" },
  { key: "image", label: "Image", type: "media" },
  { key: "order", label: "Order", type: "number" },
];

export default function AgendaPage() {
  return (
    <ResourceManager<AgendaItem>
      title="Agenda"
      description="Manage the summit's schedule rows."
      service={agendaService}
      fields={fields}
      columns={[
        { key: "order", label: "#" },
        { key: "time", label: "Time" },
        { key: "title", label: "Title" },
      ]}
      emptyItem={{ time: "", title: "", detail: "", highlights: [], image: "", order: 0 }}
    />
  );
}
