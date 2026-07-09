"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminPreferences } from "@/components/AdminPreferencesProvider";
import { cn } from "@/lib/utils";

export default function ThemeToggleButton({ className }: { className?: string }) {
  const { prefs, toggleTheme } = useAdminPreferences();
  const isDark = prefs.theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-muted)] transition-colors hover:border-everfit-wine/30 hover:text-everfit-accent",
        className
      )}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
