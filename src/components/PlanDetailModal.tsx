"use client";

import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

export type PlanDetailItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDesc: string;
  price: number;
  duration: string;
  level: string;
  features: string;
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

export default function PlanDetailModal({
  plan,
  commercialUrl,
  toggling,
  deleting,
  onClose,
  onEdit,
  onToggleFeatured,
  onDelete,
}: {
  plan: PlanDetailItem;
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
        aria-labelledby="plan-detail-title"
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="min-w-0 pr-4">
            <h3
              id="plan-detail-title"
              className="font-display text-xl font-bold text-everfit-charcoal"
            >
              {plan.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">/{plan.slug}</p>
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
          {plan.image && (
            <div className="overflow-hidden rounded-2xl bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={plan.image}
                alt={plan.title}
                className="max-h-56 w-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Descripción corta
            </p>
            <p className="mt-1 text-sm text-gray-700">{plan.description}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Descripción completa
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {plan.longDesc}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Nivel
              </p>
              <p className="mt-1 text-sm font-medium">{plan.level}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Duración
              </p>
              <p className="mt-1 text-sm font-medium">{plan.duration}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Precio
              </p>
              <p className="mt-1 text-sm font-medium text-everfit-orange">
                {plan.price > 0 ? formatPrice(plan.price) : "Coaching personalizado"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Estado
              </p>
              <p className="mt-1 text-sm font-medium">
                {plan.featured ? "Destacado" : "Normal"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Qué incluye
            </p>
            <p className="mt-1 whitespace-pre-wrap rounded-2xl bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-700">
              {linesPreview(plan.features)}
            </p>
          </div>

          <p className="text-xs text-gray-400">Creado {formatDate(plan.createdAt)}</p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-gray-100 px-6 py-5">
          <Link
            href={`${commercialUrl}/planes/${plan.slug}`}
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
            className={plan.featured ? "btn-admin-outline" : "btn-admin-primary"}
          >
            <Star size={16} />
            {plan.featured ? "Quitar de destacados" : "Marcar como destacado"}
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
