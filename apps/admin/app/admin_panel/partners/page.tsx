"use client";

import { ResourceManager, type FieldConfig } from "../components/ResourceManager";
import { partnerService, type Partner } from "../../../lib/services/partners";

const fields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "type", label: "Type (e.g. Networking Partner)", type: "text" },
  { key: "logo", label: "Logo", type: "media" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "website", label: "Website URL", type: "text" },
  { key: "order", label: "Order", type: "number" },
];

export default function PartnersPage() {
  return (
    <ResourceManager<Partner>
      title="Partners"
      description="Manage partner organizations."
      service={partnerService}
      fields={fields}
      columns={[
        { key: "order", label: "#" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
      ]}
      emptyItem={{ name: "", type: "", logo: "", description: "", website: "", order: 0 }}
    />
  );
}
