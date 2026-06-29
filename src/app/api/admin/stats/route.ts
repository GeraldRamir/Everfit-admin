import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    plans,
    challenges,
    recipes,
    posts,
    testimonials,
    messagesNew,
    messagesTotal,
    notificationsUnread,
  ] = await Promise.all([
    prisma.plan.count(),
    prisma.challenge.count(),
    prisma.recipe.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.notification.count({ where: { read: false } }),
  ]);

  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentNotifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    counts: {
      plans,
      challenges,
      recipes,
      posts,
      testimonials,
      messagesNew,
      messagesTotal,
      notificationsUnread,
    },
    recentMessages,
    recentNotifications,
  });
}
