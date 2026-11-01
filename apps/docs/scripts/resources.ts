import {
  betaRelease,
  stableRelease,
  betaArchiveName,
  versionHref,
} from "../../../tools/release-channels";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import catalog from "../../../tools/catalog/components.json";
import metadata from "../app/data/component-docs.json";
import { publicUsage } from "../app/utils/docs/public-usage";
import { demoDependencies } from "../app/utils/docs/usage-dependencies";
import { buildComponentMarkdown } from "../app/utils/docs/component-markdown";
import { getLocalizedDetails } from "../app/utils/docs/details";
import { descriptions } from "../app/utils/docs/i18n";
import type { ComponentDocs } from "../app/utils/docs/component-docs-types";
import {
  getSitePage,
  localize,
  siteOrigin,
  sitePages,
  themeCss,
} from "../app/utils/docs/site-page-data";
import {
  changelogAnchor,
  changelogEntries,
  excludedChangelogItems,
} from "../app/utils/docs/site-changelog-data";
import { consumerDocument } from "../../../tools/ai/consumer-documents";
import { sitePageMarkdown } from "../app/utils/docs/site-page-markdown";
import { templateDefinitions } from "../app/utils/docs/template-definitions";
import {
  templateMarkdown,
  templatesIndexMarkdown,
  componentsIndexMarkdown,
} from "../app/utils/docs/section-markdown";

