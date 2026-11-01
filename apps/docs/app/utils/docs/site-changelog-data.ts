import { bi } from "./site-page-data";
export type ChangelogItem = { type: "new" | "improved" | "fixed"; text: ReturnType<typeof bi>; href?: string; label?: string };
export const excludedChangelogItems: { date: string; index: string; text: string; href?: string }[] = [];
export const changelogEntries: { date: string; title: ReturnType<typeof bi>; summary?: ReturnType<typeof bi>; items: ChangelogItem[] }[] = [{
  date: "2026-11-01",
  title: bi("orvui 0.1.1", "orvui 0.1.1"),
  summary: bi("更新 npm 安装指南，新增公开 MCP 与按需加载的组件技能文档。", "Updated npm installation guides, with a public MCP endpoint and component skills loaded on demand."),
  items: [
    { type: "fixed", text: bi("纠正已发布组件包的安装说明，默认从 npm 安装，补充从 0.1.0 升级到 0.1.1 与 Nuxt 样式配置。", "Corrected installation instructions for the existing npm package, including upgrades from 0.1.0 to 0.1.1 and Nuxt stylesheet setup."), href: "/docs/installation", label: "Installation" },
    { type: "new", text: bi("公开只读 MCP 提供组件文档、源码、样式和主题查询，客户端填写 URL 即可连接。", "The public read-only MCP provides component documentation, source, styles and theme queries through a URL connection."), href: "/docs/mcp-server", label: "MCP" },
    { type: "new", text: bi("提供完整 Agent Skills 下载包与中英文组件参考，覆盖 110 个组件和 72 个注册变体。", "The complete Agent Skills archive includes Chinese and English references for 110 components and 72 registered variants."), href: "/docs/agent-skills", label: "Agent Skills" },
    { type: "improved", text: bi("组件包、注册表和 AI 资源同步到 0.1.1，保留公开 API、动效、11 套配色与语义主题覆盖行为。", "The package, registry and AI resources share version 0.1.1, retaining public APIs, motion, eleven palettes and semantic theme overrides.") },
  ],
}, {
  date: "2026-10-26",
  title: bi("组件实现更新", "Component implementation update"),
  summary: bi("重建组件运行逻辑与演示，保留现有公开接口。", "Component runtime and demonstrations have been rebuilt while keeping the public interfaces."),
  items: [
    { type: "improved", text: bi("组件目录和生成资源使用 orvui 产品版本，109 个组件与 72 个注册示例的入口保持兼容。", "Catalog and generated resources now use the orvui product version, with stable entry points for 109 components and 72 registered examples."), href: "/docs/installation", label: "Installation" },
    { type: "improved", text: bi("共享弹层与主题生成逻辑已重建，11 套配色保持兼容值。", "Shared layers and theme generation have been rebuilt with the eleven palette values held fixed."), href: "/docs/theme", label: "Themes" },
    { type: "improved", text: bi("站点字体改从已安装的 Fontsource 包获取，保留字体自己的许可和文件校验。", "Site fonts are sourced directly from the installed Fontsource packages, with their own licenses and file checksums retained.") },
  ],
}];
export const changelogAnchor = (date: string) => `week-${date}`;
