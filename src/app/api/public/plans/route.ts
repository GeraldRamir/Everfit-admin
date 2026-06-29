import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  return jsonResponse(plans);
}
