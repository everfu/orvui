import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 0 } }),
  );
  await page.addInitScript(() => localStorage.setItem("orvui-theme", "dark"));
});

test("hero link uses the button spring and keeps localized navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/");
  await expect(page.locator(".home-showcase")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const link = page.getByRole("link", { name: "Get started", exact: true });
  await expect(link).toHaveAttribute("href", "/en/guide");
  const scale = () =>
    link.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
  await link.hover();
  await expect.poll(scale).toBeGreaterThan(1.01);
  await page.mouse.down();
  await expect.poll(scale).toBeLessThan(0.96);
  // Release off the link to observe recovery without navigating.
  await page.mouse.move(2, 2);
  await page.mouse.up();
  await expect.poll(scale).toBeCloseTo(1, 2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/guide$/);
  await expect(page.locator(".home-palette")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("real color selector supports ring motion, keyboard, touch and reduced motion", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" ||
      /hydration|mismatch/i.test(message.text())
    )
      errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const response = await page.goto("/");
  const ssr = await response!.text();
  expect(ssr).toContain('data-palette="default"');
  expect(ssr).toContain('type="radio"');
  await expect(page.locator(".home-showcase")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const palette = page.getByRole("group", { name: "展台配色", exact: true });
  await expect(palette.getByRole("radio")).toHaveCount(11);
  const ring = palette.locator("[data-color-selection]");
  await expect(ring).toBeVisible();
  const initial = await ring.boundingBox();
  const violet = palette.locator('label:has([data-palette="violet"])');
  if (info.project.use.isMobile) await violet.tap();
  else await violet.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "violet");
  await expect(palette.locator('[data-palette="violet"]')).toBeChecked();
  await expect
    .poll(async () => {
      const bounds = await ring.boundingBox();
      const target = await violet.locator(":scope > span").boundingBox();
      return (
        Math.abs(bounds!.x - target!.x + 4) +
        Math.abs(bounds!.y - target!.y + 4)
      );
    })
    .toBeLessThan(1);
  const final = await ring.boundingBox();
  expect(
    Math.hypot(final!.x - initial!.x, final!.y - initial!.y),
  ).toBeGreaterThan(20);
  await expect(page.locator("html")).toHaveClass(/dark/);
  await palette.locator('[data-palette="violet"]').focus();
  await page.keyboard.press("ArrowRight");
  const selected = palette.locator("input:checked");
  expect(await selected.getAttribute("data-palette")).not.toBe("violet");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await palette.locator('label:has([data-palette="teal"])').click();
  await expect(palette.locator('[data-palette="teal"]')).toBeChecked();
  const geometry = await palette.locator("label").evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        width: box.width,
        height: box.height,
      };
    }),
  );
  const viewportWidth = await page.evaluate(() => innerWidth);
  expect(
    geometry.every(
      (box) =>
        box.width === 44 &&
        box.height === 44 &&
        box.left >= 0 &&
        box.right <= viewportWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator(".home-showcase-toolbar").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `artifacts/reports/home-controls/${info.project.name}.png`,
  });
  expect(errors).toEqual([]);
});
