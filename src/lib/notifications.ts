import { prisma } from "./prisma";
import { sendPushNotification } from "./push";

export async function createNotification(data: {
  type: "CONTACT" | "SYSTEM";
  title: string;
  message: string;
  link?: string;
}) {
  const notification = await prisma.notification.create({ data });

  sendPushNotification({
    title: data.title,
    message: data.message,
    link: data.link,
  }).catch(() => {});

  return notification;
}
