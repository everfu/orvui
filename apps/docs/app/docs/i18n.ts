import { componentCopy } from "./details/content";
export const descriptions: Record<string,string> = Object.fromEntries(Object.entries(componentCopy).map(([slug, copy]) => [slug,copy.zh]));
export const categoryNames: Record<string, [string, string]> = {
  motion: ["组件", "Components"],
  blocks: ["组合模块", "Blocks"],
  agents: ["AI 代理", "AI Agents"],
  charts: ["图表", "Charts"],
};
export const variantNames: Record<string, string> = {
  base: "基础",
  metallic: "金属质感",
  stateful: "状态按钮",
  magnetic: "磁吸",
  morphing: "变形",
  morph: "变形",
  gooey: "液态",
  blur: "模糊",
  roll: "滚动",
  cascade: "逐字",
  glitch: "故障",
  spotlight: "聚光",
  stacked: "堆叠",
  terminal: "终端",
  inline: "内联",
  dropdown: "下拉",
  default: "默认",
  wave: "波形",
  bubble: "气泡",
  ruler: "标尺",
  fill: "填充",
  text: "文字",
  icon: "图标",
};
