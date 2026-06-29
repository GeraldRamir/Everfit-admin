import { Bell, Search } from "lucide-react";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function AdminHeader({
  adminName,
  unreadNotifications = 0,
}: {
  adminName: string;
  unreadNotifications?: number;
}) {
  const firstName = adminName.split(" ")[0];

  return (
    <header className="admin-topbar">
      <div className="min-w-[200px] flex-1">
        <h1 className="font-display text-xl font-bold text-everfit-charcoal lg:text-2xl">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="text-sm text-gray-500">Panel Everfit by Mich</p>
      </div>

      <div className="relative hidden flex-1 justify-center md:flex">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar..."
          className="admin-search w-full max-w-md"
          aria-label="Buscar en el panel"
        />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/notificaciones"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-everfit-wine/20 hover:text-everfit-wine"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-everfit-orange px-1 text-[0.625rem] font-bold text-white">
              {unreadNotifications}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-2 rounded-2xl border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-everfit-wine font-display text-xs font-bold text-white">
            {adminName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-everfit-charcoal">{adminName}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
