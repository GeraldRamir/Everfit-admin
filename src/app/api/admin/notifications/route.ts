import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids, read } = await request.json();
  await prisma.notification.updateMany({
    where: { id: { in: ids } },
    data: { read },
  });

  return NextResponse.json({ success: true });
}
