import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

export default defineConfig({
  testDir: "../../tests/e2e",
  testMatch: ["docs-nuxt.spec.ts", "home-showcase.spec.ts"],
  outputDir: "../../artifacts/reports/docs-nuxt/browser",
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile:
          process.env.ORVUI_DOCS_BROWSER_REPORT ??
          fileURLToPath(
            new URL(
              "../../artifacts/reports/docs-nuxt/browser.json",
              import.meta.url,
            ),
          ),
      },
    ],
  ],
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: process.env.ORVUI_NUXT_URL ?? "http://127.0.0.1:5174",
    browserName: "chromium",
    permissions: ["clipboard-read", "clipboard-write"],
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
