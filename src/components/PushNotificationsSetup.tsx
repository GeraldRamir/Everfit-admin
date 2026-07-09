"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeToPush(registration: ServiceWorkerRegistration) {
  const res = await fetch("/api/admin/push/vapid-public-key");
  if (!res.ok) return false;

  const { publicKey } = (await res.json()) as { publicKey: string };
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const saveRes = await fetch("/api/admin/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  });

  if (!saveRes.ok) {
    const err = await saveRes.json().catch(() => ({}));
    console.error("[push] subscribe failed:", err);
  }

  return saveRes.ok;
}

export default function PushNotificationsSetup() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(isSupported);
    if (!isSupported) return;

    setDismissed(window.localStorage.getItem("everfit-push-dismissed") === "1");

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (registration) => {
        const existing = await registration.pushManager.getSubscription();
        setSubscribed(Boolean(existing));

        if (Notification.permission === "granted" && !existing) {
          const ok = await subscribeToPush(registration);
          setSubscribed(ok);
        }
      })
      .catch(() => {});
  }, []);

  async function enablePush() {
    setLoading(true);
    try {
      const permissionResult = await Notification.requestPermission();
      if (permissionResult !== "granted") return;

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const ok = await subscribeToPush(registration);
      setSubscribed(ok);
      if (ok) {
        window.localStorage.removeItem("everfit-push-dismissed");
        setDismissed(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function disablePush() {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/admin/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }

  function dismissBanner() {
    window.localStorage.setItem("everfit-push-dismissed", "1");
    setDismissed(true);
  }

  if (!supported) return null;

  if (subscribed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 hidden md:block">
        <button
          type="button"
          onClick={disablePush}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800 shadow-sm transition hover:bg-emerald-100"
          title="Desactivar notificaciones push"
        >
          <Bell className="h-3.5 w-3.5" />
          Push activas
        </button>
      </div>
    );
  }

  if (Notification.permission === "denied" || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-everfit-wine/20 bg-[var(--admin-surface)] p-4 shadow-xl">
      <button
        type="button"
        onClick={dismissBanner}
        className="absolute right-3 top-3 text-[var(--admin-muted-soft)] transition hover:text-[var(--admin-muted)]"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="rounded-full bg-everfit-cream p-2 text-everfit-accent">
          <Bell className="h-4 w-4" />
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-everfit-accent">Notificaciones push</p>
          <p className="mb-3 text-xs leading-relaxed text-[var(--admin-muted)]">
            Recibe alertas al instante cuando llegue una nueva solicitud de servicio desde la web
            comercial.
          </p>
          <button
            type="button"
            onClick={enablePush}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-everfit-wine px-4 py-2 text-xs font-semibold text-white transition hover:bg-everfit-wine-dark"
          >
            <Bell className="h-3.5 w-3.5" />
            {loading ? "Activando…" : "Activar notificaciones"}
          </button>
        </div>
      </div>
    </div>
  );
}
