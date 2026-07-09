import Link from "next/link";
import {
  Bell,
  BookOpen,
  Dumbbell,
  Flame,
  Mail,
  MessageSquare,
  Salad,
  Shield,
} from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards from "@/components/ui/StatCards";
import SettingsPanel from "@/components/SettingsClient";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default async function ConfiguracionPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const [plans, challenges, recipes, posts, messages, notifications] = await Promise.all([
    prisma.plan.count(),
    prisma.challenge.count(),
    prisma.recipe.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count(),
    prisma.notification.count({ where: { read: false } }),
  ]);

  const commercialUrl =
    process.env.NEXT_PUBLIC_COMMERCIAL_SITE_URL ?? "http://localhost:3000";

  return (
    <div>
      <AdminPageHeader
        title="Configuración"
        description="Tema, preferencias del panel y accesos del sistema."
      />

      <StatCards
        items={[
          {
            label: "Contenido",
            value: plans + challenges + recipes + posts,
            hint: "Items en catálogo",
            icon: "globe",
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
          {
            label: "Solicitudes",
            value: messages,
            hint: "Mensajes recibidos",
            icon: "mail",
            iconBg: "bg-everfit-orange/10 text-everfit-orange",
            href: "/dashboard/mensajes",
          },
          {
            label: "Alertas",
            value: notifications,
            hint: "Sin leer",
            icon: "bell",
            iconBg: "bg-everfit-wine/10 text-everfit-wine",
            href: "/dashboard/notificaciones",
          },
          {
            label: "Sesión",
            value: "Activa",
            hint: admin.name,
            icon: "users",
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
        ]}
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="admin-card">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-everfit-wine font-display text-lg font-bold text-white">
              {admin.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-everfit-charcoal">
                {admin.name}
              </h3>
              <p className="text-sm text-[var(--admin-muted)]">{admin.email}</p>
            </div>
          </div>
          <div className="space-y-3 border-t border-[var(--admin-border-soft)] pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--admin-muted)]">Rol</span>
              <span className="font-medium text-everfit-charcoal">Administradora</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--admin-muted)]">Cuenta creada</span>
              <span className="font-medium text-everfit-charcoal">
                {formatDate(admin.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--admin-muted)]">Sesión</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                <Shield size={14} />
                Activa
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="mb-1 font-display text-lg font-bold text-everfit-charcoal">
            Accesos rápidos
          </h3>
          <p className="mb-5 text-sm text-[var(--admin-muted)]">
            Ir directamente a cada sección del panel
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/dashboard/planes", label: "Planes", icon: Dumbbell, count: plans },
              { href: "/dashboard/retos", label: "Retos", icon: Flame, count: challenges },
              { href: "/dashboard/recetas", label: "Recetas", icon: Salad, count: recipes },
              { href: "/dashboard/blog", label: "Blog", icon: BookOpen, count: posts },
              {
                href: "/dashboard/testimonios",
                label: "Testimonios",
                icon: MessageSquare,
                count: null,
              },
              { href: "/dashboard/mensajes", label: "Solicitudes", icon: Mail, count: messages },
              {
                href: "/dashboard/notificaciones",
                label: "Notificaciones",
                icon: Bell,
                count: notifications,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-3 transition-colors hover:border-everfit-wine/25"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-everfit-cream text-everfit-wine">
                  <item.icon size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-everfit-charcoal">{item.label}</p>
                  {item.count !== null && (
                    <p className="text-xs text-[var(--admin-muted-soft)]">
                      {item.count} registros
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SettingsPanel commercialUrl={commercialUrl} />
    </div>
  );
}
