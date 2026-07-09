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

function parseBlogBody(body: Record<string, unknown>, partial = false) {
  if (partial) {
    const keys = Object.keys(body);
    if (keys.length === 1 && typeof body.published === "boolean") {
      return { published: body.published };
    }
  }

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

  const publishedAtRaw = body.publishedAt;
  let publishedAt: Date;
  if (publishedAtRaw instanceof Date) {
    publishedAt = publishedAtRaw;
  } else {
    const raw = String(publishedAtRaw ?? "").trim();
    publishedAt = raw ? new Date(raw) : new Date();
  }
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("La fecha de publicación no es válida");
  }

  const published =
    body.published === undefined || body.published === null
      ? true
      : Boolean(body.published);

  return { title, slug, excerpt, content, category, image, publishedAt, published };
}

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseBlogBody(body, true);

    if ("slug" in data && typeof data.slug === "string") {
      const clash = await prisma.blogPost.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (clash) {
        return NextResponse.json(
          { error: "Ya existe un artículo con ese slug." },
          { status: 409 }
        );
      }
    }

    const post = await prisma.blogPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al actualizar el artículo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
