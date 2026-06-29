import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type StatCardItem = {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  iconBg: string;
  href?: string;
};

export default function StatCards({ items }: { items: StatCardItem[] }) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((stat) => {
        const content = (
          <>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums text-everfit-charcoal">
                {stat.value}
              </p>
              {stat.hint && <p className="mt-1 text-xs text-gray-400">{stat.hint}</p>}
            </div>
            <div className={`admin-stat-icon ${stat.iconBg}`}>
              <stat.icon size={22} aria-hidden="true" />
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
