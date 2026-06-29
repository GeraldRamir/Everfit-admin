self.addEventListener("push", (event) => {
  let payload = { title: "Everfit Admin", message: "Nueva notificación", link: "/dashboard" };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.message = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.message,
      data: { link: payload.link ?? "/dashboard" },
      tag: "everfit-admin-notification",
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link ?? "/dashboard";
  event.waitUntil(clients.openWindow(link));
});
