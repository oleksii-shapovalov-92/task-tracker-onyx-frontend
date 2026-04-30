import { useTheme, type ThemePreference } from "../../features/theme/useTheme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function ThemeToggle() {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();

  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50">
      <span aria-hidden>{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
      <span className="sr-only">Theme</span>

      <select
        value={themePreference}
        onChange={(event) =>
          setThemePreference(event.target.value as ThemePreference)
        }
        aria-label="Theme"
        className="cursor-pointer bg-transparent text-sm font-medium outline-none"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
