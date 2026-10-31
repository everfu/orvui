import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "../..");
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve(root, "artifacts/browsers");
const { chromium, expect } = await import("@playwright/test");
const manifest = JSON.parse(
  readFileSync(
    resolve(root, "apps/docs/public/templates/manifest.json"),
    "utf8",
  ),
);
const previewUrls = JSON.parse(process.env.ORVUI_TEMPLATE_PREVIEW_URLS || "{}");
const reports = resolve(root, "artifacts/reports/templates");
mkdirSync(reports, { recursive: true });
const browser = await chromium.launch({
  proxy: process.env.ORVUI_VERIFY_PROXY
    ? { server: process.env.ORVUI_VERIFY_PROXY }
    : undefined,
});
const results = [];
try {
  for (const template of manifest) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const result = { slug: template.slug, passed: false };
    try {
      for (const filename of ["source.json", "source.zip"])
        if (
          existsSync(
            resolve(
              root,
              "apps/docs/public/templates",
              template.slug,
              filename,
            ),
          )
        )
          throw new Error("Private source payload in public output");
      await page.goto(
        (previewUrls[template.slug] || template.previewUrl) +
          "?lang=zh&appearance=dark",
        { waitUntil: "networkidle" },
      );
      await expect(page.locator(".home-app-frame")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      if (process.argv.includes("--screenshots"))
        await page.screenshot({
          path: resolve(root, "apps/docs/public", template.screenshot.slice(1)),
          animations: "disabled",
          timeout: 15000,
        });
      await page.screenshot({
        path: resolve(reports, template.slug + "-desktop.png"),
        animations: "disabled",
        timeout: 15000,
      });
      for (const palette of [
        "default",
        "violet",
        "blue",
        "green",
        "amber",
        "blood-orange",
        "rose",
        "red",
        "teal",
        "indigo",
        "lime",
      ]) {
        await page
          .locator(".application-preferences select")
          .selectOption(palette);
        if (palette === "default")
          await expect(page.locator("html")).not.toHaveAttribute("data-theme");
        else
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            palette,
          );
      }
      await page
        .getByRole("button", { name: "切换明暗模式", exact: true })
        .click();
      await expect(page.locator("html")).not.toHaveClass(/dark/);
      await page.getByRole("button", { name: "切换语言", exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(
        page.getByRole("button", { name: "Toggle sidebar", exact: true }),
      ).toHaveAttribute("aria-expanded", "false");
      await page
        .getByRole("button", { name: "Toggle sidebar", exact: true })
        .click();
      await expect(page.locator("[data-mobile]")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
      await page.keyboard.press("Escape");
      await expect(page.locator("[data-mobile]")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      if (
        !(await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ))
      )
        throw new Error("Mobile page overflow");
      await page.screenshot({
        path: resolve(reports, template.slug + "-mobile.png"),
        animations: "disabled",
        timeout: 15000,
      });
      if (errors.length) throw new Error(errors.join("\n"));
      result.passed = true;
    } catch (error) {
      result.error = String(error);
    } finally {
      await context.close();
      results.push(result);
      console.log(JSON.stringify(result));
    }
  }
} finally {
  await browser.close();
  writeFileSync(
    resolve(reports, "summary.json"),
    JSON.stringify(results, null, 2) + "\n",
  );
}
if (results.some((result) => !result.passed)) process.exitCode = 1;
