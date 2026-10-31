import { expect, test, type Page } from "@playwright/test";

async function prepare(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 0 } }),
  );
  await page.goto("/components/blocks/command-palette");
  await expect(page).toHaveTitle(/Command Palette/i);
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const trigger = page.getByRole("button", {
    name: "Open command palette",
    exact: true,
  });
  await trigger.scrollIntoViewIfNeeded();
  return { trigger, errors };
}

async function openingFrames(page: Page, invoke: () => Promise<unknown>) {
  await page.evaluate(() => {
    const frames: { panel: number; backdrop: number }[] = [];
    (window as any).paletteFrames = frames;
    (window as any).recordPalette = true;
    function sample() {
      const panel = document.querySelector(
        '[role="dialog"][aria-label="Command palette"]',
      );
      const backdrop = document.querySelector(
        '[aria-label="Close command palette"]',
      );
      if (panel && backdrop && !panel.closest("[inert]"))
        frames.push({
          panel: Number(getComputedStyle(panel).opacity),
          backdrop: Number(getComputedStyle(backdrop).opacity),
        });
      if ((window as any).recordPalette) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await invoke();
  const dialog = page.getByRole("dialog", {
    name: "Command palette",
    exact: true,
  });
  await expect(dialog).toHaveCSS("opacity", "1");
  // Include the frames after spring completion, where the original fade blinked.
  await page.waitForTimeout(250);
  const frames: { panel: number; backdrop: number }[] = await page.evaluate(
    () => {
      (window as any).recordPalette = false;
      return (window as any).paletteFrames;
    },
  );
  expect(frames.length).toBeGreaterThan(3);
  for (const key of ["panel", "backdrop"] as const) {
    for (let i = 1; i < frames.length; i++)
      expect(frames[i][key]).toBeGreaterThanOrEqual(frames[i - 1][key] - 0.001);
    expect(frames.at(-1)![key]).toBe(1);
  }
  await expect(dialog).toHaveCount(1);
  await expect(page.getByRole("combobox")).toBeFocused();
}

test("command palette opens without an opacity reset and survives an interrupted close", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { trigger, errors } = await prepare(page);
  await openingFrames(page, () => trigger.click());
  const input = page.getByRole("combobox");
  await input.fill("settings");
  await expect(page.getByRole("option")).toHaveCount(1);
  await expect(page.getByRole("option")).toContainText("Settings");
  // Reopen through the shortcut during the 120ms exit, without waiting for removal.
  await page.keyboard.press("Escape");
  await openingFrames(page, () => page.keyboard.press("Control+j"));
  await expect(input).toHaveValue("");
  await expect(page.getByRole("option")).toHaveCount(5);
  await page.mouse.move(0, 0);
  const selected = page
    .getByRole("dialog", { name: "Command palette", exact: true })
    .locator('[role="option"][aria-selected="true"]');
  const previous = Number(await selected.getAttribute("data-index"));
  await page.keyboard.press("ArrowDown");
  await expect(selected).toHaveAttribute(
    "data-index",
    String(Math.min(previous + 1, 4)),
  );
  await page.keyboard.press("Enter");
  await expect(
    page.locator('[role="dialog"][aria-label="Command palette"]'),
  ).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test("command palette retains reduced motion, viewport fit and backdrop dismissal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { trigger, errors } = await prepare(page);
  await openingFrames(page, () => trigger.click());
  const dialog = page.getByRole("dialog", {
    name: "Command palette",
    exact: true,
  });
  await expect(dialog).toHaveCSS("transform", "none");
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(16);
  expect(box.x + box.width).toBeLessThanOrEqual(
    page.viewportSize()!.width - 16,
  );
  await page
    .getByRole("button", { name: "Close command palette" })
    .click({ position: { x: 4, y: 4 } });
  await expect(
    page.locator('[role="dialog"][aria-label="Command palette"]'),
  ).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
