import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  THEMES,
  THEME_LIST,
  themeExportCss,
} from "../../packages/vue/src/theme/palettes";
import { designSystemCss } from "../../packages/vue/src/theme/stylesheet";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("orvui shared palette and source visual baseline", () => {
  it("exports self-contained themes, including existing glass and gradient extensions", () => {
    for (const { id } of THEME_LIST) {
      const css = themeExportCss(id);
      expect(css).toContain(":root {");
      expect(css).toContain(".dark {");
      expect(css).toContain("--glass-strong-bg:");
      expect(css).toContain("--gradient-accent:");
      expect(css).toContain("--border-strong:");
      expect(css).not.toContain("@import");
      for (const mode of ["light", "dark"] as const) {
        const block =
          mode === "light" ? css.split("\n\n")[0] : css.split("\n\n")[1];
        const vars = Object.fromEntries(
          [...block.matchAll(/(--[\w-]+): ([^;]+);/g)].map((match) => [
            match[1],
            match[2],
          ]),
        );
        const valueOf = (token: string): string => {
          const alias = /^var\((--[\w-]+)\)$/.exec(vars[token]);
          return alias ? valueOf(alias[1]) : vars[token];
        };
        for (const [token, color] of Object.entries(THEMES[id][mode])) {
          expect(valueOf(token), `${id}/${mode}/${token}`).toBe(color);
        }
      }
    }
  });

  it("preserves consumer overrides through the existing semantic aliases", () => {
    const css = themeExportCss("default");
    for (const [token, target] of Object.entries({
      "--input": "--border",
      "--ring": "--border-strong",
      "--popover": "--card",
      "--secondary": "--card",
      "--muted": "--card",
      "--card-foreground": "--foreground",
      "--popover-foreground": "--foreground",
      "--secondary-foreground": "--foreground",
      "--destructive": "--danger",
      "--accent-foreground": "--accent-fg",
    }))
      expect(css).toContain(`${token}: var(${target});`);
    // A colored theme's focus and contrasting text are not aliases to neutrals.
    expect(themeExportCss("violet")).toContain(
      `--ring: ${THEMES.violet.light["--ring"]};`,
    );
    expect(themeExportCss("violet")).toContain(
      `--accent-foreground: ${THEMES.violet.light["--accent-foreground"]};`,
    );
  });

  it("keeps the published token stylesheet in sync with the sole palette source", () => {
    const css = source("packages/vue/src/tokens.css");
    expect(css).toBe(designSystemCss());
    for (const { id } of THEME_LIST.filter(({ id }) => id !== "default")) {
      expect(css).toContain(`[data-theme="${id}"] {`);
      expect(css).toContain(`.dark[data-theme="${id}"] {`);
    }
    const fullStyles = source("packages/vue/src/styles.css");
    expect(fullStyles).toContain('@import "./tokens.css";');
    expect(fullStyles).not.toContain("--background:");
    expect(css).toContain("--color-primary: var(--primary)");
  });
});

it("preserves every frozen token value in all eleven light and dark palettes", async () => {
  const contract = (await import("../fixtures/orvui-palette-contract.json"))
    .default;
  expect(THEMES).toEqual(contract);
});
