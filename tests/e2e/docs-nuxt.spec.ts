import { expect, test, type Locator, type Page } from "@playwright/test";
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

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`motion guide tabs keep their surface during rapid switches (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/docs/motion-patterns");
    const tabs = page.getByRole("tablist", { name: "示例视图", exact: true });
    // Wait for this example's hydration through its own interaction, without
    // depending on optional header statistics or arbitrary page-load delays.
    await expect(async () => {
      await tabs.getByRole("tab", { name: "代码", exact: true }).click();
      await expect(
        tabs.getByRole("tab", { name: "代码", exact: true }),
      ).toHaveAttribute("aria-selected", "true", { timeout: 500 });
    }).toPass({ timeout: 30000 });
    await tabs.getByRole("tab", { name: "预览", exact: true }).click();
    await expect(
      tabs
        .locator("..")
        .locator('[role="tabpanel"] [aria-hidden="true"]')
        .filter({ hasText: "实时组件视图" }),
    ).toHaveCSS("opacity", "1");
    await tabs.scrollIntoViewIfNeeded();
    const recordSwitch = (target: 0 | 1, rapid = false) =>
      tabs.evaluate(
        async (list, selection) => {
          const root = list.parentElement!;
          const panel = root.querySelector<HTMLElement>('[role="tabpanel"]')!;
          const buttons =
            list.querySelectorAll<HTMLButtonElement>('[role="tab"]');
          const height = root.getBoundingClientRect().height;
          const samples: {
            stable: boolean;
            height: number;
            opacity: number;
            elapsed: number;
            layers: number[];
          }[] = [];
          const start = performance.now();
          buttons[selection.target].click();
          if (selection.rapid) {
            setTimeout(() => buttons[0].click(), 40);
            setTimeout(() => buttons[1].click(), 80);
          }
          await new Promise<void>((resolve) => {
            function sample() {
              const current =
                root.querySelector<HTMLElement>('[role="tabpanel"]');
              const layers = current?.querySelectorAll<HTMLElement>(
                '[aria-hidden="true"]',
              );
              samples.push({
                stable: current === panel,
                height: Math.abs(root.getBoundingClientRect().height - height),
                opacity: current
                  ? Number(getComputedStyle(current).opacity)
                  : 0,
                elapsed: performance.now() - start,
                layers: Array.from(layers ?? [], (layer) =>
                  Number(getComputedStyle(layer).opacity),
                ),
              });
              if (performance.now() - start < 600)
                requestAnimationFrame(sample);
              else resolve();
            }
            requestAnimationFrame(sample);
          });
          return samples;
        },
        { target, rapid },
      );
    for (const scenario of [
      { target: 1, rapid: false },
      { target: 0, rapid: false },
      { target: 1, rapid: true },
    ] as const) {
      const result = await recordSwitch(scenario.target, scenario.rapid);
      expect(result.length).toBeGreaterThan(5);
      expect(
        result.every((frame) => frame.stable && frame.layers.length === 2),
      ).toBe(true);
      expect(Math.max(...result.map((frame) => frame.height))).toBeLessThan(1);
      expect(Math.min(...result.map((frame) => frame.opacity))).toBe(1);
      // A non-empty panel alone misses a one-frame swap back to the old text.
      // Check each layer through completion, after the last rapid selection.
      const frames = scenario.rapid
        ? result.filter((frame) => frame.elapsed >= 120)
        : result;
      for (let index = 1; index < frames.length; index++) {
        expect(
          frames[index].layers[scenario.target] -
            frames[index - 1].layers[scenario.target],
        ).toBeGreaterThanOrEqual(-0.02);
        expect(
          frames[index].layers[1 - scenario.target] -
            frames[index - 1].layers[1 - scenario.target],
        ).toBeLessThanOrEqual(0.02);
      }
      expect(result.at(-1)!.layers).toEqual(scenario.target ? [0, 1] : [1, 0]);
    }
    await expect(
      tabs.getByRole("tab", { name: "代码", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(tabs.locator("..").getByRole("tabpanel")).toHaveAccessibleName(
      "代码",
    );
    await expect(
      tabs.locator("..").locator('[role="tabpanel"] .sr-only'),
    ).toHaveText("可复制的源码");
    await expect(
      tabs
        .locator("..")
        .locator('[role="tabpanel"] [aria-hidden="true"]')
        .filter({ hasText: "可复制的源码" }),
    ).toHaveCSS("opacity", "1");
    await tabs
      .locator("..")
      .screenshot({ path: test.info().outputPath("tabs-code.png") });
  });
}

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`sidebar and public collapsible fades do not flash (${reducedMotion})`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/docs/motion-patterns");
    if (info.project.name === "mobile") {
      await expect(async () => {
        await page
          .getByRole("button", { name: "打开导航", exact: true })
          .click();
        await expect(page.locator(".mobile-menu-content")).toBeVisible({
          timeout: 500,
        });
      }).toPass({ timeout: 30000 });
    }
    const navigation = page.locator(
      info.project.name === "mobile"
        ? ".mobile-menu-content .docs-navigation"
        : ".docs-sidebar .docs-navigation",
    );
    const sidebarTrigger = navigation.getByRole("button", {
      name: "开始使用",
      exact: true,
    });
    // Prove this group has hydrated before sampling either direction.
    await expect(async () => {
      await sidebarTrigger.click();
      await expect(sidebarTrigger).toHaveAttribute("aria-expanded", "false", {
        timeout: 500,
      });
    }).toPass({ timeout: 30000 });
    await verifyFade(sidebarTrigger, 1);
    await verifyFade(sidebarTrigger, 0);
    await navigation.screenshot({
      path: info.outputPath("sidebar-collapsed.png"),
    });
    await verifyFade(sidebarTrigger, 1);

    await page.goto("/components/motion/collapsible");
    const demo = page.locator(".demo-content").first();
    await expect(demo).toHaveAttribute("aria-busy", "false", {
      timeout: 30000,
    });
    const demoTrigger = demo.getByRole("button", {
      name: "More details",
      exact: true,
    });
    await verifyFade(demoTrigger, 1);
    await verifyFade(demoTrigger, 0);

    async function verifyFade(trigger: Locator, target: 0 | 1) {
      const values = await trigger.evaluate(async (button) => {
        const panel = document.getElementById(
          button.getAttribute("aria-controls")!,
        )!;
        const inner = panel.firstElementChild!;
        const values: number[] = [];
        const start = performance.now();
        (button as HTMLButtonElement).click();
        await new Promise<void>((resolve) => {
          function sample() {
            values.push(Number(getComputedStyle(inner).opacity));
            if (performance.now() - start < 650) requestAnimationFrame(sample);
            else resolve();
          }
          requestAnimationFrame(sample);
        });
        return values;
      });
      expect(values.length).toBeGreaterThan(5);
      for (let index = 1; index < values.length; index++) {
        expect(
          (values[index] - values[index - 1]) * (target ? 1 : -1),
        ).toBeGreaterThanOrEqual(-0.02);
      }
      expect(values.at(-1)).toBe(target);
      await expect(trigger).toHaveAttribute(
        "aria-expanded",
        target ? "true" : "false",
      );
    }
  });
}

test("language popup opacity does not flash when opening or closing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/docs/installation");
  await expect(page.locator(".github-control").first()).toHaveText("1.2k", {
    timeout: 15000,
  });
  await openSettings(page);
  const language = page.getByRole("button", {
    name: "选择语言，当前：简体中文",
    exact: true,
  });
  const menu = page.locator(".language-panel");
  const sampleOpacity = () =>
    page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const values: number[] = [];
          const start = performance.now();
          function sample() {
            const panel = document.querySelector(".language-panel");
            values.push(panel ? Number(getComputedStyle(panel).opacity) : 0);
            if (performance.now() - start < 1000) requestAnimationFrame(sample);
            else resolve(values);
          }
          requestAnimationFrame(sample);
        }),
    );
  function expectMonotonic(values: number[], direction: 1 | -1) {
    expect(values.length).toBeGreaterThan(5);
    for (let i = 1; i < values.length; i++) {
      expect((values[i] - values[i - 1]) * direction).toBeGreaterThanOrEqual(
        -0.02,
      );
    }
  }

  await language.click();
  await expect(menu).toBeVisible();
  const entering = await sampleOpacity();
  expectMonotonic(entering, 1);
  expect(entering.at(-1)).toBe(1);
  await expect(menu.locator("[aria-current=page]")).toBeFocused();
  await language.click();
  expectMonotonic(await sampleOpacity(), -1);
  await expect(menu).toHaveCount(0);

  // Closing before the entrance spring settles must not flash either.
  await language.click();
  await expect
    .poll(() => menu.evaluate((el) => Number(getComputedStyle(el).opacity)))
    .toBeGreaterThan(0.1);
  await language.click();
  expectMonotonic(await sampleOpacity(), -1);
  await expect(menu).toHaveCount(0);
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
  await expect(page.locator(".site-header")).toHaveCSS("height", "100px");
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
      .getByRole("link", { name: "安装", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/installation$/);
    await expect(page.getByRole("dialog")).not.toBeVisible();
  } else {
    await expect(page.locator(".docs-sidebar")).toHaveCSS("width", "256px");
    await expect(page.locator(".docs-resources")).toHaveCSS("width", "224px");
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

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`long code expands, scrolls and collapses with localized controls (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
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
}

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

