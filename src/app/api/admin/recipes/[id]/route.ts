import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

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

function parseRecipeBody(body: Record<string, unknown>, partial = false) {
  if (partial) {
    const keys = Object.keys(body);
    if (keys.length === 1 && typeof body.featured === "boolean") {
      return { featured: body.featured };
    }
    if (keys.length === 1 && typeof body.published === "boolean") {
      return { published: body.published };
    }
  }

  const title = String(body.title ?? "").trim();
  if (!title) throw new Error("El título es obligatorio");

  const description = String(body.description ?? "").trim();
  if (!description) throw new Error("La descripción es obligatoria");

  const category = String(body.category ?? "").trim();
  if (!category) throw new Error("La categoría es obligatoria");

  const prepTime = String(body.prepTime ?? "").trim() || "—";
  const calories = Number(body.calories);
  const protein = Number(body.protein);
  const carbs = Number(body.carbs);
  const fat = Number(body.fat);
  const servings = Number(body.servings ?? 1);
  const fiberRaw = body.fiber;
  const fiber =
    fiberRaw === "" || fiberRaw === null || fiberRaw === undefined
      ? null
      : Number(fiberRaw);

  if ([calories, protein, carbs, fat, servings].some((n) => Number.isNaN(n))) {
    throw new Error("Los valores nutricionales deben ser números válidos");
  }
  if (fiber !== null && Number.isNaN(fiber)) {
    throw new Error("La fibra debe ser un número válido");
  }

  const notes = String(body.notes ?? "").trim() || null;
  const image = String(body.image ?? "").trim() || null;
  const featured = Boolean(body.featured);
  const slugInput = String(body.slug ?? "").trim();
  const slug = slugify(slugInput || title);
  if (!slug) throw new Error("El slug no es válido");

  return {
    title,
    slug,
    description,
    ingredients: toLines(body.ingredients),
    instructions: toLines(body.instructions),
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: fiber === null ? null : Math.round(fiber),
    notes,
    prepTime,
    servings: Math.max(1, Math.round(servings)),
    category,
    image,
    featured,
  };
}

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseRecipeBody(body, true);

    if ("slug" in data && typeof data.slug === "string") {
      const clash = await prisma.recipe.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (clash) {
        return NextResponse.json(
          { error: "Ya existe una receta con ese slug." },
          { status: 409 }
        );
      }
    }

    const recipe = await prisma.recipe.update({ where: { id }, data });
    return NextResponse.json(recipe);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al actualizar la receta";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
