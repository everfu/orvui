import { expect, test, type Page } from "@playwright/test";
test.setTimeout(45000);
async function prepare(page: Page, reduce = false) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 0 } }),
  );
  await page.goto("/components/motion/center-morph-modal");
  await expect(page).toHaveTitle(/Center Morph Modal/);
  const demo = page.locator(".demo-content").first();
  await expect(demo).toHaveAttribute("aria-busy", "false", { timeout: 15000 });
  const trigger = demo.getByRole("button", { name: "Open modal" });
  await trigger.scrollIntoViewIfNeeded();
  return { trigger, errors };
}
async function openingFrames(
  page: Page,
  invoke: () => Promise<unknown>,
  reduce = false,
) {
  await page.evaluate(() => {
    const frames: {
      clip: number;
      opacity: number;
      backdrop: number;
      close: number;
    }[] = [];
    (window as any).centerFrames = frames;
    (window as any).recordCenter = true;
    function sample() {
      const panel = document.querySelector<HTMLElement>(
        '[role="dialog"][aria-label="orvui"]',
      );
      const backdrop = document.querySelector<HTMLElement>(
        '[aria-label="Dismiss modal"]',
      );
      const close = panel?.querySelector<HTMLElement>(
        '[aria-label="Close modal"]',
      );
      if (panel && backdrop && close && !panel.closest("[inert]"))
        frames.push({
          clip: parseFloat(
            getComputedStyle(panel).clipPath.replace("inset(", ""),
          ),
          opacity: Number(getComputedStyle(panel).opacity),
          backdrop: Number(getComputedStyle(backdrop).opacity),
          close: Number(getComputedStyle(close).opacity),
        });
      if ((window as any).recordCenter) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await invoke();
  // A reopened surface can still carry the old session's final style for a frame.
  await page.waitForTimeout(650);
  const dialog = page.getByRole("dialog", { name: "orvui", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("clip-path", "inset(0% round 30px)");
  await expect(dialog.getByRole("button", { name: "Close modal" })).toHaveCSS(
    "opacity",
    "1",
  );
  await page.waitForTimeout(250);
  const frames: {
    clip: number;
    opacity: number;
    backdrop: number;
    close: number;
  }[] = await page.evaluate(() => {
    (window as any).recordCenter = false;
    return (window as any).centerFrames;
  });
  expect(frames.length).toBeGreaterThan(3);
  for (let i = 1; i < frames.length; i++) {
    expect(frames[i].clip).toBeLessThanOrEqual(frames[i - 1].clip + 0.001);
    for (const key of ["opacity", "backdrop", "close"] as const)
      expect(frames[i][key]).toBeGreaterThanOrEqual(frames[i - 1][key] - 0.001);
  }
  expect(frames.at(-1)).toEqual({ clip: 0, opacity: 1, backdrop: 1, close: 1 });
  if (reduce) expect(frames.every((frame) => frame.clip === 0)).toBe(true);
  await expect(
    dialog.getByRole("button", { name: "Start creating" }),
  ).toBeFocused();
  return dialog;
}

test("center modal unfolds without resetting its clip at completion under CPU pressure", async ({
  page,
}) => {
  const { trigger, errors } = await prepare(page);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const dialog = await openingFrames(page, () => trigger.click());
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const box = (await dialog.boundingBox())!;
  expect(box.width).toBeLessThanOrEqual(416);
  expect(box.x + box.width / 2).toBeCloseTo(page.viewportSize()!.width / 2, 0);
  await dialog.getByRole("button", { name: "Close modal" }).click();
  await expect(page.locator('[role="dialog"][aria-label="orvui"]')).toHaveCount(
    0,
  );
  await expect(trigger).toBeFocused();
  await openingFrames(page, () => trigger.click());
  await page.getByRole("button", { name: "Start creating" }).click();
  await expect(page.locator('[role="dialog"][aria-label="orvui"]')).toHaveCount(
    0,
  );
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test("center modal reverses an interrupted exit and keeps focus and dismissal working", async ({
  page,
}) => {
  const { trigger, errors } = await prepare(page);
  await openingFrames(page, () => trigger.click());
  await page.keyboard.press("Escape");
  await openingFrames(page, () => page.keyboard.press("Enter"));
  await expect(
    page.getByRole("dialog", { name: "orvui", exact: true }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Start creating" }).click();
  await expect(page.locator('[role="dialog"][aria-label="orvui"]')).toHaveCount(
    0,
  );
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test("center modal uses an opacity-only reduced-motion opening and backdrop dismissal", async ({
  page,
}) => {
  const { trigger, errors } = await prepare(page, true);
  await openingFrames(page, () => trigger.click(), true);
  await page
    .getByRole("button", { name: "Dismiss modal" })
    .click({ position: { x: 2, y: 2 } });
  await expect(page.locator('[role="dialog"][aria-label="orvui"]')).toHaveCount(
    0,
  );
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
