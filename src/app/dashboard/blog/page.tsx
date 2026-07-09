import { prisma } from "@/lib/prisma";
import BlogAdminClient from "@/components/BlogAdminClient";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  const categories = new Set(posts.map((p) => p.category)).size;

  return (
    <BlogAdminClient
      items={posts.map((p) => ({
        ...p,
        publishedAt: p.publishedAt.toISOString(),
      }))}
      summary={{
        total: posts.length,
        categories,
        lastPublished: posts[0]
          ? new Intl.DateTimeFormat("es-DO", { dateStyle: "short" }).format(posts[0].publishedAt)
          : null,
        totalChars: posts.reduce((s, p) => s + p.content.length, 0),
      }}
    />
  );
}
