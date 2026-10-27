import { bi } from "./site-page-data";
export type ChangelogItem = { type: "new" | "improved" | "fixed"; text: ReturnType<typeof bi>; href?: string; label?: string };
export const excludedChangelogItems: { date: string; index: string; text: string; href?: string }[] = [];
export const changelogEntries: { date: string; title: ReturnType<typeof bi>; summary?: ReturnType<typeof bi>; items: ChangelogItem[] }[] = [{
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
