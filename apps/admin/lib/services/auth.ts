import { apiRequest } from "../api/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const TOKEN_KEY = "cebc_admin_token";
const USER_KEY = "cebc_admin_user";

export const authService = {
  async login(email: string, password: string) {
    const data = await apiRequest<{ token: string; admin: AdminUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.admin));
    return data.admin;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/login";
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      // Corrupted/stale value — clear it so future reads don't keep failing.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
};
