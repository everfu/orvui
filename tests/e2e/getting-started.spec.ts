import { expect } from "@playwright/test";
import { test } from "./fixtures";

for (const locale of ["", "/en"])
  for (const channel of ["", "/beta"]) {
    const en = locale === "/en",
      prefix = channel + locale;
    test(`getting started ${prefix || "stable zh"} previews, FAQ and installation paths work`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/guide`);
      await expect(page.locator("#docs-content h1")).toHaveText(
        en ? "Introduction" : "介绍",
      );
      const preview = page.locator(".guide-preview");
      await preview
        .getByRole("button", {
          name: en ? "Add component" : "添加组件",
          exact: true,
        })
        .click();
      await expect(
        preview.getByRole("button", {
          name: en ? "Added" : "已添加",
          exact: true,
        }),
      ).toBeVisible();
      await preview.getByRole("switch").click();
      await expect(preview.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false",
      );
      const slider = preview.getByRole("slider");
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(preview.locator("output")).toContainText("65");
      await page
        .getByRole("button", {
          name: en ? "Do I need Tailwind CSS?" : "需要安装 Tailwind CSS 吗？",
          exact: true,
        })
        .click();
      await expect(page.locator(".guide-faq")).toContainText(
        en ? "compiled styles" : "预编译样式",
      );
      // Old inbound links still resolve to a visible section of the reorganized introduction.
      await page.goto(`${prefix}/guide#import-components`);
      await expect(page.locator("#import-components")).toHaveCount(1);
      await page
        .locator(
          `.guide-link-cards a[href="${prefix}/docs/installation#package"]`,
        )
        .first()
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${prefix}/docs/installation#package$`),
      );
      await expect(page.locator("#docs-content h1")).toHaveText(
        en ? "Quick Start" : "快速开始",
      );
      const command = page
        .locator(".guide-install-command")
        .filter({
          hasText: channel ? "orvui-vue-0.2.0-beta.1.tgz" : "@orvui/vue",
        })
        .first();
      await command.getByRole("tab", { name: "npm", exact: true }).click();
      await expect(command.locator(".code-content")).toContainText(
        "npm install",
      );
      await command
        .getByRole("button", {
          name: en ? "Copy code" : "复制代码",
          exact: true,
        })
        .click();
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toBe(
        channel
          ? "npm install ./orvui-vue-0.2.0-beta.1.tgz"
          : "npm install @orvui/vue",
      );
      const markdown = await page.request.get(`${prefix}/guide.md`);
      expect(markdown.status()).toBe(200);
      const text = await markdown.text();
      expect(text).toContain('<a id="import-components"></a>');
      expect(text).toContain(
        en ? "Do I need Tailwind CSS?" : "需要安装 Tailwind CSS 吗？",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.reload();
      await expect(page.locator("#docs-content h1")).toHaveText(
        en ? "Quick Start" : "快速开始",
      );
    });
  }
