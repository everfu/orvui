import { expect, test, type Page } from "@playwright/test";
import { fileURLToPath } from "node:url";

async function visitDocs(page: Page, href: string) {
  await page.goto(href);
  // The mocked statistics arrive after the shell mounts; SSR buttons can be visible earlier.
  await expect(page.locator(".github-control").first()).toHaveText("1.2k");
}

async function openSettings(page: Page) {
  if (await page.locator(".desktop-header-settings").isVisible()) return;
  const toggle = page.getByRole("button", {
    name: /^(打开导航|Open navigation)$/,
  });
  if ((await toggle.getAttribute("aria-expanded")) === "true") {
    await expect(page.locator(".mobile-header-settings")).toBeVisible();
    return;
  }
  // A route change closes the old sheet; its exit must finish before reopening.
  await expect(page.locator(".mobile-header-settings")).toHaveCount(0);
  await toggle.click();
  await expect(page.locator(".mobile-header-settings")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({
      json: { stargazers_count: 1234 },
    }),
  );
  // The wallet demo's remote avatar is decoration, not part of these flows.
  // Keep browser acceptance self-contained when the network is unavailable.
  await page.route(
    "https://api.dicebear.com/9.x/glass/svg?seed=main",
    (route) =>
      route.fulfill({
        path: fileURLToPath(
          new URL("../../apps/docs/public/favicon.svg", import.meta.url),
        ),
        contentType: "image/svg+xml",
      }),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const expected404 =
      message.location().url.includes("/missing-nuxt-page") &&
      /404/.test(message.text());
    if (
      !expected404 &&
      (message.type() === "error" || /hydration|mismatch/i.test(message.text()))
    )
      errors.push(message.text());
  });
  await page.addInitScript(() => localStorage.setItem("orvui-theme", "dark"));
  // Check errors after each interaction flow, including hydration warnings.
  (page as typeof page & { docsErrors: string[] }).docsErrors = errors;
});

test("documentation typography and code frames fit desktop and mobile", async ({
  page,
}, info) => {
  await visitDocs(page, "/docs/theme");
  await expect(page.locator("#overview h1")).toBeVisible();
  const panel = page.locator(".code-panel").first();
  await expect(panel.locator(".code-file-header")).toBeVisible();
  await expect(panel.locator(".code-language")).toHaveCount(0);
  await expect(panel.locator(".code-body")).toHaveCSS("border-radius", "12px");
  await expect(panel.locator(".code-content")).toHaveCSS("font-size", "13px");
  await expect(panel.locator(".code-content")).toHaveCSS("line-height", "20px");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `artifacts/reports/docs-nuxt/${info.project.name}-theme.png`,
    animations: "disabled",
  });
  await visitDocs(page, "/components/motion/button");
  await expect(page.locator("#docs-content h1")).toHaveText("Button");
  await expect(
    page.getByRole("heading", { name: "API 参考", exact: true }),
  ).toHaveCount(1);
  const order = await page
    .locator("#docs-content")
    .evaluate((el) => [...el.querySelectorAll("h2")].map((h) => h.textContent));
  expect(order.indexOf("适用场景")).toBeLessThan(order.indexOf("安装"));
  await page.screenshot({
    path: `artifacts/reports/docs-nuxt/${info.project.name}-button.png`,
    animations: "disabled",
  });
});

test.afterEach(async ({ page }) => {
  expect((page as typeof page & { docsErrors: string[] }).docsErrors).toEqual(
    [],
  );
});

test("hydrates a component and preserves query/hash during client language navigation", async ({
  page,
}) => {
  await visitDocs(page, "/components/motion/switch?example=1#default");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const control = page.getByRole("switch", {
    name: "Activity notifications",
    exact: true,
  });
  await expect(control).toBeChecked();
  await control.click();
  await expect(control).not.toBeChecked();
  await page.evaluate(() => {
    Object.assign(window, {
      orvuiNavigationMarker: "same-document",
      orvuiHeader: document.querySelector(".site-header"),
    });
  });
  await openSettings(page);
  await page.getByRole("button", { name: "选择语言，当前：简体中文" }).click();
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(
    /\/en\/components\/motion\/switch\?example=1#default$/,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("Switch | orvui");
  // The page owns demo state, while the shared header survives navigation.
  await expect(control).toBeChecked();
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { orvuiHeader?: Element }).orvuiHeader ===
        document.querySelector(".site-header"),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { orvuiNavigationMarker?: string })
          .orvuiNavigationMarker,
    ),
  ).toBe("same-document");
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await page.goForward();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(control).toBeChecked();
});

