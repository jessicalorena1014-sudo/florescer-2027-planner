import { useEffect, useState } from "react";

const PREFIX = "florescer-2027:";

export function useLocalState<T>(key: string, initial: T) {
  const fullKey = PREFIX + key;
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(fullKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch {
      /* ignore quota */
    }
  }, [fullKey, value]);

  return [value, setValue] as const;
}

export function useTheme() {
  const [theme, setTheme] = useLocalState<"light" | "dark">("theme", "light");
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return { theme, setTheme, toggle: () => setTheme(theme === "light" ? "dark" : "light") };
}
