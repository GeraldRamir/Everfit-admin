import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  if (!recipe) return jsonResponse({ error: "Not found" }, { status: 404 });
  return jsonResponse(recipe);
}
