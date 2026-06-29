import { MessageSquare, Star, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContentSectionClient from "@/components/ContentSectionClient";

export default async function TestimoniosAdminPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  const avgRating = items.length
    ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1)
    : "—";

  return (
    <ContentSectionClient
      title="Testimonios"
      description="Historias de clientas visibles en la página principal."
      stats={[
        {
          label: "Testimonios",
          value: items.length,
          hint: "En home",
          icon: MessageSquare,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
        {
          label: "Rating promedio",
          value: avgRating,
          hint: "De 5 estrellas",
          icon: Star,
          iconBg: "bg-everfit-orange/10 text-everfit-orange",
        },
        {
          label: "5 estrellas",
          value: items.filter((t) => t.rating === 5).length,
          hint: "Valoración máxima",
          icon: Star,
          iconBg: "bg-everfit-wine/10 text-everfit-wine",
        },
        {
          label: "Clientas",
          value: items.length,
          hint: "Historias reales",
          icon: Users,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
      ]}
      items={items.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }))}
      columns={[
        { key: "name", label: "Nombre" },
        { key: "role", label: "Rol" },
        { key: "rating", label: "Rating", render: "rating" },
        { key: "content", label: "Comentario", render: "truncate" },
      ]}
      detailFields={[
        { key: "name", label: "Nombre" },
        { key: "role", label: "Rol / contexto" },
        { key: "rating", label: "Valoración" },
        { key: "content", label: "Testimonio", multiline: true },
        { key: "createdAt", label: "Registrado" },
      ]}
      emptyIcon={MessageSquare}
      emptyTitle="No hay testimonios"
      emptyDescription="Los testimonios de clientas aparecerán aquí."
      hasFeaturedFilter={false}
    />
  );
}
