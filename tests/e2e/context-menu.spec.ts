import { expect, test, type Page } from "@playwright/test";

type Frame = {
  ready: boolean;
  opacity: number;
  visibility: string;
  inset: number[];
};

async function prepare(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 0 } }),
  );
  await page.goto("/components/motion/context-menu");
  await expect(page).toHaveTitle(/Animated Context Menu/);
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const trigger = page.getByRole("button", { name: "Right click on me" });
  await trigger.scrollIntoViewIfNeeded();
  // Let the documentation scroll settle before invoking a scroll-dismissed overlay.
  await page.waitForTimeout(200);
  return { trigger, errors };
}

async function recordOpening(page: Page, invoke: () => Promise<unknown>) {
  const invocation = await page.evaluate(() => {
    const frames: Frame[] = [];
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    const invocation = Number(menu.dataset.invocation ?? 0) + 1;
    (window as any).menuFrames = frames;
    (window as any).menuFrameRecording = true;
    function sample() {
      const style = getComputedStyle(menu);
      if (
        Number(menu.dataset.invocation) === invocation &&
        menu.parentElement?.getAttribute("aria-hidden") === "false"
      ) {
        frames.push({
          ready: menu.dataset.morphReady === "true",
          opacity: Number(style.opacity),
          visibility: style.visibility,
          inset: (
            style.clipPath.split("round")[0].match(/[\d.e+-]+(?=px)/g) ?? []
          ).map(Number),
        });
      }
      if ((window as any).menuFrameRecording) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
    return invocation;
  });
  await invoke();
  await expect(page.getByRole("menu")).toHaveAttribute(
    "data-invocation",
    String(invocation),
  );
  await expect(page.getByRole("menu")).toHaveAttribute(
    "data-morph-ready",
    "true",
  );
  await expect(page.getByRole("menu")).toHaveCSS("opacity", "1");
  const frames: Frame[] = await page.evaluate(() => {
    (window as any).menuFrameRecording = false;
    return (window as any).menuFrames;
  });
  const start = frames.filter((frame) => !frame.ready).at(-1)!;
  expect(start).toBeDefined();
  // Preparation must finish hidden at the 16px origin, before the reveal starts.
  expect(start.opacity).toBe(0);
  const bounds = await page.getByRole("menu").boundingBox();
  expect(start.inset).toHaveLength(4);
  expect(bounds!.width - start.inset[1] - start.inset[3]).toBeCloseTo(16, 0);
  expect(bounds!.height - start.inset[0] - start.inset[2]).toBeCloseTo(16, 0);
  expect(
    frames
      .filter((frame) => !frame.ready)
      .every((frame) => frame.visibility === "hidden" || frame.opacity === 0),
  ).toBe(true);
  return page.getByRole("menu");
}

test("documentation context menu reveals from its measured origin on first open and interrupted reopen", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { trigger, errors } = await prepare(page);
  await recordOpening(page, () => trigger.click({ button: "right" }));
  await expect(
    page.getByRole("menuitem", { name: "Open", exact: true }),
  ).toBeFocused();
  await recordOpening(page, () =>
    trigger.click({ button: "right", position: { x: 4, y: 4 } }),
  );
  await page.keyboard.press("Escape");
  // Reopen while the 300ms exit is still running.
  await recordOpening(page, () => trigger.click({ button: "right" }));
  await page.getByRole("menuitemcheckbox", { name: "Keep offline" }).click();
  await expect(
    page.getByRole("menuitemcheckbox", { name: "Keep offline" }),
  ).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-context-menu-portal]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test("documentation context menu retains keyboard invocation and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { trigger, errors } = await prepare(page);
  await trigger.focus();
  await page.keyboard.press("Shift+F10");
  const menu = page.getByRole("menu");
  await expect(menu).toHaveCSS("opacity", "1");
  await expect(
    page.getByRole("menuitem", { name: "Open", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Rename", exact: true }),
  ).toBeFocused();
  const box = await menu.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.y).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 8);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height - 8);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