test("search selects a component and cleans up its overlay", async ({
  page,
}) => {
  await visitDocs(page, "/guide");
  await page.getByRole("button", { name: "搜索组件", exact: true }).click();
  const input = page.getByPlaceholder("搜索组件…");
  await input.fill("Switch");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/components\/motion\/switch$/);
  await expect(page.locator("#docs-content h1")).toHaveText("Switch");
  await expect(input).not.toBeVisible();
  expect(
    await page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).overflow),
  ).not.toBe("hidden");
});

test("loads usage/source and copies actual component code", async ({
  page,
}) => {
  await visitDocs(page, "/en/components/motion/switch");
  await page.getByRole("tab", { name: "Usage", exact: true }).first().click();
  await expect(page.locator(".code-panel").first()).toContainText("Switch");
  await page.getByRole("tab", { name: "Code", exact: true }).first().click();
  const panel = page.locator("[role=tabpanel]:visible .code-panel").first();
  await expect(panel).toContainText("defineProps");
  await panel.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("defineProps");
  await page.getByRole("tab", { name: "Preview", exact: true }).first().click();
  await expect(
    page.getByRole("switch", { name: "Activity notifications", exact: true }),
  ).toBeVisible();
});

test("opens all eleven palettes and closes the anchored panel by keyboard", async ({
  page,
}) => {
  await visitDocs(page, "/guide");
  await page.getByRole("button", { name: "自定义主题", exact: true }).click();
  await expect(page.locator("[data-theme-option]")).toHaveCount(11);
  await page.getByRole("button", { name: "蓝色", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "blue");
  await page.keyboard.press("Escape");
  await expect(page.locator(".theme-popover")).not.toBeVisible();
});

test("keeps light appearance and normal motion working across client navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await visitDocs(page, "/en/components/motion/switch");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await openSettings(page);
  await page.getByRole("tab", { name: "Light theme", exact: true }).click();
  if (await page.locator(".mobile-header-settings").isVisible())
    await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  await page
    .getByRole("button", { name: "Expand preview", exact: true })
    .first()
    .click();
  await expect(page.locator(".example-section.is-expanded")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".example-section.is-expanded")).toHaveCount(0);
  await openSettings(page);
  await page
    .getByRole("button", { name: "Choose language, current: English" })
    .click();
  await page.getByRole("link", { name: "简体中文", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/motion\/switch$/);
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
});

test("four-category demos respond and expanded preview releases its overlay", async ({
  page,
}) => {
  await visitDocs(page, "/en/components/blocks/wallet-card");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const hide = page.getByRole("button", { name: "Hide balance", exact: true });
  await hide.click();
  await expect(
    page.getByRole("button", { name: "Show balance", exact: true }),
  ).toBeVisible();
  await visitDocs(page, "/en/components/agents/tool-result");
  await expect(page.locator(".demo-content").first()).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const disclosure = page
    .locator(".demo-content button[aria-expanded]")
    .first();
  const before = await disclosure.getAttribute("aria-expanded");
  await disclosure.click();
  await expect(disclosure).toHaveAttribute(
    "aria-expanded",
    before === "true" ? "false" : "true",
  );
  await visitDocs(page, "/en/charts/donut-chart");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await page
    .locator(".demo-content button")
    .filter({ hasText: "Team" })
    .first()
    .click();
  await expect(page.locator(".demo-content")).toContainText(
    "Filtering by Team",
  );
  await visitDocs(page, "/en/components/motion/switch");
  await page
    .getByRole("button", { name: "Expand preview", exact: true })
    .first()
    .click();
  await expect(page.locator(".example-section.is-expanded")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".example-section.is-expanded")).toHaveCount(0);
  expect(
    await page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).overflow),
  ).not.toBe("hidden");
});

test("responsive geometry, mobile navigation and localized 404 recovery", async ({
  page,
}, info) => {
  await visitDocs(page, "/guide");
  await expect(page.locator(".site-header")).toHaveCSS("height", "56px");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "打开导航", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "安装指南", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/installation$/);
    await expect(page.getByRole("dialog")).not.toBeVisible();
  } else {
    await expect(page.locator(".docs-sidebar")).toHaveCSS("width", "240px");
    await expect(page.locator(".docs-resources")).toHaveCSS("width", "320px");
  }
  await page.screenshot({
    path: `artifacts/reports/docs-nuxt/${info.project.name}.png`,
    fullPage: false,
    animations: "disabled",
  });
  const response = await page.goto("/en/missing-nuxt-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Page not found", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Back home", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator(".hero-count")).toBeVisible();
});

