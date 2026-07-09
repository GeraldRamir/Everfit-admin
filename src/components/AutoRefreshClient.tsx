"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminPreferences } from "@/components/AdminPreferencesProvider";

/** Soft-refreshes the dashboard when auto-refresh is enabled in settings. */
export default function AutoRefreshClient() {
  const { prefs } = useAdminPreferences();
  const router = useRouter();

  useEffect(() => {
    if (!prefs.autoRefreshSeconds) return;
    const id = window.setInterval(() => {
      router.refresh();
    }, prefs.autoRefreshSeconds * 1000);
    return () => window.clearInterval(id);
  }, [prefs.autoRefreshSeconds, router]);

  return null;
}
