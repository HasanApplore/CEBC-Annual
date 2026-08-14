import { apiRequest } from "../api/client";

// Shared read/write methods for the ordered-list content resources
// (agenda, speakers, sponsors, partners, gallery) — mirrors the backend's
// crudFactory so each resource's service file is a one-liner.
export function createResourceService<T extends { _id?: string }>(endpoint: string) {
  return {
    getAll: () => apiRequest<T[]>(endpoint, { auth: false }),
    create: (data: Partial<T>) => apiRequest<T>(endpoint, { method: "POST", body: data }),
    update: (id: string, data: Partial<T>) =>
      apiRequest<T>(`${endpoint}/${id}`, { method: "PUT", body: data }),
    remove: (id: string) => apiRequest<null>(`${endpoint}/${id}`, { method: "DELETE" }),
  };
}
