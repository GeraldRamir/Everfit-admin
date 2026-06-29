import { Dumbbell, Star, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContentSectionClient from "@/components/ContentSectionClient";
import { formatPrice } from "@/lib/utils";

export default async function PlanesAdminPage() {
  const plans = await prisma.plan.findMany({ orderBy: { title: "asc" } });
  const featured = plans.filter((p) => p.featured).length;

  return (
    <ContentSectionClient
      title="Planes"
      description="Programas de coaching publicados en la web comercial."
      stats={[
        {
          label: "Total planes",
          value: plans.length,
          hint: "En catálogo",
          icon: Dumbbell,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
        {
          label: "Destacados",
          value: featured,
          hint: "Visibles en home",
          icon: Star,
          iconBg: "bg-everfit-orange/10 text-everfit-orange",
        },
        {
          label: "Niveles",
          value: new Set(plans.map((p) => p.level)).size,
          hint: "Categorías activas",
          icon: TrendingUp,
          iconBg: "bg-everfit-wine/10 text-everfit-wine",
        },
        {
          label: "Precio promedio",
          value: plans.length
            ? formatPrice(plans.reduce((s, p) => s + p.price, 0) / plans.length)
            : "—",
          hint: "Coaching mensual",
          icon: Dumbbell,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
      ]}
      items={plans.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
      columns={[
        { key: "title", label: "Título" },
        { key: "level", label: "Nivel" },
        { key: "duration", label: "Duración" },
        { key: "price", label: "Precio", render: "price" },
        { key: "featured", label: "Estado", render: "featured" },
      ]}
      detailFields={[
        { key: "description", label: "Descripción corta", multiline: true },
        { key: "longDesc", label: "Descripción completa", multiline: true },
        { key: "level", label: "Nivel" },
        { key: "duration", label: "Duración" },
        { key: "price", label: "Precio" },
        { key: "features", label: "Características", multiline: true },
      ]}
      emptyIcon={Dumbbell}
      emptyTitle="No hay planes publicados"
      emptyDescription="Los planes aparecerán aquí cuando estén en la base de datos."
      commercialBasePath="/planes"
      toggleFeaturedApi="/api/admin/plans"
    />
  );
}
