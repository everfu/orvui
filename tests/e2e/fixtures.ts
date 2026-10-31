import { expect, test as base } from "@playwright/test";

export const test = base.extend<{ runtimeChecks: void }>({
  runtimeChecks: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" ||
          /hydration|mismatch/i.test(message.text())
        )
          errors.push(message.text());
      });
      await page.route("https://api.github.com/repos/everfu/orvui", (route) =>
        route.fulfill({ json: { stargazers_count: 0 } }),
      );
      await page.addInitScript(() =>
        localStorage.setItem("orvui-theme", "dark"),
      );
      await use();
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});
