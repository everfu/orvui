import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures";
test.use({ reducedMotion: "no-preference" });

const panel = (page: Page) => page.locator(".home-scene-panel");
const select = (page: Page, name: string) =>
  page
    .getByRole("tablist", { name: "展示场景", exact: true })
    .getByRole("tab", { name, exact: true })
    .click();
async function open(page: Page) {
  await page.goto("/");
  await expect(page.locator(".home-showcase")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
}

test("scene content fades and settles, then releases its transition styles and input lock", async ({
  page,
}, info) => {
  await open(page);
  await expect(panel(page).locator(".home-scene-view")).toHaveCSS(
    "opacity",
    "1",
  );
  await panel(page).evaluate((el) => {
    const samples: Array<{
      opacity: number;
      y: number;
      filter: string;
      locked: boolean;
    }> = [];
    const start = performance.now();
    function sample() {
      const view = el.querySelector<HTMLElement>(".home-scene-view");
      if (view?.querySelector('[data-scene="dashboard"]')) {
        const style = getComputedStyle(view);
        samples.push({
          opacity: Number(style.opacity),
          y: new DOMMatrixReadOnly(style.transform).m42,
          filter: style.filter,
          locked: el.hasAttribute("inert"),
        });
        if (
          Number(style.opacity) >= 0.999 &&
          el.getAttribute("aria-busy") === "false" &&
          samples.length > 2
        ) {
          el.setAttribute("data-motion-samples", JSON.stringify(samples));
          return;
        }
      }
      if (performance.now() - start < 4000) requestAnimationFrame(sample);
      else el.setAttribute("data-motion-samples", JSON.stringify(samples));
    }
    requestAnimationFrame(sample);
  });
  await select(page, "仪表盘");
  await expect(panel(page).locator('[data-scene="dashboard"]')).toBeAttached();
  await expect(panel(page)).toHaveAttribute("data-motion-samples", /.+/);
  const frames = JSON.parse(
    (await panel(page).getAttribute("data-motion-samples"))!,
  ) as Array<{ opacity: number; y: number; locked: boolean }>;
  expect(frames.some((frame) => frame.opacity < 0.99 && frame.y > 0)).toBe(
    true,
  );
  expect(frames.some((frame) => frame.locked)).toBe(true);
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await expect(panel(page)).not.toHaveAttribute("inert", "");
  await expect(panel(page).locator(".home-scene-view")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(panel(page).locator(".home-scene-view")).toHaveCSS(
    "filter",
    "none",
  );
  await panel(page).screenshot({
    path: `artifacts/reports/scene-motion/${info.project.name}-settled.png`,
  });
  await select(page, "组件");
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await page
    .getByRole("textbox", { name: "你的邮箱", exact: true })
    .fill("motion@example.com");
});

test("a slow scene keeps the previous content and cannot overwrite a later selection", async ({
  page,
}) => {
  let delayed = false;
  await page.route("**/_nuxt/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("HomeMailScene") && body.includes("home-mail-layout")) {
      delayed = true;
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    await route.fulfill({ response, body });
  });
  await open(page);
  await select(page, "邮件");
  await expect.poll(() => delayed).toBe(true);
  await expect(panel(page).locator('[data-scene="components"]')).toBeVisible();
  await expect(panel(page)).toHaveAttribute("aria-busy", "true");
  await select(page, "仪表盘");
  await expect(panel(page).locator('[data-scene="dashboard"]')).toBeVisible();
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await page.waitForTimeout(750);
  await expect(panel(page).locator("[data-scene]")).toHaveCount(1);
  await expect(panel(page).locator('[data-scene="mail"]')).toHaveCount(0);
  for (const name of ["邮件", "聊天", "组件", "CRM", "财务"])
    await select(page, name);
  await expect(panel(page).locator('[data-scene="finances"]')).toBeVisible();
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await expect(panel(page).locator("[data-scene]")).toHaveCount(1);
  await select(page, "组件");
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await page
    .getByRole("tablist", { name: "展示场景", exact: true })
    .getByRole("tab", { name: "组件", exact: true })
    .press("ArrowRight");
  await expect(panel(page).locator('[data-scene="dashboard"]')).toBeVisible();
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
});

test("reduced motion reveals without displacement or blur and leaving the page releases the view", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await select(page, "仪表盘");
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await select(page, "邮件");
  await expect(panel(page)).toHaveAttribute("aria-busy", "false");
  await expect(panel(page).locator(".home-scene-view")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(panel(page).locator(".home-scene-view")).toHaveCSS(
    "filter",
    "none",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator('.landing-hero a[href="/guide"]').click();
  await expect(page).toHaveURL(/\/guide$/);
  await expect(page.locator(".home-scene-panel")).toHaveCount(0);
});

test("tab label contrast follows the indicator across palettes and appearance modes", async ({
  page,
}, info) => {
  await open(page);
  const tabs = page.getByRole("tablist", { name: "展示场景", exact: true });
  const palettes = await page
    .locator(".home-palette [data-palette]")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-palette")!),
    );
  for (const appearance of ["dark", "light"]) {
    if (appearance === "light") {
      if (await page.locator(".desktop-header-settings").isVisible())
        await page
          .locator(".desktop-header-settings")
          .getByRole("tab", { name: "浅色", exact: true })
          .click();
      else {
        await page
          .getByRole("button", { name: "打开导航", exact: true })
          .click();
        await page
          .locator(".mobile-header-settings")
          .getByRole("tab", { name: "浅色", exact: true })
          .click();
        await page.keyboard.press("Escape");
        await expect(page.locator(".mobile-header-settings")).toHaveCount(0);
      }
    }
    for (const [index, palette] of palettes.entries()) {
      await page
        .locator(`.home-palette label:has([data-palette="${palette}"])`)
        .click();
      await tabs
        .getByRole("tab", { name: index % 2 ? "组件" : "仪表盘", exact: true })
        .click();
      await page.waitForTimeout(180);
      const active = tabs.locator('[role="tab"][aria-selected="true"]');
      await expect
        .poll(() =>
          active.evaluate((el) => {
            const label = el.querySelector<HTMLElement>("[data-tabs-label]")!;
            const pill = el
              .closest('[role="tablist"]')!
              .querySelector("[data-tabs-indicator]")!
              .getBoundingClientRect();
            const tab = el.getBoundingClientRect();
            const inset = label.style.clipPath
              .replace(/^inset\(|\)$/g, "")
              .split(/\s+/)
              .map(Number.parseFloat);
            const right = inset[1] ?? 0,
              left = inset[3] ?? right;
            return (
              Math.abs(pill.left - tab.left) < 0.5 &&
              Math.abs(pill.right - tab.right) < 0.5 &&
              right + left < 0.5
            );
          }),
        )
        .toBe(true);
      expect(
        await active.evaluate((el) => {
          const label = el.querySelector("[data-tabs-label]")!;
          const ctx = document.createElement("canvas").getContext("2d")!;
          ctx.fillStyle = getComputedStyle(label).color;
          const actual = ctx.fillStyle;
          ctx.fillStyle = getComputedStyle(
            document.documentElement,
          ).getPropertyValue("--primary-foreground");
          return actual === ctx.fillStyle;
        }),
      ).toBe(true);
    }
    await tabs.screenshot({
      path: `artifacts/reports/scene-motion/${info.project.name}-${appearance}-tab-colors.png`,
    });
  }
});
