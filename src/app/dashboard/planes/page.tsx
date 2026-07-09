import { prisma } from "@/lib/prisma";
import PlanesAdminClient from "@/components/PlanesAdminClient";
import { formatPrice } from "@/lib/utils";

export default async function PlanesAdminPage() {
  const plans = await prisma.plan.findMany({ orderBy: { title: "asc" } });
  const featured = plans.filter((p) => p.featured).length;
  const avgPrice = plans.length
    ? formatPrice(plans.reduce((s, p) => s + p.price, 0) / plans.length)
    : "—";

  return (
    <PlanesAdminClient
      summary={{
        total: plans.length,
        featured,
        levels: new Set(plans.map((p) => p.level)).size,
        avgPrice,
      }}
      items={plans.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
