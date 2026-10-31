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
  await page.goto("/components/blocks/bloom-menu");
  await expect(page).toHaveTitle(/Bloom Menu/i);
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const demo = page.locator(".demo-content");
  const trigger = demo.getByRole("button", { name: "Create", exact: true });
  await trigger.scrollIntoViewIfNeeded();
  return { demo, trigger, errors };
}

async function openingFrames(page: Page, invoke: () => Promise<unknown>) {
  await page.evaluate(() => {
    const frames: { opacity: number; clip: number; items: number[] }[] = [];
    (window as any).bloomFrames = frames;
    (window as any).recordBloom = true;
    function sample() {
      const menu = document.querySelector('.demo-content [role="menu"]');
      if (menu)
        frames.push({
          opacity: Number(getComputedStyle(menu.parentElement!).opacity),
          clip: parseFloat(
            getComputedStyle(menu).clipPath.replace("inset(", ""),
          ),
          items: [...menu.querySelectorAll('[role="menuitem"] > span')].map(
            (el) => Number(getComputedStyle(el).opacity),
          ),
        });
      if ((window as any).recordBloom) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await invoke();
  const menu = page.locator('.demo-content [role="menu"]');
  await expect(menu).toHaveCount(1);
  await expect(menu.locator("..")).toHaveCSS("opacity", "1");
  await expect(menu.locator('[role="menuitem"] > span').last()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.waitForTimeout(300);
  const frames: { opacity: number; clip: number; items: number[] }[] =
    await page.evaluate(() => {
      (window as any).recordBloom = false;
      return (window as any).bloomFrames;
    });
  expect(frames.length).toBeGreaterThan(3);
  for (let i = 1; i < frames.length; i++) {
    expect(frames[i].opacity).toBeGreaterThanOrEqual(
      frames[i - 1].opacity - 0.001,
    );
    expect(frames[i].clip).toBeLessThanOrEqual(frames[i - 1].clip + 0.001);
    frames[i].items.forEach((opacity, index) =>
      expect(opacity).toBeGreaterThanOrEqual(
        frames[i - 1].items[index] - 0.001,
      ),
    );
  }
  expect(frames.at(-1)!.opacity).toBe(1);
  expect(frames.at(-1)!.clip).toBe(0);
  expect(frames.at(-1)!.items).toEqual([1, 1, 1, 1, 1, 1]);
}

test("Bloom Menu keeps its content, clip and staggered icons stable after expansion and reopening", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const { demo, trigger, errors } = await prepare(page);
  await openingFrames(page, () => trigger.click());
  await expect(
    demo.getByRole("menuitem", { name: "Note", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    demo.getByRole("menuitem", { name: "Space", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    demo.getByRole("menuitem", { name: "URL", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(demo.getByRole("menu")).toHaveCount(0);
  await openingFrames(page, () => trigger.click());
  await demo.getByRole("menuitem", { name: "Canvas", exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(demo.getByRole("menu")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Bloom Menu keeps reduced motion, viewport fit and outside dismissal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { demo, trigger, errors } = await prepare(page);
  await openingFrames(page, () => trigger.click());
  const menu = demo.getByRole("menu");
  const bounds = (await menu.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
  await expect(menu.locator('[role="menuitem"] > span').first()).toHaveCSS(
    "filter",
    "blur(0px)",
  );
  await page.mouse.click(2, 120);
  await expect(demo.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toBeVisible();
  expect(errors).toEqual([]);
});
