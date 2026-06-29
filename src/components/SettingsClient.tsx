"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

export default function SettingsActions() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="btn-admin-outline">
      <LogOut size={16} />
      Cerrar sesión
    </button>
  );
}

export function CommercialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium text-everfit-charcoal transition-colors hover:border-everfit-wine/20 hover:bg-everfit-cream/30"
    >
      {label}
      <ExternalLink size={16} className="text-gray-400" />
    </a>
  );
}
