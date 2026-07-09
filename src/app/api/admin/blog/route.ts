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

function parseBlogBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  if (!title) throw new Error("El título es obligatorio");

  const excerpt = String(body.excerpt ?? "").trim();
  if (!excerpt) throw new Error("El extracto es obligatorio");

  const content = String(body.content ?? "").trim();
  if (!content) throw new Error("El contenido es obligatorio");

  const category = String(body.category ?? "").trim();
  if (!category) throw new Error("La categoría es obligatoria");

  const image = String(body.image ?? "").trim() || null;
  const slugInput = String(body.slug ?? "").trim();
  const slug = slugify(slugInput || title);
  if (!slug) throw new Error("El slug no es válido");

  const publishedAtRaw = String(body.publishedAt ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("La fecha de publicación no es válida");
  }

  const published =
    body.published === undefined || body.published === null
      ? true
      : Boolean(body.published);

  return { title, slug, excerpt, content, category, image, publishedAt, published };
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseBlogBody(body);

    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un artículo con ese slug. Cambia el título o el slug." },
        { status: 409 }
      );
    }

    const post = await prisma.blogPost.create({ data });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear el artículo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