test("document outline supports deep links, history and reading position without recording scrolls", async ({
  page,
}, info) => {
  await visitDocs(page, "/en/components/motion/switch?case=outline#install");
  const outline =
    info.project.name === "mobile"
      ? page.locator(".docs-inline-outline")
      : page.locator(".docs-resources");
  if (info.project.name === "mobile")
    await outline
      .getByRole("button", { name: "On this page", exact: true })
      .click();
  const links = outline.locator(".orvui-toc-link");
  expect(await links.count()).toBeGreaterThan(6);
  const missing = await links.evaluateAll((elements) =>
    elements.flatMap((link) => {
      const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
      const target = document.getElementById(id);
      return !target || target.closest(".preview-stage") ? [id] : [];
    }),
  );
  expect(missing).toEqual([]);
  await outline.getByRole("link", { name: "FAQ", exact: true }).click();
  await expect(page).toHaveURL(/\?case=outline#faq$/);
  await expect(outline.locator('[aria-current="location"]')).toHaveText("FAQ");
  await page.goBack();
  await expect(page).toHaveURL(/\?case=outline#install$/);
  await expect(outline.locator('[aria-current="location"]')).toHaveText(
    "Installation",
  );
  const history = await page.evaluate(() => window.history.length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(outline.locator('[aria-current="location"]')).toHaveText(
    "Overview",
  );
  expect(await page.evaluate(() => window.history.length)).toBe(history);
});

test("all navigation groups remain reachable from chart pages", async ({
  page,
}, info) => {
  await visitDocs(page, "/en/charts/donut-chart");
  if (info.project.name === "mobile") await openSettings(page);
  const navigation =
    info.project.name === "mobile"
      ? page.locator(".mobile-menu-content .docs-navigation")
      : page.locator(".docs-sidebar .docs-navigation");
  await expect(navigation.locator(".docs-nav-group-trigger")).toHaveCount(11);
  await navigation
    .getByRole("link", { name: "Table of Contents", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/components\/motion\/table-of-contents$/);
  await expect(page.locator("#docs-content h1")).toHaveText(
    "Table of Contents",
  );
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await expect(page.locator(".demo-content .orvui-toc")).toBeVisible();
  if (info.project.name === "mobile")
    await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("documentation layout fits the responsive and language/appearance matrix", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "The matrix explicitly sets every viewport.",
  );
  test.setTimeout(150000);
  for (const width of [1440, 1280, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const en of [false, true]) {
      const prefix = en ? "/en" : "";
      await page.emulateMedia({
        reducedMotion: en ? "no-preference" : "reduce",
      });
      await visitDocs(page, `${prefix}/docs/installation`);
      const viteExample = page.locator(".code-panel").filter({
        has: page.locator(".code-file-name", { hasText: "vite.config.ts" }),
      });
      await expect(viteExample).toContainText("import.meta.url");
      await expect(viteExample).not.toContainText("globalThis._importMeta_");
      if (en) {
        await openSettings(page);
        await page
          .getByRole("tab", { name: "Light theme", exact: true })
          .click();
        if (await page.locator(".mobile-header-settings").isVisible())
          await page.keyboard.press("Escape");
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator(".site-header")).toHaveCSS("height", "100px");
      if (width >= 1280) {
        await expect(page.locator(".docs-sidebar")).toHaveCSS("width", "256px");
        await expect(page.locator(".docs-resources")).toHaveCSS(
          "width",
          "224px",
        );
        await expect(page.locator(".docs-inline-outline")).not.toBeVisible();
      } else {
        await expect(page.locator(".docs-resources")).not.toBeVisible();
        await expect(
          page.locator(".docs-inline-outline-trigger"),
        ).toBeVisible();
      }
      await page.screenshot({
        path: `artifacts/reports/docs-redesign/${width}-${en ? "en-light" : "zh-dark"}.png`,
        animations: "disabled",
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const path of [
    "/components/motion/button",
    "/en/components/agents/tool-result",
    "/en/charts",
    "/changelog",
  ]) {
    await visitDocs(page, path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/reports/docs-redesign/${path.replaceAll("/", "-").slice(1)}.png`,
      animations: "disabled",
    });
  }
});

test("sidebar uses plain group headings and keeps its current row clear", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Desktop sidebar only.");
  await visitDocs(page, "/guide");
  const sidebar = page.locator(".docs-sidebar");
  await expect(
    sidebar.locator(".docs-navigation-eyebrow, .docs-nav-start"),
  ).toHaveCount(0);
  await expect(sidebar.locator('a[aria-current="page"]')).toHaveText("介绍");
  await expect(sidebar.locator('a[aria-current="page"] svg')).toBeVisible();
  await page.screenshot({
    path: "artifacts/reports/docs-redesign/sidebar-guide.png",
    animations: "disabled",
  });
  await visitDocs(page, "/components/motion/button");
  const current = sidebar.locator('a[aria-current="page"]');
  await expect(current).toBeVisible();
  await expect(current).toHaveText("Button");
  const heading = sidebar.getByRole("button", {
    name: "基础操作 5",
    exact: true,
  });
  await expect(heading).toBeVisible();
  await expect
    .poll(() =>
      heading.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return (
          document
            .elementFromPoint(rect.x + 12, rect.y + rect.height / 2)
            ?.closest(".docs-nav-group-trigger") === el
        );
      }),
    )
    .toBe(true);
  await page.screenshot({
    path: "artifacts/reports/docs-redesign/sidebar-component.png",
    animations: "disabled",
  });
});
