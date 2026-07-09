"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Plus, Star, TrendingUp } from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards from "@/components/ui/StatCards";
import SectionToolbar from "@/components/ui/SectionToolbar";
import EmptyState from "@/components/ui/EmptyState";
import PlanFormModal, {
  planToFormValues,
  type PlanFormValues,
} from "@/components/PlanFormModal";
import PlanDetailModal, {
  type PlanDetailItem,
} from "@/components/PlanDetailModal";
import { useAdminPreferences } from "@/components/AdminPreferencesProvider";
import AdminRowActions, { AdminStatusBadge } from "@/components/ui/AdminRowActions";
import { cn, formatPrice } from "@/lib/utils";

type PlanItem = PlanDetailItem;

const PAGE_SIZE = 8;

export default function PlanesAdminClient({
  items,
  summary,
}: {
  items: PlanItem[];
  summary: {
    total: number;
    featured: number;
    levels: number;
    avgPrice: string;
  };
}) {
  const router = useRouter();
  const { prefs } = useAdminPreferences();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<PlanFormValues | null>(null);

  const commercialUrl =
    process.env.NEXT_PUBLIC_COMMERCIAL_SITE_URL ?? "http://localhost:3000";

  const stats = useMemo(
    () => [
      {
        label: "Total planes",
        value: summary.total,
        hint: "En catálogo",
        icon: Dumbbell,
        iconBg: "bg-everfit-cream text-everfit-wine",
      },
      {
        label: "Destacados",
        value: summary.featured,
        hint: "Visibles en home",
        icon: Star,
        iconBg: "bg-everfit-orange/10 text-everfit-orange",
      },
      {
        label: "Niveles",
        value: summary.levels,
        hint: "Categorías activas",
        icon: TrendingUp,
        iconBg: "bg-everfit-wine/10 text-everfit-wine",
      },
      {
        label: "Precio promedio",
        value: summary.avgPrice,
        hint: "Coaching mensual",
        icon: Dumbbell,
        iconBg: "bg-everfit-cream text-everfit-wine",
      },
    ],
    [summary]
  );

  const filters = useMemo(
    () => [
      { id: "all", label: "Todos", count: items.length },
      {
        id: "published",
        label: "Publicados",
        count: items.filter((i) => i.published !== false).length,
      },
      {
        id: "draft",
        label: "Borradores",
        count: items.filter((i) => i.published === false).length,
      },
      {
        id: "featured",
        label: "Destacados",
        count: items.filter((i) => i.featured).length,
      },
    ],
    [items]
  );

  const filtered = useMemo(() => {
    let result = items;
    if (filter === "featured") result = result.filter((i) => i.featured);
    if (filter === "published") result = result.filter((i) => i.published !== false);
    if (filter === "draft") result = result.filter((i) => i.published === false);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = items.find((i) => i.id === selectedId) ?? null;

  function openCreate() {
    setSelectedId(null);
    setFormInitial(null);
    setFormOpen(true);
  }

  function openEdit(item: PlanItem) {
    setFormInitial(planToFormValues(item));
    setFormOpen(true);
  }

  async function toggleFeatured(item: PlanItem) {
    setBusyId(item.id);
    setToggling(true);
    await fetch(`/api/admin/plans/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    setToggling(false);
    setBusyId(null);
    router.refresh();
  }

  async function togglePublished(item: PlanItem) {
    setBusyId(item.id);
    await fetch(`/api/admin/plans/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !(item.published ?? true) }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(item: PlanItem) {
    if (prefs.confirmDeletes && !confirm(`¿Eliminar el plan "${item.title}"?`)) return;
    setBusyId(item.id);
    setDeleting(true);
    await fetch(`/api/admin/plans/${item.id}`, { method: "DELETE" });
    setDeleting(false);
    setBusyId(null);
    setSelectedId(null);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Planes"
        description="Crea y edita programas de coaching publicados en la web comercial."
        action={
          <button type="button" onClick={openCreate} className="btn-admin-primary">
            <Plus size={16} />
            Nuevo plan
          </button>
        }
      />

      <StatCards items={stats} />

      <div className="admin-table-wrap">
        <SectionToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Buscar planes..."
          filters={filters}
          activeFilter={filter}
          onFilterChange={(id) => {
            setFilter(id);
            setPage(1);
          }}
        />

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Dumbbell}
              title="No hay planes publicados"
              description="Usa «Nuevo plan» para publicar el primero."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Nivel</th>
                    <th>Duración</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "cursor-pointer",
                        selectedId === item.id && "bg-everfit-cream/40"
                      )}
                    >
                      <td className="font-medium text-everfit-charcoal">{item.title}</td>
                      <td>{item.level}</td>
                      <td>{item.duration}</td>
                      <td className="font-semibold text-everfit-orange">
                        {item.price > 0 ? formatPrice(item.price) : "Coaching"}
                      </td>
                      <td>
                        <AdminStatusBadge
                          published={item.published !== false}
                          featured={item.featured}
                        />
                      </td>
                      <td className="text-right">
                        <AdminRowActions
                          published={item.published !== false}
                          featured={item.featured}
                          busy={busyId === item.id}
                          commercialUrl={commercialUrl}
                          commercialPath={`/planes/${item.slug}`}
                          onEdit={() => openEdit(item)}
                          onTogglePublished={() => togglePublished(item)}
                          onToggleFeatured={() => toggleFeatured(item)}
                          onDelete={() => handleDelete(item)}
                        />
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

      {selected && (
        <PlanDetailModal
          plan={selected}
          commercialUrl={commercialUrl}
          toggling={toggling}
          deleting={deleting}
          onClose={() => setSelectedId(null)}
          onEdit={() => openEdit(selected)}
          onToggleFeatured={() => toggleFeatured(selected)}
          onDelete={() => handleDelete(selected)}
        />
      )}

      <PlanFormModal
        open={formOpen}
        initial={formInitial}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setSelectedId(null);
          router.refresh();
        }}
      />
    </div>
  );
}
