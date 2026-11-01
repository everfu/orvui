import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures";
test.use({ reducedMotion: "no-preference" });

async function instrument(page: Page) {
  await page.addInitScript(() => {
    const states: { mode: string | null; path: string }[] = [];
    (window as any).docsMotionStates = states;
    new MutationObserver(() =>
      states.push({
        mode: document.documentElement.getAttribute("data-docs-route-motion"),
        path: location.pathname,
      }),
    ).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-docs-route-motion"],
    });
    (window as any).nativeStarts = 0;
    (window as any).nativeFrames = [];
    const original = document.startViewTransition?.bind(document);
    if (original)
      document.startViewTransition = ((...args: any[]) => {
        (window as any).nativeStarts++;
        const transition = (original as any)(...args);
        void transition.ready
          .then(() => {
            (window as any).nativeFrames.push({
              root: getComputedStyle(document.documentElement)
                .viewTransitionName,
              name: getComputedStyle(
                document.documentElement,
                "::view-transition-new(orvui-docs)",
              ).animationName,
            });
          })
          .catch(() => {});
        return transition;
      }) as typeof document.startViewTransition;
  });
}
async function settled(page: Page) {
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-docs-route-motion",
    /.+/,
  );
  await expect(page.locator("#docs-content")).not.toHaveAttribute("inert", "");
  await expect(page.locator("#docs-content")).not.toHaveAttribute(
    "aria-busy",
    "true",
  );
  await expect(page.locator("#docs-content")).toHaveCSS("opacity", "1");
}

test("reading-pane transitions preserve chrome, anchors and history", async ({
  page,
}) => {
  await instrument(page);
  await page.goto("/beta/en/guide");
  await expect(page.locator("h1")).toHaveText("Introduction");
  expect(await page.evaluate(() => (window as any).nativeStarts)).toBe(0);
  const header = await page.locator(".site-header").boundingBox();
  await page.locator(".beta-notice a").click();
  await expect(page).toHaveURL(/\/beta\/en\/docs\/installation$/);
  await expect(page.locator("h1")).toHaveText("Quick Start");
  await settled(page);
  expect(
    await page.evaluate(() =>
      (window as any).docsMotionStates.some(
        (state: any) => state.mode === "native",
      ),
    ),
  ).toBe(true);
  expect(await page.locator(".site-header").boundingBox()).toEqual(header);
  expect(
    await page.evaluate(() =>
      (window as any).nativeFrames.some(
        (frame: any) =>
          frame.root === "none" && frame.name === "docs-reading-in",
      ),
    ),
  ).toBe(true);
  const before = await page.evaluate(() => (window as any).nativeStarts);
  await page.locator('.guide-link-cards a[href="#package"]').click();
  await settled(page);
  expect(await page.evaluate(() => (window as any).nativeStarts)).toBe(before);
  await page.goBack();
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Introduction");
  await settled(page);
});

