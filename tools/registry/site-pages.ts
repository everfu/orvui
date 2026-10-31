import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import catalog from "../catalog/components.json";
import metadata from "./component-docs.json";
import type { ComponentDocs } from "./component-docs-types";
import {
  agentSkill,
  getSitePage,
  localize,
  resolveSiteCode,
  siteOrigin,
  sitePages,
  themeCss,
} from "../../apps/docs/app/utils/docs/site-page-data";
import {
  changelogAnchor,
  changelogEntries,
  excludedChangelogItems,
} from "../../apps/docs/app/utils/docs/site-changelog-data";
import { sitePageMarkdown } from "../../apps/docs/app/utils/docs/site-page-markdown";
import { templateDefinitions } from "../../apps/docs/app/utils/docs/template-definitions";
import { templateMarkdown, templatesIndexMarkdown, componentsIndexMarkdown } from "../../apps/docs/app/utils/docs/section-markdown";

export function buildSitePages(
  options: { root?: string; origin?: string } = {},
) {
  const root = resolve(options.root ?? process.cwd()),
    output = resolve(root, "apps/docs/public"),
    origin = siteOrigin(options.origin ?? process.env.ORVUI_REGISTRY_ORIGIN);
  const artifacts: string[] = [];
  const put = (file: string, content: string) => {
    const path = resolve(output, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    artifacts.push(file);
  };
  for (const page of sitePages)
    for (const en of [false, true])
      put(
        `${en ? "en/" : ""}${page.path.slice(1)}.md`,
        sitePageMarkdown(page.slug, en, origin),
      );
  for (const en of [false, true]) {
    const prefix = en ? "en/" : "";
    put(`${prefix}components.md`, componentsIndexMarkdown(en, origin));
    put(`${prefix}templates.md`, templatesIndexMarkdown(en, origin));
    for (const template of templateDefinitions) {
      put(`${prefix}templates/${template.slug}.md`, templateMarkdown(template.slug, en, origin));
    }
  }
  put(
    "theme.css",
    `/* orvui design system. MIT; product version ${catalog.product.version}. */\n${themeCss}`,
  );
  put("orvui-agent/SKILL.md", resolveSiteCode(agentSkill, origin));
  const registryFile = resolve(output, "r/registry.json");
  if (!existsSync(registryFile))
    throw new Error(
      "Build the component registry before the support-page resources.",
    );
  put("registry.json", readFileSync(registryFile, "utf8"));
  const docs = metadata as unknown as ComponentDocs;
  for (const category of catalog.categories)
    for (const entry of category.components) {
      const file =
        docs.entries[`${category.slug}/${entry.slug}`]?.default.primaryFile;
      if (!file || !existsSync(resolve(root, file)))
        throw new Error(
          `No actual primary Vue source for ${category.slug}/${entry.slug}`,
        );
      put(`r/${entry.slug}/raw.txt`, readFileSync(resolve(root, file), "utf8"));
    }
  const lines = [
    "# orvui",
    "",
    "> An independent Vue 3.5 UI system with expressive motion, composable APIs and copyable source.",
    "",
    "## Guides",
    ...sitePages.filter(page => page.slug !== "changelog").map(
      (page) => `- [${localize(page.title, true)}](${origin}${page.path}.md)`,
    ),
    "",
    "## Registry",
    `- [Registry index](${origin}/r/registry.json)`,
    `- [shadcn-vue catalog](${origin}/registry.json)`,
    `- [Local agent instructions](${origin}/orvui-agent/SKILL.md)`,
    "",
    "## Components",
  ];
  for (const category of catalog.categories)
    for (const item of category.components) {
      const path =
        category.slug === "charts"
          ? `/charts/${item.slug}`
          : `/components/${category.slug}/${item.slug}`;
      lines.push(
        `- [${item.name}](${origin}${path}.md): ${item.description.replace(/\bReact\b/g, "Vue")}`,
      );
    }
  lines.push("", "## Templates", ...templateDefinitions.map(template => `- [${template.name}](${origin}/templates/${template.slug}.md): ${template.description.en}`), "", "## Releases", `- [Releases](${origin}/changelog.md)`, `- [RSS](${origin}/changelog/rss.xml)`);
  put("llms.txt", lines.join("\n") + "\n");
  const xml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  const weeks = changelogEntries
    .map(
      (week) =>
        `<item><title>${xml(week.title.en)}</title><link>${xml(`${origin}/changelog#${changelogAnchor(week.date)}`)}</link><guid>${xml(`${origin}/changelog#${changelogAnchor(week.date)}`)}</guid><pubDate>${new Date(`${week.date}T00:00:00Z`).toUTCString()}</pubDate><description>${xml((week.summary ? `<p>${week.summary.en}</p>` : "") + "<ul>" + week.items.map((item) => `<li>${item.type}: ${item.text.en}${item.href ? ` <a href="${origin}${item.href}">${item.label ?? "Learn more"}</a>` : ""}</li>`).join("") + "</ul>")}</description></item>`,
    )
    .join("\n");
  put(
    "changelog/rss.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Component history · orvui</title><link>${xml(origin + "/changelog")}</link><description>${xml(getSitePage("changelog").description.en)}</description><language>en</language>\n${weeks}\n</channel></rss>\n`,
  );
  return {
    pages: sitePages.length,
    locales: 2,
    artifacts: artifacts.length,
    rawSources: catalog.categories.reduce(
      (total, category) => total + category.components.length,
      0,
    ),
    changelogWeeks: changelogEntries.length,
    changelogItems: changelogEntries.flatMap((week) => week.items).length,
    excludedChangelogItems: excludedChangelogItems.length,
    origin,
  };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  console.log(JSON.stringify(buildSitePages(), null, 2));
