import assert from "node:assert/strict";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createDocsPages } from "./routes";
import {
  applySocialMetadata,
  documentTitle,
} from "../../apps/docs/app/utils/docs/page-metadata";
import { getSitePage } from "../../apps/docs/app/utils/docs/site-page-data";
import { getComponentAbout } from "../../apps/docs/app/utils/docs/details";
import catalog from "../catalog/components.json";
import {
  componentGroups,
  groupedComponentPath,
} from "../../apps/docs/app/utils/docs/document-sections";
import { templateDefinitions } from "../../apps/docs/app/utils/docs/template-definitions";
import { documentOutline } from "../../apps/docs/app/utils/docs/document-outline";
import {
  isComponentNew,
  NEW_BADGE_SNAPSHOT,
} from "../../apps/docs/app/composables/new-badge";

const origin =
  process.argv[2] ?? process.env.ORVUI_NUXT_URL ?? "http://127.0.0.1:5174";
const pages = createDocsPages();
const decode = (value: string) =>
  value
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, number: string) =>
      String.fromCodePoint(
        number[0]!.toLowerCase() === "x"
          ? parseInt(number.slice(1), 16)
          : parseInt(number, 10),
      ),
    )
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
const get = (path: string) =>
  fetch(new URL(path, origin), { headers: { accept: "text/html" } });
