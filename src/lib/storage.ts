import { useCallback, useEffect, useState } from "react";

const PREFIX = "florescer-2027:";
const EVENT = "florescer-2027:storage";

type StorageEvent = { key: string; value: unknown };

function readKey<T>(fullKey: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(fullKey);
    return raw ? (JSON.parse(raw) as T) : initial;
  } catch {
    return initial;
  }
}

export function useLocalState<T>(key: string, initial: T) {
  const fullKey = PREFIX + key;
  // Always start from `initial` on first render to avoid SSR/hydration mismatches.
  const [value, setValueState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount.
  useEffect(() => {
    setValueState(readKey<T>(fullKey, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  // Persist and broadcast to other hook instances using the same key.
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value));
      window.dispatchEvent(
        new CustomEvent<StorageEvent>(EVENT, { detail: { key: fullKey, value } }),
      );
    } catch {
      /* ignore quota */
    }
  }, [fullKey, value, hydrated]);

  // Listen for updates from other instances (same tab) and cross-tab storage events.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onLocal = (e: Event) => {
      const detail = (e as CustomEvent<StorageEvent>).detail;
      if (detail && detail.key === fullKey) {
        setValueState(detail.value as T);
      }
    };
    const onStorage = (e: globalThis.StorageEvent) => {
      if (e.key === fullKey && e.newValue) {
        try {
          setValueState(JSON.parse(e.newValue) as T);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener(EVENT, onLocal as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onLocal as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [fullKey]);

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    setValueState((prev) =>
      typeof next === "function" ? (next as (p: T) => T)(prev) : next,
    );
  }, []);

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
