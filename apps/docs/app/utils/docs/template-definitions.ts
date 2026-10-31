const templateBaseDefinitions = [
  {
    slug: "dashboard",
    name: "Dashboard",
    zh: "数据仪表盘",
    en: "Analytics dashboard",
    description: {
      zh: "指标、销售趋势、筛选与成员表格，组成一个可交互的数据工作台。",
      en: "An interactive workspace combining metrics, sales trends, filters and a member table.",
    },
    scene: "HomeDashboardScene.vue",
  },
  {
    slug: "mail",
    name: "Mail",
    zh: "邮件工作台",
    en: "Mail workspace",
    description: {
      zh: "将文件夹、搜索、邮件列表、阅读和本地撰写整合到一个工作区。",
      en: "A workspace with folders, search, message lists, reading and local composition.",
    },
    scene: "HomeMailScene.vue",
  },
  {
    slug: "chat",
    name: "Chat",
    zh: "AI 聊天界面",
    en: "AI chat interface",
    description: {
      zh: "对话、流式响应、工具审核、代码与引用构成完整的本地聊天演示。",
      en: "A local chat composition with conversations, streaming responses, tool approval, code and citations.",
    },
    scene: "HomeChatScene.vue",
  },
  {
    slug: "finances",
    name: "Finances",
    zh: "财务工作台",
    en: "Finance workspace",
    description: {
      zh: "通过资产趋势、持仓和交易记录展示财务信息，支持周期和隐私切换。",
      en: "Present portfolio trends, holdings and transactions with period and privacy controls.",
    },
    scene: "HomeFinancesScene.vue",
  },
  {
    slug: "crm",
    name: "CRM",
    zh: "客户关系管理",
    en: "Customer relationship management",
    description: {
      zh: "组合日期范围、销售漏斗、预测、账户与商机，呈现销售工作台。",
      en: "A sales workspace combining date ranges, funnels, forecasts, accounts and opportunities.",
    },
    scene: "HomeCrmScene.vue",
  },
] as const;
const applicationPages = {
  dashboard: [
    {
      id: "dashboard",
      zh: "概览",
      en: "Overview",
    },
    {
      id: "orders",
      zh: "订单",
      en: "Orders",
    },
    {
      id: "tracker",
      zh: "追踪",
      en: "Tracker",
    },
    {
      id: "analytics",
      zh: "分析",
      en: "Analytics",
    },
    {
      id: "settings",
      zh: "设置",
      en: "Settings",
    },
  ],
  mail: [
    {
      id: "inbox",
      zh: "收件箱",
      en: "Inbox",
    },
    {
      id: "starred",
      zh: "星标",
      en: "Starred",
    },
    {
      id: "sent",
      zh: "已发送",
      en: "Sent",
    },
    {
      id: "drafts",
      zh: "草稿",
      en: "Drafts",
    },
    {
      id: "snoozed",
      zh: "稍后处理",
      en: "Snoozed",
    },
    {
      id: "archive",
      zh: "归档",
      en: "Archive",
    },
    {
      id: "spam",
      zh: "垃圾邮件",
      en: "Spam",
    },
    {
      id: "trash",
      zh: "回收站",
      en: "Trash",
    },
  ],
  chat: [
    { id: "showcase", zh: "AI 组件组合", en: "AI components showcase" },
    { id: "conversation", zh: "历史对话", en: "Conversation history" },
    {
      id: "new",
      zh: "新对话",
      en: "New chat",
    },
    {
      id: "library",
      zh: "资料库",
      en: "Library",
    },
    {
      id: "explore",
      zh: "探索",
      en: "Explore",
    },
  ],
  crm: [
    {
      id: "home",
      zh: "首页",
      en: "Home",
    },
    {
      id: "next",
      zh: "接下来",
      en: "Up next",
    },
    {
      id: "notifications",
      zh: "通知",
      en: "Notifications",
    },
    {
      id: "accounts",
      zh: "客户",
      en: "Accounts",
    },
    {
      id: "opportunities",
      zh: "商机",
      en: "Opportunities",
    },
    {
      id: "contacts",
      zh: "联系人",
      en: "Contacts",
    },
    {
      id: "tasks",
      zh: "任务",
      en: "Tasks",
    },
    {
      id: "meetings",
      zh: "会议",
      en: "Meetings",
    },
    {
      id: "notes",
      zh: "笔记",
      en: "Notes",
    },
    {
      id: "new",
      zh: "新建列表",
      en: "New list",
    },
    {
      id: "risk",
      zh: "风险客户",
      en: "At risk",
    },
    {
      id: "warm",
      zh: "潜在客户",
      en: "Warm contacts",
    },
  ],
  finances: [
    {
      id: "dashboard",
      zh: "概览",
      en: "Overview",
    },
    {
      id: "portfolio",
      zh: "资产组合",
      en: "Portfolio",
    },
    {
      id: "spending",
      zh: "支出",
      en: "Spending",
    },
    {
      id: "transactions",
      zh: "交易记录",
      en: "Transactions",
    },
    {
      id: "earn",
      zh: "收益",
      en: "Earn",
    },
    {
      id: "settings",
      zh: "设置",
      en: "Settings",
    },
  ],
} as const;
export const templateDefinitions = [...templateBaseDefinitions]
  .sort(
    (a, b) =>
      ["dashboard", "mail", "chat", "crm", "finances"].indexOf(a.slug) -
      ["dashboard", "mail", "chat", "crm", "finances"].indexOf(b.slug),
  )
  .map((template) => ({
    ...template,
    previewUrl: `https://orvui-template-${template.slug}.netlify.app`,
    screenshot: `/templates/${template.slug}/preview.png`,
    pages: applicationPages[template.slug],
  }));
export type TemplateSlug = (typeof templateDefinitions)[number]["slug"];
export const findTemplate = (slug?: string) =>
  templateDefinitions.find((template) => template.slug === slug);
export const templateSections = [
  { id: "overview", zh: "概览", en: "Overview" },
  { id: "template-use-cases", zh: "适用场景", en: "When to use it", level: 3 },
  { id: "preview", zh: "交互预览", en: "Interactive preview" },
  { id: "template-walkthrough", zh: "试一试", en: "Try it", level: 3 },
  { id: "composition", zh: "页面组成", en: "Application pages" },
  { id: "notes", zh: "使用说明", en: "Usage notes" },
  { id: "licenses", zh: "来源与许可", en: "Attribution and licenses" },
] as const;
