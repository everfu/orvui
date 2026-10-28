import { expect, test, type Page } from "@playwright/test";

const scenes = [
  ["components", "组件", "Components"],
  ["dashboard", "仪表盘", "Dashboard"],
  ["mail", "邮件", "Mail"],
  ["chat", "聊天", "Chat"],
  ["finances", "财务", "Finances"],
  ["crm", "CRM", "CRM"],
] as const;

test.beforeEach(async ({ page }) => {
  // Isolate the existing header's optional GitHub metadata from local acceptance.
  await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
    route.fulfill({ json: { stargazers_count: 0 } }),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" ||
      /hydration|mismatch/i.test(message.text())
    )
      errors.push(message.text() + " " + message.location().url);
  });
  (page as Page & { homeErrors: string[] }).homeErrors = errors;
  await page.addInitScript(() => {
    if (window === window.top) localStorage.setItem("orvui-theme", "dark");
  });
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { homeErrors: string[] }).homeErrors).toEqual([]);
});
async function openHome(page: Page, url = "/") {
  await page.goto(url);
  await expect(page.locator(".home-showcase")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 30000 },
  );
}
async function scene(page: Page, id: string, en = false) {
  const item = scenes.find((item) => item[0] === id)!;
  await page
    .getByRole("tablist", {
      name: en ? "Showcase scenes" : "展示场景",
      exact: true,
    })
    .getByRole("tab", { name: item[en ? 2 : 1], exact: true })
    .click();
  await expect(page.locator(`[data-scene="${id}"]`)).toBeVisible();
  await expect(page.locator(".home-scene-panel")).toHaveAttribute(
    "aria-busy",
    "false",
  );
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

test("compact installation and six real component compositions", async ({
  page,
}, info) => {
  await openHome(page);
  const install = await page.locator(".home-install").boundingBox();
  const showcase = await page.locator(".home-showcase").boundingBox();
  expect(install!.y + install!.height).toBeLessThanOrEqual(showcase!.y + 1);
  if (info.project.name === "desktop") expect(showcase!.y).toBeLessThan(780);
  await expect(
    page
      .getByRole("tablist", { name: "展示场景", exact: true })
      .getByRole("tab"),
  ).toHaveCount(6);
  await expect(page.locator('.home-palette input[type="radio"]')).toHaveCount(
    11,
  );
  await page
    .getByRole("textbox", { name: "你的邮箱", exact: true })
    .fill("demo@example.com");
  await page.getByRole("button", { name: "选择地区", exact: true }).click();
  await page.getByRole("option", { name: "亚洲", exact: true }).click();
  const slider = page
    .locator('[data-scene="components"]')
    .getByRole("slider", { name: "价格", exact: true });
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "500");
  await page.getByRole("switch", { name: "示例开关", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "示例开关", exact: true }),
  ).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "保存更改", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "更改已保存", exact: true }),
  ).toBeVisible();
  await page.locator(".home-install .command-copy").click();
  await expect(page.locator(".home-install .command-copy")).toHaveAttribute(
    "aria-label",
    "已复制",
  );
  await noOverflow(page);
});

