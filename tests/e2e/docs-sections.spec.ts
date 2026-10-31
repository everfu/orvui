import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://orvui-template-*.netlify.app/**", route => route.fulfill({contentType:"text/html",body:'<!doctype html><script>parent.postMessage({type:"orvui:template-ready"},new URLSearchParams(location.search).get("parentOrigin"))</script><h1>Template preview fixture</h1>'}));
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 1234 } }),
  );
});
test("route tabs partition guides, components, templates and dated releases", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (/hydration|mismatch/i.test(message.text())) errors.push(message.text());
  });
  await page.goto("/guide");
  await expect(page.locator(".github-control").first()).toHaveText("1.2k");
  const tabs = page.locator(".docs-section-tabs");
  await expect(tabs.locator("a")).toHaveCount(4);
  await expect(tabs.locator('[aria-current="page"]')).toHaveText("引导");
  await expect(page.locator(".site-header")).toHaveCSS("height", "100px");
  await expect(
    page.locator('.docs-sidebar a[href="/components/motion/switch"]'),
  ).toHaveCount(0);
  await tabs.getByRole("link", { name: "组件", exact: true }).click();
  await expect(page).toHaveURL(/\/components$/);
  await expect(page.locator("#docs-content h1")).toHaveText("Vue 组件");
  await expect(page.locator(".docs-catalog-card")).toHaveCount(110);
  await expect(
    page.locator(".docs-sidebar [data-section=components]"),
  ).toHaveCount(1);
  await expect(page.locator('.docs-sidebar a[href="/guide"]')).toHaveCount(0);
  if (await page.locator(".docs-sidebar").isVisible()) {
    await page
      .locator('.docs-sidebar a[href="/components/motion/switch"]')
      .click();
    await expect(page.locator("#docs-content h1")).toHaveText("Switch");
    await expect(tabs.locator('[aria-current="page"]')).toHaveText("组件");
    await page.goBack();
    await expect(page).toHaveURL(/\/components$/);
  }
  await tabs.getByRole("link", { name: "模板", exact: true }).click();
  await expect(page.locator(".template-gallery-card")).toHaveCount(5);
  await expect
    .poll(() =>
      page
        .locator(".template-gallery-card img")
        .first()
        .evaluate(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page
    .locator('a.template-screenshot-link[href="/templates/dashboard"]')
    .click();
  await expect(tabs.locator('[aria-current="page"]')).toHaveText("模板");
  await expect(page.locator(".template-iframe-stage iframe")).toHaveAttribute("src", /orvui-template-dashboard\.netlify\.app/);
  await expect(page.locator('a[download]')).toHaveCount(0);
  await expect(page.locator('#source')).toHaveCount(0);
  await tabs.getByRole("link", { name: "更新日志", exact: true }).click();
  await expect(page).toHaveURL(/\/changelog$/);
  await expect(tabs.locator('[aria-current="page"]')).toHaveText("更新日志");
  await expect(page.locator('.docs-sidebar a[href="/guide"]')).toHaveCount(0);
  await expect(page.locator(".site-changelog")).toContainText("2026");
  expect(errors).toEqual([]);
});

test("template routes preserve language, query, hash and header across navigation", async ({
  page,
}) => {
  await page.goto("/templates/crm?source=docs#notes");
  await expect(page.locator(".github-control").first()).toHaveText("1.2k");
  if (!(await page.locator(".desktop-header-settings").isVisible()))
    await page.getByRole("button", { name: "打开导航", exact: true }).click();
  await page
    .getByRole("button", { name: "选择语言，当前：简体中文", exact: true })
    .click();
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/templates\/crm\?source=docs#notes$/);
  await expect(
    page.locator(".docs-section-tabs [aria-current=page]"),
  ).toHaveText("Templates");
  await expect(
    page.locator(".docs-section-tabs [aria-current=page]"),
  ).toBeInViewport({ ratio: 0.95 });
  await expect(page.locator("#notes h2")).toHaveText("Usage notes");
  await page.reload();
  await expect(
    page.locator(".docs-section-tabs [aria-current=page]"),
  ).toHaveText("Templates");
});

