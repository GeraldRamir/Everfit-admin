"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards from "@/components/ui/StatCards";
import SectionToolbar from "@/components/ui/SectionToolbar";
import EmptyState from "@/components/ui/EmptyState";
import BlogFormModal, { blogToFormValues, type BlogFormValues } from "@/components/BlogFormModal";
import BlogDetailModal from "@/components/BlogDetailModal";
import { type BlogDetailItem } from "@/lib/blog-preview";
import { useAdminPreferences } from "@/components/AdminPreferencesProvider";
import AdminRowActions, { AdminStatusBadge } from "@/components/ui/AdminRowActions";
import { cn, formatDate } from "@/lib/utils";

const PAGE_SIZE = 8;

export default function BlogAdminClient({
  items,
  summary,
}: {
  items: BlogDetailItem[];
  summary: {
    total: number;
    categories: number;
    lastPublished: string | null;
    totalChars: number;
  };
}) {
  const router = useRouter();
  const { prefs } = useAdminPreferences();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<BlogFormValues | null>(null);

  const commercialUrl =
    process.env.NEXT_PUBLIC_COMMERCIAL_SITE_URL ?? "http://localhost:3000";

  const stats = useMemo(
    () => [
      {
        label: "Artículos",
        value: summary.total,
        hint: "Publicados",
        icon: BookOpen,
        iconBg: "bg-everfit-cream text-everfit-wine",
      },
      {
        label: "Categorías",
        value: summary.categories,
        hint: "Temas activos",
        icon: BookOpen,
        iconBg: "bg-everfit-orange/10 text-everfit-orange",
      },
      {
        label: "Último artículo",
        value: summary.lastPublished ?? "—",
        hint: items[0]?.title?.slice(0, 28) ?? "",
        icon: BookOpen,
        iconBg: "bg-everfit-wine/10 text-everfit-wine",
      },
      {
        label: "Contenido",
        value: summary.totalChars > 0 ? summary.totalChars.toLocaleString() : "—",
        hint: "Caracteres totales",
        icon: BookOpen,
        iconBg: "bg-everfit-cream text-everfit-wine",
      },
    ],
    [summary, items]
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
    ],
    [items]
  );

  const filtered = useMemo(() => {
    let result = items;
    if (filter === "published") result = result.filter((i) => i.published !== false);
    if (filter === "draft") result = result.filter((i) => i.published === false);
    if (!search.trim()) return result;
    const q = search.toLowerCase();
    return result.filter((item) =>
      [item.title, item.slug, item.excerpt, item.category, item.content]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = items.find((i) => i.id === selectedId) ?? null;

  function openCreate() {
    setSelectedId(null);
    setFormInitial(null);
    setFormOpen(true);
  }

  function openEdit(item: BlogDetailItem) {
    setFormInitial(blogToFormValues(item));
    setFormOpen(true);
  }

  async function togglePublished(item: BlogDetailItem) {
    setBusyId(item.id);
    await fetch(`/api/admin/blog/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !(item.published ?? true) }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(item: BlogDetailItem) {
    if (prefs.confirmDeletes && !confirm(`¿Eliminar el artículo "${item.title}"?`)) return;
    setBusyId(item.id);
    setDeleting(true);
    await fetch(`/api/admin/blog/${item.id}`, { method: "DELETE" });
    setDeleting(false);
    setBusyId(null);
    setSelectedId(null);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Artículos de motivación, nutrición y entrenamiento — coordinados con la web comercial."
        action={
          <button type="button" onClick={openCreate} className="btn-admin-primary">
            <Plus size={16} />
            Nuevo artículo
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
          searchPlaceholder="Buscar artículos..."
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
              icon={BookOpen}
              title="No hay artículos publicados"
              description="Usa «Nuevo artículo» para publicar el primero."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Publicado</th>
                    <th>Extracto</th>
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
                      <td>{item.category}</td>
                      <td>{formatDate(item.publishedAt)}</td>
                      <td>
                        <span className="block max-w-xs truncate" title={item.excerpt}>
                          {item.excerpt}
                        </span>
                      </td>
                      <td>
                        <AdminStatusBadge published={item.published !== false} />
                      </td>
                      <td className="text-right">
                        <AdminRowActions
                          published={item.published !== false}
                          busy={busyId === item.id}
                          commercialUrl={commercialUrl}
                          commercialPath={`/blog/${item.slug}`}
                          onEdit={() => openEdit(item)}
                          onTogglePublished={() => togglePublished(item)}
                          onDelete={() => handleDelete(item)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-[var(--admin-border-soft)] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-admin-outline px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-sm text-[var(--admin-muted)]">
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
        <BlogDetailModal
          post={selected}
          commercialUrl={commercialUrl}
          deleting={deleting}
          onClose={() => setSelectedId(null)}
          onEdit={() => openEdit(selected)}
          onDelete={() => handleDelete(selected)}
        />
      )}

      <BlogFormModal
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
