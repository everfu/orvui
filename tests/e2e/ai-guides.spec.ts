import { expect, test, type Response } from "@playwright/test";

for (const locale of ["zh", "en"] as const) {
  test(`${locale} AI guides render on the server, hydrate, navigate and provide the offline skill`, async ({
    page,
  }, info) => {
    const prefix = locale === "en" ? "/en" : "";
    const errors: { message: string; url: string }[] = [];
    const documents = new Map<string, Response>();
    const challenges = new Set<string>();
    const challengeChecks: Promise<void>[] = [];
    page.on("pageerror", (error) =>
      errors.push({ message: error.message, url: "" }),
    );
    page.on("response", (response) => {
      if (response.request().resourceType() === "document")
        documents.set(response.url(), response);
      if (
        response.status() === 403 &&
        /\/docs\/(?:mcp-server|agent-skills)$/.test(
          new URL(response.url()).pathname,
        )
      )
        challengeChecks.push(
          (async () => {
            const body = await response.text().catch(() => "");
            if (
              /we are verifying your connection/i.test(body) &&
              /netlify\.com\/security/.test(body)
            )
              challenges.add(response.url());
          })(),
        );
    });
    page.on("console", (message) => {
      if (
        message.type() === "error" ||
        /hydration|mismatch/i.test(message.text())
      )
        errors.push({ message: message.text(), url: message.location().url });
    });
    await page.route("https://api.github.com/**", (route) =>
      route.fulfill({ json: { stargazers_count: 100 } }),
    );
    await page.goto(`${prefix}/docs/mcp-server`);
    await expect(page).toHaveTitle(/MCP/);
    await expect(page.locator("#docs-content h1")).toContainText("MCP");
    const response = documents.get(page.url());
    expect(response?.status()).toBe(200);
    expect(await response!.text()).toContain("get_component_docs");
    await expect(page.locator("#docs-content")).toContainText(
      "get_component_skill",
    );
    await expect(page.locator("vite-error-overlay")).toHaveCount(0);
    // A Netlify connection check may finish navigation after goto resolves.
    // Highlighting starts on mount, so wait for it before testing interactions.
    await expect(
      page.locator("#docs-content .code-panel .shiki").first(),
    ).toBeVisible({ timeout: 15000 });
    const copy = page.locator("#docs-content .code-copy-button").first();
    await copy.click();
    await expect(copy).toHaveAttribute(
      "aria-label",
      locale === "en" ? "Copied" : "已复制",
    );
    await page.screenshot({
      path: `artifacts/reports/ai/${info.project.name}-${locale}-mcp.png`,
      animations: "disabled",
    });
    await page
      .locator(`#docs-content a[href="${prefix}/docs/agent-skills"]`)
      .first()
      .click();
    await expect(page).toHaveURL(`${prefix}/docs/agent-skills`);
    await expect(page.locator("#docs-content h1")).toHaveText("Agent Skills");
    const archive = page.locator('a[href="/orvui-agent/orvui-skill.zip"]');
    await expect(archive).toBeVisible();
    const [saved] = await Promise.all([
      page.waitForEvent("download"),
      archive.click(),
    ]);
    expect(saved.suggestedFilename()).toBe("orvui-skill.zip");
    expect(await saved.failure()).toBeNull();
    const download = await page.request.get("/orvui-agent/orvui-skill.zip");
    expect(download.status()).toBe(200);
    expect((await download.body()).subarray(0, 4).toString("hex")).toBe(
      "504b0304",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/reports/ai/${info.project.name}-${locale}-skills.png`,
      animations: "disabled",
    });
    await page.reload();
    await expect(page.locator("#docs-content h1")).toHaveText("Agent Skills");
    expect(documents.get(page.url())?.status()).toBe(200);
    await Promise.all(challengeChecks);
    // Netlify can challenge a navigation, then let the browser complete its
    // normal connection check. Require the final document to be 200 and retain
    // the challenge in the report; do not suppress application errors or gates
    // the browser did not resolve itself.
    const unresolved = errors.filter(
      (error) =>
        !(
          /status of 403/.test(error.message) &&
          challenges.has(error.url) &&
          documents.get(error.url)?.status() === 200
        ),
    );
    for (const url of challenges)
      info.annotations.push({
        type: "netlify-connection-check",
        description: `${url}: ${documents.get(url)?.status() === 200 ? "resolved normally" : "unresolved"}`,
      });
    expect(unresolved).toEqual([]);
  });
}
