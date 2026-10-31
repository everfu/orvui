import { expect, test, type Page } from "@playwright/test";
test.setTimeout(45000);

async function prepare(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 0 } }),
  );
  await page.route("https://images.unsplash.com/**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000"><rect width="1600" height="2000" fill="#416d8b"/><circle cx="800" cy="1000" r="500" fill="#ccb37f"/></svg>',
    }),
  );
  await page.goto("/components/motion/image-viewer");
  await expect(page).toHaveTitle(/Image Viewer/i);
  const demo = page.locator(".demo-content").first();
  await expect(demo).toHaveAttribute("aria-busy", "false", { timeout: 15000 });
  await demo.scrollIntoViewIfNeeded();
  const thumbs = demo.locator("[data-orvui-image-id]");
  const dialog = page.getByRole("dialog", {
    name: "Collected photographs",
    exact: true,
  });
  return { demo, thumbs, dialog, errors };
}

async function thumbnailsRestored(page: Page) {
  const images = page
    .locator(".demo-content")
    .first()
    .locator("[data-orvui-image-id] img");
  await expect(
    page.locator('[data-image-viewer-portal] [role="dialog"]'),
  ).toHaveCount(0);
  await expect(images).toHaveCount(3);
  for (const image of await images.all()) {
    await expect(image).toHaveCSS("opacity", "1");
    await expect(image).toHaveCSS("transform", "none");
    await expect(image).toBeVisible();
    expect(
      await image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    ).toBe(true);
  }
}

test("image viewer returns every photograph to a visible thumbnail after repeated open and close", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { thumbs, dialog, errors } = await prepare(page);
  for (const index of [2, 0, 1, 2]) {
    const source = thumbs.nth(index);
    await source.click();
    await expect(dialog).toBeVisible();
    const frame = dialog
      .locator("[data-lightbox-content]")
      .filter({ has: page.locator("img") })
      .first();
    const opening = await frame.evaluate((element) =>
      element
        .getAnimations()
        .map((animation) => ({
          duration: animation.effect?.getTiming().duration,
          frames: (animation.effect as KeyframeEffect)?.getKeyframes(),
        }))
        .find((animation) => animation.duration === 460),
    );
    expect(opening).toBeDefined();
    expect(opening!.frames[0].transform).toContain("scale(");
    expect(opening!.frames.at(-1)!.transform).toBe("none");
    await page.waitForTimeout(500);
    await dialog.getByRole("button", { name: "Close viewer" }).click();
    await thumbnailsRestored(page);
    await expect(source).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test("image viewer recovers thumbnails after interrupted opening, navigation and fast reopening", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { thumbs, dialog, errors } = await prepare(page);
  await thumbs.nth(2).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  // Reopen from the focused thumbnail while the old return animation is active.
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(
    dialog.getByRole("img", { name: "Open landscape", exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Zoom in" }).click();
  await expect(
    dialog.getByRole("button", { name: "Zoom out" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await thumbnailsRestored(page);
  expect(errors).toEqual([]);
});

test("reduced-motion image viewer fades without geometry motion and restores its thumbnail", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { thumbs, dialog, errors } = await prepare(page);
  await thumbs.nth(2).click();
  await expect(dialog).toBeVisible();
  const frame = dialog
    .locator("[data-lightbox-content]")
    .filter({ has: page.locator("img") })
    .first();
  expect(
    await frame.evaluate((element) =>
      element
        .getAnimations()
        .every((animation) =>
          (animation.effect as KeyframeEffect)
            .getKeyframes()
            .every((frame) => frame.transform === undefined),
        ),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await thumbnailsRestored(page);
  await expect(thumbs.nth(2)).toBeFocused();
  expect(errors).toEqual([]);
});
