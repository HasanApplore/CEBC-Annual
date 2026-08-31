"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { authService, type AdminUser } from "../../../lib/services/auth";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);

  useEffect(() => {
    try {
      const token = authService.getToken();
      const currentUser = authService.getUser();
      if (!token || !currentUser) {
        setUser(null);
        window.location.replace("/login");
        return;
      }
      setUser(currentUser);
    } catch {
      setUser(null);
      window.location.replace("/login");
    }
  }, []);

  if (user === undefined || user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1b3d] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#8fbf8e]" size={32} />
          <p className="text-sm font-medium text-white/80">Checking authentication…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
