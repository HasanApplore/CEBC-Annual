"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CreditCard,
  FileText,
  Handshake,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mic2,
  Trophy,
  Users,
} from "lucide-react";
import { authService, type AdminUser } from "../../../lib/services/auth";

const NAV_ITEMS = [
  { href: "/admin_panel/content", label: "Site Content", icon: FileText },
  { href: "/admin_panel/agenda", label: "Agenda", icon: CalendarClock },
  { href: "/admin_panel/speakers", label: "Speakers", icon: Mic2 },
  { href: "/admin_panel/sponsors", label: "Sponsors", icon: Trophy },
  { href: "/admin_panel/partners", label: "Partners", icon: Handshake },
  { href: "/admin_panel/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin_panel/registrations", label: "Registrations", icon: Users },
  { href: "/admin_panel/payments", label: "Payments", icon: CreditCard },
];

export function Sidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-black/10 bg-[#0f1b3d] text-white">
      <div className="flex items-center gap-2 px-6 py-5 text-lg font-bold tracking-tight">
        <LayoutDashboard size={20} className="text-[#8fbf8e]" />
        CEBC Admin
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-xs text-white/50">{user.email}</p>
        <button
          onClick={() => authService.logout()}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
}
