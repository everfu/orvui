import {
  betaArchiveName,
  type ReleaseChannel,
} from "../../../../../tools/release-channels";
import { packageName } from "../../../../../tools/distribution";
import type { ApiComponent, ApiEntry } from "./component-docs-types";
import type { CatalogEntry } from "../../../../../tools/registry/types";
import { componentBindings, componentStateCopy } from "./component-handbook";
import catalog from "../../../../../tools/catalog/components.json";
import { getVariantDescription } from "./variant-descriptions";
import { relatedComponents, getLocalizedDetails } from "./details";
import type { ComponentDetailBaseline, AgentGuide } from "./details/types";

export interface ComponentMarkdownInput {
  category: { slug: string; name: string };
  component: CatalogEntry;
  api: ApiEntry;
  /** Public-package imports, keyed by `default` and every registered example slug. */
  usage: Record<string, string>;
  /** Copy-source examples paired with the exact registry items they need. */
  registryUsage?: Record<
    string,
    { code: string; installSlugs: string[]; extraDependencies?: string[] }
  >;
  demoDependencies?: string[];
  /** Pass the final localized/Vue-adapted record from getLocalizedDetails. */
  details?: ComponentDetailBaseline;
  pageUrl: string;
  /** Current site origin or the absolute registry collection URL ending in /r. */
  registryBaseUrl: string;
  description?: string;
  dependencies?: string[];
  locale?: "zh" | "en";
  productVersion?: string;
  channel?: ReleaseChannel;
  /** Optional additional public exports that are not used by a registered demo. */
  apiComponents?: ApiComponent[];
}

