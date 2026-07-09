import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import PushNotificationsSetup from "@/components/PushNotificationsSetup";
import AutoRefreshClient from "@/components/AutoRefreshClient";
import { AdminPreferencesProvider } from "@/components/AdminPreferencesProvider";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const [unreadMessages, unreadNotifications] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.notification.count({ where: { read: false } }),
  ]);

  return (
    <AdminPreferencesProvider>
      <div className="admin-shell flex">
        <AdminSidebar
          adminName={admin.name}
          unreadMessages={unreadMessages}
          unreadNotifications={unreadNotifications}
        />
        <div className="admin-main">
          <AdminHeader adminName={admin.name} unreadNotifications={unreadNotifications} />
          <main className="admin-content">{children}</main>
        </div>
        <PushNotificationsSetup />
        <AutoRefreshClient />
      </div>
    </AdminPreferencesProvider>
  );
}
