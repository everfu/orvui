import type { ApiEntry } from "../../../../../tools/registry/component-docs-types";

const text = (zh: string, en: string) => ({ zh, en });
export const componentGroupGuidance = {
  actions: text(
    "以明确操作为入口：普通操作使用 Button，需要持续按压或滑动确认时查看 CTA Buttons；紧凑工具栏可选择 Expandable Action Bar。",
    "Start with Button for an explicit action. Use CTA Buttons for deliberate hold or slide confirmation, and Expandable Action Bar for compact toolbars.",
  ),
  forms: text(
    "固定选项使用 Select，可搜索单选使用 Combobox，多选使用 Multi Select；即时设置用 Switch，需要随表单提交的勾选用 Checkbox。",
    "Use Select for fixed options, Combobox for searchable single selection and Multi Select for multiple values. Use Switch for immediate settings and Checkbox for a value submitted with a form.",
  ),
  navigation: text(
    "页面内相关视图使用 Tabs；页面层级使用 Breadcrumb；长文章定位使用 Table of Contents；跨功能区导航可使用 Animated Sidebar。",
    "Use Tabs for related views in one page, Breadcrumb for page hierarchy, Table of Contents for article navigation and Animated Sidebar for workspace sections.",
  ),
  display: text(
    "先确定内容结构：表格数据使用 Table，层级文件用 File Tree，可展开补充内容用 Collapsible；多个互斥折叠项使用 Bouncy Accordion。",
    "Match the content structure: Table for tabular data, File Tree for nested files and Collapsible for optional details. Use Bouncy Accordion for a single-open set of sections.",
  ),
  feedback: text(
    "页面内的持久说明使用 Alert，短暂操作反馈使用 Toast Stack；过程等待使用 Loader，明确进度与成功结果应由应用状态驱动。",
    "Use Alert for persistent inline information, Toast Stack for transient action feedback and Loader while an operation is pending. Drive progress and completion from application state.",
  ),
  overlays: text(
    "简短非交互提示使用 Tooltip，触发器附近的内容使用 Popover；需要聚焦完成任务时使用 Modal、Drawer 或移动端 Bottom Sheet。",
    "Use Tooltip for short non-interactive labels and Popover for content beside its trigger. Use Modal, Drawer or a mobile Bottom Sheet for focused tasks.",
  ),
  motion: text(
    "在已有结构上增加动效：文字变化、共享选中背景或滚动反馈按需组合，并为减少动态效果保留清晰的静态状态。",
    "Add motion to an existing structure with text transitions, shared selection backgrounds or scroll feedback, while retaining clear static states for reduced motion.",
  ),
  business: text(
    "这些组件组合多个基础能力。先阅读用法与状态，再替换样例数据，并将保存、提交与持久化连接到应用。",
    "These components combine several primitives. Read their usage and state contracts before replacing sample data and connecting saves, submissions and persistence.",
  ),
  ai: text(
    "从 Prompt Input、Message 和 Streaming Response 组织对话，再加入工具结果、审核和引用；模型请求与消息存储由应用提供。",
    "Build a conversation with Prompt Input, Message and Streaming Response, then add tool results, approvals and citations. The application provides model requests and message storage.",
  ),
  charts: text(
    "按数据关系选择：Donut 展示占比，Funnel 展示阶段转化，Sankey 展示流向；金融图表需保持时间、单位与坐标范围一致。",
    "Choose by data relationship: Donut for proportions, Funnel for stage conversion and Sankey for flows. Keep time, units and axis ranges consistent in financial charts.",
  ),
} as const;

/** Only document a Vue model when the public metadata declares both halves. */
export function componentBindings(entry?: ApiEntry) {
  const bindings = new Map<
    string,
    {
      component: string;
      prop: string;
      event: string;
      directive: string;
      type: string;
      initial: string;
    }
  >();
  const compositions = entry
    ? [entry.default, ...Object.values(entry.variants)]
    : [];
  for (const composition of compositions) {
    for (const component of composition.components) {
      for (const prop of component.props) {
        const event = component.events.find(
          (event) => event.name === `update:${prop.name}`,
        );
        if (!event) continue;
        const key = `${component.displayName}:${prop.name}`;
        if (!bindings.has(key))
          bindings.set(key, {
            component: component.displayName,
            prop: prop.name,
            event: event.name,
            directive:
              prop.name === "modelValue" ? "v-model" : `v-model:${prop.name}`,
            type: prop.type ?? "—",
            initial: prop.defaultValue ?? "—",
          });
      }
    }
  }
  return [...bindings.values()];
}
export const componentStateCopy = {
  controlled: text(
    "需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。",
    "Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.",
  ),
  uncontrolled: text(
    "可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。",
    "Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.",
  ),
  static: text(
    "此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。",
    "This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.",
  ),
};
