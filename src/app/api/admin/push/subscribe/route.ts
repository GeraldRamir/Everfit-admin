import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

function normalizeSubscription(raw: unknown): PushSubscriptionPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const subscription = raw as Record<string, unknown>;
  const endpoint = subscription.endpoint;
  const keys = subscription.keys;

  if (typeof endpoint !== "string" || !keys || typeof keys !== "object") return null;

  const keyRecord = keys as Record<string, unknown>;
  const p256dh = keyRecord.p256dh;
  const auth = keyRecord.auth;

  if (typeof p256dh !== "string" || typeof auth !== "string") return null;

  return { endpoint, keys: { p256dh, auth } };
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const subscription = normalizeSubscription(body.subscription);

    if (!subscription) {
      return Response.json({ error: "Suscripción inválida." }, { status: 400 });
    }

    if (!prisma.pushSubscription) {
      return Response.json(
        {
          error:
            "Cliente Prisma desactualizado. Detén el servidor, ejecuta `npx prisma generate` y reinicia everfit-admin.",
        },
        { status: 503 }
      );
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        adminId: admin.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      update: {
        adminId: admin.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[push/subscribe]", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "No se pudo guardar la suscripción.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const endpoint = body.endpoint as string | undefined;

    if (!endpoint) {
      return Response.json({ error: "Endpoint requerido." }, { status: 400 });
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint, adminId: admin.id },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "No se pudo eliminar la suscripción." }, { status: 500 });
  }
}