function betaMarkdown(content: string) {
  return content
    .replaceAll(stableRelease.version, betaRelease.version)
    .replaceAll("pnpm add @orvui/vue", `pnpm add ./${betaArchiveName}`)
    .replaceAll(
      "Install the published component package from npm in your application directory.",
      "Install the local Beta archive; see the Beta installation guide to build it.",
    )
    .replaceAll(
      "在你的应用目录从 npm 安装已发布的组件包。",
      "安装本地 Beta 归档，制作方法见 Beta 安装指南。",
    )
    .replaceAll(
      `${"https://orvui.efu.me"}/r/`,
      `${"https://orvui.efu.me"}/beta/r/`,
    )
    .replace(
      /\]\((\/[^)]+)\)/g,
      (_, href: string) => `](${versionHref(href, "beta")})`,
    );
}

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
    if (
      file.endsWith(".md") &&
      !file.startsWith("beta/") &&
      !file.startsWith("orvui-agent/")
    ) {
      const slug = sitePages.find(
        (page) =>
          `${file.replace(/^en\//, "").replace(/\.md$/, "")}` ===
          page.path.slice(1),
      )?.slug;
      const beta = slug
        ? sitePageMarkdown(slug, file.startsWith("en/"), origin, "beta")
        : betaMarkdown(content);
      const target = resolve(output, "beta", file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, beta);
    }
  };
  for (const template of templateDefinitions)
    for (const filename of ["source.json", "source.zip"])
      rmSync(resolve(output, "templates", template.slug, filename), {
        force: true,
      });
  put(
    "templates/manifest.json",
    JSON.stringify(
      templateDefinitions.map(
        ({ slug, name, description, previewUrl, screenshot, pages }) => ({
          slug,
          name,
          description,
          previewUrl,
          screenshot,
          pages,
        }),
      ),
      null,
      2,
    ) + "\n",
  );
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
      put(
        `${prefix}templates/${template.slug}.md`,
        templateMarkdown(template.slug, en, origin),
      );
    }
  }
  put(
    "theme.css",
    `/* orvui design system. MIT; product version ${catalog.product.version}. */\n${themeCss}`,
  );
  put(
    "orvui-agent/SKILL.md",
    readFileSync(resolve(root, "skills/orvui/SKILL.md"), "utf8"),
  );
  for (const filename of ["AGENTS.md", "DESIGN.md"] as const)
    for (const en of [false, true])
      put(
        `orvui-agent/${en ? "en/" : ""}${filename}`,
        consumerDocument(filename, en, origin),
      );
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
    ...sitePages
      .filter((page) => page.slug !== "changelog")
      .map(
        (page) => `- [${localize(page.title, true)}](${origin}${page.path}.md)`,
      ),
    "",
    "## UI for Agents",
    `- [Agent Skills](${origin}/docs/agent-skills.md)`,
    `- [MCP Server](${origin}/docs/mcp-server.md)`,
    `- [AGENTS.md](${origin}/orvui-agent/AGENTS.md)`,
    `- [DESIGN.md](${origin}/orvui-agent/DESIGN.md)`,
    `- [AGENTS.md (English)](${origin}/orvui-agent/en/AGENTS.md)`,
    `- [DESIGN.md (English)](${origin}/orvui-agent/en/DESIGN.md)`,
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
  lines.push(
    "",
    "## Templates",
    ...templateDefinitions.map(
      (template) =>
        `- [${template.name}](${origin}/templates/${template.slug}.md): ${template.description.en}`,
    ),
    "",
    "## Releases",
    `- [Releases](${origin}/changelog.md)`,
    `- [RSS](${origin}/changelog/rss.xml)`,
  );
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
export function buildMarkdownPages(
  options: { root?: string; origin?: string } = {},
) {
  const root = resolve(options.root ?? process.cwd());
  const origin = new URL(
    options.origin ??
      process.env.ORVUI_REGISTRY_ORIGIN ??
      "https://orvui.efu.me",
  ).origin;
  const docs = metadata as unknown as ComponentDocs;
  const paths: string[] = [];
  for (const category of catalog.categories)
    for (const component of category.components) {
      const key = `${category.slug}/${component.slug}`,
        api = docs.entries[key],
        snippets = publicUsage.entries[key];
      if (!api || !snippets)
        throw new Error(`Missing API or public Usage for ${key}`);
      const usage = {
        default: snippets.default.code,
        ...Object.fromEntries(
          Object.entries(snippets.variants).map(([key, value]) => [
            key,
            value.code,
          ]),
        ),
      };
      const registryUsage = Object.fromEntries(
        Object.entries({ default: snippets.default, ...snippets.variants }).map(
          ([key, value]) =>
            [
              key,
              {
                code: value.registryCode,
                installSlugs: value.registryInstallSlugs,
                extraDependencies: value.registryExtraDependencies,
              },
            ] as const,
        ),
      );
      const installSlugs = Array.from(
        new Set(
          Object.values(registryUsage).flatMap((value) => value.installSlugs),
        ),
      );
      const dependencies = Array.from(
        new Set(
          installSlugs.flatMap(
            (slug) =>
              JSON.parse(
                readFileSync(
                  resolve(root, `apps/docs/public/r/${slug}.json`),
                  "utf8",
                ),
              ).dependencies ?? [],
          ),
        ),
      );
      const route = `/${category.slug === "charts" ? "charts" : `components/${category.slug}`}/${component.slug}`;
      for (const en of [false, true]) {
        const path = `${en ? "/en" : ""}${route}.md`,
          file = resolve(root, `apps/docs/public${path}`);
        const markdown = buildComponentMarkdown({
          category,
          component,
          api,
          usage,
          registryUsage,
          demoDependencies: Array.from(
            new Set(
              Object.values({
                default: snippets.default,
                ...snippets.variants,
              }).flatMap(demoDependencies),
            ),
          ),
          details: getLocalizedDetails(category.slug, component.slug, en),
          pageUrl: origin + path.slice(0, -3),
          registryBaseUrl: origin,
          locale: en ? "en" : "zh",
          description: en
            ? component.description.replace(/\bReact\b/g, "Vue")
            : descriptions[component.slug] || component.description,
          dependencies,
          productVersion: catalog.product.version,
        });
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, markdown);
        const betaFile = resolve(
          root,
          "apps/docs/public/beta",
          path.replace(/^\//, ""),
        );
        mkdirSync(dirname(betaFile), { recursive: true });
        writeFileSync(betaFile, betaMarkdown(markdown));
        paths.push(path);
      }
    }
  return {
    components: catalog.categories.reduce(
      (sum, category) => sum + category.components.length,
      0,
    ),
    locales: 2,
    pages: paths.length,
    origin,
    paths,
  };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const site = buildSitePages();
  const { paths, ...components } = buildMarkdownPages();
  console.log(JSON.stringify({ site, components }, null, 2));
}
