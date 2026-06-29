"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Star, X } from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards, { type StatCardItem } from "@/components/ui/StatCards";
import SectionToolbar from "@/components/ui/SectionToolbar";
import EmptyState from "@/components/ui/EmptyState";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type ContentColumn = {
  key: string;
  label: string;
  render?: "text" | "featured" | "price" | "date" | "rating" | "truncate";
};

export type DetailField = {
  key: string;
  label: string;
  multiline?: boolean;
};

export type ContentItem = {
  id: string;
  slug?: string;
  featured?: boolean;
  [key: string]: unknown;
};

const PAGE_SIZE = 8;

function renderCell(item: ContentItem, col: ContentColumn) {
  const value = item[col.key];
  const type = col.render ?? "text";

  if (type === "featured") {
    return value ? (
      <span className="admin-pill-active">Destacado</span>
    ) : (
      <span className="text-gray-400">—</span>
    );
  }
  if (type === "price") {
    return <span className="font-semibold text-everfit-orange">{formatPrice(Number(value))}</span>;
  }
  if (type === "date") {
    return <span className="text-gray-500">{formatDate(String(value))}</span>;
  }
  if (type === "rating") {
    const rating = Number(value);
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-everfit-wine">
        <Star size={14} fill="currentColor" aria-hidden="true" />
        {rating}/5
      </span>
    );
  }
  if (type === "truncate") {
    const text = String(value ?? "—");
    return (
      <span className="block max-w-xs truncate text-gray-600" title={text}>
        {text}
      </span>
    );
  }
  return String(value ?? "—");
}

export default function ContentSectionClient({
  title,
  description,
  stats,
  items,
  columns,
  detailFields,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  commercialBasePath,
  toggleFeaturedApi,
  hasFeaturedFilter = true,
}: {
  title: string;
  description: string;
  stats: StatCardItem[];
  items: ContentItem[];
  columns: ContentColumn[];
  detailFields: DetailField[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
  commercialBasePath?: string;
  toggleFeaturedApi?: string;
  hasFeaturedFilter?: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const commercialUrl = process.env.NEXT_PUBLIC_COMMERCIAL_SITE_URL ?? "http://localhost:3000";

  const filters = useMemo(() => {
    if (!hasFeaturedFilter) return undefined;
    const featured = items.filter((i) => i.featured).length;
    return [
      { id: "all", label: "Todos", count: items.length },
      { id: "featured", label: "Destacados", count: featured },
    ];
  }, [items, hasFeaturedFilter]);

  const filtered = useMemo(() => {
    let result = items;
    if (filter === "featured") {
      result = result.filter((i) => i.featured);
    }
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

  function handleFilterChange(id: string) {
    setFilter(id);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function toggleFeatured() {
    if (!selected || !toggleFeaturedApi) return;
    setToggling(true);
    await fetch(`${toggleFeaturedApi}/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !selected.featured }),
    });
    setToggling(false);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader title={title} description={description} />
      <StatCards items={stats} />

      <div className="admin-table-wrap">
        <SectionToolbar
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder={`Buscar en ${title.toLowerCase()}...`}
          filters={filters}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
        />

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                      className={cn(
                        "cursor-pointer",
                        selectedId === item.id && "bg-everfit-cream/40"
                      )}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={col.key === columns[0].key ? "font-medium text-everfit-charcoal" : ""}
                        >
                          {renderCell(item, col)}
                        </td>
                      ))}
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
        <div className="admin-detail-panel mt-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-everfit-charcoal">
                {String(selected.title ?? selected.name ?? "Detalle")}
              </h3>
              {selected.slug && (
                <p className="mt-1 text-sm text-gray-500">/{String(selected.slug)}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-everfit-wine"
              aria-label="Cerrar detalle"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {detailFields.map((field) => {
              const value = selected[field.key];
              if (value === undefined || value === null || value === "") return null;
              return (
                <div
                  key={field.key}
                  className={field.multiline ? "sm:col-span-2" : ""}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {field.label}
                  </p>
                  {field.multiline ? (
                    <p className="mt-1 whitespace-pre-wrap rounded-2xl bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-700">
                      {String(value)}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-everfit-charcoal">
                      {field.key === "price"
                        ? formatPrice(Number(value))
                        : field.key === "publishedAt" || field.key === "createdAt"
                          ? formatDate(String(value))
                          : String(value)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            {commercialBasePath && selected.slug && (
              <Link
                href={`${commercialUrl}${commercialBasePath}/${selected.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-admin-outline"
              >
                <ExternalLink size={16} />
                Ver en la web
              </Link>
            )}
            {toggleFeaturedApi && (
              <button
                type="button"
                onClick={toggleFeatured}
                disabled={toggling}
                className={selected.featured ? "btn-admin-outline" : "btn-admin-primary"}
              >
                {selected.featured ? "Quitar de destacados" : "Marcar como destacado"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
