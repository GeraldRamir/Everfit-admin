import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  const [services, plans, challenges, recipes, testimonials] = await Promise.all([
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.plan.findMany({ where: { featured: true, published: true } }),
    prisma.challenge.findMany({
      where: { featured: true, published: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.recipe.findMany({ where: { featured: true, published: true }, take: 4 }),
    prisma.testimonial.findMany({ take: 3 }),
  ]);

  return jsonResponse({ services, plans, challenges, recipes, testimonials });
}
