import { useEffect, useMemo, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "onyx-theme";
const THEME_VALUES: ThemePreference[] = ["light", "dark", "system"];

const isThemePreference = (value: string | null): value is ThemePreference =>
  value !== null && THEME_VALUES.includes(value as ThemePreference);

const getStoredTheme = (): ThemePreference => {
  if (typeof window === "undefined") return "system";

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  return isThemePreference(storedValue) ? storedValue : "system";
};

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (preference: ThemePreference) => {
  if (typeof document === "undefined") return;

  const resolvedTheme = preference === "system" ? getSystemTheme() : preference;
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
};

export function useTheme() {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(getStoredTheme);

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    themePreference === "system" ? getSystemTheme() : themePreference,
  );

  useEffect(() => {
    applyTheme(themePreference);

    if (themePreference === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, themePreference);
    }

    setResolvedTheme(
      themePreference === "system" ? getSystemTheme() : themePreference,
    );
  }, [themePreference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      setResolvedTheme(
        themePreference === "system" ? getSystemTheme() : themePreference,
      );
      applyTheme(themePreference);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [themePreference]);

  return useMemo(
    () => ({ themePreference, resolvedTheme, setThemePreference }),
    [themePreference, resolvedTheme],
  );
}