test("long code expands, scrolls and collapses with localized controls", async ({
  page,
}) => {
  await visitDocs(page, "/docs/theme");
  const panel = page.locator(".code-panel").filter({
    has: page.locator(".code-file-name", { hasText: "globals.css" }),
  });
  const expand = panel.getByRole("button", { name: "展开代码", exact: true });
  await expand.click();
  await expect(
    panel.getByRole("button", { name: "收起代码", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  const region = panel.getByRole("region");
  await region.focus();
  await region.press("End");
  await expect
    .poll(() => region.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  await panel.getByRole("button", { name: "收起代码", exact: true }).click();
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => region.evaluate((el) => el.scrollTop)).toBe(0);
});

test("header controls and palette match the compact layout and support keyboard dismissal", async ({
  page,
}, info) => {
  await visitDocs(page, "/guide");
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-header-default.png`,
    animations: "disabled",
  });
  const theme = page.getByRole("button", { name: "自定义主题", exact: true });
  await theme.click();
  const panel = page.locator(".theme-popover");
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS("width", "248px");
  await expect(panel).toHaveCSS("border-radius", "24px");
  await expect(panel.locator("[data-theme-option]")).toHaveCount(11);
  const bounds = await panel.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(12);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
    page.viewportSize()!.width - 12,
  );
  await expect(panel.locator('[data-theme-id="default"]')).toBeFocused();
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-theme-default.png`,
    animations: "disabled",
  });
  await page.keyboard.press("ArrowRight");
  await expect(panel.locator('[data-theme-id="violet"]')).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "violet");
  await panel.getByRole("button", { name: "复制 CSS", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain(":root");
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-theme.png`,
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await expect(theme).toBeFocused();
  await theme.click();
  await expect(
    panel.getByRole("button", { name: "紫罗兰", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await openSettings(page);
  const language = page.getByRole("button", {
    name: "选择语言，当前：简体中文",
    exact: true,
  });
  await language.click();
  const menu = page.locator(".language-panel");
  await expect(menu).toHaveCSS("width", "220px");
  await expect(menu.locator(".language-option")).toHaveText([
    "English",
    "简体中文",
  ]);
  await expect(menu.locator("[aria-current=page]")).toHaveText("简体中文");
  await expect(menu.locator("[aria-current=page]")).toBeFocused();
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-language.png`,
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await expect(language).toBeFocused();
  const repository = page.getByRole("link", {
    name: "在 GitHub 查看 orvui，1234 颗星",
    exact: true,
  });
  await expect(repository).toHaveAttribute(
    "href",
    "https://github.com/everfu/orvui",
  );
  await expect(repository).toHaveText("1.2k");
  if (await page.locator(".mobile-header-settings").isVisible())
    await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "搜索组件", exact: true }).click();
  const search = page.locator(".site-search-panel");
  await expect(search.getByRole("option")).toHaveCount(5);
  await expect(search).toHaveCSS("border-radius", "12px");
  const searchBounds = await search.boundingBox();
  expect(searchBounds!.y).toBeCloseTo(
    info.project.name === "mobile"
      ? 16
      : Math.max(16, page.viewportSize()!.height / 2 - 250),
    0,
  );
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-search.png`,
    animations: "disabled",
  });
  const input = search.getByRole("combobox");
  await input.fill("no-such-orvui-component-123");
  await expect(search.getByRole("status")).toHaveText("没有找到结果。");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "搜索组件", exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-header.png`,
    animations: "disabled",
  });
  await openSettings(page);
  await page.getByRole("tab", { name: "浅色", exact: true }).click();
  if (await page.locator(".mobile-header-settings").isVisible())
    await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-header-light.png`,
    animations: "disabled",
  });
  await openSettings(page);
  await page
    .getByRole("button", { name: "选择语言，当前：简体中文", exact: true })
    .click();
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/guide$/);
  await page.screenshot({
    path: `artifacts/reports/heroui-header/${info.project.name}-header-english.png`,
    animations: "disabled",
  });
});
