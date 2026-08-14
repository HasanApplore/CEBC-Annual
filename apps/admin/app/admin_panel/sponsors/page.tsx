"use client";

import { ResourceManager, type FieldConfig } from "../components/ResourceManager";
import { sponsorService, type Sponsor } from "../../../lib/services/sponsors";

const fields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "tier", label: "Tier", type: "select", options: ["Platinum", "Gold", "Silver"] },
  { key: "logo", label: "Logo", type: "media" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "website", label: "Website URL", type: "text" },
  { key: "order", label: "Order", type: "number" },
];

export default function SponsorsPage() {
  return (
    <ResourceManager<Sponsor>
      title="Sponsors"
      description="Manage sponsor tiers and details."
      service={sponsorService}
      fields={fields}
      columns={[
        { key: "tier", label: "Tier" },
        { key: "order", label: "#" },
        { key: "name", label: "Name" },
      ]}
      emptyItem={{ name: "", tier: "Platinum", logo: "", description: "", website: "", order: 0 }}
    />
  );
}
