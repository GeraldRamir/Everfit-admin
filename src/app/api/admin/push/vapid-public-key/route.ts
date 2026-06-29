import { requireAdmin } from "@/lib/auth";
import { getVapidPublicKey } from "@/lib/push";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return Response.json(
      { error: "Las claves VAPID no están configuradas en el servidor." },
      { status: 503 }
    );
  }

  return Response.json({ publicKey });
}