test("homepage keeps a single toolbar and docs retain navigation tabs", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator(".github-control").first()).toHaveText("1.2k");
  await expect(page.locator(".docs-section-tabs")).toHaveCount(0);
  await expect(page.locator(".site-header")).toHaveCSS("height", "56px");
  const header = page.locator(".site-header");
  await expect(header).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveClass(/scrolled/);
  await expect(header).not.toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
  await page.screenshot({
    path: `artifacts/reports/docs-sections/${info.project.name}-home-scrolled.png`,
    animations: "disabled",
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveClass(/scrolled/);
  await expect(header).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
  await page.screenshot({
    path: `artifacts/reports/docs-sections/${info.project.name}-home-navigation.png`,
    animations: "disabled",
  });
  await page.goto("/components");
  await expect(page.locator(".site-header")).toHaveCSS("height", "100px");
  await expect(
    page.locator('.docs-section-tabs [aria-current="page"]'),
  ).toHaveText("组件");
});

test("four tabs and section-specific content fit all five widths", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Matrix sets the viewport explicitly.",
  );
  test.setTimeout(120000);
  for (const width of [1920, 1440, 1280, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/en/components", "/templates/mail"]) {
      await page.goto(path);
      await expect(page.locator(".docs-section-tabs")).toBeVisible();
      const alignment = await page.evaluate(() => {
        const menu = document
          .querySelector(".docs-section-tabs")!
          .getBoundingClientRect();
        const content = document
          .querySelector(".docs-frame")!
          .getBoundingClientRect();
        return {
          left: Math.abs(menu.left - content.left),
          right: Math.abs(menu.right - content.right),
        };
      });
      expect(alignment.left).toBeLessThanOrEqual(1);
      expect(alignment.right).toBeLessThanOrEqual(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `artifacts/reports/docs-sections/${width}-${path.includes("mail") ? "template" : "components"}.png`,
        animations: "disabled",
      });
    }
  }
});

test("component articles explain real model bindings in both languages", async ({
  page,
}, info) => {
  for (const en of [false, true]) {
    const prefix = en ? "/en" : "";
    await page.goto(prefix + "/components/motion/switch#state-and-events");
    const section = page.locator("#state-and-events");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      en ? "State and events" : "状态与事件",
    );
    await expect(section.locator("tbody tr")).toHaveCount(1);
    await expect(section.locator("tbody")).toContainText("v-model");
    await expect(section.locator("tbody")).toContainText("update:modelValue");
    await section.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `artifacts/reports/docs-content/${info.project.name}-${en ? "en" : "zh"}-component-state.png`,
      animations: "disabled",
    });
    const response = await page.request.get(
      prefix + "/components/motion/switch.md",
    );
    expect(await response.text()).toContain('<a id="state-and-events"></a>');
    await page.goto(prefix + "/components/motion/button#state-and-events");
    await expect(page.locator("#state-and-events table")).toHaveCount(0);
    await expect(page.locator("#state-and-events")).toContainText(
      en ? "undocumented v-model" : "未公开的 v-model",
    );
  }
});

test("template detail embeds the independent application and hides source downloads", async ({page}) => {
  await page.route("https://orvui-template-chat.netlify.app/**", route => route.fulfill({contentType:"text/html", body:"<!doctype html><html><body>Independent template</body></html>"}));
  await page.goto("/en/templates/chat");
  await expect(page.locator("#template-use-cases")).toHaveText("When to use it");
  await expect(page.locator("#preview .docs-editorial-list li")).toHaveCount(3);
  await expect(page.locator("#composition")).toContainText("Library");
  await expect(page.locator("iframe")).toHaveAttribute("src", /orvui-template-chat\.netlify\.app/);
  await expect(page.locator('a[download]')).toHaveCount(0);
  await expect(page.locator('#source')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
