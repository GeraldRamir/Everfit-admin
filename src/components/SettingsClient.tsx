"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  ExternalLink,
  Globe,
  LayoutGrid,
  LogOut,
  Monitor,
  Moon,
  RefreshCw,
  ShieldAlert,
  Sun,
  Trash2,
} from "lucide-react";
import {
  useAdminPreferences,
  type ThemeMode,
} from "@/components/AdminPreferencesProvider";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "admin-toggle",
        checked ? "bg-everfit-wine" : "bg-[var(--admin-border)]"
      )}
    >
      <span
        className={cn(
          "admin-toggle-knob",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function SettingsPanel({
  commercialUrl,
}: {
  commercialUrl: string;
}) {
  const router = useRouter();
  const { prefs, setPrefs, setTheme } = useAdminPreferences();
  const [savedFlash, setSavedFlash] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    setPushSupported(supported);
    if (supported) setPushPermission(Notification.permission);
  }, []);

  function flashSaved() {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  function updatePref<K extends keyof typeof prefs>(key: K, value: (typeof prefs)[K]) {
    setPrefs({ [key]: value });
    flashSaved();
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function clearLocalCache() {
    if (
      prefs.confirmDeletes &&
      !confirm("¿Borrar preferencias locales y vista de notificaciones push descartadas?")
    ) {
      return;
    }
    localStorage.removeItem("everfit-admin-prefs");
    localStorage.removeItem("everfit-push-dismissed");
    setPrefs({
      theme: "light",
      compactTables: false,
      confirmDeletes: true,
      autoRefreshSeconds: 0,
      sidebarCollapsedDefault: false,
    });
    flashSaved();
  }

  async function requestPushPermission() {
    if (!pushSupported) return;
    const result = await Notification.requestPermission();
    setPushPermission(result);
  }

  const themes: { id: ThemeMode; label: string; icon: typeof Sun; hint: string }[] = [
    { id: "light", label: "Claro", icon: Sun, hint: "Fondo claro, ideal de día" },
    { id: "dark", label: "Oscuro", icon: Moon, hint: "Menos fatiga visual" },
  ];

  return (
    <div className="space-y-6">
      {savedFlash && (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          Preferencias guardadas
        </p>
      )}

      {/* Apariencia */}
      <section className="admin-card">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-everfit-cream text-everfit-wine">
            <Monitor size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-everfit-charcoal">Apariencia</h3>
            <p className="text-sm text-[var(--admin-muted)]">
              Tema del panel y densidad de las tablas
            </p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted-soft)]">
          Modo de color
        </p>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {themes.map((item) => {
            const active = prefs.theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTheme(item.id);
                  flashSaved();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors",
                  active
                    ? "border-everfit-wine/40 bg-everfit-cream/60 shadow-sm"
                    : "border-[var(--admin-border)] bg-[var(--admin-surface-soft)] hover:border-everfit-wine/25"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    active
                      ? "bg-everfit-wine text-white"
                      : "bg-[var(--admin-surface)] text-[var(--admin-muted)]"
                  )}
                >
                  <item.icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-everfit-charcoal">
                    {item.label}
                  </span>
                  <span className="block text-xs text-[var(--admin-muted)]">{item.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[var(--admin-border-soft)] pt-5">
          <div>
            <p className="text-sm font-semibold text-everfit-charcoal">Tablas compactas</p>
            <p className="text-xs text-[var(--admin-muted)]">
              Reduce el espaciado de filas en listados (planes, recetas, mensajes…)
            </p>
          </div>
          <Toggle
            checked={prefs.compactTables}
            onChange={(v) => updatePref("compactTables", v)}
            label="Tablas compactas"
          />
        </div>
      </section>

      {/* Flujo de trabajo */}
      <section className="admin-card">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-everfit-orange/10 text-everfit-orange">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-everfit-charcoal">
              Flujo de trabajo
            </h3>
            <p className="text-sm text-[var(--admin-muted)]">
              Comportamiento del panel al gestionar contenido
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-everfit-charcoal">
                Confirmar antes de eliminar
              </p>
              <p className="text-xs text-[var(--admin-muted)]">
                Muestra un aviso al borrar planes, recetas u otros registros
              </p>
            </div>
            <Toggle
              checked={prefs.confirmDeletes}
              onChange={(v) => updatePref("confirmDeletes", v)}
              label="Confirmar eliminaciones"
            />
          </div>

          <div className="border-t border-[var(--admin-border-soft)] pt-5">
            <div className="mb-3 flex items-start gap-3">
              <RefreshCw size={16} className="mt-0.5 text-[var(--admin-muted)]" />
              <div>
                <p className="text-sm font-semibold text-everfit-charcoal">
                  Actualización automática
                </p>
                <p className="text-xs text-[var(--admin-muted)]">
                  Recarga periódica del panel para ver solicitudes nuevas
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 0, label: "Off" },
                { value: 30, label: "30 s" },
                { value: 60, label: "1 min" },
                { value: 120, label: "2 min" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updatePref("autoRefreshSeconds", opt.value)}
                  className={cn(
                    "rounded-2xl border px-4 py-2 text-sm font-medium transition-colors",
                    prefs.autoRefreshSeconds === opt.value
                      ? "border-everfit-wine/30 bg-everfit-cream text-everfit-wine shadow-sm"
                      : "border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-everfit-wine/20"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notificaciones + sitio */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="admin-card">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-everfit-wine/10 text-everfit-wine">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-everfit-charcoal">
                Notificaciones push
              </h3>
              <p className="text-sm text-[var(--admin-muted)]">
                Alertas al recibir solicitudes de la web
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl bg-[var(--admin-surface-soft)] px-4 py-3 text-sm">
            <p className="text-[var(--admin-muted)]">Estado del navegador</p>
            <p className="mt-1 font-semibold text-everfit-charcoal">
              {!pushSupported
                ? "No compatible"
                : pushPermission === "granted"
                  ? "Permiso concedido"
                  : pushPermission === "denied"
                    ? "Permiso denegado"
                    : "Pendiente de activar"}
            </p>
          </div>

          {pushSupported && pushPermission !== "granted" && (
            <button
              type="button"
              onClick={requestPushPermission}
              className="btn-admin-primary w-full"
            >
              Solicitar permiso de notificaciones
            </button>
          )}
          {pushSupported && pushPermission === "granted" && (
            <p className="text-xs text-[var(--admin-muted)]">
              Las notificaciones están activas. Puedes reactivarlas desde el banner del dashboard si
              las descartaste.
            </p>
          )}
        </section>

        <section className="admin-card">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-everfit-cream text-everfit-wine">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-everfit-charcoal">
                Sitio comercial
              </h3>
              <p className="text-sm text-[var(--admin-muted)]">
                Enlace rápido a la página pública
              </p>
            </div>
          </div>

          <a
            href={commercialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-4 py-3 text-sm font-medium text-everfit-charcoal transition-colors hover:border-everfit-wine/25"
          >
            <span className="truncate">{commercialUrl}</span>
            <ExternalLink size={16} className="shrink-0 text-[var(--admin-muted-soft)]" />
          </a>
          <Link
            href="/dashboard/mensajes"
            className="mt-3 inline-flex text-sm font-semibold text-everfit-accent hover:underline"
          >
            Ver solicitudes de contacto →
          </Link>
        </section>
      </div>

      {/* Datos locales + sesión */}
      <section className="admin-card">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-everfit-charcoal">
              Datos locales y sesión
            </h3>
            <p className="text-sm text-[var(--admin-muted)]">
              Preferencias guardadas solo en este navegador
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={clearLocalCache} className="btn-admin-outline">
            <Trash2 size={16} />
            Restablecer preferencias
          </button>
          <button type="button" onClick={logout} className="btn-admin-primary">
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </section>
    </div>
  );
}
