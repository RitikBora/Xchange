"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "xchange-ui-theme";

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => null,
});

function applyThemeAttr(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    // 1. explicit stored choice wins, 2. else follow the OS setting,
    // 3. else fall back to light — kept in sync with THEME_INIT_SCRIPT.
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    applyThemeAttr(theme);
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (next: Theme) => {
      localStorage.setItem(STORAGE_KEY, next);
      applyThemeAttr(next);
      setThemeState(next);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const THEME_STORAGE_KEY = STORAGE_KEY;
