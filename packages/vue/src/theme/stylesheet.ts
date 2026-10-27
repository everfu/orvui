import { themeExportCss, themesStylesheet } from "./palettes";
import { EASE_OUT, EASE_IN_OUT, EASE_DRAWER } from "../lib/ease";

const colorNames = ["border", "border-strong", "neon", "violet", "success", "warning", "background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "destructive", "input", "ring"];
export function designSystemCss(): string {
  const mappings = ["@theme inline {"];
  const curves = { out: EASE_OUT, "in-out": EASE_IN_OUT, drawer: EASE_DRAWER };
  for (const [name, values] of Object.entries(curves)) mappings.push(`  --ease-${name}: cubic-bezier(${values.join(", ")});`);
  for (const name of colorNames) mappings.push(`  --color-${name}: var(--${name});`);
  mappings.push('  --font-sans: var(--font-geist-sans, Geist), ui-sans-serif, system-ui, sans-serif;');
  mappings.push('  --font-mono: var(--font-geist-mono, "Geist Mono"), ui-monospace, monospace;');
  mappings.push('  --font-display: var(--font-geist-sans, Geist), ui-sans-serif, system-ui, sans-serif;', "}");
  return ["/* Generated from the orvui theme compatibility contract. */", themeExportCss("default"), themesStylesheet(), mappings.join("\n"), ""].join("\n\n");
}
