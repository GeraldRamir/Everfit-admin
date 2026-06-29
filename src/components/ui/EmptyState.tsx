import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="admin-card flex flex-col items-center py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-everfit-cream text-everfit-wine">
        <Icon size={24} aria-hidden="true" />
      </div>
      <p className="font-display text-lg font-bold text-everfit-charcoal">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>}
    </div>
  );
}