const checked: string[] = [];
const failures: string[] = [];
async function checkPage(page: (typeof pages)[number]) {
  const response = await get(page.path);
  assert.equal(response.status, 200, `${page.path}: HTTP status`);
  const html = await response.text();
  assert.match(html, /<div[^>]+id="__nuxt"/, `${page.path}: Nuxt app`);
  assert.equal(
    decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
    documentTitle(page),
    `${page.path}: title`,
  );
  assert.match(html, /<h1\b[^>]*>[\s\S]+?<\/h1>/, `${page.path}: SSR heading`);
  // Check meaningful rendered content, outside Nuxt's serialized payload.
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";
  const text = decode(
    body
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " "),
  ).replace(/\s+/g, " ");
  const en = page.path.startsWith("/en/");
  const fm = page.frontmatter;
  if (fm.layout !== "home") {
    const category = catalog.categories.find(
      (category) => category.slug === fm.category,
    );
    const outline = documentOutline({
      layout: String(fm.layout),
      category,
      entry: category?.components.find((entry) => entry.slug === fm.slug),
      page: fm.sitePage as Parameters<typeof documentOutline>[0]["page"],
      en,
      isNew: (entry) => isComponentNew(entry, NEW_BADGE_SNAPSHOT),
    });
    const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    for (const item of outline) {
      assert.equal(
        ids.filter((id) => id === item.id).length,
        1,
        `${page.path}: unique outline target ${item.id}`,
      );
      if (fm.layout !== "templates") assert.ok(
        body.includes(`href="#${encodeURIComponent(item.id)}"`),
        `${page.path}: SSR outline link ${item.id}`,
      );
    }
  }
  if (fm.sitePage === "installation") {
    assert.ok(
      text.includes("import.meta.url"),
      `${page.path}: literal import-meta example`,
    );
    assert.ok(
      !text.includes("globalThis._importMeta_"),
      `${page.path}: build must not rewrite example code`,
    );
  }
  if (fm.layout === "component") {
    const about = getComponentAbout(String(fm.category), String(fm.slug), en);
    assert.ok(about, `${page.path}: component content definition`);
    assert.ok(
      text.includes(about.overview.replace(/\s+/g, " ")),
      `${page.path}: SSR component overview`,
    );
    assert.ok(body.includes('id="api-reference"'), `${page.path}: SSR API`);
  } else if (fm.layout === "site-page") {
    const guide = getSitePage(fm.sitePage as Parameters<typeof getSitePage>[0]);
    assert.ok(
      text.includes(
        decode(
          guide.description[en ? "en" : "zh"].replace(/<[^>]*>/g, " "),
        ).replace(/\s+/g, " "),
      ),
      `${page.path}: SSR guide introduction`,
    );
    for (const section of guide.sections)
      assert.ok(
        body.includes(`id="${section.id}"`),
        `${page.path}: SSR section ${section.id}`,
      );
  } else if (fm.layout === "category") {
    const category = catalog.categories.find(
      (item) => item.slug === fm.category,
    )!;
    for (const entry of category.components)
      assert.ok(
        body.includes(`href="${page.path}/${entry.slug}"`),
        `${page.path}: SSR component link ${entry.slug}`,
      );
  } else if (fm.layout === "components") {
    assert.equal(
      (body.match(/class="docs-catalog-card"/g) ?? []).length,
      110,
      `${page.path}: SSR component cards`,
    );
    for (const group of componentGroups) {
      for (const entry of group.entries) {
        assert.ok(
          body.includes(`href="${groupedComponentPath(entry, en)}"`),
          `${page.path}: component ${entry.slug}`,
        );
      }
    }
  } else if (fm.layout === "templates") {
    assert.equal(
      (body.match(/class="template-gallery-card"/g) ?? []).length,
      5,
      `${page.path}: SSR template cards`,
    );
    for (const template of templateDefinitions) {
      assert.ok(
        body.includes(`href="${en ? "/en" : ""}/templates/${template.slug}"`),
        `${page.path}: template ${template.slug}`,
      );
    }
  } else if (fm.layout === "template") {
    assert.ok(
      body.includes('class="template-document"'),
      `${page.path}: SSR template document`,
    );
    assert.ok(
      body.includes(`href="https://orvui-template-${fm.templateSlug}.netlify.app?lang=`) || body.includes(`href="https://orvui-template-${fm.templateSlug}.netlify.app/?lang=`),
      `${page.path}: independent live preview`,
    );
  } else {
    assert.equal(fm.layout, "home", `${page.path}: recognized page layout`);
    assert.ok(body.includes('class="landing-hero"'), `${page.path}: SSR home`);
  }
  assert.ok(
    html.includes(`lang="${page.path.startsWith("/en/") ? "en" : "zh-CN"}"`),
    `${page.path}: language`,
  );
  const metadata = { ...page, frontmatter: { ...page.frontmatter } };
  applySocialMetadata(metadata);
  assert.equal(
    decode(
      html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "",
    ),
    metadata.description,
    `${page.path}: localized description`,
  );
  assert.ok(
    !html.includes('class="demo-error"'),
    `${page.path}: no failed SSR demo`,
  );
  const tags = [
    ...(html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "").matchAll(
      /<(meta|link)\s+[^>]*>/g,
    ),
  ].map((match) => ({
    tag: match[1],
    ...Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
        key!,
        decode(value!),
      ]),
    ),
  })) as Array<Record<string, string>>;
  const expectedHead = (
    metadata.frontmatter as { head: [string, Record<string, string>][] }
  ).head;
  for (const [tag, attrs] of expectedHead) {
    const identity = attrs.property ? "property" : attrs.name ? "name" : "rel";
    const matches = tags.filter(
      (item) => item.tag === tag && item[identity] === attrs[identity],
    );
    assert.equal(
      matches.length,
      1,
      `${page.path}: exactly one ${attrs[identity]}`,
    );
    for (const [key, value] of Object.entries(attrs))
      assert.equal(
        matches[0]![key],
        value,
        `${page.path}: ${attrs[identity]} ${key}`,
      );
  }
  checked.push(page.path);
}
// Keep renderer and shader initialization bounded on development machines.
const queue = [...pages];
await Promise.all(
  Array.from({ length: 2 }, async () => {
    for (let page = queue.shift(); page; page = queue.shift()) {
      try {
        await checkPage(page);
      } catch (error) {
        failures.push(String(error));
      }
    }
  }),
);

