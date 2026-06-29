"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

export default function SectionToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  activeFilter,
  onFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="admin-input w-full pl-9"
          aria-label="Buscar"
        />
      </div>
      {filters && filters.length > 0 && onFilterChange && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "admin-filter-pill",
                activeFilter === filter.id && "admin-filter-pill-active"
              )}
            >
              {filter.label}
              {filter.count !== undefined && (
                <span className="ml-1.5 tabular-nums opacity-70">({filter.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
