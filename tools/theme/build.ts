import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { designSystemCss } from "../../packages/vue/src/theme/stylesheet";
export { designSystemCss } from "../../packages/vue/src/theme/stylesheet";

export function buildDesignSystem(check = false): void {
  const target = fileURLToPath(
    new URL("../../packages/vue/src/tokens.css", import.meta.url),
  );
  const css = designSystemCss();
  if (check) {
    if (readFileSync(target, "utf8") !== css)
      throw new Error("orvui tokens.css is out of date; run pnpm theme:build.");
  } else writeFileSync(target, css);
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  buildDesignSystem(process.argv.includes("--check"));
}
