"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Bell, BellOff, BellRing, Mail } from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards from "@/components/ui/StatCards";
import SectionToolbar from "@/components/ui/SectionToolbar";
import EmptyState from "@/components/ui/EmptyState";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

type Notification = {
  id: string;
  type: "CONTACT" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

const PAGE_SIZE = 8;

export default function NotificationsClient({ items }: { items: Notification[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const counts = useMemo(
    () => ({
      all: items.length,
      unread: items.filter((n) => !n.read).length,
      CONTACT: items.filter((n) => n.type === "CONTACT").length,
      SYSTEM: items.filter((n) => n.type === "SYSTEM").length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    let result = items;
    if (filter === "unread") result = result.filter((n) => !n.read);
    else if (filter === "CONTACT" || filter === "SYSTEM") {
      result = result.filter((n) => n.type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function markRead(ids: string[]) {
    if (!ids.length) return;
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, read: true }),
    });
    router.refresh();
  }

  async function markAllRead() {
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    await markRead(ids);
  }

  async function handleLinkClick(id: string) {
    await markRead([id]);
  }

  function handleFilterChange(id: string) {
    setFilter(id);
    setPage(1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Notificaciones"
        description="Alertas de solicitudes y actividad del sistema."
        action={
          counts.unread > 0 ? (
            <button type="button" onClick={markAllRead} className="btn-admin-outline">
              <BellOff size={16} />
              Marcar todas como leídas
            </button>
          ) : undefined
        }
      />

      <StatCards
        items={[
          {
            label: "Sin leer",
            value: counts.unread,
            hint: "Requieren atención",
            icon: BellRing,
            iconBg: "bg-everfit-orange/10 text-everfit-orange",
          },
          {
            label: "Contacto",
            value: counts.CONTACT,
            hint: "Nuevas solicitudes",
            icon: Mail,
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
          {
            label: "Sistema",
            value: counts.SYSTEM,
            hint: "Actividad interna",
            icon: Bell,
            iconBg: "bg-everfit-wine/10 text-everfit-wine",
          },
          {
            label: "Total",
            value: counts.all,
            hint: "Todas las alertas",
            icon: Bell,
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
        ]}
      />

      <div className="admin-table-wrap">
        <SectionToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Buscar notificaciones..."
          filters={[
            { id: "all", label: "Todas", count: counts.all },
            { id: "unread", label: "Sin leer", count: counts.unread },
            { id: "CONTACT", label: "Contacto", count: counts.CONTACT },
            { id: "SYSTEM", label: "Sistema", count: counts.SYSTEM },
          ]}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
        />

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Bell}
              title="Sin notificaciones"
              description={
                filter !== "all" || search
                  ? "No hay resultados con estos filtros."
                  : "Las alertas del sistema aparecerán aquí."
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {paginated.map((n) => (
              <article
                key={n.id}
                className={cn(
                  "flex items-start justify-between gap-4 px-6 py-5 transition-colors hover:bg-everfit-cream/10",
                  !n.read && "bg-everfit-orange/[0.03]"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="font-display font-bold text-everfit-charcoal">{n.title}</p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-gray-500">
                      {NOTIFICATION_TYPE_LABELS[n.type]}
                    </span>
                    {!n.read && <span className="badge-status-new">Nueva</span>}
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => handleLinkClick(n.id)}
                      className="mt-2 inline-block text-sm font-semibold text-everfit-orange"
                    >
                      Ver detalle →
                    </Link>
                  )}
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markRead([n.id])}
                    className="btn-admin-outline shrink-0 px-3 py-1.5 text-xs"
                  >
                    Marcar leída
                  </button>
                )}
              </article>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-admin-outline px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-500">
                  Página {page} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-admin-outline px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
