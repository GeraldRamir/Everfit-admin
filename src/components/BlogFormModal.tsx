"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

export type BlogFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  publishedAt: string;
  published: boolean;
};

const EMPTY: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Motivación",
  image: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  published: true,
};

const CATEGORIES = ["Motivación", "Mindset", "Nutrición", "Entrenamiento", "Lifestyle"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function blogToFormValues(item: Record<string, unknown>): BlogFormValues {
  const publishedAt = item.publishedAt
    ? new Date(String(item.publishedAt)).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return {
    id: String(item.id),
    title: String(item.title ?? ""),
    slug: String(item.slug ?? ""),
    excerpt: String(item.excerpt ?? ""),
    content: String(item.content ?? ""),
    category: String(item.category ?? "Motivación"),
    image: String(item.image ?? ""),
    publishedAt,
    published: item.published !== false,
  };
}

export default function BlogFormModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial?: BlogFormValues | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<BlogFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const next = initial ?? EMPTY;
    setForm(next);
    setPreview(next.image || null);
    setError(null);
    setUploading(false);
    setSlugTouched(Boolean(initial?.slug));
  }, [open, initial]);

  if (!open) return null;

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blog");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir");
      update("image", data.url);
      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
      setPreview(form.image || null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      image: form.image,
      published: form.published,
      publishedAt: new Date(`${form.publishedAt}T12:00:00`).toISOString(),
    };

    const url = form.id ? `/api/admin/blog/${form.id}` : "/api/admin/blog";
    const method = form.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar el artículo");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="admin-modal-overlay fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="admin-modal-panel">
        <div className="flex items-start justify-between border-b border-[var(--admin-border-soft)] px-6 py-5">
          <div>
            <h3 className="font-display text-xl font-bold text-everfit-charcoal">
              {form.id ? "Editar artículo" : "Nuevo artículo"}
            </h3>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">
              Misma estructura que verás en la web comercial (/blog)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--admin-muted-soft)] hover:bg-[var(--admin-surface-soft)] hover:text-everfit-accent"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Título *
              </label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Slug (URL) *
              </label>
              <input
                className="admin-input font-mono text-xs"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", slugify(e.target.value));
                }}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Categoría *
              </label>
              <select
                className="admin-input"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Extracto * <span className="normal-case tracking-normal">(cita intro en la web)</span>
              </label>
              <textarea
                className="admin-input min-h-[88px] resize-y"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Contenido *
              </label>
              <textarea
                className="admin-input min-h-[220px] resize-y font-mono text-xs leading-relaxed"
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder={`Párrafo normal.\n\n## Sección\n\n- Punto uno\n- Punto dos\n\n> Cita destacada`}
                required
              />
              <p className="mt-2 text-xs text-[var(--admin-muted)]">
                Usa líneas vacías entre párrafos.{" "}
                <code className="rounded bg-[var(--admin-surface-soft)] px-1">##</code> título,{" "}
                <code className="rounded bg-[var(--admin-surface-soft)] px-1">-</code> lista,{" "}
                <code className="rounded bg-[var(--admin-surface-soft)] px-1">&gt;</code> cita.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Fecha de publicación
              </label>
              <input
                type="date"
                className="admin-input"
                value={form.publishedAt}
                onChange={(e) => update("publishedAt", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
                Imagen de portada
              </label>
              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="max-h-56 w-full object-cover" />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="rounded-xl bg-[var(--admin-surface)]/95 px-3 py-2 text-xs font-semibold text-everfit-accent shadow-sm"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        update("image", "");
                        setPreview(null);
                      }}
                      className="rounded-xl bg-[var(--admin-surface)]/95 p-2 text-red-600 shadow-sm"
                      aria-label="Quitar imagen"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-6 py-10 text-center transition-colors hover:border-everfit-wine/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--admin-surface)] text-everfit-accent shadow-sm">
                    {uploading ? <Upload size={20} className="animate-pulse" /> : <ImagePlus size={20} />}
                  </span>
                  <span className="text-sm font-semibold text-everfit-charcoal">
                    Subir imagen de portada
                  </span>
                  <span className="text-xs text-[var(--admin-muted)]">JPG, PNG o WEBP · máx. 5 MB</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--admin-border-soft)] pt-5">
            <button type="button" onClick={onClose} className="btn-admin-outline">
              Cancelar
            </button>
            <button type="submit" disabled={saving || uploading} className="btn-admin-primary">
              {saving ? "Guardando…" : form.id ? "Guardar cambios" : "Publicar artículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
