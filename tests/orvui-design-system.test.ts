import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import frozenPalettes from "./fixtures/orvui-theme-colors.json";
import {
  THEMES,
  THEME_LIST,
  themeExportCss,
  type ColorTheme,
} from "../packages/vue/src/theme/palettes";
import { designSystemCss } from "../packages/vue/src/theme/stylesheet";

const source = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("orvui shared palette and source visual baseline", () => {
  it("retains all eleven inherited palettes against the pre-migration source backup", () => {
    // Frozen before the naming migration; retain its original labels and color values.
    expect(
      createHash("sha256").update(JSON.stringify(frozenPalettes)).digest("hex"),
    ).toBe("184b835752ac5660a0bcd4633af73b82892cfead8729c22ae5f98711d5031b20");
    expect(THEME_LIST.map((theme) => theme.id)).toEqual(
      Object.keys(frozenPalettes),
    );
    for (const [id, frozen] of Object.entries(frozenPalettes)) {
      const current = THEMES[id as ColorTheme];
      expect(current.name).toBe(id === "default" ? "orvui" : frozen.name);
      expect(current.swatch).toBe(frozen.swatch);
      for (const mode of ["light", "dark"] as const) {
        for (const [token, color] of Object.entries(frozen[mode])) {
          expect(current[mode][token], `${id}/${mode}/${token}`).toBe(color);
        }
      }
    }
  });

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

  it("keeps the original Tailwind geometry and source component shapes", () => {
    const css = designSystemCss();
    expect(css).not.toMatch(
      /--(?:spacing|radius-[\w-]+|shadow-[\w-]+|font-weight-[\w-]+):/,
    );
    expect(css).not.toContain("--orvui-radius-");
    expect(css).toContain("var(--font-geist-sans, Geist)");
    expect(css).toContain('var(--font-geist-mono, "Geist Mono")');
    const button = source("packages/vue/src/motion/button/src/Button.vue");
    expect(button).toContain('sm: "h-8 px-3 text-xs gap-1.5 rounded-full"');
    expect(button).toContain('md: "h-10 px-5 text-sm gap-2 rounded-full"');
    expect(button).toContain('lg: "h-12 px-6 text-base gap-2 rounded-full"');
    expect(source("packages/vue/src/motion/input/src/Input.vue")).toContain(
      "relative h-11 overflow-hidden rounded-full",
    );
    expect(source("packages/vue/src/motion/card/src/Card.vue")).toContain(
      "relative flex flex-col rounded-2xl",
    );
    expect(
      source(
        "packages/vue/src/motion/center-morph-modal/src/CenterMorphModalContent.vue",
      ),
    ).toContain("rounded-[30px]");
    expect(
      source("packages/vue/src/motion/select/src/SelectTrigger.vue"),
    ).toContain('["12px", "0px", "0px", "12px"]');
  });
});

it("preserves every frozen token value in all eleven light and dark palettes", async () => {
  const contract = (await import("./fixtures/orvui-palette-contract.json")).default;
  expect(THEMES).toEqual(contract);
});
