import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("switches release, retains document state, navigates and reloads in both locales", async ({
  page,
}) => {
  for (const locale of ["", "/en"]) {
    await page.goto(`${locale}/components/motion/button?mode=package#usage`);
    const trigger = page.getByRole("button", {
      name: locale ? "Choose version" : "选择版本",
      exact: true,
    });
    await trigger.click();
    const panel = page.getByRole("dialog", {
      name: locale ? "Choose version" : "选择版本",
      exact: true,
    });
    await expect(panel).toBeVisible();
    await expect(panel.locator('[aria-current="page"]')).toContainText("0.1.1");
    await panel.getByRole("link").filter({ hasText: "Beta" }).click();
    await expect(page).toHaveURL(
      new RegExp(
        `/beta${locale}/components/motion/button\\?mode=package#usage$`,
      ),
    );
    await expect(trigger).toContainText("0.2.0-beta.1");
    await page.reload();
    await expect(page.locator("h1")).toContainText("Button");
    await page.locator(".beta-notice a").click();
    await expect(page).toHaveURL(
      new RegExp(`/beta${locale}/docs/installation$`),
    );
    await expect(page.locator("main")).toContainText("vue@3.6.0-rc.14");
    await expect(page.locator("main")).toContainText("pnpm beta:pack");
    await expect(page.locator("main")).toContainText(
      "pnpm add ./orvui-vue-0.2.0-beta.1.tgz",
    );
    await page
      .getByRole("button", {
        name: locale ? "Choose version" : "选择版本",
        exact: true,
      })
      .click();
    await panel.getByRole("link").filter({ hasText: "0.1.1" }).click();
    await expect(page).toHaveURL(new RegExp(`${locale}/docs/installation$`));
    await expect(page.locator(".beta-notice")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("pnpm beta:pack");
  }
});

test("supports keyboard dismissal and a viewport-clamped version menu", async ({
  page,
}) => {
  await page.goto("/beta/en/guide");
  const trigger = page.getByRole("button", {
    name: "Choose version",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const panel = page.getByRole("dialog", {
    name: "Choose version",
    exact: true,
  });
  await expect(panel.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("End");
  await expect(panel.getByRole("link").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  const bounds = await panel.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
  await page.locator("h1").click();
  await expect(panel).toHaveCount(0);
});
