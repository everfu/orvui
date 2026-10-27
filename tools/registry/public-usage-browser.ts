import data from "./public-usage.json";
import type { PublicUsageManifest } from "./public-usage-types";
/** Prebuilt source only: this module never loads Node APIs or the TS compiler. */
export const publicUsage = data as PublicUsageManifest;
export function usageFor(
  category: string,
  slug: string,
  variant = "default",
  mode: "package" | "registry" = "package",
) {
  const entry = publicUsage.entries[`${category}/${slug}`];
  const usage =
    variant === "default" ? entry?.default : entry?.variants[variant];
  if (!usage) return;
  if (mode === "registry" && !usage.registryCode)
    throw new Error(
      `Missing registry Usage for ${category}/${slug}/${variant}`,
    );
  return mode === "registry" ? { ...usage, code: usage.registryCode } : usage;
}
