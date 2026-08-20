"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, type AdminUser } from "../../../lib/services/auth";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);

  useEffect(() => {
    try {
      const token = authService.getToken();
      const currentUser = authService.getUser();
      if (!token || !currentUser) {
        setUser(null);
        router.replace("/login");
        return;
      }
      setUser(currentUser);
    } catch {
      // Never leave `user` stuck at undefined — always resolve to a state
      // that renders something, even if the session check itself failed.
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
