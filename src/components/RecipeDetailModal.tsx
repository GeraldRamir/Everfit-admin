"use client";

import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export type RecipeDetailItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string;
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  notes: string | null;
  prepTime: string;
  servings: number;
  category: string;
  image: string | null;
  featured: boolean;
  published?: boolean;
  createdAt: string;
};

function linesPreview(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.join("\n");
  } catch {
    /* plain */
  }
  return value;
}

export default function RecipeDetailModal({
  recipe,
  commercialUrl,
  toggling,
  deleting,
  onClose,
  onEdit,
  onToggleFeatured,
  onDelete,
}: {
  recipe: RecipeDetailItem;
  commercialUrl: string;
  toggling: boolean;
  deleting: boolean;
  onClose: () => void;
  onEdit: () => void;
  onToggleFeatured: () => void;
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
        aria-labelledby="recipe-detail-title"
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="min-w-0 pr-4">
            <h3
              id="recipe-detail-title"
              className="font-display text-xl font-bold text-everfit-charcoal"
            >
              {recipe.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">/{recipe.slug}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-everfit-wine"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
          {recipe.image && (
            <div className="overflow-hidden rounded-2xl bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="max-h-56 w-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Descripción
            </p>
            <p className="mt-1 text-sm text-gray-700">{recipe.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Categoría
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tiempo
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.prepTime}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Calorías
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.calories} kcal</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Proteína
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.protein} g</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Carbohidratos
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.carbs} g</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Grasas
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.fat} g</p>
            </div>
            {recipe.fiber != null && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Fibra
                </p>
                <p className="mt-1 text-sm font-medium">{recipe.fiber} g</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Porciones
              </p>
              <p className="mt-1 text-sm font-medium">{recipe.servings}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Ingredientes
            </p>
            <p className="mt-1 whitespace-pre-wrap rounded-2xl bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-700">
              {linesPreview(recipe.ingredients)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Preparación
            </p>
            <p className="mt-1 whitespace-pre-wrap rounded-2xl bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-700">
              {linesPreview(recipe.instructions)}
            </p>
          </div>

          {recipe.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Notas / macros por porción
              </p>
              <p className="mt-1 whitespace-pre-wrap rounded-2xl bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-700">
                {recipe.notes}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Creada {formatDate(recipe.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-gray-100 px-6 py-5">
          <Link
            href={`${commercialUrl}/recetas/${recipe.slug}`}
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
            onClick={onToggleFeatured}
            disabled={toggling}
            className={recipe.featured ? "btn-admin-outline" : "btn-admin-primary"}
          >
            <Star size={16} />
            {recipe.featured ? "Quitar de destacados" : "Marcar como destacado"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="btn-admin-outline text-red-600 hover:border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
