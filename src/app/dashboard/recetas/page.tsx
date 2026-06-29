import { Salad, Star, UtensilsCrossed } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContentSectionClient from "@/components/ContentSectionClient";

export default async function RecetasAdminPage() {
  const recipes = await prisma.recipe.findMany({ orderBy: { title: "asc" } });
  const featured = recipes.filter((r) => r.featured).length;
  const avgCalories = recipes.length
    ? Math.round(recipes.reduce((s, r) => s + r.calories, 0) / recipes.length)
    : 0;

  return (
    <ContentSectionClient
      title="Recetas"
      description="Recetas fit publicadas en el sitio comercial."
      stats={[
        {
          label: "Total recetas",
          value: recipes.length,
          hint: "En catálogo",
          icon: Salad,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
        {
          label: "Destacadas",
          value: featured,
          hint: "Visibles en home",
          icon: Star,
          iconBg: "bg-everfit-orange/10 text-everfit-orange",
        },
        {
          label: "Categorías",
          value: new Set(recipes.map((r) => r.category)).size,
          hint: "Tipos de comida",
          icon: UtensilsCrossed,
          iconBg: "bg-everfit-wine/10 text-everfit-wine",
        },
        {
          label: "Calorías prom.",
          value: avgCalories || "—",
          hint: "Por receta",
          icon: Salad,
          iconBg: "bg-everfit-cream text-everfit-wine",
        },
      ]}
      items={recipes.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      columns={[
        { key: "title", label: "Título" },
        { key: "category", label: "Categoría" },
        { key: "calories", label: "Calorías" },
        { key: "prepTime", label: "Prep." },
        { key: "featured", label: "Estado", render: "featured" },
      ]}
      detailFields={[
        { key: "description", label: "Descripción", multiline: true },
        { key: "category", label: "Categoría" },
        { key: "calories", label: "Calorías" },
        { key: "protein", label: "Proteína (g)" },
        { key: "carbs", label: "Carbohidratos (g)" },
        { key: "fat", label: "Grasas (g)" },
        { key: "prepTime", label: "Tiempo de preparación" },
        { key: "servings", label: "Porciones" },
        { key: "ingredients", label: "Ingredientes", multiline: true },
        { key: "instructions", label: "Instrucciones", multiline: true },
      ]}
      emptyIcon={Salad}
      emptyTitle="No hay recetas publicadas"
      emptyDescription="Las recetas del sitio aparecerán aquí."
      commercialBasePath="/recetas"
      toggleFeaturedApi="/api/admin/recipes"
    />
  );
}
