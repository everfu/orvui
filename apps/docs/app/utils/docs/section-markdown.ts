import { componentGroups, groupedComponentPath } from "./document-sections";
import { descriptions } from "./i18n";
import { templateDefinitions, findTemplate } from "./template-definitions";
import { templateEditorial } from "./template-editorial";
import { componentGroupGuidance } from "./component-handbook";
const anchor = (id: string) => `<a id="${id}"></a>`;
export function componentsIndexMarkdown(en: boolean, origin: string) {
  return (
    [
      anchor("overview"),
      `# ${en ? "Vue Components" : "Vue 组件"}`,
      "",
      ...componentGroups.flatMap((group) => [
        anchor(group.id),
        `## ${en ? group.en : group.zh}`,
        "",
        ...group.entries.map(
          (entry) =>
            `- [${entry.name}](${origin}${groupedComponentPath(entry, en)}): ${en ? entry.description : descriptions[entry.slug]} · ${entry.examples?.length || 1} ${en ? "examples" : "个示例"}`,
        ),
        "",
      ]),
      anchor("choosing-components"),
      `## ${en ? "Choose a component" : "选择组件"}`,
      "",
      en
        ? "Start with the interaction you need, then open its examples, state bindings and API. Use primitives for a small interaction or an application template for a complete workspace."
        : "先确定需要的交互，再查看示例、状态绑定和 API。单一交互从基础组件开始，完整工作台可从应用模板开始。",
      "",
      `[${en ? "Installation guide" : "安装指南"}](${origin}${en ? "/en" : ""}/docs/installation) · [${en ? "Application templates" : "应用模板"}](${origin}${en ? "/en" : ""}/templates)`,
      "",
      ...componentGroups.flatMap((group) => [
        `### ${en ? group.en : group.zh}`,
        "",
        componentGroupGuidance[group.id][en ? "en" : "zh"],
        "",
      ]),
    ].join("\n").trimEnd() + "\n"
  );
}
export function templatesIndexMarkdown(en: boolean, origin: string) {
  const t = (zh: string, english: string) => (en ? english : zh);
  return [
    anchor("overview"),
    `# ${t("应用模板", "Application templates")}`,
    "",
    t(
      "用 orvui 构建的完整应用模板，打开在线工作空间体验。",
      "Full application templates built with orvui. Explore each live workspace.",
    ),
    "",
    anchor("applications"),
    `## ${t("应用工作台", "Workspaces")}`,
    "",
    ...templateDefinitions.flatMap((template) => [
      `### ${template.name}`,
      "",
      `![${template.name}](${origin}${template.screenshot})`,
      "",
      template.description[en ? "en" : "zh"],
      "",
      `[${t("查看详情", "View details")}](${origin}${en ? "/en" : ""}/templates/${template.slug}) · [${t("在线预览", "Live preview")}](${template.previewUrl})`,
      "",
    ]),
    anchor("choosing-template"),
    `## ${t("选择模板", "Choose a starting point")}`,
    ...templateDefinitions.map(
      (template) =>
        `- **${template.name}**: ${templateEditorial[template.slug].purpose[en ? "en" : "zh"]}`,
    ),
    "",
    anchor("start-building"),
    `## ${t("开始体验", "Start exploring")}`,
    t(
      "在线演示公开，完整模板源码在私有仓库维护。所有操作使用本地样例数据。",
      "Live demos are public; complete template sources are maintained in private repositories. All actions use local sample data.",
    ),
    "",
  ].join("\n");
}
export function templateMarkdown(slug: string, en: boolean, origin: string) {
  const template = findTemplate(slug);
  if (!template) throw new Error(`Unknown template: ${slug}`);
  const t = (zh: string, english: string) => (en ? english : zh);
  const editorial = templateEditorial[template.slug];
  return [
    "---",
    `title: ${template.name}`,
    `description: ${JSON.stringify(template.description[en ? "en" : "zh"])}`,
    "---",
    "",
    anchor("overview"),
    `# ${template.name}`,
    "",
    template.description[en ? "en" : "zh"],
    "",
    anchor("template-use-cases"),
    `### ${t("适用场景", "When to use it")}`,
    editorial.purpose[en ? "en" : "zh"],
    "",
    anchor("preview"),
    `## ${t("交互预览", "Interactive preview")}`,
    `[${t("在线预览", "Live preview")}](${template.previewUrl}?lang=${en ? "en" : "zh"})`,
    "",
    anchor("template-walkthrough"),
    `### ${t("试一试", "Try it")}`,
    ...editorial.walkthrough.map(
      (step, i) => `${i + 1}. ${step[en ? "en" : "zh"]}`,
    ),
    "",
    anchor("composition"),
    `## ${t("页面组成", "Application pages")}`,
    ...template.pages.map((page) => `- ${en ? page.en : page.zh}`),
    "",
    anchor("notes"),
    `## ${t("使用说明", "Usage notes")}`,
    t(
      "支持中英文、明暗模式和十一套配色。演示数据保存在当前浏览器；语言切换保留编辑内容。设置中的重置演示可恢复初始数据。",
      "Supports Chinese, English, light and dark appearance and eleven palettes. Demo data stays in this browser; changing language preserves edits. Reset demo in Settings restores the sample data.",
    ),
    "",
    t(
      "邮件、AI 回复和财务操作仅更新本地状态。在线演示公开，完整源码仅在私有仓库维护。",
      "Mail, AI responses and financial actions only update local state. Live demos are public; complete sources are maintained in private repositories.",
    ),
    "",
    anchor("licenses"),
    `## ${t("来源与许可", "Attribution and licenses")}`,
    t(
      "界面参考 HeroUI 的模板展示方式，由本项目独立实现；orvui 组件、字体与相关资产保留各自版权和许可。",
      "The gallery presentation references HeroUI and is independently implemented. orvui components, fonts and assets retain their respective copyright and licenses.",
    ),
    `[NOTICE](${origin}/licenses/orvui-NOTICE.txt)`,
    "",
  ].join("\n");
}
