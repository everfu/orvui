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
  await page.goto("/components/motion/popover");
  await expect(page).toHaveTitle(/Popover/);
  const demo = page.locator(".demo-content").first();
  await expect(demo).toHaveAttribute("aria-busy", "false", { timeout: 15000 });
  await demo.scrollIntoViewIfNeeded();
  return { demo, errors };
}

async function settled(page: Page) {
  const dialog = page
    .getByRole("dialog")
    .filter({ has: page.getByText("Dimensions", { exact: true }) });
  await expect(dialog).toBeVisible();
  const id = await dialog.getAttribute("id");
  const portal = page
    .locator("[data-popover-portal]")
    .filter({ has: page.locator(`[id="${id}"]`) });
  await expect(portal.locator("[data-popover-chrome]")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect
    .poll(async () =>
      Number(
        await portal.locator("feGaussianBlur").getAttribute("stdDeviation"),
      ),
    )
    .toBe(0);
  expect(
    await portal
      .locator(':scope > div[aria-hidden="true"]')
      .evaluate((el) => getComputedStyle(el).filter),
  ).not.toContain("url(");
  return { dialog, portal };
}

test("popover keeps its morph, settles to a crisp surface and preserves edits through reopening", async ({
  page,
}) => {
  const { demo, errors } = await prepare(page);
  const trigger = demo.getByRole("button", { name: "Edit profile" });
  await trigger.click();
  const { dialog, portal } = await settled(page);
  const original = await dialog.boundingBox();
  expect(original!.width).toBe(288);
  await dialog.getByLabel("Width", { exact: true }).fill("80%");
  await expect(portal.locator("[data-popover-chrome]")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(dialog.getByLabel("Width", { exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(portal).toHaveCSS("visibility", "hidden");
  await trigger.click();
  await settled(page);
  await expect(dialog.getByLabel("Width", { exact: true })).toHaveValue("80%");
  await page.mouse.click(2, 120);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(errors).toEqual([]);
});

test("popover flips above a low trigger and fits narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 600 });
  const { demo, errors } = await prepare(page);
  const trigger = demo.getByRole("button", { name: "Edit profile" });
  await trigger.evaluate((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - (window.innerHeight - 72));
  });
  await trigger.click();
  const { dialog } = await settled(page);
  const anchor = (await trigger.boundingBox())!;
  const panel = (await dialog.boundingBox())!;
  expect(panel.x).toBeGreaterThanOrEqual(12);
  expect(panel.x + panel.width).toBeLessThanOrEqual(308);
  expect(panel.y + panel.height).toBeLessThanOrEqual(anchor.y - 13);
  // Also exercise a viewport-only resize, with no change to the content's size.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(async () => (await dialog.boundingBox())!.y)
    .toBeGreaterThanOrEqual(12);
  expect(errors).toEqual([]);
});

test("popover retains reduced motion and mouse hover transfer", async ({
  page,
}, info) => {
  const { demo, errors } = await prepare(page, true);
  await demo.getByRole("button", { name: "Edit profile" }).click();
  const { dialog } = await settled(page);
  await dialog.getByLabel("Height", { exact: true }).fill("240px");
  await page.keyboard.press("Escape");
  if (!info.project.use.isMobile) {
    const hover = demo.getByRole("button", { name: "Hover me" });
    await hover.hover();
    const panel = page
      .getByRole("dialog")
      .filter({ hasText: "Opens on hover" });
    await expect(panel).toBeVisible();
    await panel.hover();
    await page.waitForTimeout(180);
    await expect(hover).toHaveAttribute("aria-expanded", "true");
    await page.mouse.move(2, 120);
    await expect(hover).toHaveAttribute("aria-expanded", "false");
  }
  expect(errors).toEqual([]);
});
