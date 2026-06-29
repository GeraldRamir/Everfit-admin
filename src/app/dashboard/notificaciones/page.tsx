import { prisma } from "@/lib/prisma";
import NotificationsClient from "@/components/NotificationsClient";

export default async function NotificacionesPage() {
  const items = await prisma.notification.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <NotificationsClient items={items.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }))} />
  );
}
