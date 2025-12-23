"use client";

import { useState, useEffect } from "react";

interface ThemeColors {
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

interface ThemeConfig {
  colors: ThemeColors;
  borderRadius: string;
}

const DEFAULT_DARK_THEME: ThemeConfig = {
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
  borderRadius: "8px",
};

const PRESET_THEMES: Record<string, ThemeConfig> = {
  dark: DEFAULT_DARK_THEME,
  light: {
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
    borderRadius: "8px",
  },
  purple: {
    colors: {
      background: "#0f0a1a",
      surface: "#1a1425",
      surfaceHover: "#251e35",
      border: "#2d2640",
      primary: "#a855f7",
      primaryHover: "#9333ea",
      text: "#faf5ff",
      textSecondary: "#c4b5fd",
      success: "#22c55e",
      error: "#ef4444",
      warning: "#eab308",
    },
    borderRadius: "8px",
  },
  green: {
    colors: {
      background: "#0a1a0f",
      surface: "#14251a",
      surfaceHover: "#1e3525",
      border: "#264030",
      primary: "#22c55e",
      primaryHover: "#16a34a",
      text: "#f0fdf4",
      textSecondary: "#86efac",
      success: "#22c55e",
      error: "#ef4444",
      warning: "#eab308",
    },
    borderRadius: "8px",
  },
};

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  background: "Background",
  surface: "Surface",
  surfaceHover: "Surface Hover",
  border: "Border",
  primary: "Primary",
  primaryHover: "Primary Hover",
  text: "Text",
  textSecondary: "Text Secondary",
  success: "Success",
  error: "Error",
  warning: "Warning",
};

export function ThemeConfigPanel() {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_DARK_THEME);
  const [activePreset, setActivePreset] = useState<string>("dark");
  const [saved, setSaved] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("agent-framework-theme");
    const savedPreset = localStorage.getItem("agent-framework-theme-preset");
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setTheme(parsed);
        if (savedPreset) {
          setActivePreset(savedPreset);
        }
      } catch {
        // Invalid JSON, use defaults
      }
    }
    // Apply theme on load
    applyTheme(savedTheme ? JSON.parse(savedTheme) : DEFAULT_DARK_THEME);
  }, []);

  const applyTheme = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    root.style.setProperty("--border-radius", themeConfig.borderRadius);
  };

  const handlePresetChange = (presetName: string) => {
    const preset = PRESET_THEMES[presetName];
    if (preset) {
      setTheme(preset);
      setActivePreset(presetName);
      applyTheme(preset);
    }
  };

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        [colorKey]: value,
      },
    };
    setTheme(newTheme);
    setActivePreset("custom");
    applyTheme(newTheme);
  };

  const handleBorderRadiusChange = (value: string) => {
    const newTheme = {
      ...theme,
      borderRadius: value,
    };
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSave = () => {
    localStorage.setItem("agent-framework-theme", JSON.stringify(theme));
    localStorage.setItem("agent-framework-theme-preset", activePreset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setTheme(DEFAULT_DARK_THEME);
    setActivePreset("dark");
    applyTheme(DEFAULT_DARK_THEME);
  };

  return (
    <div className="rounded-lg border p-6 space-y-6">
      {/* Preset Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Theme Preset</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(PRESET_THEMES).map((presetName) => (
            <button
              key={presetName}
              onClick={() => handlePresetChange(presetName)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                activePreset === presetName
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {presetName}
            </button>
          ))}
          {activePreset === "custom" && (
            <button
              disabled
              className="px-4 py-2 rounded-lg border text-sm font-medium border-purple-500 bg-purple-50 text-purple-700"
            >
              Custom
            </button>
          )}
        </div>
      </div>

      {/* Color Customization */}
      <div>
        <label className="block text-sm font-medium mb-2">Colors</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Object.keys(theme.colors) as (keyof ThemeColors)[]).map(
            (colorKey) => (
              <div key={colorKey} className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.colors[colorKey]}
                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <div>
                  <p className="text-xs font-medium">{COLOR_LABELS[colorKey]}</p>
                  <p className="text-xs text-gray-500">
                    {theme.colors[colorKey]}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Border Radius: {theme.borderRadius}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={parseInt(theme.borderRadius)}
          onChange={(e) => handleBorderRadiusChange(`${e.target.value}px`)}
          className="w-full"
        />
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">Preview</label>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius,
          }}
        >
          <div
            className="p-4 rounded-lg mb-4"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius,
            }}
          >
            <h3 style={{ color: theme.colors.text, marginBottom: "8px" }}>
              Preview Card
            </h3>
            <p style={{ color: theme.colors.textSecondary, fontSize: "14px" }}>
              This is how your theme will look.
            </p>
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: "#fff",
                padding: "8px 16px",
                borderRadius: theme.borderRadius,
                marginTop: "12px",
                border: "none",
              }}
            >
              Primary Button
            </button>
          </div>
          <div className="flex gap-2">
            <span
              style={{
                backgroundColor: theme.colors.success,
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              Success
            </span>
            <span
              style={{
                backgroundColor: theme.colors.error,
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              Error
            </span>
            <span
              style={{
                backgroundColor: theme.colors.warning,
                color: "#000",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              Warning
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {saved ? "Saved!" : "Save Theme"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
