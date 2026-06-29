"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Dumbbell,
  Flame,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Salad,
  Settings,
} from "lucide-react";
import EverfitLogo from "@/components/EverfitLogo";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "admin-sidebar-collapsed";

const iconMap = {
  LayoutDashboard,
  Mail,
  Bell,
  Dumbbell,
  Flame,
  Salad,
  BookOpen,
  MessageSquare,
};

export default function AdminSidebar({
  adminName,
  unreadMessages = 0,
  unreadNotifications = 0,
}: {
  adminName: string;
  unreadMessages?: number;
  unreadNotifications?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    setMounted(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function badgeFor(href: string) {
    if (href === "/dashboard/mensajes") return unreadMessages;
    if (href === "/dashboard/notificaciones") return unreadNotifications;
    return 0;
  }

  const isCollapsed = mounted && collapsed;

  return (
    <aside
      className={cn(
        "admin-sidebar",
        isCollapsed ? "admin-sidebar-collapsed" : "admin-sidebar-expanded"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-gray-100",
          isCollapsed ? "flex-col gap-3 px-3 py-4" : "justify-between px-4 py-5"
        )}
      >
        {isCollapsed ? (
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl"
            title="Everfit by Mich"
          >
            <Image
              src="/images/logo-original-transparent.png"
              alt="Everfit by Mich"
              width={40}
              height={40}
              className="h-8 w-8 object-contain"
            />
          </Link>
        ) : (
          <EverfitLogo theme="light" />
        )}

        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-everfit-wine"
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav
        className={cn(
          "flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-4",
          isCollapsed ? "px-2" : "px-4"
        )}
      >
        {ADMIN_NAV.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active = pathname === item.href;
          const badge = badgeFor(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "admin-nav-link",
                isCollapsed && "justify-center px-3",
                active ? "admin-nav-link-active" : "admin-nav-link-idle"
              )}
            >
              <span
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3"
                )}
              >
                <span className="relative shrink-0">
                  <Icon size={18} strokeWidth={active ? 2.25 : 2} aria-hidden="true" />
                  {isCollapsed && badge > 0 && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-everfit-orange" />
                  )}
                </span>
                {!isCollapsed && item.label}
              </span>
              {!isCollapsed && badge > 0 && (
                <span className="rounded-full bg-everfit-orange px-2 py-0.5 text-[0.625rem] font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "shrink-0 space-y-1 border-t border-gray-100",
          isCollapsed ? "p-2" : "p-4"
        )}
      >
        <Link
          href="/dashboard/configuracion"
          title={isCollapsed ? "Configuración" : undefined}
          className={cn(
            "admin-nav-link",
            isCollapsed && "justify-center px-3",
            pathname === "/dashboard/configuracion" ? "admin-nav-link-active" : "admin-nav-link-idle"
          )}
        >
          <span
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <Settings size={18} aria-hidden="true" />
            {!isCollapsed && "Configuración"}
          </span>
        </Link>

        <div
          className={cn(
            "mt-2 flex rounded-2xl bg-everfit-cream/60",
            isCollapsed
              ? "flex-col items-center gap-2 p-2"
              : "items-center gap-3 p-3"
          )}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-everfit-wine font-display text-sm font-bold text-white"
            title={isCollapsed ? adminName : undefined}
          >
            {initials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-everfit-charcoal">{adminName}</p>
              <p className="text-xs text-gray-500">Administradora</p>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-everfit-wine"
            aria-label="Cerrar sesión"
            title={isCollapsed ? "Cerrar sesión" : undefined}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
