import { prisma } from "@/lib/prisma";
import RecetasAdminClient from "@/components/RecetasAdminClient";

export default async function RecetasAdminPage() {
  const recipes = await prisma.recipe.findMany({ orderBy: { title: "asc" } });
  const featured = recipes.filter((r) => r.featured).length;
  const avgCalories = recipes.length
    ? Math.round(recipes.reduce((s, r) => s + r.calories, 0) / recipes.length)
    : 0;
  const categories = new Set(recipes.map((r) => r.category)).size;

  return (
    <RecetasAdminClient
      summary={{
        total: recipes.length,
        featured,
        categories,
        avgCalories: avgCalories || "—",
      }}
      items={recipes.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
