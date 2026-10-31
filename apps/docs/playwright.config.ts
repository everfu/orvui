import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const home = "home-*.spec.ts";
const effects = "component-effects.spec.ts";
const desktop = { viewport: { width: 1440, height: 1000 } };
const mobile = {
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
};

export default defineConfig({
  testDir: "../../tests/e2e",
  testMatch: "**/*.spec.ts",
  outputDir: "../../artifacts/reports/browser/results",
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: resolve(
          root,
          process.env.ORVUI_DOCS_BROWSER_REPORT ??
            "artifacts/reports/browser/results.json",
        ),
      },
    ],
  ],
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: process.env.ORVUI_NUXT_URL ?? "http://127.0.0.1:3000",
    browserName: "chromium",
    permissions: ["clipboard-read", "clipboard-write"],
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", testIgnore: [home, effects], use: desktop },
    { name: "mobile", testIgnore: [home, effects], use: mobile },
    ...[
      { name: "home-desktop", use: { viewport: { width: 1440, height: 900 } } },
      { name: "home-tablet", use: { viewport: { width: 768, height: 1024 } } },
      { name: "home-mobile", use: mobile },
    ].map((project) => ({
      ...project,
      testMatch: home,
      timeout: 90000,
      expect: { timeout: 10000 },
    })),
    ...[
      { name: "effects-desktop", use: desktop },
      { name: "effects-mobile", use: mobile },
    ].map((project) => ({
      ...project,
      testMatch: effects,
      timeout: 60000,
      use: { ...project.use, reducedMotion: "no-preference" as const },
    })),
  ],
});
