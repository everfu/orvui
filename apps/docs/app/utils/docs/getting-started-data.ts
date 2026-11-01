import type { SitePageDefinition } from "./site-page-data";
const bi = (zh: string, en: string) => ({ zh, en });

/** Introduction content is shared by the page, Markdown and AI documentation. */
export const introductionEditorial: Partial<SitePageDefinition> = {
  title: bi("介绍", "Introduction"),
  description: bi(
    "为 Vue 构建自然、生动且易于定制的用户界面。",
    "Build expressive, composable interfaces for Vue.",
  ),
  lead: bi(
    "orvui 是一个基于 Vue 3.5、Composition API 和 TypeScript 的开源组件库。组件包含交互动效、语义主题和状态绑定，可安装组件包，也可按需复制完整源码。",
    "orvui is an open-source component library built with Vue 3.5, the Composition API and TypeScript. It combines interactive motion, semantic themes and state bindings, with a prebuilt package and individually installable source.",
  ),
  illustration: "components",
  sections: [
    {
      id: "why-orvui",
      legacyIds: ["state"],
      title: bi("为什么选择 orvui？", "Why orvui?"),
      blocks: [
        {
          kind: "features",
          items: [
            {
              title: bi("开箱即用的细节", "Considered defaults"),
              text: bi(
                "从按钮、表单到数据图表，组件共享字体、间距与十一套配色。先接入产品，再调整需要的部分。",
                "Buttons, forms and charts share typography, spacing and eleven palettes. Start with the defaults and customize the parts your product needs.",
              ),
            },
            {
              title: bi("交互自带动效", "Motion with purpose"),
              text: bi(
                "按压、布局变化与弹层过渡服务于交互反馈，并响应减少动态效果的系统偏好。",
                "Press feedback, layout changes and overlay transitions clarify interaction and respect reduced-motion preferences.",
              ),
            },
            {
              title: bi("按 Vue 的方式组合", "Compose the Vue way"),
              text: bi(
                "通过 v-model、插槽、子组件和组合式 API 连接状态。类型声明与组件页 API 帮助你了解每个接口。",
                "Connect state through v-model, slots, child components and composables. Type declarations and component API references describe each interface.",
              ),
            },
            {
              title: bi("保留定制空间", "Room to make it yours"),
              text: bi(
                "使用语义 CSS 变量调整主题，通过组件属性与插槽改变内容；需要修改内部实现时，可以复制单个组件源码。",
                "Adjust themes with semantic CSS variables and compose content through props and slots. Copy individual components when you need to change their internals.",
              ),
            },
            {
              title: bi("键盘与服务端场景", "Keyboard and server rendering"),
              text: bi(
                "表单和浮层提供键盘操作、焦点管理及相应语义。组件覆盖 SSR 与水合场景，具体交互和限制见各页说明。",
                "Forms and overlays provide keyboard interactions, focus management and semantics. SSR and hydration are covered; each component documents its behavior and limitations.",
              ),
            },
            {
              title: bi("为 AI 工作流提供上下文", "Context for coding agents"),
              text: bi(
                "通过 MCP、Agent Skills 与 Markdown 文档读取真实导入、状态绑定、示例和许可，帮助助手使用现有组件。",
                "MCP, Agent Skills and Markdown expose real imports, state bindings, examples and licenses so coding agents can work with existing components.",
              ),
            },
          ],
        },
      ],
    },
    {
      id: "installation",
      legacyIds: ["import-components", "copy-source"],
      title: bi("选择适合你的接入方式", "Choose how to get started"),
      blocks: [
        {
          kind: "paragraph",
          text: bi(
            "组件包和复制源码使用相同的公共 API。按维护方式选择入口，完整配置集中在快速开始。",
            "The package and copied source share the same public APIs. Choose how you want to maintain your components, then follow Quick Start for the complete setup.",
          ),
        },
        {
          kind: "links",
          layout: "cards",
          items: [
            {
              label: bi("安装组件包", "Install the package"),
              url: "/docs/installation#package",
              description: bi(
                "使用预构建入口与完整样式，显式导入需要的组件。",
                "Use prebuilt entrypoints and complete styles, importing the components you need.",
              ),
            },
            {
              label: bi("复制组件源码", "Copy the source"),
              url: "/docs/installation#source-setup",
              description: bi(
                "通过 shadcn-vue 按组件安装，将实现与相对依赖放入自己的项目。",
                "Install individual components with shadcn-vue and keep the implementation and relative helpers in your project.",
              ),
            },
          ],
        },
      ],
    },
    {
      id: "ecosystem",
      legacyIds: ["nuxt"],
      title: bi("围绕组件的工具与资源", "The orvui ecosystem"),
      blocks: [
        {
          kind: "links",
          layout: "cards",
          items: [
            {
              label: bi("Vue 与 Nuxt", "Vue and Nuxt"),
              url: "/docs/installation#package",
              description: bi(
                "在 Vue 应用中导入组件与样式；Nuxt 在 css 配置中加载样式，组件仍显式导入。",
                "Import components and styles in Vue. In Nuxt, load the stylesheet through css and keep explicit component imports.",
              ),
            },
            {
              label: bi("主题与动效", "Themes and motion"),
              url: "/docs/theme",
              description: bi(
                "选择配色、切换明暗模式，并使用语义变量和共享动效约定。",
                "Choose a palette, set the appearance mode and work with semantic variables and shared motion conventions.",
              ),
            },
            {
              label: bi("MCP Server", "MCP Server"),
              url: "/docs/mcp-server",
              description: bi(
                "让开发工具查询组件 API、示例、源码与主题变量。",
                "Let development tools query component APIs, examples, source and theme variables.",
              ),
            },
            {
              label: bi("Agent Skills", "Agent Skills"),
              url: "/docs/agent-skills",
              description: bi(
                "为编程助手安装可按需读取的组件说明与使用约定。",
                "Install component references and usage guidance that coding agents can read on demand.",
              ),
            },
            {
              label: bi("组件目录", "Components"),
              url: "/components",
              description: bi(
                "按使用场景浏览交互、组合模块、AI 组件和图表。",
                "Browse interactions, application blocks, AI components and charts by use case.",
              ),
            },
            {
              label: bi("应用模板", "Application templates"),
              url: "/templates",
              description: bi(
                "体验 Dashboard、Mail、Chat、Finances 与 CRM 的独立演示。",
                "Explore independent Dashboard, Mail, Chat, Finances and CRM demos.",
              ),
            },
          ],
        },
      ],
    },
    {
      id: "faq",
      title: bi("常见问题", "FAQ"),
      blocks: [
        {
          kind: "faq",
          items: [
            {
              id: "license",
              question: bi(
                "可以免费用于商业项目吗？",
                "Can I use orvui commercially?",
              ),
              answer: bi(
                "orvui 以 MIT 许可提供。使用和分发时保留版权、LICENSE 和 NOTICE；独立 Shader 与字体资源遵循各自许可，详见许可清单。",
                "orvui is available under MIT. Preserve copyright, LICENSE and NOTICE when using or distributing it. Separate shader and font resources retain their own licenses; consult the license inventory.",
              ),
            },
            {
              id: "tailwind",
              question: bi(
                "需要安装 Tailwind CSS 吗？",
                "Do I need Tailwind CSS?",
              ),
              answer: bi(
                "组件包包含预编译样式，无需额外配置 Tailwind。复制源码需要 Tailwind CSS 4，并按快速开始配置样式与路径。",
                "The package includes compiled styles and needs no additional Tailwind setup. Copied source requires Tailwind CSS 4 and the stylesheet and alias setup in Quick Start.",
              ),
            },
            {
              id: "frameworks",
              question: bi(
                "支持 Vue、Nuxt 和 TypeScript 吗？",
                "Does it work with Vue, Nuxt and TypeScript?",
              ),
              answer: bi(
                "支持 Vue 与 Nuxt 显式导入，提供 TypeScript 声明。Nuxt 在 nuxt.config.ts 中加载组件包样式；涉及浏览器能力的场景，请同时阅读组件的 SSR 说明。",
                "Vue and Nuxt use explicit imports, with TypeScript declarations included. Load package styles in nuxt.config.ts and consult component SSR notes for browser-dependent features.",
              ),
            },
            {
              id: "beta",
              question: bi("如何试用 Vue 3.6？", "How can I try Vue 3.6?"),
              answer: bi(
                "使用页眉版本菜单切换到 Beta，并按对应快速开始安装本地归档和锁定 Vue RC 依赖。当前支持常规虚拟 DOM 渲染，尚未启用 Vapor 编译。",
                "Switch to Beta in the header, then follow its Quick Start to install the local archive and pin Vue RC dependencies. The Beta uses virtual DOM rendering; Vapor compilation is not enabled.",
              ),
            },
          ],
        },
      ],
    },
    {
      id: "attribution",
      title: bi("参与项目", "Get involved"),
      blocks: [
        {
          kind: "paragraph",
          text: bi(
            '在 <a href="https://github.com/everfu/orvui">GitHub</a> 查看源码、报告问题或贡献改进。复制和分发组件时，保留实现中的版权与适用许可。',
            'Explore the source, report issues or contribute improvements on <a href="https://github.com/everfu/orvui">GitHub</a>. Keep copyright and applicable licenses with copied or distributed components.',
          ),
        },
        {
          kind: "links",
          items: [
            {
              label: bi("源码与问题反馈", "Source and issues"),
              url: "https://github.com/everfu/orvui",
              description: bi(
                "提供复现步骤、版本和预期行为，帮助定位问题。",
                "Include reproduction steps, versions and expected behavior when reporting a problem.",
              ),
            },
            {
              label: bi("版权与许可", "Copyright and licenses"),
              url: "/licenses/orvui-NOTICE.txt",
              endpoint: true,
              description: bi(
                "查阅组件、Shader 与字体资源的来源和许可说明。",
                "Review provenance and licenses for components, shaders and font resources.",
              ),
            },
          ],
        },
      ],
    },
  ],
};
