import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures";

test("SVG loader keyframes stay valid during animation, preference changes and route cleanup", async ({
  page,
}, info) => {
  await page.goto("/components/motion/loader");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const ball = page
    .locator('.demo-content [role="status"]')
    .nth(7)
    .locator("circle")
    .first();
  const first = Number(await ball.getAttribute("cx"));
  await expect
    .poll(async () => Math.abs(Number(await ball.getAttribute("cx")) - first))
    .toBeGreaterThan(2);
  for (let i = 0; i < 8; i++) {
    const invalid = await page
      .locator(".demo-content svg")
      .evaluateAll((elements) =>
        elements
          .flatMap((svg) => [svg, ...svg.querySelectorAll("*")])
          .flatMap((el) =>
            ["cx", "cy", "opacity"]
              .filter(
                (name) =>
                  el.hasAttribute(name) &&
                  !Number.isFinite(Number(el.getAttribute(name))),
              )
              .map((name) => name + "=" + el.getAttribute(name)),
          ),
      );
    expect(invalid).toEqual([]);
    await page.waitForTimeout(45);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(ball).toHaveAttribute("cx", "40");
  await page.locator(".preview-stage").screenshot({
    path: `artifacts/reports/component-audit/${info.project.name}-loader.png`,
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(async () => Math.abs(Number(await ball.getAttribute("cx")) - 40))
    .toBeGreaterThan(2);
  await page.goto("/charts/sankey-chart");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await page.waitForTimeout(300);
});

test("home control composition keeps magnetic geometry and OTP success inside its column", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator(".home-showcase")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const buttons = page.locator(".home-button-samples button");
  const widths = await buttons.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().width),
  );
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(2);
  const otp = page.getByRole("textbox", { name: "输入验证码", exact: true });
  await otp.scrollIntoViewIfNeeded();
  await otp.focus();
  await otp.press("Home");
  await otp.pressSequentially("432089");
  await expect(page.locator(".home-otp-control")).toHaveAttribute(
    "data-status",
    "success",
  );
  const bounds = await page.locator(".home-otp-control").evaluate((el) => ({
    right: el.getBoundingClientRect().right,
    children: [...el.querySelectorAll("fieldset *")]
      .filter((node) => node.getBoundingClientRect().width > 0)
      .map((node) => node.getBoundingClientRect().right),
  }));
  expect(Math.max(...bounds.children)).toBeLessThanOrEqual(bounds.right + 1);
  await expect(page.locator(".home-otp-control fieldset > span")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.waitForTimeout(450);
  await page.locator(".home-otp").screenshot({
    path: `artifacts/reports/component-audit/${info.project.name}-otp-success.png`,
  });
  await page.getByRole("button", { name: "重新发送", exact: true }).click();
  await expect(page.locator(".home-otp-control")).toHaveAttribute(
    "data-status",
    "idle",
  );
  await expect(page.locator('.home-otp [data-filled="true"]')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("composition legend retains its selected border and clears pinned state", async ({
  page,
}, info) => {
  await page.goto("/charts/composition-chart");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const legend = page
    .getByRole("button", { name: "Highlight Organic search", exact: true })
    .first();
  await legend.click();
  await expect(legend).toHaveAttribute("aria-pressed", "true");
  expect(
    await legend.evaluate((el) => getComputedStyle(el).boxShadow),
  ).not.toBe("none");
  const stage = page.locator(".preview-stage").first();
  await stage.screenshot({
    path: `artifacts/reports/component-audit/${info.project.name}-composition-selected.png`,
  });
  await legend.press("Escape");
  await expect(legend).toHaveAttribute("aria-pressed", "false");
});

test("reduced wheel fallback centers its controlled date and follows a clicked row", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/motion/wheel-picker");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const lists = page.locator(".demo-content ul");
  await expect(lists).toHaveCount(3);
  await expect
    .poll(() =>
      lists.evaluateAll((nodes) => nodes.map((node) => node.scrollTop)),
    )
    .toEqual([210, 336, 1008]);
  await page.getByRole("button", { name: "May", exact: true }).click();
  await expect(page.locator(".demo-content")).toContainText("May 9, 2004");
  await expect
    .poll(() => lists.first().evaluate((node) => node.scrollTop))
    .toBe(168);
  await page.locator(".preview-stage").screenshot({
    path: `artifacts/reports/component-audit/${info.project.name}-wheel-selected.png`,
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const month = page.getByRole("listbox", { name: "Month", exact: true });
  await month.focus();
  await month.press("ArrowDown");
  await expect(page.locator(".demo-content")).toContainText("June 9, 2004");
});

test("dock preview keeps its native target sizes reachable in a narrow viewport", async ({
  page,
}, info) => {
  await page.goto("/components/motion/dock");
  await expect(page.locator(".demo-content")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const scroller = page.locator(".demo-content > div");
  const last = scroller.locator('[aria-label="GitHub"]');
  await expect(scroller).toHaveCSS("overflow-x", "auto");
  await page.getByRole("button", { name: "Settings", exact: true }).focus();
  if (info.project.use.isMobile) {
    await scroller.hover();
    await page.mouse.wheel(400, 0);
    await expect
      .poll(() => scroller.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0);
  }
  const visible = await last.evaluate((el) => {
    const button = el.getBoundingClientRect();
    const viewport = el.closest(".overflow-x-auto")!.getBoundingClientRect();
    return button.left >= viewport.left && button.right <= viewport.right;
  });
  expect(visible).toBe(true);
  await page.locator(".preview-stage").screenshot({
    path: `artifacts/reports/component-audit/${info.project.name}-dock.png`,
  });
});