test("rapid navigation and a mid-transition preference change leave the latest document usable", async ({
  page,
}) => {
  await instrument(page);
  await page.goto("/guide");
  await page.evaluate(() => {
    const click = (href: string) => {
      const anchor = document.createElement("a");
      anchor.href = href;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
    };
    click("/docs/installation");
    setTimeout(() => click("/docs/theme"), 20);
    setTimeout(() => click("/docs/motion-patterns"), 45);
  });
  await expect(page).toHaveURL(/\/docs\/motion-patterns$/);
  await expect(page.locator("#page-transitions")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settled(page);
  const demo = page.locator(".page-motion-demo");
  const first = demo.getByRole("tab").first();
  await first.focus();
  await page.keyboard.press("End");
  await expect(demo.getByRole("tab").last()).toBeFocused();
  await expect(
    demo.locator('[role="tabpanel"][aria-hidden="false"] h3'),
  ).toHaveText("主题");
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  await expect(
    demo.locator('[role="tabpanel"][aria-hidden="false"] h3'),
  ).toHaveText("安装");
  expect(
    await demo
      .locator('[role="tabpanel"]')
      .evaluateAll((panels) =>
        panels.every(
          (panel) =>
            new DOMMatrixReadOnly(getComputedStyle(panel).transform).m42 === 0,
        ),
      ),
  ).toBe(true);
});

for (const reduced of [false, true])
  test(`fallback works without native transitions, reduced=${reduced}`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    await page.addInitScript(() => {
      Object.defineProperty(document, "startViewTransition", {
        value: undefined,
        configurable: true,
      });
      (window as any).docsAnimations = [];
      const original = Element.prototype.animate;
      Element.prototype.animate = function (
        ...args: Parameters<Element["animate"]>
      ) {
        if ((this as HTMLElement).id === "docs-content")
          (window as any).docsAnimations.push({
            frames: args[0],
            options: args[1],
          });
        return original.apply(this, args);
      };
    });
    await page.goto("/guide");
    expect(
      await page.evaluate(() => (window as any).docsAnimations.length),
    ).toBe(0);
    await page
      .locator('.guide-link-cards a[href="/docs/installation#package"]')
      .first()
      .click();
    await expect(page.locator("h1")).toHaveText("快速开始");
    await settled(page);
    const animations = await page.evaluate(
      () => (window as any).docsAnimations,
    );
    expect(animations.length).toBeGreaterThan(0);
    expect(animations.at(-1).options.duration).toBe(reduced ? 80 : 220);
    if (reduced)
      expect(
        animations
          .at(-1)
          .frames.every((frame: any) => frame.transform === "none"),
      ).toBe(true);
  });

test("the existing Preview/Code example and real component tabs do not flash back after rapid input", async ({
  page,
}) => {
  await page.goto("/docs/motion-patterns");
  const tabs = page.getByRole("tablist", { name: "示例视图", exact: true });
  await tabs.getByRole("tab", { name: "代码", exact: true }).click();
  await tabs.getByRole("tab", { name: "预览", exact: true }).click();
  await tabs.getByRole("tab", { name: "代码", exact: true }).click();
  await expect(
    tabs.getByRole("tab", { name: "代码", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const panelId = await tabs
    .getByRole("tab", { name: "代码", exact: true })
    .getAttribute("aria-controls");
  const layers = page.locator(`[id="${panelId}"] > span[aria-hidden="true"]`);
  await expect(layers.last()).toHaveCSS("opacity", "1");
  await page.goto("/components/motion/switch");
  const example = page.locator(".example-section").first();
  for (const label of ["用法", "源码", "预览", "用法"])
    await example.getByRole("tab", { name: label, exact: true }).click();
  await expect(example.getByRole("tabpanel")).toHaveCount(1);
  await expect(example.getByRole("tabpanel")).toHaveCSS("opacity", "1");
  await expect(
    example.getByRole("tab", { name: "用法", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});

test("layout measurements during a route transition and responsive resize stay error-free", async ({
  page,
}) => {
  await page.goto("/beta/guide");
  await page.evaluate(() => {
    const original = document.startViewTransition.bind(document);
    (window as any).layoutMeasured = false;
    document.startViewTransition = ((...args: any[]) => {
      const transition = (original as any)(...args);
      void transition.ready
        .then(() => {
          const measure = () => {
            getComputedStyle(
              document.documentElement,
              "::view-transition-new(orvui-docs)",
            ).transform;
            document.getElementById("docs-content")?.getBoundingClientRect();
            if (document.documentElement.hasAttribute("data-docs-route-motion"))
              requestAnimationFrame(measure);
          };
          requestAnimationFrame(measure);
        })
        .catch(() => {});
      void transition.finished.then(() => {
        (window as any).layoutMeasured = true;
      });
      return transition;
    }) as typeof document.startViewTransition;
  });
  await page.locator(".beta-notice a").click();
  await expect(page.locator("h1")).toHaveText("快速开始");
  await expect
    .poll(() => page.evaluate(() => (window as any).layoutMeasured))
    .toBe(true);
  await settled(page);
  await page.goto("/beta/docs/motion-patterns#page-transitions");
  const original = page.viewportSize()!;
  await page.setViewportSize({
    width: original.width < 600 ? 1440 : 390,
    height: 844,
  });
  await page.setViewportSize(original);
  await expect(page.locator("#page-transitions")).toHaveCount(1);
});
