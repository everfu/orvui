import type { TemplateSlug } from "./template-definitions";
export type EditorialText = { zh: string; en: string };
export const templateEditorial: Record<
  TemplateSlug,
  { purpose: EditorialText; walkthrough: EditorialText[] }
> = {
  dashboard: {
    purpose: {
      zh: "适合运营后台、订单管理与团队分析。",
      en: "For operations, order management and team analytics.",
    },
    walkthrough: [
      {
        zh: "切换概览统计周期，观察指标与图表更新。",
        en: "Change the overview reporting period and inspect the metrics and charts.",
      },
      {
        zh: "打开订单，搜索 Northstar 并编辑一条记录；刷新后检查更改。",
        en: "Open Orders, search for Northstar and edit a record. Refresh to check the saved changes.",
      },
      {
        zh: "在追踪中完成任务，并在设置中调整工作空间偏好。",
        en: "Complete a task in Tracker and customize workspace preferences in Settings.",
      },
    ],
  },
  mail: {
    purpose: {
      zh: "适合展示完整的邮件整理、阅读与撰写流程。",
      en: "For complete mail organization, reading and composition workflows.",
    },
    walkthrough: [
      {
        zh: "打开一封邮件，切换星标或将它归档。",
        en: "Open a message, toggle its star or archive it.",
      },
      {
        zh: "撰写邮件并保存草稿，再从草稿箱继续编辑。",
        en: "Compose a message, save a draft and continue editing it from Drafts.",
      },
      {
        zh: "将邮件移到回收站，然后恢复；保存到已发送仅更新演示状态。",
        en: "Move a message to Trash and restore it. Saving to Sent only updates local demo state.",
      },
    ],
  },
  chat: {
    purpose: {
      zh: "适合 AI 对话、工具审核与知识收藏工作空间。",
      en: "For AI conversations, tool review and saved knowledge workspaces.",
    },
    walkthrough: [
      {
        zh: "从探索选择一个主题，创建对话并观察本地流式回复。",
        en: "Choose a topic in Explore to create a conversation and watch the local streaming response.",
      },
      {
        zh: "尝试停止、重试，并允许或拒绝工具操作。",
        en: "Try Stop and Retry, then allow or deny a tool action.",
      },
      {
        zh: "收藏一条回复，在资料库找到它；刷新后继续历史对话。",
        en: "Save a response, find it in Library and continue the conversation after a refresh.",
      },
    ],
  },
  crm: {
    purpose: {
      zh: "适合客户、商机、联系人与团队跟进管理。",
      en: "For accounts, opportunities, contacts and team follow-up management.",
    },
    walkthrough: [
      {
        zh: "在客户列表搜索 Northstar，打开详情并编辑记录。",
        en: "Search for Northstar in Accounts, open its detail and edit the record.",
      },
      {
        zh: "通过关联记录查看联系人和商机，切换商机状态。",
        en: "Follow related records to contacts and opportunities, then update an opportunity stage.",
      },
      {
        zh: "完成任务、记录会议或笔记，并保存列表筛选。",
        en: "Complete tasks, record meetings or notes, and save list filters.",
      },
    ],
  },
  finances: {
    purpose: {
      zh: "适合资产概览、支出分类与交易记录管理。",
      en: "For portfolio overviews, spending categories and transaction records.",
    },
    walkthrough: [
      {
        zh: "切换概览周期，查看资产趋势和持仓。",
        en: "Change the overview period and inspect the portfolio trend and holdings.",
      },
      {
        zh: "打开交易详情，修改本地记录；在支出页面筛选支出。",
        en: "Open a transaction detail, edit the local record and filter expenses in Spending.",
      },
      {
        zh: "在设置中隐藏金额，再刷新检查隐私偏好。",
        en: "Hide amounts in Settings, then refresh to check the privacy preference.",
      },
    ],
  },
};