function cell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}
function inline(value: string) {
  const cleaned = cell(value),
    longest = Math.max(
      0,
      ...Array.from(cleaned.matchAll(/`+/g), (match) => match[0].length),
    ),
    fence = "`".repeat(longest + 1),
    pad = /^[` ]|[` ]$/.test(cleaned) ? " " : "";
  return `${fence}${pad}${cleaned}${pad}${fence}`;
}
function block(value: string, language: string) {
  const longest = Math.max(
      0,
      ...Array.from(value.matchAll(/`+/g), (match) => match[0].length),
    ),
    fence = "`".repeat(Math.max(3, longest + 1));
  return [fence + language, value.trimEnd(), fence, ""];
}
function registryUrl(base: string, slug: string) {
  const root = base.replace(/\/+$/, "");
  return `${root.endsWith("/r") || root.endsWith("/registry") ? root : root + "/r"}/${encodeURIComponent(slug)}.json`;
}

export function buildComponentMarkdown(input: ComponentMarkdownInput): string {
  const { component, api, details } = input,
    t = (english: string, chinese: string) =>
      input.locale === "zh" ? chinese : english,
    description =
      input.description ?? details?.description ?? component.description,
    pageUrl = input.pageUrl.replace(/[?#].*$/, "").replace(/\/$/, ""),
    lines = [
      "---",
      `title: ${JSON.stringify(component.name)}`,
      `description: ${JSON.stringify(description)}`,
      `category: ${JSON.stringify(input.category.name)}`,
      ...(details
        ? [
            `publishedAt: ${JSON.stringify(details.dates.publishedAt)}`,
            `updatedAt: ${JSON.stringify(details.dates.updatedAt)}`,
          ]
        : []),
      `documentation: ${JSON.stringify(pageUrl)}`,
      `markdown: ${JSON.stringify(pageUrl + ".md")}`,
      `license: "MIT"`,
      ...(input.productVersion
        ? [`productVersion: ${JSON.stringify(input.productVersion)}`]
        : []),
      "---",
      "",
      '<a id="overview"></a>',
      `# ${component.name}`,
      "",
      `> ${description}`,
      "",
      '<a id="install"></a>',
      `## ${t("Install", "安装")}`,
      "",
    ];
  if (details?.about) {
    const installHeading = lines.splice(lines.length - 3, 3);
    lines.push(
      ...(details.about.overview !== description
        ? [details.about.overview, ""]
        : []),
      '<a id="when-to-use"></a>',
      "",
      `## ${t("When to use it", "适用场景")}`,
      "",
      ...details.about.useWhen.map((item) => `- ${item}`),
      "",
      ...installHeading,
    );
  }
  const targets =
    component.examples?.filter((example) => example.installSlug) ?? [];
  if (input.registryUsage) {
    for (const example of [
      { slug: "default", name: component.name },
      ...(component.examples ?? []),
    ]) {
      const registry = input.registryUsage[example.slug];
      if (!registry?.code.trim() || !registry.installSlugs.length)
        throw new Error(
          `Missing registry Markdown usage for ${input.category.slug}/${component.slug}/${example.slug}`,
        );
      lines.push(
        `### ${example.name} — ${t("Registry source", "复制源码")}`,
        "",
        ...block(
          `pnpm dlx shadcn-vue@2.8.2 add ${registry.installSlugs.map((slug) => registryUrl(input.registryBaseUrl, slug)).join(" ")}`,
          "bash",
        ),
        ...(registry.extraDependencies?.length
          ? [
              t("This example also needs:", "此示例还需要："),
              "",
              ...block(
                `pnpm add ${registry.extraDependencies.join(" ")}`,
                "bash",
              ),
            ]
          : []),
      );
    }
  } else if (targets.length) {
    for (const example of targets) {
      lines.push(
        `### ${example.name}`,
        "",
        ...(example.description
          ? [
              getVariantDescription(
                input.category.slug,
                component.slug,
                example.slug,
                input.locale !== "zh",
                example.description,
              ),
              "",
            ]
          : []),
        ...block(
          `pnpm dlx shadcn-vue@2.8.2 add ${registryUrl(input.registryBaseUrl, example.installSlug!)}`,
          "bash",
        ),
      );
    }
  } else
    lines.push(
      ...block(
        `pnpm dlx shadcn-vue@2.8.2 add ${registryUrl(input.registryBaseUrl, component.slug)}`,
        "bash",
      ),
    );
  lines.push(
    t(
      "Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.",
      "通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。",
    ),
    "",
    `### ${t("Component package", "组件包")}`,
    "",
    input.channel === "beta"
      ? t(
          "Install the local Beta archive; see the Beta installation guide to build it.",
          "安装本地 Beta 归档，制作方法见 Beta 安装指南。",
        )
      : t(
          "Install the published component package from npm in your application directory.",
          "在你的应用目录从 npm 安装已发布的组件包。",
        ),
    "",
    ...block(
      input.channel === "beta"
        ? `pnpm add ./${betaArchiveName}`
        : `pnpm add ${packageName}`,
      "bash",
    ),
    ...(input.demoDependencies?.length
      ? [...block(`pnpm add ${input.demoDependencies.join(" ")}`, "bash")]
      : []),
    ...block("import '@orvui/vue/style.css';", "typescript"),
    `## ${t("Dependencies", "依赖")}`,
    "",
  );
  if (input.dependencies)
    lines.push(
      input.dependencies.length
        ? input.dependencies
            .map((dependency) => `- ${inline(dependency)}`)
            .join("\n")
        : t(
            "This component has no external package dependencies.",
            "该组件没有额外的外部包依赖。",
          ),
    );
  else
    lines.push(
      t(
        "See the registry detail for this component's dependency list.",
        "组件的完整依赖列表见注册表详情。",
      ),
    );
  lines.push("", '<a id="examples"></a>', `## ${t("Usage", "用法")}`, "");
  const examples = [
    { slug: "default", name: component.name, description: "" },
    ...(component.examples ?? []),
  ];
  for (const example of examples) {
    const usage = input.usage[example.slug];
    if (!usage?.trim())
      throw new Error(
        `Missing Markdown usage for ${input.category.slug}/${component.slug}/${example.slug}`,
      );
    lines.push(
      `<a id="${example.slug}"></a>`,
      `### ${example.name}`,
      "",
      ...(example.description
        ? [
            getVariantDescription(
              input.category.slug,
              component.slug,
              example.slug,
              input.locale !== "zh",
              example.description,
            ),
            "",
          ]
        : []),
      ...(input.registryUsage
        ? [
            `**${t("Registry source", "复制源码")}**`,
            "",
            ...block(input.registryUsage[example.slug].code, "vue"),
            `**${t("Package", "组件包")}**`,
            "",
          ]
        : []),
      ...block(usage, "vue"),
    );
  }
  if (details?.guide) guideMarkdown(details.guide, lines, t, pageUrl);
  const bindings = componentBindings(api);
  lines.push(
    '<a id="state-and-events"></a>',
    `## ${t("State and events", "状态与事件")}`,
    "",
    (bindings.length
      ? componentStateCopy.controlled
      : componentStateCopy.static)[input.locale === "zh" ? "zh" : "en"],
    "",
  );
  if (bindings.length)
    lines.push(
      `| ${t("Component", "组件")} | ${t("Vue binding", "Vue 绑定")} | ${t("Type", "类型")} | ${t("Update event", "更新事件")} |`,
      "| --- | --- | --- | --- |",
      ...bindings.map(
        (binding) =>
          `| ${inline(binding.component)} | ${inline(binding.directive)} | ${inline(binding.type)} | ${inline(binding.event)} |`,
      ),
      "",
      componentStateCopy.uncontrolled[input.locale === "zh" ? "zh" : "en"],
      "",
    );
  const publicComponents = new Map<string, ApiComponent>();
  for (const composition of [api.default, ...Object.values(api.variants)])
    for (const component of composition.components)
      publicComponents.set(component.file, component);
  for (const component of input.apiComponents ?? [])
    publicComponents.set(component.file, component);
  if (publicComponents.size)
    lines.push(
      '<a id="api-reference"></a>',
      `## ${t("API Reference", "API 参考")}`,
      "",
    );
  for (const component of publicComponents.values()) {
    lines.push(`### ${component.displayName}`, "");
    if (component.props.length) {
      lines.push(
        `#### ${t("Props", "属性")}`,
        "",
        `| ${t("Prop", "属性")} | ${t("Type", "类型")} | ${t("Default", "默认值")} | ${t("Required", "必填")} | ${t("Description", "说明")} |`,
        "| --- | --- | --- | --- | --- |",
      );
      for (const prop of component.props)
        lines.push(
          `| ${inline(prop.name)} | ${prop.type ? inline(prop.type) : "—"} | ${prop.defaultValue !== null ? inline(prop.defaultValue) : "—"} | ${prop.required ? t("Yes", "是") : t("No", "否")} | ${cell(prop.description) || "—"} |`,
        );
      lines.push("");
    }
    if (component.events.length) {
      lines.push(
        `#### ${t("Events", "事件")}`,
        "",
        `| ${t("Event", "事件")} | ${t("Payload", "载荷")} | ${t("Description", "说明")} |`,
        "| --- | --- | --- |",
      );
      for (const event of component.events)
        lines.push(
          `| ${inline(event.name)} | ${event.signature ? inline(event.signature) : "—"} | ${cell(event.description) || "—"} |`,
        );
      lines.push("");
    }
    if (component.slots.length) {
      lines.push(
        `#### ${t("Slots", "插槽")}`,
        "",
        `| ${t("Slot", "插槽")} | ${t("Signature", "签名")} | ${t("Exposed bindings", "暴露的绑定")} | ${t("Description", "说明")} |`,
        "| --- | --- | --- | --- |",
      );
      for (const slot of component.slots)
        lines.push(
          `| ${inline(slot.name)} | ${slot.signature ? inline(slot.signature) : "—"} | ${slot.bindings.length ? slot.bindings.map((binding) => inline(`${binding.name}: ${binding.expression}`)).join(", ") : "—"} | ${cell(slot.description) || "—"} |`,
        );
      lines.push("");
    }
  }
  if (details?.about) {
    const about = details.about;
    lines.push(
      '<a id="about"></a>',
      `## ${t("About", "关于")} ${component.name}`,
      "",
      '<a id="accessibility"></a>',
      `### ${t("Accessibility", "无障碍")}`,
      "",
      about.accessibility,
      "",
      '<a id="faq"></a>',
      `### ${t("FAQ", "常见问题")}`,
      "",
    );
    for (const item of about.faq)
      lines.push(`**${item.question}**`, "", item.answer, "");
  }
  if (
    catalog.categories.some((category) =>
      category.components.some((entry) => entry.slug === component.slug),
    )
  ) {
    const related = relatedComponents(input.category.slug, component.slug, 3);
    if (related.length) {
      lines.push(
        '<a id="related-components"></a>',
        `## ${t("Related components", "相关组件")}`,
        "",
      );
      const prefix = input.locale === "zh" ? "" : "/en";
      for (const item of related) {
        const localized = getLocalizedDetails(
          item.category,
          item.slug,
          input.locale !== "zh",
        );
        const path = `${prefix}/${item.category === "charts" ? "charts" : `components/${item.category}`}/${item.slug}`;
        lines.push(
          `- [${item.name}](${new URL(path, pageUrl).href}): ${localized?.description ?? item.description}`,
        );
      }
      lines.push("");
    }
  }
  const files = Array.from(
    new Set([
      ...[api.default, ...Object.values(api.variants)].flatMap(
        (composition) => composition.sourceFiles,
      ),
      ...(input.apiComponents ?? []).map((component) => component.file),
    ]),
  );
  lines.push(
    '<a id="licenses"></a>',
    `## ${t("Source", "源码")}`,
    "",
    `- ${t("Registry detail", "注册表详情")}: ${registryUrl(input.registryBaseUrl, component.slug)}`,
    `- ${t("Documentation", "文档")}: ${pageUrl}`,
    ...files.map((file) => `- ${inline(file)}`),
    "",
    t(
      "Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.",
      "Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。",
    ),
    `- [LICENSE](${new URL("/licenses/MIT.txt", input.registryBaseUrl).href})`,
    `- [NOTICE](${new URL("/licenses/orvui-NOTICE.txt", input.registryBaseUrl).href})`,
    ...(details?.credit
      ? [
          t("Design credit", "设计来源") +
            `: [${details.credit.name}](${details.credit.url})`,
        ]
      : []),
    ...(component.slug === "shader-background"
      ? [
          "",
          t(
            "The bundled Paper Design shader runtime retains its separate license in `packages/vue/src/motion/shader-background/LICENSE.paper-design`.",
            "附带的 Paper Design Shader 运行时保留独立许可证，见 `packages/vue/src/motion/shader-background/LICENSE.paper-design`。",
          ),
        ]
      : []),
    "",
  );
  return (
    lines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

function guideMarkdown(
  guide: AgentGuide,
  lines: string[],
  t: (english: string, chinese: string) => string,
  pageUrl: string,
) {
  lines.push(
    `## ${t("Component Guide", "组件指南")}`,
    "",
    '<a id="composition"></a>',
    `### ${t("Composition", "组合结构")}`,
    "",
    guide.composition.description,
    "",
    ...block(guide.composition.tree, "text"),
    '<a id="behavior"></a>',
    `### ${t("How it works", "工作方式")}`,
    "",
    guide.introduction,
    "",
    `### ${t("Lifecycle", "生命周期")}`,
    "",
  );
  for (const item of guide.lifecycle)
    lines.push(`#### ${item.title}`, "", item.description, "");
  lines.push(`### ${t("Principles", "设计原则")}`, "");
  for (const item of guide.principles)
    lines.push(`#### ${item.title}`, "", item.description, "");
  lines.push(
    `### ${guide.implementation.title}`,
    "",
    guide.implementation.description,
    "",
    `### ${t("Connections", "关联组件")}`,
    "",
  );
  for (const item of guide.connections) {
    const category = catalog.categories.find((category) =>
      category.components.some((component) => component.slug === item.slug),
    );
    if (!category) throw new Error(`Unknown related component ${item.slug}`);
    const page = new URL(pageUrl);
    const prefix = page.pathname.startsWith("/en/") ? "/en" : "";
    const path = `${prefix}/${category.slug === "charts" ? "charts" : `components/${category.slug}`}/${item.slug}`;
    lines.push(
      `- [${item.name}](${new URL(path, page.origin).href}): ${item.description}`,
    );
  }
  lines.push(
    "",
    `### ${t("Contract", "能力边界")}`,
    "",
    `- ${t("Owns", "负责")}: ${guide.contract.owns}`,
    `- ${t("Leaves to the application", "由应用负责")}: ${guide.contract.leaves}`,
    "",
    `### ${t("Usage guidance", "使用建议")}`,
    "",
    `- ${t("Use when", "适用")}: ${guide.guidance.useWhen}`,
    `- ${t("Avoid when", "不适用")}: ${guide.guidance.avoidWhen}`,
    "",
  );
}
