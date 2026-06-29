"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Archive, Inbox, Mail, MailOpen, MessageSquare, Reply } from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards from "@/components/ui/StatCards";
import SectionToolbar from "@/components/ui/SectionToolbar";
import EmptyState from "@/components/ui/EmptyState";
import { CONTACT_STATUS_LABELS, CONTACT_SUBJECT_LABELS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  sourcePlan: string | null;
  sourcePage: string | null;
  status: keyof typeof CONTACT_STATUS_LABELS;
  createdAt: string;
};

function formatSubject(subject: string) {
  return CONTACT_SUBJECT_LABELS[subject as keyof typeof CONTACT_SUBJECT_LABELS] ?? subject;
}

const statusClass = {
  NEW: "badge-status-new",
  READ: "badge-status-read",
  REPLIED: "badge-status-replied",
  ARCHIVED: "badge-status-archived",
};

const PAGE_SIZE = 6;

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(highlightId);

  useEffect(() => {
    if (highlightId) setSelectedId(highlightId);
  }, [highlightId]);

  const counts = useMemo(
    () => ({
      all: messages.length,
      NEW: messages.filter((m) => m.status === "NEW").length,
      READ: messages.filter((m) => m.status === "READ").length,
      REPLIED: messages.filter((m) => m.status === "REPLIED").length,
      ARCHIVED: messages.filter((m) => m.status === "ARCHIVED").length,
    }),
    [messages]
  );

  const filtered = useMemo(() => {
    let result = messages;
    if (filter !== "all") {
      result = result.filter((m) => m.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return result;
  }, [messages, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  async function updateStatus(id: string, status: Message["status"]) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  function handleFilterChange(id: string) {
    setFilter(id);
    setPage(1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Solicitudes"
        description="Mensajes del formulario de contacto de la página comercial."
      />

      <StatCards
        items={[
          {
            label: "Nuevas",
            value: counts.NEW,
            hint: "Pendientes de revisar",
            icon: Inbox,
            iconBg: "bg-everfit-orange/10 text-everfit-orange",
          },
          {
            label: "Leídas",
            value: counts.READ,
            hint: "Vistas sin responder",
            icon: MailOpen,
            iconBg: "bg-blue-50 text-blue-700",
          },
          {
            label: "Respondidas",
            value: counts.REPLIED,
            hint: "Atendidas",
            icon: Reply,
            iconBg: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Total",
            value: counts.all,
            hint: "Todas las solicitudes",
            icon: Mail,
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <div className="admin-table-wrap">
            <SectionToolbar
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              searchPlaceholder="Buscar por nombre, email o asunto..."
              filters={[
                { id: "all", label: "Todas", count: counts.all },
                { id: "NEW", label: "Nuevas", count: counts.NEW },
                { id: "READ", label: "Leídas", count: counts.READ },
                { id: "REPLIED", label: "Respondidas", count: counts.REPLIED },
                { id: "ARCHIVED", label: "Archivadas", count: counts.ARCHIVED },
              ]}
              activeFilter={filter}
              onFilterChange={handleFilterChange}
            />

            {filtered.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={MessageSquare}
                  title="No hay solicitudes"
                  description={
                    filter !== "all" || search
                      ? "Prueba con otros filtros o términos de búsqueda."
                      : "Los mensajes del formulario de contacto aparecerán aquí."
                  }
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Asunto</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((msg) => (
                        <tr
                          key={msg.id}
                          onClick={() => setSelectedId(msg.id)}
                          className={cn(
                            "cursor-pointer",
                            selectedId === msg.id && "bg-everfit-cream/40",
                            highlightId === msg.id && "ring-2 ring-inset ring-everfit-orange/30"
                          )}
                        >
                          <td>
                            <p className="font-medium text-everfit-charcoal">{msg.name}</p>
                            <p className="text-xs text-gray-400">{msg.email}</p>
                          </td>
                          <td className="max-w-[200px] truncate">{formatSubject(msg.subject)}</td>
                          <td className="text-gray-500">{formatDate(msg.createdAt)}</td>
                          <td>
                            <span className={statusClass[msg.status]}>
                              {CONTACT_STATUS_LABELS[msg.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-6 py-4">
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
              </>
            )}
          </div>
        </div>

        <div className="xl:col-span-2">
          {selected ? (
            <div className="admin-detail-panel sticky top-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-everfit-charcoal">
                    {formatSubject(selected.subject)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{formatDate(selected.createdAt)}</p>
                </div>
                <span className={statusClass[selected.status]}>
                  {CONTACT_STATUS_LABELS[selected.status]}
                </span>
              </div>

              {(selected.sourcePlan || selected.sourcePage) && (
                <div className="mb-4 rounded-2xl border border-everfit-cream-dark bg-everfit-cream/40 p-4 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-everfit-wine">
                    Origen en la web comercial
                  </p>
                  {selected.sourcePlan && (
                    <p className="mb-0 text-gray-700">
                      <span className="font-medium">Plan / servicio:</span> {selected.sourcePlan}
                    </p>
                  )}
                  {selected.sourcePage && (
                    <p className="mb-0 text-gray-600">
                      <span className="font-medium">Página:</span> {selected.sourcePage}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4 space-y-2 rounded-2xl bg-gray-50/80 p-4 text-sm">
                <p>
                  <span className="font-semibold text-everfit-charcoal">{selected.name}</span>
                </p>
                <p className="text-gray-600">{selected.email}</p>
                {selected.phone && <p className="text-gray-600">{selected.phone}</p>}
              </div>

              <p className="mb-5 whitespace-pre-wrap rounded-2xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-700">
                {selected.message}
              </p>

              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Cambiar estado
              </p>
              <div className="flex flex-wrap gap-2">
                {(["NEW", "READ", "REPLIED", "ARCHIVED"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(selected.id, status)}
                    className={selected.status === status ? "btn-admin-primary" : "btn-admin-outline"}
                  >
                    {CONTACT_STATUS_LABELS[status]}
                  </button>
                ))}
              </div>

              {selected.status !== "ARCHIVED" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "ARCHIVED")}
                  className="btn-admin-outline mt-4 w-full"
                >
                  <Archive size={16} />
                  Archivar solicitud
                </button>
              )}
            </div>
          ) : (
            <div className="admin-card flex h-full min-h-[280px] flex-col items-center justify-center text-center">
              <Mail size={32} className="mb-3 text-gray-300" aria-hidden="true" />
              <p className="font-medium text-gray-500">Selecciona una solicitud</p>
              <p className="mt-1 text-sm text-gray-400">Haz clic en una fila para ver el detalle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
