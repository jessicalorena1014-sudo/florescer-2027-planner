import { useEffect, useState } from "react";

/**
 * Returns true once the component has mounted on the client.
 * Use to gate UI that depends on `new Date()`, `localStorage`,
 * `window`, or other browser-only state to prevent SSR hydration mismatches.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
