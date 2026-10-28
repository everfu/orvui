import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import base from "./playwright.config";
export default defineConfig(base, {
  testMatch: ["component-effects.spec.ts"],
  timeout: 60000,
  outputDir: "../../artifacts/reports/component-audit/browser",
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: fileURLToPath(
          new URL(
            "../../artifacts/reports/component-audit/interactions.json",
            import.meta.url,
          ),
        ),
      },
    ],
  ],
  projects: [
    {
      name: "desktop",
      use: {
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "no-preference",
      },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: "no-preference",
      },
    },
  ],
});
