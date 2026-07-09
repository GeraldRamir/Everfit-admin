"use client";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  ExternalLink,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminRowActionsProps = {
  published?: boolean;
  featured?: boolean;
  busy?: boolean;
  commercialUrl?: string;
  commercialPath?: string;
  onEdit?: () => void;
  onTogglePublished?: () => void;
  onToggleFeatured?: () => void;
  onDelete?: () => void;
  className?: string;
};

function ActionButton({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "danger" | "accent" | "success";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-xl border transition-colors disabled:opacity-40",
        tone === "danger" &&
          "border-red-200/80 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30",
        tone === "accent" &&
          "border-everfit-wine/20 text-everfit-accent hover:bg-[var(--admin-hover)]",
        tone === "success" &&
          "border-emerald-200/80 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/40 dark:hover:bg-emerald-950/30",
        tone === "default" &&
          "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-everfit-wine/25 hover:text-everfit-accent hover:bg-[var(--admin-surface-soft)]"
      )}
    >
      {children}
    </button>
  );
}

export default function AdminRowActions({
  published = true,
  featured = false,
  busy = false,
  commercialUrl,
  commercialPath,
  onEdit,
  onTogglePublished,
  onToggleFeatured,
  onDelete,
  className,
}: AdminRowActionsProps) {
  const webHref =
    commercialUrl && commercialPath ? `${commercialUrl}${commercialPath}` : null;

  return (
    <div
      className={cn("flex items-center justify-end gap-1.5", className)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {webHref && published && (
        <Link
          href={webHref}
          target="_blank"
          rel="noopener noreferrer"
          title="Ver en la web"
          aria-label="Ver en la web"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--admin-border)] text-[var(--admin-muted)] transition-colors hover:border-everfit-wine/25 hover:text-everfit-accent hover:bg-[var(--admin-surface-soft)]"
        >
          <ExternalLink size={15} />
        </Link>
      )}

      {onEdit && (
        <ActionButton label="Editar" onClick={onEdit} disabled={busy} tone="accent">
          <Pencil size={15} />
        </ActionButton>
      )}

      {onTogglePublished && (
        <ActionButton
          label={published ? "Despublicar" : "Publicar"}
          onClick={onTogglePublished}
          disabled={busy}
          tone={published ? "default" : "success"}
        >
          {published ? <EyeOff size={15} /> : <Eye size={15} />}
        </ActionButton>
      )}

      {onToggleFeatured && (
        <ActionButton
          label={featured ? "Quitar destacado" : "Destacar"}
          onClick={onToggleFeatured}
          disabled={busy}
          tone={featured ? "accent" : "default"}
        >
          <Star size={15} fill={featured ? "currentColor" : "none"} />
        </ActionButton>
      )}

      {onDelete && (
        <ActionButton label="Eliminar" onClick={onDelete} disabled={busy} tone="danger">
          <Trash2 size={15} />
        </ActionButton>
      )}
    </div>
  );
}

export function AdminStatusBadge({
  published = true,
  featured = false,
}: {
  published?: boolean;
  featured?: boolean;
}) {
  if (!published) {
    return (
      <span className="inline-flex rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--admin-muted)]">
        Borrador
      </span>
    );
  }
  if (featured) {
    return <span className="admin-pill-active">Publicado · Destacado</span>;
  }
  return (
    <span className="inline-flex rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
      Publicado
    </span>
  );
}
