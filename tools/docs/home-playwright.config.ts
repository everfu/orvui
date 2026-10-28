import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  testMatch: "home-showcase.spec.ts",
  timeout: 90000,
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  expect: { timeout: 10000 },
  outputDir: "../../artifacts/reports/home-showcase/browser",
  reporter: [
    ["list"],
    ["json", { outputFile: fileURLToPath(new URL("../../artifacts/reports/home-showcase/browser.json", import.meta.url)) }],
  ],
});
