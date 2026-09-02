import React, { createContext, useContext, useState, useEffect } from "react";

export const THEMES = {
  daylight: {
    id: "daylight",
    name: "Daylight Indigo",
    emoji: "☀️",
    description: "Clean, bright & friendly modern SaaS",
    primaryAccent: "#4f46e5",
    secondaryAccent: "#06b6d4",
    badgeColor: "#4f46e5",
    previewColor: "#ffffff",
    accentGlow: "rgba(79, 70, 229, 0.15)",
    isLight: true,
  },
  sage: {
    id: "sage",
    name: "Warm Sage & Ivory",
    emoji: "🌿",
    description: "Natural, calm, warm organic tones",
    primaryAccent: "#059669",
    secondaryAccent: "#10b981",
    badgeColor: "#059669",
    previewColor: "#fbfbfa",
    accentGlow: "rgba(5, 150, 105, 0.15)",
    isLight: true,
  },
  sunset: {
    id: "sunset",
    name: "Sunset Coral & Amber",
    emoji: "🌅",
    description: "Warm cream, friendly coral & golden honey",
    primaryAccent: "#e11d48",
    secondaryAccent: "#f59e0b",
    badgeColor: "#e11d48",
    previewColor: "#fffbf7",
    accentGlow: "rgba(225, 29, 72, 0.15)",
    isLight: true,
  },
  dusk: {
    id: "dusk",
    name: "Calm Evening Slate",
    emoji: "🌙",
    description: "Soft muted dusk slate for easy night reading",
    primaryAccent: "#818cf8",
    secondaryAccent: "#34d399",
    badgeColor: "#818cf8",
    previewColor: "#0f172a",
    accentGlow: "rgba(129, 140, 248, 0.2)",
    isLight: false,
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("nexfin_human_theme") || "daylight";
  });

  const setTheme = (newTheme) => {
    if (THEMES[newTheme]) {
      setThemeState(newTheme);
      localStorage.setItem("nexfin_human_theme", newTheme);
    }
  };

  const cycleTheme = () => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  useEffect(() => {
    const root = document.documentElement;
    Object.keys(THEMES).forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });
    root.classList.add(`theme-${theme}`);

    // Quick keyboard shortcut (Alt + T / Option + T) to cycle theme
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        cycleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme]);

  const currentTheme = THEMES[theme] || THEMES.daylight;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, currentTheme, allThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
