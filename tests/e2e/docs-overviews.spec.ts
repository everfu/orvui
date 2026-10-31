import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 1234 } }),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" ||
      /hydration|mismatch/i.test(message.text())
    )
      errors.push(message.text());
  });
  (page as typeof page & { overviewErrors: string[] }).overviewErrors = errors;
});
test.afterEach(async ({ page }) =>
  expect(
    (page as typeof page & { overviewErrors: string[] }).overviewErrors,
  ).toEqual([]),
);

test("Components tab opens the grouped catalog with working jumps, help and search", async ({
  page,
}) => {
  await page.goto("/guide");
  await expect(page.locator(".github-control").first()).toHaveText("1.2k");
  await page
    .locator(".docs-section-tabs")
    .getByRole("link", { name: "组件", exact: true })
    .click();
  await expect(page).toHaveURL(/\/components$/);
  await expect(page.locator(".docs-catalog-card")).toHaveCount(110);
  await expect(page.locator(".catalog-jump-link")).toHaveCount(10);
  await expect(page.locator(".docs-catalog-card").first()).toBeInViewport({
    ratio: 0.2,
  });
  await expect(page.locator(".docs-catalog-counts")).toContainText(
    "110 个组件",
  );
  await page
    .locator(".catalog-jump-links")
    .getByRole("link", { name: "表单与选择", exact: false })
    .click();
  await expect(page).toHaveURL(/#forms$/);
  await expect(page.locator("#forms h2")).toBeInViewport();
  const help = page.locator("#choosing-components .catalog-help-trigger");
  await expect(help).toHaveAttribute("aria-expanded", "false");
  await help.focus();
  await help.press("Enter");
  await expect(help).toHaveAttribute("aria-expanded", "true");
  await page
    .locator(".docs-catalog-header")
    .getByRole("button", { name: "搜索文档", exact: true })
    .click();
  await page.getByPlaceholder("搜索组件…").fill("Switch");
  await page.getByPlaceholder("搜索组件…").press("Enter");
  await expect(page).toHaveURL(/\/components\/motion\/switch$/);
});

test("Templates tab leads with real previews and independent live demos", async ({
  page,
}) => {
  await page.goto("/components");
  await expect(page.locator(".github-control").first()).toHaveText("1.2k");
  await page
    .locator(".docs-section-tabs")
    .getByRole("link", { name: "模板", exact: true })
    .click();
  await expect(page).toHaveURL(/\/templates$/);
  await expect(page.locator(".template-gallery-card")).toHaveCount(5);
  await expect(
    page.locator(".template-gallery-card img").first(),
  ).toBeInViewport({
    ratio: 0.2,
  });
  await expect
    .poll(() =>
      page
        .locator(".template-gallery-card img")
        .first()
        .evaluate((el) => (el as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.locator("a[download]")).toHaveCount(0);
  await expect(
    page.locator('.template-gallery-actions a[target="_blank"]'),
  ).toHaveCount(5);
  await expect(page.locator(".docs-sidebar")).toHaveCount(0);
  await expect(page.locator(".template-source-status")).toHaveCount(5);
  await expect(page.locator(".template-source-status").first()).toHaveText(
    "暂未开放源码",
  );
  await expect(
    page.getByRole("link", { name: "查看详情", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("#choosing-template, #start-building")).toHaveCount(
    0,
  );
  await page
    .context()
    .route("https://orvui-template-dashboard.netlify.app/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>Demo preview</title><h1>Demo preview</h1>",
      }),
    );
  const preview = page.locator("a.template-screenshot-link").first();
  await preview.focus();
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.keyboard.press("Enter"),
  ]);
  await expect(popup).toHaveURL(
    "https://orvui-template-dashboard.netlify.app/?lang=zh",
  );
  await popup.close();
  await expect(page).toHaveURL(/\/templates$/);
});

test("overview first view fits desktop, tablet and mobile in both languages and appearances", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Matrix sets its own viewport.");
  test.setTimeout(120000);
  for (const width of [1440, 1280, 1024, 768, 390])
    for (const en of [false, true]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(
        ({ theme }) => localStorage.setItem("orvui-theme", theme),
        { theme: en ? "light" : "dark" },
      );
      for (const path of ["components", "templates"]) {
        await page.goto(`${en ? "/en" : ""}/${path}`);
        await expect(page.locator(".github-control").first()).toHaveText(
          "1.2k",
        );
        await expect(page.locator(".docs-catalog-header h1")).toBeVisible();
        const item = page
          .locator(
            path === "templates"
              ? ".template-gallery-card img"
              : ".docs-catalog-card",
          )
          .first();
        await expect(item).toBeInViewport({ ratio: 0.2 });
        if (path === "templates")
          await expect
            .poll(() =>
              item.evaluate((el) => (el as HTMLImageElement).naturalWidth),
            )
            .toBeGreaterThan(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `artifacts/reports/docs-overviews/${width}-${en ? "en-light" : "zh-dark"}-${path}.png`,
          animations: "disabled",
        });
      }
    }
});
