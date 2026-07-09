"use client";

import Link from "next/link";
import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { BlogPreviewBody, type BlogDetailItem } from "@/lib/blog-preview";
import { formatDate } from "@/lib/utils";

export default function BlogDetailModal({
  post,
  commercialUrl,
  deleting,
  onClose,
  onEdit,
  onDelete,
}: {
  post: BlogDetailItem;
  commercialUrl: string;
  deleting: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="admin-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="admin-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-detail-title"
      >
        <div className="flex items-start justify-between border-b border-[var(--admin-border-soft)] px-6 py-5">
          <div className="min-w-0 pr-4">
            <span className="admin-pill-active mb-2">{post.category}</span>
            <h3
              id="blog-detail-title"
              className="font-display text-xl font-bold text-everfit-charcoal"
            >
              {post.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">/{post.slug}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-[var(--admin-muted-soft)] hover:bg-[var(--admin-surface-soft)] hover:text-everfit-accent"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {post.image && (
            <div className="overflow-hidden rounded-2xl bg-[var(--admin-surface-soft)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="" className="max-h-64 w-full object-cover" />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Publicado
              </p>
              <p className="mt-1 text-sm font-medium text-everfit-charcoal">
                {formatDate(post.publishedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Extracto
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--admin-muted)]">{post.excerpt}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border-soft)] bg-[var(--admin-surface-soft)] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
              Vista previa del contenido (como en la web)
            </p>
            <BlogPreviewBody content={post.content} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-[var(--admin-border-soft)] px-6 py-5">
          <Link
            href={`${commercialUrl}/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-admin-outline"
          >
            <ExternalLink size={16} />
            Ver en la web
          </Link>
          <button type="button" onClick={onEdit} className="btn-admin-outline">
            <Pencil size={16} />
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="btn-admin-outline ml-auto text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={16} />
            {deleting ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
