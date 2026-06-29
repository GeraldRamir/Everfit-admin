import Link from "next/link";
import {
  Bell,
  BookOpen,
  Dumbbell,
  Flame,
  Mail,
  MessageSquare,
  Salad,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { CONTACT_STATUS_LABELS } from "@/lib/constants";
import ContentStatusChart from "@/components/dashboard/ContentStatusChart";

const statusBadge = {
  NEW: "badge-status-new",
  READ: "badge-status-read",
  REPLIED: "badge-status-replied",
  ARCHIVED: "badge-status-archived",
};

export default async function DashboardPage() {
  const [
    plans,
    challenges,
    recipes,
    posts,
    testimonials,
    messagesNew,
    messagesTotal,
    notificationsUnread,
    recentMessages,
    statusGroups,
    topRetos,
    recentNotifications,
  ] = await Promise.all([
    prisma.plan.count(),
    prisma.challenge.count(),
    prisma.recipe.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.notification.count({ where: { read: false } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.challenge.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const statusData = (["NEW", "READ", "REPLIED", "ARCHIVED"] as const).map((status) => ({
    status,
    count: statusGroups.find((g) => g.status === status)?._count.status ?? 0,
  }));

  const stats = [
    {
      label: "Solicitudes nuevas",
      value: messagesNew,
      hint: "Pendientes de revisar",
      icon: Mail,
      iconBg: "bg-everfit-orange/10 text-everfit-orange",
      href: "/dashboard/mensajes",
    },
    {
      label: "Total solicitudes",
      value: messagesTotal,
      hint: "Mensajes recibidos",
      icon: MessageSquare,
      iconBg: "bg-everfit-cream text-everfit-wine",
      href: "/dashboard/mensajes",
    },
    {
      label: "Notificaciones",
      value: notificationsUnread,
      hint: "Sin leer",
      icon: Bell,
      iconBg: "bg-everfit-wine/10 text-everfit-wine",
      href: "/dashboard/notificaciones",
    },
    {
      label: "Contenido activo",
      value: plans + challenges + recipes + posts,
      hint: "Planes, retos, recetas y blog",
      icon: TrendingUp,
      iconBg: "bg-everfit-cream text-everfit-wine",
      href: "/dashboard/planes",
    },
  ];

  const inventory = [
    { label: "Planes", value: plans, icon: Dumbbell },
    { label: "Retos", value: challenges, icon: Flame },
    { label: "Recetas", value: recipes, icon: Salad },
    { label: "Blog", value: posts, icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-stat-card">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums text-everfit-charcoal">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-400">{stat.hint}</p>
            </div>
            <div className={`admin-stat-icon ${stat.iconBg}`}>
              <stat.icon size={22} aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ContentStatusChart data={statusData} />
        </div>

        <div className="admin-card h-full">
          <h3 className="mb-1 font-display text-lg font-bold text-everfit-charcoal">
            Resumen de contenido
          </h3>
          <p className="mb-6 text-sm text-gray-500">Catálogo publicado en la web</p>
          <div className="grid grid-cols-2 gap-4">
            {inventory.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-everfit-cream text-everfit-wine">
                  <item.icon size={18} aria-hidden="true" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-everfit-charcoal">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-everfit-cream/50 p-4">
            <p className="text-sm font-semibold text-everfit-wine">{testimonials} testimonios</p>
            <p className="text-xs text-gray-500">Visibles en la página comercial</p>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <h3 className="font-display text-lg font-bold text-everfit-charcoal">
              Detalle de solicitudes
            </h3>
            <p className="text-sm text-gray-500">Últimos mensajes del formulario de contacto</p>
          </div>
          <Link href="/dashboard/mensajes" className="btn-admin-outline text-sm">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Asunto</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    No hay solicitudes todavía.
                  </td>
                </tr>
              )}
              {recentMessages.map((msg) => (
                <tr key={msg.id} className="cursor-pointer hover:bg-everfit-cream/20">
                  <td className="font-medium text-everfit-charcoal">
                    <Link href={`/dashboard/mensajes?id=${msg.id}`} className="hover:text-everfit-wine">
                      {msg.name}
                    </Link>
                  </td>
                  <td>{msg.subject}</td>
                  <td className="text-gray-500">{msg.email}</td>
                  <td className="text-gray-500">{formatDate(msg.createdAt)}</td>
                  <td>
                    <span className={statusBadge[msg.status]}>
                      {CONTACT_STATUS_LABELS[msg.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card">
          <h3 className="mb-1 font-display text-lg font-bold text-everfit-charcoal">
            Retos destacados
          </h3>
          <p className="mb-5 text-sm text-gray-500">Productos activos en la tienda</p>
          <div className="space-y-4">
            {topRetos.length === 0 && (
              <p className="rounded-2xl bg-gray-50/80 py-6 text-center text-sm text-gray-500">
                No hay retos marcados como destacados.
              </p>
            )}
            {topRetos.map((reto) => (
              <div key={reto.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-everfit-charcoal">{reto.title}</p>
                  <p className="text-xs text-gray-500">{reto.duration}</p>
                </div>
                <span className="shrink-0 font-display font-bold text-everfit-orange">
                  {formatPrice(reto.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-everfit-charcoal">
                Actividad reciente
              </h3>
              <p className="text-sm text-gray-500">Notificaciones del sistema</p>
            </div>
            <Link href="/dashboard/notificaciones" className="text-sm font-semibold text-everfit-orange">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotifications.length === 0 && (
              <p className="rounded-2xl bg-gray-50/80 py-6 text-center text-sm text-gray-500">
                Sin actividad reciente.
              </p>
            )}
            {recentNotifications.map((n) => (
              <div key={n.id} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                <p className="font-medium text-everfit-charcoal">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
