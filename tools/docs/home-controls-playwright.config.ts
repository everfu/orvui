import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import base from "./home-playwright.config";

export default defineConfig({
  ...base,
  testMatch: "home-controls.spec.ts",
  outputDir: "../../artifacts/reports/home-controls/browser",
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile: fileURLToPath(
          new URL(
            "../../artifacts/reports/home-controls/browser.json",
            import.meta.url,
          ),
        ),
      },
    ],
  ],
});
