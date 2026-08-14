const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
  return json.data;
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
  return json.data;
}

// Files uploaded via the admin panel are stored on the backend and come back
// as a relative "/uploads/..." path — resolve that against the backend's
// origin so the browser doesn't request it from the frontend's own origin.
// Everything else (absolute URLs, and the site's own "/images"/"/videos"
// public assets used as defaults) is left untouched.
export function resolveMediaUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  if (!path.startsWith("/uploads/")) return path;
  const origin = API_URL.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
}
