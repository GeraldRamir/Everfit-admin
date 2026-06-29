import { Flame, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContentSectionClient from "@/components/ContentSectionClient";
import { formatPrice } from "@/lib/utils";

export default async function RetosAdminPage() {
  const retos = await prisma.challenge.findMany({ orderBy: { order: "asc" } });
  const featured = retos.filter((r) => r.featured).length;
  const revenue = retos.reduce((s, r) => s + r.price, 0);

  return (
    <ContentSectionClient
      title="Retos"
      description="Retos de pago disponibles en la tienda online."
      stats={[
        {
          label: "Total retos",
          value: retos.length,
          hint: "En tienda",
          icon: Flame,
          iconBg: "bg-everfit-orange/10 text-everfit-orange",
        },
        {
          label: "Destacados",
          value: featured,
          hint: "En home y sección retos",
          icon: Star,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
        {
          label: "Precio promedio",
          value: retos.length ? formatPrice(revenue / retos.length) : "—",
          hint: "Por reto",
          icon: ShoppingBag,
          iconBg: "bg-everfit-wine/10 text-everfit-wine",
        },
        {
          label: "Catálogo total",
          value: formatPrice(revenue),
          hint: "Suma de precios",
          icon: TrendingUp,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
      ]}
      items={retos.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      columns={[
        { key: "title", label: "Título" },
        { key: "duration", label: "Duración" },
        { key: "price", label: "Precio", render: "price" },
        { key: "order", label: "Orden" },
        { key: "featured", label: "Estado", render: "featured" },
      ]}
      detailFields={[
        { key: "description", label: "Descripción", multiline: true },
        { key: "duration", label: "Duración" },
        { key: "price", label: "Precio" },
        { key: "order", label: "Orden de visualización" },
        { key: "createdAt", label: "Creado" },
      ]}
      emptyIcon={Flame}
      emptyTitle="No hay retos publicados"
      emptyDescription="Los retos de la tienda aparecerán aquí."
      commercialBasePath="/retos"
      toggleFeaturedApi="/api/admin/challenges"
    />
  );
}
