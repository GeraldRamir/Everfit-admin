import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
  return jsonResponse(recipes);
}
