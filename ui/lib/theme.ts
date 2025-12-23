export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  primary: string;
  primaryHover: string;
  text: string;
  textSecondary: string;
  success: string;
  error: string;
  warning: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  borderRadius: string;
}

export const darkTheme: ThemeConfig = {
  colors: {
    background: "#0f0f0f",
    surface: "#1a1a1a",
    surfaceHover: "#252525",
    border: "#2a2a2a",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    text: "#fafafa",
    textSecondary: "#a1a1aa",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#eab308",
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, Menlo, monospace",
  },
  borderRadius: "8px",
};

export const lightTheme: ThemeConfig = {
  colors: {
    background: "#ffffff",
    surface: "#f9fafb",
    surfaceHover: "#f3f4f6",
    border: "#e5e7eb",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    text: "#111827",
    textSecondary: "#6b7280",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#eab308",
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, Menlo, monospace",
  },
  borderRadius: "8px",
};

/**
 * Apply theme to document by setting CSS variables
 */
export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Apply fonts
  root.style.setProperty("--font-heading", theme.fonts.heading);
  root.style.setProperty("--font-body", theme.fonts.body);
  root.style.setProperty("--font-mono", theme.fonts.mono);

  // Apply other properties
  root.style.setProperty("--border-radius", theme.borderRadius);
}

/**
 * Load theme from localStorage or return default
 */
export function loadTheme(): ThemeConfig {
  if (typeof localStorage === "undefined") return darkTheme;

  const saved = localStorage.getItem("agent-framework-theme");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return darkTheme;
    }
  }
  return darkTheme;
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: ThemeConfig): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("agent-framework-theme", JSON.stringify(theme));
}
