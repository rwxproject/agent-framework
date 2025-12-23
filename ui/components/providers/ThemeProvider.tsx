"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeConfig, darkTheme, applyTheme, loadTheme, saveTheme } from "@/lib/theme";

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(darkTheme);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = loadTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  };

  const resetTheme = () => {
    setTheme(darkTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
