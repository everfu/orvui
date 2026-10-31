export type Appearance = "light" | "dark" | "system";

export function appearance(value: unknown): Appearance | undefined {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : undefined;
}

/** Migrate a valid legacy preference without overriding a newer choice. */
export function readStoredAppearance(
  storage?: Pick<Storage, "getItem" | "setItem">,
): Appearance {
  const valid = (value: unknown): value is Appearance =>
    value === "light" || value === "dark" || value === "system";
  let current: string | null | undefined;
  try {
    current = storage?.getItem("orvui-theme");
  } catch {
    /* Storage can be unavailable even when the browser exposes it. */
  }
  if (valid(current)) return current;
  let legacy: string | null | undefined;
  try {
    legacy = storage?.getItem("iui-theme");
  } catch {
    /* Keep the deterministic default when storage cannot be read. */
  }
  if (!valid(legacy)) return "dark";
  try {
    storage?.setItem("orvui-theme", legacy);
  } catch {
    /* A blocked migration still preserves the preference for this visit. */
  }
  return legacy;
}

// Serializing the same self-contained reader keeps pre-hydration and Vue in sync.
export const appearanceBootstrap = `(() => {
  const read = ${readStoredAppearance.toString()};
  let storage;
  try { storage = window.localStorage; } catch {}
  const theme = read(storage);
  document.documentElement.classList.toggle('dark', theme === 'dark' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
})();`;
