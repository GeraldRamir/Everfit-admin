import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CONTACT_STATUS_LABELS } from "@/lib/constants";

type Props = { params: Promise<{ id: string }> };

const VALID_STATUSES = Object.keys(CONTACT_STATUS_LABELS) as (keyof typeof CONTACT_STATUS_LABELS)[];

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(message);
}
