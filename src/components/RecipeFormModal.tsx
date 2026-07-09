"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, X } from "lucide-react";

export type RecipeFormValues = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string;
  instructions: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  notes: string;
  prepTime: string;
  servings: string;
  category: string;
  image: string;
  featured: boolean;
};

const EMPTY: RecipeFormValues = {
  title: "",
  slug: "",
  description: "",
  ingredients: "",
  instructions: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  fiber: "",
  notes: "",
  prepTime: "",
  servings: "1",
  category: "Desayuno",
  image: "",
  featured: false,
};

const CATEGORIES = ["Desayuno", "Almuerzo", "Snack", "Cena", "Postre", "Bebida"];

function linesFromJson(value: unknown): string {
  if (!value) return "";
  if (Array.isArray(value)) return value.join("\n");
  const text = String(value);
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.join("\n");
  } catch {
    /* plain text */
  }
  return text;
}

export function recipeToFormValues(item: Record<string, unknown>): RecipeFormValues {
  return {
    id: String(item.id),
    title: String(item.title ?? ""),
    slug: String(item.slug ?? ""),
    description: String(item.description ?? ""),
    ingredients: linesFromJson(item.ingredients),
    instructions: linesFromJson(item.instructions),
    calories: String(item.calories ?? ""),
    protein: String(item.protein ?? ""),
    carbs: String(item.carbs ?? ""),
    fat: String(item.fat ?? ""),
    fiber: item.fiber == null ? "" : String(item.fiber),
    notes: String(item.notes ?? ""),
    prepTime: String(item.prepTime ?? ""),
    servings: String(item.servings ?? "1"),
    category: String(item.category ?? "Desayuno"),
    image: String(item.image ?? ""),
    featured: Boolean(item.featured),
  };
}

export default function RecipeFormModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial?: RecipeFormValues | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<RecipeFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const next = initial ?? EMPTY;
    setForm(next);
    setPreview(next.image || null);
    setError(null);
    setUploading(false);
  }, [open, initial]);

  if (!open) return null;

  function update<K extends keyof RecipeFormValues>(key: K, value: RecipeFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "recipes");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir la imagen");
        setPreview(form.image || null);
        return;
      }
      update("image", data.url as string);
      setPreview(data.url as string);
    } catch {
      setError("Error de conexión al subir la imagen");
      setPreview(form.image || null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage() {
    update("image", "");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      ingredients: form.ingredients,
      instructions: form.instructions,
      calories: form.calories,
      protein: form.protein,
      carbs: form.carbs,
      fat: form.fat,
      fiber: form.fiber,
      notes: form.notes,
      prepTime: form.prepTime,
      servings: form.servings,
      category: form.category,
      image: form.image,
      featured: form.featured,
    };

    try {
      const isEdit = Boolean(form.id);
      const res = await fetch(
        isEdit ? `/api/admin/recipes/${form.id}` : "/api/admin/recipes",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar la receta");
        setSaving(false);
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("Error de conexión al guardar la receta");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="admin-modal-panel">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h3 className="font-display text-xl font-bold text-everfit-charcoal">
              {form.id ? "Editar receta" : "Nueva receta"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Completa los mismos campos que se muestran en la página comercial.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-everfit-wine"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Título *
              </span>
              <input
                required
                className="admin-input w-full"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ej. Pancakes de Proteína"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Slug (URL)
              </span>
              <input
                className="admin-input w-full"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="Se genera solo si lo dejas vacío"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Categoría *
              </span>
              <select
                required
                className="admin-input w-full"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Descripción *
              </span>
              <textarea
                required
                rows={2}
                className="admin-input w-full"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Resumen corto de la receta"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ingredientes * (uno por línea)
              </span>
              <textarea
                required
                rows={6}
                className="admin-input w-full font-mono text-sm"
                value={form.ingredients}
                onChange={(e) => update("ingredients", e.target.value)}
                placeholder={"½ taza (40 g) de avena\n1 scoop (30 g) de proteína\n..."}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Preparación * (un paso por línea)
              </span>
              <textarea
                required
                rows={5}
                className="admin-input w-full font-mono text-sm"
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                placeholder={"Mezcla todos los ingredientes.\nRefrigera toda la noche.\n..."}
              />
            </label>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Valores nutricionales (receta completa)
            </p>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
              {(
                [
                  ["calories", "Calorías (kcal)"],
                  ["protein", "Proteína (g)"],
                  ["carbs", "Carbohidratos (g)"],
                  ["fat", "Grasas (g)"],
                  ["fiber", "Fibra (g)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {label}
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    required={key !== "fiber"}
                    className="admin-input w-full"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder={key === "fiber" ? "Opcional" : "0"}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tiempo de preparación
              </span>
              <input
                className="admin-input w-full"
                value={form.prepTime}
                onChange={(e) => update("prepTime", e.target.value)}
                placeholder="Ej. 15 min · 5 min + reposo"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Porciones / rendimientos
              </span>
              <input
                type="number"
                min={1}
                required
                className="admin-input w-full"
                value={form.servings}
                onChange={(e) => update("servings", e.target.value)}
                placeholder="Ej. 3 tostadas · 4 pancakes · 2 wraps"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Notas / macros por porción
              </span>
              <textarea
                rows={3}
                className="admin-input w-full"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Ej. Si se divide en 3 tostadas, cada una aporta aproximadamente: 103 kcal · 11.3 g proteína..."
              />
            </label>

            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Imagen de la receta
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />

              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="max-h-52 w-full object-cover"
                  />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-everfit-wine shadow-sm hover:bg-white"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={uploading}
                      className="rounded-xl bg-white/95 p-2 text-red-600 shadow-sm hover:bg-white"
                      aria-label="Quitar imagen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
                      Subiendo...
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center transition-colors hover:border-everfit-wine/40 hover:bg-everfit-cream/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-everfit-wine shadow-sm">
                    {uploading ? <Upload size={20} className="animate-pulse" /> : <ImagePlus size={20} />}
                  </span>
                  <span className="text-sm font-semibold text-everfit-charcoal">
                    {uploading ? "Subiendo imagen..." : "Subir imagen"}
                  </span>
                  <span className="text-xs text-gray-500">
                    JPG, PNG, WEBP o GIF · máx. 5 MB
                  </span>
                </button>
              )}
            </div>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-everfit-wine focus:ring-everfit-wine"
              />
              <span className="text-sm font-medium text-everfit-charcoal">
                Destacar en la página de inicio
              </span>
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
            <button type="button" onClick={onClose} className="btn-admin-outline">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-admin-primary"
            >
              {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear receta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
