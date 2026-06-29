import Link from "next/link";
import {
  Bell,
  BookOpen,
  Dumbbell,
  Flame,
  Globe,
  Mail,
  MessageSquare,
  Salad,
  Server,
  Shield,
} from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import StatCards from "@/components/ui/StatCards";
import SettingsActions, { CommercialLink } from "@/components/SettingsClient";
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

  const commercialUrl = process.env.NEXT_PUBLIC_COMMERCIAL_SITE_URL ?? "http://localhost:3000";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

  return (
    <div>
      <AdminPageHeader
        title="Configuración"
        description="Perfil, enlaces del sistema y accesos rápidos."
        action={<SettingsActions />}
      />

      <StatCards
        items={[
          {
            label: "Contenido",
            value: plans + challenges + recipes + posts,
            hint: "Items en catálogo",
            icon: Globe,
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
          {
            label: "Solicitudes",
            value: messages,
            hint: "Mensajes recibidos",
            icon: Mail,
            iconBg: "bg-everfit-orange/10 text-everfit-orange",
            href: "/dashboard/mensajes",
          },
          {
            label: "Alertas",
            value: notifications,
            hint: "Sin leer",
            icon: Bell,
            iconBg: "bg-everfit-wine/10 text-everfit-wine",
            href: "/dashboard/notificaciones",
          },
          {
            label: "API",
            value: "Activa",
            hint: "Servidor admin",
            icon: Server,
            iconBg: "bg-everfit-cream text-everfit-wine",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
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
              <h3 className="font-display text-lg font-bold text-everfit-charcoal">{admin.name}</h3>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
          </div>
          <div className="space-y-3 border-t border-gray-100 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Rol</span>
              <span className="font-medium text-everfit-charcoal">Administradora</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cuenta creada</span>
              <span className="font-medium text-everfit-charcoal">{formatDate(admin.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sesión</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <Shield size={14} />
                Activa
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="mb-1 font-display text-lg font-bold text-everfit-charcoal">Enlaces del sistema</h3>
          <p className="mb-5 text-sm text-gray-500">Sitio comercial y API pública</p>
          <div className="space-y-3">
            <CommercialLink href={commercialUrl} label="Sitio comercial (Everfit by Mich)" />
            <CommercialLink href={`${apiUrl}/api/public/home`} label="API pública — Home" />
          </div>
        </div>

        <div className="admin-card lg:col-span-2">
          <h3 className="mb-1 font-display text-lg font-bold text-everfit-charcoal">Accesos rápidos</h3>
          <p className="mb-5 text-sm text-gray-500">Ir directamente a cada sección del panel</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/dashboard/planes", label: "Planes", icon: Dumbbell, count: plans },
              { href: "/dashboard/retos", label: "Retos", icon: Flame, count: challenges },
              { href: "/dashboard/recetas", label: "Recetas", icon: Salad, count: recipes },
              { href: "/dashboard/blog", label: "Blog", icon: BookOpen, count: posts },
              { href: "/dashboard/testimonios", label: "Testimonios", icon: MessageSquare, count: null },
              { href: "/dashboard/mensajes", label: "Solicitudes", icon: Mail, count: messages },
              { href: "/dashboard/notificaciones", label: "Notificaciones", icon: Bell, count: notifications },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/40 p-4 transition-colors hover:border-everfit-wine/20 hover:bg-everfit-cream/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-everfit-cream text-everfit-wine">
                  <item.icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-everfit-charcoal">{item.label}</p>
                  {item.count !== null && (
                    <p className="text-xs text-gray-400">{item.count} registros</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