for (const path of [
  "/missing-nuxt-page",
  "/en/missing-nuxt-page",
  "/components/motion/missing-nuxt-component",
]) {
  try {
    const response = await get(path);
    const html = await response.text();
    assert.equal(response.status, 404, `${path}: real 404`);
    assert.match(html, /noindex, nofollow/, `${path}: robots`);
    assert.ok(
      html.includes(path.startsWith("/en/") ? "Page not found" : "页面未找到"),
      `${path}: localized error`,
    );
  } catch (error) {
    failures.push(String(error));
  }
}

const registry = (await (
  await fetch(new URL("/r/registry.json", origin))
).json()) as {
  items: Array<{ name: string }>;
};
assert.ok(registry.items.length >= 109, "Complete registry index");
const downloads = pages
  .filter((page) =>
    ["component", "site-page", "components", "templates", "template"].includes(
      String(page.frontmatter.layout),
    ),
  )
  .map((page) => `${page.path}.md`);
const rawSources = catalog.categories.flatMap((category) =>
  category.components.map((entry) => `/r/${entry.slug}/raw.txt`),
);
const resources = [
  ...new Set([
    ...templateDefinitions.flatMap((template) => [
      `/templates/${template.slug}/preview.png`,
    ]),
    "/templates/manifest.json",
    "/favicon.svg",
    "/social/orvui-v2.png",
    "/fonts/source/geist-latin-400-normal.woff2",
    "/licenses/MIT.txt",
    "/licenses/orvui-NOTICE.txt",
    "/licenses/paper-design-PolyForm-Shield.txt",
    "/r/registry.json",
    "/registry.json",
    "/r/button.json",
    "/r/button/raw.txt",
    "/components/motion/button.md",
    "/en/components/motion/button.md",
    "/docs/installation.md",
    "/llms.txt",
    "/theme.css",
    "/orvui-agent/SKILL.md",
    "/changelog/rss.xml",
    ...downloads,
    ...rawSources,
    ...registry.items.map((item) => `/r/${item.name}.json`),
    ...readdirSync(resolve("apps/docs/public/fonts/source")).map(
      (file) => `/fonts/source/${file}`,
    ),
    ...readdirSync(resolve("apps/docs/public/licenses")).map(
      (file) => `/licenses/${file}`,
    ),
  ]),
];
for (const path of resources) {
  try {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, `${path}: resource`);
    if (path.startsWith("/r/"))
      assert.equal(
        response.headers.get("access-control-allow-origin"),
        "*",
        `${path}: public registry CORS`,
      );
    const data = new Uint8Array(await response.arrayBuffer());
    assert.ok(data.length > 0, `${path}: nonempty resource`);
    if (path.endsWith(".woff2"))
      assert.equal(
        new TextDecoder().decode(data.slice(0, 4)),
        "wOF2",
        `${path}: WOFF2 font`,
      );
    if (path.endsWith(".md"))
      assert.match(
        new TextDecoder()
          .decode(data)
          .replace(/^(?:<a id="[^"<>]+"><\/a>\r?\n)+/, ""),
        /^(?:# |---\r?\n)/,
        `${path}: Markdown body`,
      );
    assert.ok(
      !response.headers.get("content-type")?.includes("text/html"),
      `${path}: resource must not be application HTML`,
    );
  } catch (error) {
    failures.push(String(error));
  }
}
for (const path of [
  "/en/guide",
  "/guide",
  "/en/components/motion/button",
  "/components/motion/button",
]) {
  try {
    await checkPage(pages.find((page) => page.path === path)!);
  } catch (error) {
    failures.push(String(error));
  }
}
const report = {
  origin,
  pages: pages.length,
  checked: checked.length,
  resources: resources.length,
  markdownDownloads: downloads.length,
  rawSources: rawSources.length,
  registryItems: registry.items.length,
  failures,
};
const output = resolve("artifacts/reports/docs-nuxt");
mkdirSync(output, { recursive: true });
writeFileSync(
  resolve(output, "ssr.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
