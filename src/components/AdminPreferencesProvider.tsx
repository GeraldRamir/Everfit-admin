"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export type AdminPreferences = {
  theme: ThemeMode;
  compactTables: boolean;
  confirmDeletes: boolean;
  autoRefreshSeconds: number; // 0 = off
  sidebarCollapsedDefault: boolean;
};

const STORAGE_KEY = "everfit-admin-prefs";

export const DEFAULT_PREFS: AdminPreferences = {
  theme: "light",
  compactTables: false,
  confirmDeletes: true,
  autoRefreshSeconds: 0,
  sidebarCollapsedDefault: false,
};

type PrefsContextValue = {
  prefs: AdminPreferences;
  setPrefs: (next: Partial<AdminPreferences>) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

function applyPrefsToDom(prefs: AdminPreferences) {
  applyTheme(prefs.theme);
  document.documentElement.classList.toggle("admin-compact", prefs.compactTables);
}

function loadPrefs(): AdminPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<AdminPreferences>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function AdminPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<AdminPreferences>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadPrefs();
    setPrefsState(loaded);
    applyPrefsToDom(loaded);
    setReady(true);
  }, []);

  const setPrefs = useCallback((next: Partial<AdminPreferences>) => {
    setPrefsState((prev) => {
      const merged = { ...prev, ...next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      applyPrefsToDom(merged);
      return merged;
    });
  }, []);

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      setPrefs({ theme });
    },
    [setPrefs]
  );

  const toggleTheme = useCallback(() => {
    setPrefsState((prev) => {
      const theme: ThemeMode = prev.theme === "dark" ? "light" : "dark";
      const merged = { ...prev, theme };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      applyPrefsToDom(merged);
      return merged;
    });
  }, []);

  if (!ready) {
    return (
      <PrefsContext.Provider
        value={{ prefs: DEFAULT_PREFS, setPrefs, setTheme, toggleTheme }}
      >
        {children}
      </PrefsContext.Provider>
    );
  }

  return (
    <PrefsContext.Provider value={{ prefs, setPrefs, setTheme, toggleTheme }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function useAdminPreferences() {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("useAdminPreferences must be used within AdminPreferencesProvider");
  }
  return ctx;
}
