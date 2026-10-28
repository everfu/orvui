import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import base from "./home-playwright.config";

export default defineConfig({
  ...base,
  testMatch: "home-scene-motion.spec.ts",
  outputDir: "../../artifacts/reports/scene-motion/browser",
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: fileURLToPath(
          new URL(
            "../../artifacts/reports/scene-motion/browser.json",
            import.meta.url,
          ),
        ),
      },
    ],
  ],
  use: { ...base.use, reducedMotion: "no-preference" },
});
