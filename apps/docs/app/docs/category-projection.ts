import type {
  CatalogCategory,
  CatalogEntry,
} from "../../../../tools/registry/types";
import { descriptions } from "./i18n";
import { componentPath } from "./docs-routes";
import type { NewBadgeEntry } from "./new-badge";
type Localized = readonly [string, string];
type CategoryCopy = {
  heading: Localized;
  description: Localized;
  all: Localized;
};
const copy: Record<string, CategoryCopy> = {
  motion: {
    heading: ["Vue 交互动效组件", "Vue motion components"],
    description: [
      "从按钮、输入到页面过渡，为日常界面添加清晰的状态变化。浏览 Vue 示例，安装需要的组件，再使用项目里的样式与数据完成组合。",
      "Give everyday interfaces clear state changes, from buttons and inputs to page transitions. Browse the Vue examples, install the parts you need, and compose them with your application styles and data.",
    ],
    all: ["全部交互动效", "All motion components"],
  },
  blocks: {
    heading: ["Vue 交互组合模块", "Vue interaction blocks"],
    description: [
      "把多个控件组合成可以直接体验的工作流程：上传文件、查找内容、安排时间或查看账户。每个模块都提供 Vue 源码，方便根据产品继续调整。",
      "Explore complete flows for uploading files, finding content, arranging a schedule, and checking an account. Each block brings its interactions together and includes Vue source you can adapt to your product.",
    ],
    all: ["全部组合模块", "All interaction blocks"],
  },
  charts: {
    heading: ["Vue 数据交互图表", "Vue data visualizations"],
    description: [
      "用趋势、分布、关系和时间视图展示数据，并通过悬停、选择和切换阅读细节。从示例结构开始，接入自己的数据与界面主题。",
      "Present trends, distributions, relationships, and time series, then explore details through hover, selection, and view changes. Start with an example structure and connect your own data and theme.",
    ],
    all: ["全部数据图表", "All data visualizations"],
  },
  agents: {
    heading: ["AI 工作流界面组件", "AI workflow components"],
    description: [
      "为对话和自动化任务组织输入、回答、过程与结果。在同一套 Vue 组件中呈现工具输出和待确认操作，让每一步都便于阅读与继续处理。",
      "Organize input, answers, activity, and results for conversations and automated tasks. Present tool output and pending decisions with Vue components that keep each step readable and ready for the next action.",
    ],
    all: ["全部 AI 界面组件", "All AI workflow components"],
  },
};
const agentSections: {
  id: string;
  title: Localized;
  description: Localized;
  slugs: string[];
}[] = [
  {
    id: "conversation",
    title: ["对话与输入", "Prompts and conversation"],
    description: [
      "组合消息、输入区和会话滚动区域。让正在生成的内容保持可读，并在读者回看记录时保留当前阅读位置。",
      "Combine messages, prompt fields, and a scrolling transcript. Keep incoming content readable while preserving the reader’s place when they look back through earlier turns.",
    ],
    slugs: ["prompt-input", "message", "message-bubble", "message-scroller"],
  },
  {
    id: "responses",
    title: ["回答与资料", "Answers and supporting sources"],
    description: [
      "把逐步到达的回答、图片和来源放在合适的位置。用户可以先阅读结果，再查看与内容关联的资料和后续操作。",
      "Place arriving answers, images, and source references together. Readers can follow a response as it develops, then inspect related material or continue with the available actions.",
    ],
    slugs: ["streaming-response", "image-generation", "citations"],
  },
  {
    id: "progress",
    title: ["任务与活动", "Tasks and activity"],
    description: [
      "展示任务计划、等待状态和活动顺序。把当前正在处理的步骤与已经完成的工作区分开，便于持续查看进展。",
      "Show the task plan, waiting states, and activity sequence. Make the current step and completed work easy to distinguish so a longer operation remains straightforward to follow.",
    ],
    slugs: ["loading-states", "todo-list", "agent-activity"],
  },
  {
    id: "tools",
    title: ["工具输出与文件", "Tool output and files"],
    description: [
      "在紧凑的区域中展示工具结果、代码和文件差异。内容更新时保留必要的结构，方便阅读关键输出并检查变更。",
      "Display tool results, code, and file changes in a bounded area. Preserve the useful structure as content updates so readers can inspect the important output and review the changes.",
    ],
    slugs: ["tool-result", "code-block", "file-diff"],
  },
  {
    id: "human-control",
    title: ["审核与决策", "Review and decisions"],
    description: [
      "把需要用户判断的操作呈现为清晰的选择。收集授权、审核意见和补充信息后，在流程中保留对应的处理结果。",
      "Turn operations that need a person’s judgment into clear choices. Collect permission, review feedback, or missing information, and retain the resulting decision in the workflow.",
    ],
    slugs: ["tool-approval", "approval-card"],
  },
];
export function projectCategory(
  category: CatalogCategory,
  en: boolean,
  isNew: (entry: NewBadgeEntry) => boolean,
) {
  const language = en ? 1 : 0,
    definition = copy[category.slug];
  const content = definition
    ? {
        heading: definition.heading[language],
        description: definition.description[language],
        all: definition.all[language],
      }
    : {
        heading: category.name,
        description: category.description,
        all: en ? "All components" : "全部组件",
      };
  const entries = category.components.map((item) => ({
    ...item,
    href: componentPath(category.slug, item.slug, en),
    summary: en
      ? item.description.replace(/\bReact\b/g, "Vue")
      : descriptions[item.slug] || item.description,
  }));
  let groups: {
    id: string;
    title: string;
    description: string;
    items: (CatalogEntry & { href: string; summary: string })[];
  }[];
  if (category.slug === "agents") {
    const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
    groups = agentSections.map((section) => ({
      id: section.id,
      title: section.title[language],
      description: section.description[language],
      items: section.slugs.flatMap((slug) => {
        const entry = bySlug.get(slug);
        return entry ? [entry] : [];
      }),
    }));
  } else {
    const recent: typeof entries = [],
      remaining: typeof entries = [];
    for (const entry of entries)
      (isNew(entry) ? recent : remaining).push(entry);
    groups = [
      {
        id: "new",
        title: en ? "Recently added" : "近期加入",
        description: "",
        items: recent,
      },
      { id: "all", title: content.all, description: "", items: remaining },
    ].filter((group) => group.items.length);
  }
  return { content, groups };
}
