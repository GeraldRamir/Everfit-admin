"use client";

import Link from "next/link";
import {
  Bell,
  BellRing,
  BookOpen,
  Calendar,
  Dumbbell,
  FileText,
  Flame,
  Globe,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  Reply,
  Salad,
  Server,
  ShoppingBag,
  Star,
  Tag,
  TrendingUp,
  Users,
  Archive,
  type LucideIcon,
} from "lucide-react";

export type StatIconName =
  | "archive"
  | "bell"
  | "bellRing"
  | "bookOpen"
  | "calendar"
  | "dumbbell"
  | "fileText"
  | "flame"
  | "globe"
  | "inbox"
  | "mail"
  | "mailOpen"
  | "messageSquare"
  | "reply"
  | "salad"
  | "server"
  | "shoppingBag"
  | "star"
  | "tag"
  | "trendingUp"
  | "users";

const STAT_ICONS: Record<StatIconName, LucideIcon> = {
  archive: Archive,
  bell: Bell,
  bellRing: BellRing,
  bookOpen: BookOpen,
  calendar: Calendar,
  dumbbell: Dumbbell,
  fileText: FileText,
  flame: Flame,
  globe: Globe,
  inbox: Inbox,
  mail: Mail,
  mailOpen: MailOpen,
  messageSquare: MessageSquare,
  reply: Reply,
  salad: Salad,
  server: Server,
  shoppingBag: ShoppingBag,
  star: Star,
  tag: Tag,
  trendingUp: TrendingUp,
  users: Users,
};

export type StatCardItem = {
  label: string;
  value: number | string;
  hint?: string;
  /** Prefer string names when passing from Server Components. */
  icon: LucideIcon | StatIconName;
  iconBg: string;
  href?: string;
};

function resolveIcon(icon: LucideIcon | StatIconName): LucideIcon {
  if (typeof icon === "string") {
    return STAT_ICONS[icon] ?? Salad;
  }
  return icon;
}

export function resolveStatIcon(name: StatIconName): LucideIcon {
  return STAT_ICONS[name] ?? Salad;
}

export default function StatCards({ items }: { items: StatCardItem[] }) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((stat) => {
        const Icon = resolveIcon(stat.icon);
        const content = (
          <>
            <div>
              <p className="text-sm text-[var(--admin-muted)]">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums text-everfit-charcoal">
                {stat.value}
              </p>
              {stat.hint && <p className="mt-1 text-xs text-[var(--admin-muted-soft)]">{stat.hint}</p>}
            </div>
            <div className={`admin-stat-icon ${stat.iconBg}`}>
              <Icon size={22} aria-hidden="true" />
            </div>
          </>
        );

        if (stat.href) {
          return (
            <Link key={stat.label} href={stat.href} className="admin-stat-card">
              {content}
            </Link>
          );
        }

        return (
          <div key={stat.label} className="admin-stat-card">
            {content}
          </div>
        );
      })}
    </div>
  );
}
