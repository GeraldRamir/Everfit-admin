import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, PNG, WEBP o GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "La imagen no puede superar 5 MB." },
        { status: 400 }
      );
    }

    const ext =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "gif";

    const folderRaw = String(formData.get("folder") ?? "recipes");
    const folder =
      folderRaw === "plans" ? "plans" : folderRaw === "blog" ? "blog" : "recipes";

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), bytes);

    const relativePath = `/uploads/${folder}/${filename}`;
    const origin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
      new URL(request.url).origin;

    return NextResponse.json({
      ok: true,
      path: relativePath,
      url: `${origin}${relativePath}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }
}
