import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import MessagesClient from "@/components/MessagesClient";

export default async function MensajesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <Suspense fallback={<div className="admin-card text-gray-500">Cargando solicitudes...</div>}>
      <MessagesClient
        messages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      />
    </Suspense>
  );
}
