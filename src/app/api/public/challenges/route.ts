import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  const challenges = await prisma.challenge.findMany({ orderBy: { order: "asc" } });
  return jsonResponse(challenges);
}
