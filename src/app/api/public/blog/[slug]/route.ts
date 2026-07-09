import { prisma, jsonResponse, corsOptions } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return jsonResponse({ error: "Not found" }, { status: 404 });
  return jsonResponse(post);
}
