import { BookOpen, Calendar, FileText, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContentSectionClient from "@/components/ContentSectionClient";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  const categories = new Set(posts.map((p) => p.category)).size;

  return (
    <ContentSectionClient
      title="Blog"
      description="Artículos de motivación, nutrición y entrenamiento."
      stats={[
        {
          label: "Artículos",
          value: posts.length,
          hint: "Publicados",
          icon: BookOpen,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
        {
          label: "Categorías",
          value: categories,
          hint: "Temas activos",
          icon: Tag,
          iconBg: "bg-everfit-orange/10 text-everfit-orange",
        },
        {
          label: "Último artículo",
          value: posts.length
            ? new Intl.DateTimeFormat("es-DO", { dateStyle: "short" }).format(posts[0].publishedAt)
            : "—",
          hint: posts[0]?.title?.slice(0, 30) ?? "",
          icon: Calendar,
          iconBg: "bg-everfit-wine/10 text-everfit-wine",
        },
        {
          label: "Contenido",
          value: posts.length ? `${posts.reduce((s, p) => s + p.content.length, 0).toLocaleString()} chars` : "—",
          hint: "Total escrito",
          icon: FileText,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
      ]}
      items={posts.map((p) => ({
        ...p,
        publishedAt: p.publishedAt.toISOString(),
      }))}
      columns={[
        { key: "title", label: "Título" },
        { key: "category", label: "Categoría" },
        { key: "publishedAt", label: "Publicado", render: "date" },
        { key: "excerpt", label: "Extracto", render: "truncate" },
      ]}
      detailFields={[
        { key: "excerpt", label: "Extracto", multiline: true },
        { key: "category", label: "Categoría" },
        { key: "publishedAt", label: "Fecha de publicación" },
        { key: "content", label: "Contenido", multiline: true },
      ]}
      emptyIcon={BookOpen}
      emptyTitle="No hay artículos publicados"
      emptyDescription="Los posts del blog aparecerán aquí."
      commercialBasePath="/blog"
      hasFeaturedFilter={false}
    />
  );
}
