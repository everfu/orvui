import assert from "node:assert/strict";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const base = resolve("apps/docs");
const output = resolve(base, ".netlify/functions-internal");
const metadata = JSON.parse(
  readFileSync(resolve(output, "nitro.json"), "utf8"),
);
assert.equal(metadata.preset, "netlify");
const { default: handler, config } = await import(
  pathToFileURL(resolve(output, "server/server.mjs")).href
);
assert.equal(typeof handler, "function");
assert.equal(config.path, "/*");
assert.equal(config.preferStatic, true);
assert.ok(config.excludedPath.includes("/_nuxt/*"));
const checked = [];
for (const path of ["/guide", "/en/docs/theme", "/components/motion/button"]) {
  const response = await handler(
    new Request("https://orvui.efu.me" + path, {
      headers: { accept: "text/html" },
    }),
  );
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<h1\b[^>]*>[\s\S]+?<\/h1>/, path);
  assert.ok(html.includes('rel="canonical"'), path);
  checked.push(path);
}
const missing = await handler(
  new Request("https://orvui.efu.me/en/missing-page", {
    headers: { accept: "text/html" },
  }),
);
assert.equal(missing.status, 404);
assert.match(await missing.text(), /noindex/);
for (const file of [
  "r/registry.json",
  "r/button.json",
  "r/button/raw.txt",
  "docs/theme.md",
  "fonts/source/geist-latin-400-normal.woff2",
  "licenses/MIT.txt",
  "licenses/orvui-NOTICE.txt",
  "_headers",
])
  assert.ok(existsSync(resolve(base, "dist", file)), file);
const headers = readFileSync(resolve(base, "dist/_headers"), "utf8");
assert.match(headers, /Access-Control-Allow-Origin: \*/);
const report = {
  passed: true,
  preset: metadata.preset,
  handlerRoute: config.path,
  checked,
  notFoundStatus: missing.status,
  staticResources: true,
  deployed: false,
};
const reports = resolve("artifacts/reports/docs-redesign");
mkdirSync(reports, { recursive: true });
writeFileSync(
  resolve(reports, "netlify.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
