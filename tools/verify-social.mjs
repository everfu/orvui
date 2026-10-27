import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, process.argv[2] ?? "apps/docs/.vitepress/dist");
const origin = "https://orvui.efu.me";
const entities = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };
const decode = (value) =>
  value.replace(/&(amp|quot|apos|lt|gt);/g, (_, name) => entities[name]);
const pages = readdirSync(dist, { recursive: true }).filter((file) =>
  file.endsWith(".html"),
);
function sourcePages(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (
      ["node_modules", "public"].includes(entry.name) ||
      entry.name.startsWith(".")
    )
      return [];
    const path = prefix + entry.name;
    if (entry.isDirectory())
      return sourcePages(resolve(directory, entry.name), path + "/");
    return entry.name.endsWith(".md") ? [path.replace(/\.md$/, ".html")] : [];
  });
}
const expected = new Set([
  ...sourcePages(resolve(root, "apps/docs")),
  "404.html",
]);
assert.deepEqual(
  new Set(pages),
  expected,
  "The build must contain every documentation page, including 404.",
);
let checked = 0;
for (const file of pages) {
  const html = readFileSync(resolve(dist, file), "utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert(head, `${file}: missing HTML head`);
  const tags = [...head.matchAll(/<(meta|link)\s+[^>]*>/g)].map((match) => ({
    tag: match[1],
    ...Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
        key,
        decode(value),
      ]),
    ),
  }));
  const values = (key) =>
    tags.filter((tag) => tag.property === key || tag.name === key);
  const single = (key) => {
    const matches = values(key);
    assert.equal(matches.length, 1, `${file}: expected exactly one ${key}`);
    assert(matches[0].content, `${file}: empty ${key}`);
    return matches[0].content;
  };
  const canonical = tags.filter(
    (tag) => tag.tag === "link" && tag.rel === "canonical",
  );
  if (file === "404.html" || file.endsWith("/404.html")) {
    assert.match(single("robots"), /noindex/);
    assert.equal(canonical.length, 0, `${file}: 404 canonical`);
    assert(
      !tags.some(
        (tag) =>
          tag.property?.startsWith("og:") || tag.name?.startsWith("twitter:"),
      ),
      `${file}: 404 share metadata`,
    );
    continue;
  }
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  assert.equal(single("og:title"), title, `${file}: title mismatch`);
  assert.equal(single("twitter:title"), title);
  const description = single("description");
  assert.equal(single("og:description"), description);
  assert.equal(single("twitter:description"), description);
  assert.equal(single("og:type"), "website");
  assert.equal(single("og:site_name"), "orvui");
  assert.equal(single("twitter:card"), "summary_large_image");
  assert.equal(single("robots"), "index, follow");
  const path =
    "/" + file.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  assert.equal(canonical.length, 1, `${file}: canonical count`);
  assert.equal(single("og:url"), origin + path);
  assert.equal(canonical[0].href, origin + path);
  assert.equal(single("og:locale"), file.startsWith("en/") ? "en_US" : "zh_CN");
  assert.equal(
    single("og:locale:alternate"),
    file.startsWith("en/") ? "zh_CN" : "en_US",
  );
  const image = single("og:image");
  assert.equal(new URL(image).origin, origin);
  assert.equal(single("twitter:image"), image);
  assert.equal(single("og:image:type"), "image/png");
  assert.equal(single("og:image:width"), "1200");
  assert.equal(single("og:image:height"), "630");
  assert.equal(single("twitter:image:alt"), single("og:image:alt"));
  const imagePath = resolve(dist, "." + new URL(image).pathname);
  const bytes = readFileSync(imagePath);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), 1200);
  assert.equal(bytes.readUInt32BE(20), 630);
  assert(statSync(imagePath).size < 300_000, "Share image exceeds 300 kB.");
  checked++;
}
console.log(
  `Verified static social metadata for ${checked} pages and the 404 page; share PNG is 1200 × 630.`,
);
