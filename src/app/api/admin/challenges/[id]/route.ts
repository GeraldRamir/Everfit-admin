import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  if (typeof body.featured === "boolean" && Object.keys(body).length === 1) {
    const challenge = await prisma.challenge.update({
      where: { id },
      data: { featured: body.featured },
    });
    return NextResponse.json(challenge);
  }

  if (typeof body.published === "boolean" && Object.keys(body).length === 1) {
    const challenge = await prisma.challenge.update({
      where: { id },
      data: { published: body.published },
    });
    return NextResponse.json(challenge);
  }

  return NextResponse.json({ error: "Solo se admite featured o published" }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.challenge.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
