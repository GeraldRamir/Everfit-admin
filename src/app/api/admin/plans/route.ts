import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toLines(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map(String).map((s) => s.trim()).filter(Boolean));
  }
  const text = String(value ?? "").trim();
  if (!text) return JSON.stringify([]);
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed.map(String).map((s) => s.trim()).filter(Boolean));
      }
    } catch {
      /* fall through */
    }
  }
  return JSON.stringify(
    text
      .split("\n")
      .map((line) => line.replace(/^[\s*•\-]+/, "").trim())
      .filter(Boolean)
  );
}

function parsePlanBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  if (!title) throw new Error("El título es obligatorio");

  const description = String(body.description ?? "").trim();
  if (!description) throw new Error("La descripción corta es obligatoria");

  const longDesc = String(body.longDesc ?? "").trim();
  if (!longDesc) throw new Error("La descripción completa es obligatoria");

  const level = String(body.level ?? "").trim();
  if (!level) throw new Error("El nivel es obligatorio");

  const duration = String(body.duration ?? "").trim() || "Programa continuo";
  const price = Number(body.price ?? 0);
  if (Number.isNaN(price) || price < 0) {
    throw new Error("El precio debe ser un número válido");
  }

  const features = toLines(body.features);
  if (JSON.parse(features).length === 0) {
    throw new Error("Agrega al menos una característica / lo que incluye");
  }

  const image = String(body.image ?? "").trim() || null;
  const featured = Boolean(body.featured);
  const slugInput = String(body.slug ?? "").trim();
  const slug = slugify(slugInput || title);
  if (!slug) throw new Error("El slug no es válido");

  return {
    title,
    slug,
    description,
    longDesc,
    price,
    duration,
    level,
    features,
    image,
    featured,
  };
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await prisma.plan.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parsePlanBody(body);

    const existing = await prisma.plan.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un plan con ese slug. Cambia el título o el slug." },
        { status: 409 }
      );
    }

    const plan = await prisma.plan.create({ data });
    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear el plan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
