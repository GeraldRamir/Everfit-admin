import webpush from "web-push";
import { prisma } from "./prisma";

function getVapidConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:everfitbymich@gmail.com";

  if (!publicKey || !privateKey) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

export function getVapidPublicKey() {
  return getVapidConfig()?.publicKey ?? null;
}

function configureWebPush() {
  const config = getVapidConfig();
  if (!config) return false;

  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return true;
}

export async function sendPushNotification(payload: {
  title: string;
  message: string;
  link?: string;
}) {
  if (!configureWebPush()) return { sent: 0, failed: 0 };

  const subscriptions = await prisma.pushSubscription.findMany();
  if (subscriptions.length === 0) return { sent: 0, failed: 0 };

  const body = JSON.stringify({
    title: payload.title,
    message: payload.message,
    link: payload.link,
  });

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const statusCode =
          error && typeof error === "object" && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;

        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    })
  );

  return { sent, failed };
}
