import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { featured } = await request.json();

  if (typeof featured !== "boolean") {
    return NextResponse.json({ error: "featured must be a boolean" }, { status: 400 });
  }

  const challenge = await prisma.challenge.update({ where: { id }, data: { featured } });
  return NextResponse.json(challenge);
}