test("dashboard search, filter, charts and CSV export operate on local data", async ({
  page,
}) => {
  await openHome(page);
  await scene(page, "dashboard");
  const app = page.locator('[data-scene="dashboard"]');
  await app
    .getByRole("textbox", { name: "搜索成员", exact: true })
    .fill("Maya");
  await expect(app.getByRole("table")).toContainText("Maya Chen");
  await expect(app.getByRole("table")).not.toContainText("Sam Rivera");
  await app.getByRole("textbox", { name: "搜索成员", exact: true }).fill("");
  await app.getByRole("button", { name: "筛选", exact: true }).click();
  await expect(app.getByRole("table")).not.toContainText("Sam Rivera");
  await app.getByRole("button", { name: "排序", exact: true }).click();
  await expect(app.locator('th[aria-sort="ascending"]')).toHaveCount(1);
  const download = page.waitForEvent("download");
  await app.getByRole("button", { name: "下载", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("orvui-team.csv");
  const plot = app.locator(".home-trend-plot input").first();
  await plot.focus();
  await plot.press("Home");
  await expect(app.locator(".home-trend-readout").first()).toContainText("01");
  await noOverflow(page);
});

test("mail selects, archives and composes sample messages without sending email", async ({
  page,
}) => {
  await openHome(page);
  await scene(page, "mail");
  const app = page.locator('[data-scene="mail"]');
  await app
    .locator(".home-mail-select")
    .filter({ hasText: "工作台设计评审" })
    .click();
  await expect(app.locator(".home-mail-message h3")).toHaveText(
    "工作台设计评审",
  );
  await app.getByRole("button", { name: "归档邮件", exact: true }).click();
  await expect(
    app.locator(".home-mail-select").filter({ hasText: "工作台设计评审" }),
  ).toHaveCount(0);
  await app.getByRole("button", { name: "撰写", exact: true }).click();
  const composer = page.getByRole("dialog", {
    name: "撰写演示邮件",
    exact: true,
  });
  await composer
    .getByRole("textbox", { name: "收件人", exact: true })
    .fill("demo@example.com");
  await composer
    .getByRole("textbox", { name: "主题", exact: true })
    .fill("本地组合测试");
  await composer
    .getByRole("textbox", { name: "内容", exact: true })
    .fill("这封邮件只保存在演示状态中。");
  await composer
    .getByRole("button", { name: "保存到演示已发送", exact: true })
    .click();
  await expect(app.locator(".home-mail-message h3")).toHaveText("本地组合测试");
  await expect(composer).not.toBeVisible();
  await scene(page, "components");
  await scene(page, "mail");
  await expect(
    app.locator(".home-mail-select").filter({ hasText: "本地组合测试" }),
  ).toHaveCount(0);
  await noOverflow(page);
});

test("chat has code, tools, media and local stoppable generation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openHome(page);
  await scene(page, "chat");
  const app = page.locator('[data-scene="chat"]');
  await expect(app.locator(".home-chat-transcript")).toContainText(
    "Composition API",
  );
  await app.getByRole("button", { name: "Allow once", exact: true }).click();
  await expect(app.getByText("Approved", { exact: true })).toBeVisible();
  const prompt = app.getByRole("textbox", { name: "聊天消息", exact: true });
  await prompt.fill("组合一个新的工作空间");
  await prompt.press("Enter");
  await expect(
    app.getByRole("button", { name: "Stop generating", exact: true }),
  ).toBeVisible();
  await app
    .getByRole("button", { name: "Stop generating", exact: true })
    .click();
  await expect(app.getByText("已停止生成", { exact: true })).toBeVisible();
  const stopped = await app.locator(".home-response").textContent();
  await page.waitForTimeout(200);
  expect(await app.locator(".home-response").textContent()).toBe(stopped);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await app
    .getByRole("button", { name: "Retry response", exact: true })
    .last()
    .click();
  await expect(app.locator(".home-response")).toContainText("orvui");
  await scene(page, "components");
  await scene(page, "chat");
  await expect(app.locator(".home-response")).toHaveCount(0);
  await noOverflow(page);
});

test("portfolio ranges, holdings and CRM forecast are interactive", async ({
  page,
}) => {
  await openHome(page);
  await scene(page, "finances");
  const app = page.locator('[data-scene="finances"]');
  const before = await app
    .locator(".home-portfolio-grid .home-trend-axis")
    .textContent();
  await app.getByRole("tab", { name: "1Y", exact: true }).click();
  await expect(
    app.locator(".home-portfolio-grid .home-trend-axis"),
  ).not.toHaveText(before!);
  await app.getByRole("button", { name: "查看全部持仓", exact: true }).click();
  await expect(app.locator(".home-holding-row")).toHaveCount(8);
  await app.getByRole("button", { name: "兑换", exact: true }).click();
  await expect(
    page.getByText("兑换预览已生成，本地演示", { exact: true }),
  ).toBeVisible();
  await scene(page, "crm");
  const crm = page.locator('[data-scene="crm"]');
  await expect(crm.locator(".home-crm-kpis .home-stat")).toHaveCount(6);
  const forecast = crm.getByRole("button", { name: /开放商机/ });
  await forecast.click();
  await expect(forecast).toHaveAttribute("aria-pressed", "true");
  await crm.getByRole("button", { name: /^日期范围:/ }).click();
  await expect(page.getByRole("grid")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("grid")).not.toBeVisible();
  await noOverflow(page);
});

test("application sidebar supports collapse and mobile navigation", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openHome(page);
  await scene(page, "dashboard");
  const app = page.locator('[data-scene="dashboard"]');
  await app.locator('.home-app-header [data-slot="sidebar-trigger"]').click();
  if (info.project.name === "mobile") {
    const dialog = page.getByRole("dialog", {
      name: "示例应用导航",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "订单", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(app.locator(".home-app-title")).toContainText("订单");
  } else {
    for (const id of ["dashboard", "mail", "chat", "finances", "crm"]) {
      if (id !== "dashboard") {
        await scene(page, id);
        await page
          .locator(
            `[data-scene="${id}"] .home-app-header [data-slot="sidebar-trigger"]`,
          )
          .click();
      }
      const current = page.locator(`[data-scene="${id}"]`);
      const sidebar = current.locator('aside[data-slot="sidebar"]');
      await expect(sidebar).toHaveAttribute("data-state", "collapsed");
      await expect(sidebar).toHaveCSS("width", "0px");
      await expect(sidebar.locator(":scope > div")).toHaveAttribute(
        "inert",
        "",
      );
      const layout = await current.evaluate((el) => ({
        frame: el.querySelector(".home-app-frame")!.getBoundingClientRect()
          .left,
        main: el.querySelector(".home-app-main")!.getBoundingClientRect().left,
      }));
      expect(Math.abs(layout.main - layout.frame - 1)).toBeLessThan(1);
      if (id === "dashboard")
        await current.locator(".home-app-frame").screenshot({
          path: `artifacts/reports/sidebar-collapse/${info.project.name}-collapsed.png`,
        });
      const trigger = current.locator(
        '.home-app-header [data-slot="sidebar-trigger"]',
      );
      await trigger.focus();
      await trigger.press("Enter");
      await expect(sidebar).toHaveAttribute("data-state", "expanded");
      await expect(sidebar).toHaveCSS("width", "210px");
      await expect(sidebar.locator(":scope > div")).not.toHaveAttribute(
        "inert",
        "",
      );
    }
  }
  await noOverflow(page);
});

test("recent Sankey preview has valid paths before and after viewport changes", async ({
  page,
}) => {
  await openHome(page);
  const latest = page.locator(".landing-card").first();
  await latest.scrollIntoViewIfNeeded();
  const paths = latest.locator(
    '[data-slot="sankey-chart-plot"] path[stroke^="url("]',
  );
  await expect(paths).toHaveCount(9);
  for (const path of await paths.all()) {
    await expect(path).toHaveAttribute("d", /^M /);
    await expect(path).toHaveAttribute("stroke-width", /^[\d.]+$/);
  }
  await scene(page, "dashboard");
  await latest.scrollIntoViewIfNeeded();
  for (const path of await paths.all())
    await expect(path).toHaveAttribute("d", /^M /);
});

test("palette shortcuts and header share one state across routes", async ({
  page,
}) => {
  await openHome(page);
  await page
    .locator('.home-palette label:has([data-palette="violet"])')
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "violet");
  await page.getByRole("button", { name: "自定义主题", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "自定义主题", exact: true });
  await expect(
    dialog.getByRole("button", { name: "紫罗兰", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await dialog.getByRole("button", { name: "青色", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-palette="teal"]')).toBeChecked();
  await page.locator(".hero-actions a").first().click();
  await expect(page).toHaveURL(/\/guide$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "teal");
  await page.locator(".brand").click();
  await expect(page.locator('[data-palette="teal"]')).toBeChecked();
});

for (const en of [false, true])
  for (const mode of ["dark", "light"]) {
    test(`six compositions fit ${en ? "English" : "Chinese"} in ${mode} mode`, async ({
      page,
    }, info) => {
      await openHome(page, en ? "/en/" : "/");
      const appearance = page.locator(
        `.header-tools [data-tabs-value="${mode}"]`,
      );
      if (await appearance.isVisible()) await appearance.click();
      else {
        await page
          .getByRole("button", {
            name: en ? "Open navigation" : "打开导航",
            exact: true,
          })
          .click();
        await page
          .locator(`.mobile-header-settings [data-tabs-value="${mode}"]`)
          .click();
        await page.keyboard.press("Escape");
        await expect(page.locator(".mobile-menu-content")).not.toBeVisible();
      }
      for (const [id] of scenes) {
        await scene(page, id, en);
        await noOverflow(page);
        await page
          .locator(".home-showcase-toolbar")
          .evaluate((element) => element.scrollIntoView({ block: "start" }));
        await page.evaluate(() => window.scrollBy(0, -80));
        await page.screenshot({
          path: `artifacts/reports/home-showcase/${info.project.name}-${en ? "en" : "zh"}-${mode}-${id}.png`,
          animations: "allow",
        });
      }
    });
  }
