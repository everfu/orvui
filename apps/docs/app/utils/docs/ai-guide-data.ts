import type { SiteBlock, SitePageDefinition } from "./site-page-data";
import {
  consumerDocument,
  type ConsumerDocument,
} from "../../../../../tools/ai/consumer-documents";
import { mcpEndpointUrl } from "../../../../../tools/distribution";

const bi = (zh: string, en: string) => ({ zh, en });
const paragraph = (zh: string, en: string): SiteBlock => ({
  kind: "paragraph",
  text: bi(zh, en),
});
const code = (
  value: string | { zh: string; en: string },
  filename: string,
  lang = "bash",
): SiteBlock => ({
  kind: "code",
  code: typeof value === "string" ? value : value.zh,
  codeEn: typeof value === "string" ? undefined : value.en,
  filename,
  lang,
});
const tools = [
  ["list_components", "发现组件与变体", "Discover components and variants"],
  [
    "get_component_docs",
    "读取 API、状态绑定与两种安装示例",
    "Read APIs, state bindings and examples for both installation modes",
  ],
  [
    "get_component_source_code",
    "读取完整源码闭包、依赖和许可证",
    "Read complete source closures, dependencies and licenses",
  ],
  [
    "get_component_source_styles",
    "读取 CSS 与 SFC 样式",
    "Read CSS and SFC styles",
  ],
  [
    "get_theme_variables",
    "读取十一套配色及明暗模式",
    "Read eleven palettes and light/dark modes",
  ],
  [
    "get_docs",
    "按公开路径读取指南与组件文档",
    "Read guides and component docs by public path",
  ],
  [
    "get_component_skill",
    "按需读取组件选用与组合指导",
    "Read component selection and composition guidance on demand",
  ],
];

export const aiGuidePages: SitePageDefinition[] = [
  {
    slug: "mcp-server",
    path: "/docs/mcp-server",
    eyebrow: bi("面向 AI 助手", "UI for Agents"),
    title: bi("MCP Server", "MCP Server"),
    description: bi(
      "通过线上 MCP 查询 orvui 的真实组件 API、源码、样式和主题。公开只读，填入服务器 URL 即可连接，无需安装本地服务或配置令牌。",
      "Query actual orvui APIs, source, styles and themes through the online MCP server. Public and read-only: connect with the server URL, without a local server or token.",
    ),
    sections: [
      {
        id: "setup",
        title: bi("服务器地址", "Server URL"),
        blocks: [
          paragraph(
            "复制下面的地址，在支持 Streamable HTTP 的编码助手中添加远程 MCP。服务器仅提供公开组件知识，不读取或修改你的项目。",
            "Copy the URL below and add a remote MCP server in a coding assistant that supports Streamable HTTP. The server only provides public component knowledge; it does not read or modify your project.",
          ),
          code(mcpEndpointUrl, "MCP server URL", "text"),
          paragraph(
            "这是 MCP 协议地址，通过客户端连接；直接在浏览器地址栏打开不会显示文档页。公开服务按 IP 和域名每分钟限制 100 次请求。",
            "This is a protocol endpoint for MCP clients; opening it in a browser does not show a documentation page. The public service limits requests to 100 per minute per IP and domain.",
          ),
        ],
      },
      {
        id: "clients",
        title: bi("连接编码助手", "Connect your coding assistant"),
        blocks: [
          paragraph(
            "在当前项目或客户端设置中保存配置。Codex 使用项目内 <code>.codex/config.toml</code>，Cursor 使用 <code>.cursor/mcp.json</code>；Claude Code 可使用下面的命令添加。保存后重新连接 MCP，确认可以发现七个工具。",
            "Save the configuration in your project or client settings. Use project-local <code>.codex/config.toml</code> for Codex and <code>.cursor/mcp.json</code> for Cursor; add Claude Code with the command below. Reconnect MCP and confirm that seven tools are available.",
          ),
          code(
            `[mcp_servers.orvui]\nurl = "${mcpEndpointUrl}"`,
            ".codex/config.toml",
            "toml",
          ),
          code(
            JSON.stringify(
              {
                mcpServers: {
                  orvui: {
                    url: mcpEndpointUrl,
                  },
                },
              },
              null,
              2,
            ),
            ".cursor/mcp.json",
            "json",
          ),
          code(
            `claude mcp add --transport http orvui ${mcpEndpointUrl}`,
            "Claude Code",
            "bash",
          ),
        ],
      },
      {
        id: "usage",
        title: bi("使用示例", "Usage"),
        blocks: [
          paragraph(
            "先查找组件，再读取所需 API、主题或指南。使用目录中的真实 slug；文档查询支持中文与英文。",
            "Discover components first, then read the APIs, theme or guide you need. Use actual catalog slugs; documentation queries support Chinese and English.",
          ),
          code(
            'list_components({})\nget_component_docs({ "slug": "popover", "locale": "zh" })\nget_theme_variables({ "palette": "violet", "mode": "dark" })\nget_docs({ "path": "/docs/installation", "locale": "en" })',
            "MCP tool calls",
            "text",
          ),
        ],
      },
      {
        id: "tools",
        title: bi("组件级查询", "Component queries"),
        blocks: [
          ...tools.map(([name, zh, en]) =>
            paragraph(
              `<code>${name}</code>：${zh}。`,
              `<code>${name}</code>: ${en}.`,
            ),
          ),
          paragraph(
            "使用目录中的 slug 查询组件，例如 <code>button</code>、<code>popover</code>。文档查询支持 <code>locale: zh | en</code>，默认中文；<code>get_component_docs</code> 的 <code>variant</code> 使用组件目录的示例 slug。响应注明产品版本和来源。",
            "Use catalog slugs such as <code>button</code> and <code>popover</code>. Documentation queries accept <code>locale: zh | en</code>, defaulting to Chinese. The <code>variant</code> argument to <code>get_component_docs</code> uses a catalog example slug. Responses include product version and source.",
          ),
        ],
      },
      {
        id: "versions",
        title: bi("版本与可用范围", "Versions and availability"),
        blocks: [
          paragraph(
            "线上服务随文档站部署更新。响应注明产品版本，使用前与你的项目版本核对。查询为无状态请求，不保留客户端会话；未知组件、变体或路径会返回明确错误。MCP 需要联网，完整 Skill 参考可以离线读取。",
            "The online service updates with documentation deployments. Responses identify the product version; compare it with your app before applying guidance. Queries are stateless and do not retain client sessions. Unknown components, variants and paths return explicit errors. MCP requires a network; complete Skill references can be read offline.",
          ),
          paragraph(
            '组件使用方式见 <a href="/docs/agent-skills">Agent Skills</a>，直接读取资源的流程见 <a href="/docs/ai-agents">代理指南</a>。',
            'See <a href="/docs/agent-skills">Agent Skills</a> for component workflows and the <a href="/docs/ai-agents">Agent guide</a> for direct resource access.',
          ),
        ],
      },
      {
        id: "local-development",
        title: bi("维护与离线备用", "Maintenance and offline fallback"),
        blocks: [
          paragraph(
            "维护者运行 <code>pnpm mcp:build</code> 生成数据与本地包；Netlify 构建会将同版本数据打包进函数。需要完全离线的 MCP 时，可保留 <code>@orvui/vue-mcp</code> 的 stdio 入口；日常接入优先使用上面的线上 URL。",
            "Maintainers run <code>pnpm mcp:build</code> to generate data and the local package. Netlify builds bundle matching data into the function. For fully offline MCP, the <code>@orvui/vue-mcp</code> stdio entrypoint remains available; use the online URL above for normal setup.",
          ),
          code(
            "pnpm mcp:build\npnpm mcp:dev\n# Optional offline archive\npnpm mcp:pack",
            "local fallback",
            "bash",
          ),
        ],
      },
    ],
  },
  {
    slug: "agent-skills",
    path: "/docs/agent-skills",
    eyebrow: bi("面向 AI 助手", "UI for Agents"),
    title: bi("Agent Skills", "Agent Skills"),
    description: bi(
      "让编码助手了解 orvui 的组件、组合方式与主题。一个技能入口，按需读取完整的双语组件参考。",
      "Give your coding assistant knowledge of orvui components, composition and themes. One skill loads complete bilingual component references on demand.",
    ),
    sections: [
      {
        id: "install",
        title: bi("安装", "Installation"),
        blocks: [
          paragraph(
            "在项目目录运行以下命令，按提示选择你的编码助手。技能包含参考文件，安装后无需构建 orvui 即可阅读。",
            "Run this command in your project and select your coding assistant when prompted. References are included; no orvui build is needed after installation.",
          ),
          code("npx skills add everfu/orvui --skill orvui", "terminal"),
          paragraph(
            '支持 Codex、Claude Code、Cursor 等助手。安装由 <a href="https://github.com/vercel-labs/skills">Skills CLI</a> 完成；技能提供使用指导，组件仍按<a href="/docs/installation">安装指南</a>接入。',
            'Supports Codex, Claude Code, Cursor and other assistants through the <a href="https://github.com/vercel-labs/skills">Skills CLI</a>. The skill provides guidance; install components using the <a href="/docs/installation">installation guide</a>.',
          ),
          paragraph(
            '也可下载<a href="/orvui-agent/orvui-skill.zip" download="orvui-skill.zip">完整离线 ZIP</a>，将 orvui 文件夹解压到助手的 skills 目录，保留 references、LICENSE 和 NOTICE。<a href="/orvui-agent/SKILL.md">单独查看 SKILL.md</a>。',
            'Alternatively, download the <a href="/orvui-agent/orvui-skill.zip" download="orvui-skill.zip">complete offline ZIP</a> and extract the orvui folder into your assistant’s skills directory. Keep references, LICENSE and NOTICE. <a href="/orvui-agent/SKILL.md">View SKILL.md</a> separately.',
          ),
        ],
      },
      {
        id: "install-scope",
        title: bi("安装范围", "Install scope"),
        blocks: [
          paragraph(
            "默认安装到当前项目，适合团队共享规则；添加 -g 安装到用户目录，供多个项目使用。安装时可选择助手，也可显式指定。",
            "Installation defaults to the current project, suitable for shared team guidance. Add -g to install in your user directory for multiple projects. Select assistants interactively or specify them explicitly.",
          ),
          code(
            "npx skills add everfu/orvui --skill orvui -g",
            "global installation",
          ),
          code(
            `npx skills add everfu/orvui --skill orvui --agent codex
npx skills add everfu/orvui --skill orvui --agent claude-code
npx skills add everfu/orvui --skill orvui --agent cursor`,
            "choose your assistant",
          ),
          paragraph(
            "项目内 Codex 使用 .agents/skills，Claude Code 使用 .claude/skills，Cursor 使用 .cursor/skills。CLI 管理共享副本与客户端链接，无需手动复制多个版本。",
            "In a project, Codex uses .agents/skills, Claude Code uses .claude/skills and Cursor uses .cursor/skills. The CLI manages the shared copy and agent links, so you need not maintain multiple copies manually.",
          ),
        ],
      },
      {
        id: "workflow",
        title: bi("使用", "Usage"),
        blocks: [
          paragraph(
            "安装后让助手使用 orvui 技能。先读 references/index.md，再只加载当前任务需要的组件参考。",
            "After installation, ask your assistant to use the orvui skill. Read references/index.md first, then load only the components needed for the task.",
          ),
          code(
            bi(
              "使用 orvui 技能，用 Popover 和 Button 构建一个设置面板。\n先查阅对应组件参考，保持现有动效，并使用 Popover 的真实 open 状态绑定。",
              "Use the orvui skill to build a settings panel with Popover and Button.\nRead their references first, preserve existing motion and use Popover’s actual open binding.",
            ),
            "example prompt",
            "text",
          ),
        ],
      },
      {
        id: "included",
        title: bi("包含内容", "What’s included"),
        blocks: [
          paragraph(
            "组件选用场景与相关控件取舍、真实 props/events/slots、状态绑定、注册变体和组合示例。",
            "Component selection and related controls, actual props/events/slots, state bindings, registered variants and composition examples.",
          ),
          paragraph(
            "组件包导入与注册表源码安装、主题与样式、键盘与焦点、减少动态效果、SSR/hydration 和常见限制。中英文参考与网站、MCP 使用相同的 API 和版本数据。",
            "Package imports and registry source installation, themes and styles, keyboard and focus, reduced motion, SSR/hydration and limitations. Bilingual references share API and version data with the website and MCP.",
          ),
        ],
      },
      {
        id: "structure",
        title: bi("目录结构", "Structure"),
        blocks: [
          code(
            "orvui/\n├── SKILL.md\n├── LICENSE\n├── NOTICE\n└── references/\n    ├── index.md\n    ├── zh/\n    │   └── button.md\n    └── en/\n        └── button.md\n    …",
            "skill folder",
            "text",
          ),
        ],
      },
      {
        id: "mcp",
        title: bi("与 MCP 配合", "Use with MCP"),
        blocks: [
          paragraph(
            'Skill 提供选用与组合指导，<a href="/docs/mcp-server">MCP Server</a> 可查询当前部署版本的文档、完整源码、样式和主题。无网络时仍可阅读技能包的参考；下载组件和依赖需要网络。',
            'The skill provides selection and composition guidance. <a href="/docs/mcp-server">MCP Server</a> supplies documentation, complete source, styles and themes for the deployed version. Bundled references remain readable offline; downloading components and dependencies requires a network.',
          ),
          paragraph(
            '使用前核对索引中的产品版本与应用版本。需要持续的项目约定时，参阅 <a href="/docs/agents-md">AGENTS.md</a> 和 <a href="/docs/design-md">DESIGN.md</a>。',
            'Compare the index’s product version with your app before use. For persistent project guidance, see <a href="/docs/agents-md">AGENTS.md</a> and <a href="/docs/design-md">DESIGN.md</a>.',
          ),
        ],
      },
    ],
  },
  {
    slug: "llms-txt",
    path: "/docs/llms-txt",
    eyebrow: bi("面向 AI 助手", "UI for Agents"),
    title: bi("LLMs.txt", "LLMs.txt"),
    description: bi(
      "把 orvui 的文档索引交给编码助手，按需读取指南、组件 API 与示例。",
      "Give your coding assistant an index of orvui documentation to read guides, component APIs and examples on demand.",
    ),
    sections: [
      {
        id: "files",
        title: bi("可用资源", "Available files"),
        blocks: [
          paragraph(
            '<a href="/llms.txt">/llms.txt</a> 是指南、组件、模板和注册表的轻量索引。链接指向本站实际生成的 Markdown 和资源。',
            '<a href="/llms.txt">/llms.txt</a> is a lightweight index of guides, components, templates and the registry. Its links point to Markdown and resources generated by this site.',
          ),
          paragraph(
            "指南和组件页面提供「复制页面」与 Markdown 链接。下面以 Button 为例，中英文文件分别提供对应语言的说明、API 和示例。",
            "Guide and component pages provide Copy page and Markdown links. For example, Button has separate Chinese and English files containing the corresponding guidance, APIs and examples.",
          ),
          code(
            "{{origin}}/llms.txt\n{{origin}}/components/motion/button.md\n{{origin}}/en/components/motion/button.md",
            "documentation URLs",
            "text",
          ),
        ],
      },
      {
        id: "usage",
        title: bi("在助手中使用", "Use with your assistant"),
        blocks: [
          paragraph(
            "将索引 URL 提供给能够读取网页的助手，再说明所需组件。只加载本次任务需要的文档，控制上下文大小。",
            "Provide the index URL to an assistant that can read web content, then describe the components you need. Load only the relevant documents to keep context focused.",
          ),
          code(
            bi(
              "读取 {{origin}}/llms.txt，使用 orvui 的 Button 和 Popover 构建设置面板。\n先读取相应组件的中文 Markdown，按文档中的 API 和安装方式实现。",
              "Read {{origin}}/llms.txt and build a settings panel with orvui Button and Popover.\nRead their English Markdown first and follow the documented APIs and installation mode.",
            ),
            "example prompt",
            "text",
          ),
        ],
      },
      {
        id: "next-tools",
        title: bi("选择接入方式", "Choose your integration"),
        blocks: [
          paragraph(
            '直接读取少量文档时使用索引；需要按工具查询源码和主题时连接 <a href="/docs/mcp-server">MCP</a>；需要组件选用指导和离线参考时安装 <a href="/docs/agent-skills">Agent Skills</a>。',
            'Use the index for a few documents, connect <a href="/docs/mcp-server">MCP</a> for source and theme queries, or install <a href="/docs/agent-skills">Agent Skills</a> for component guidance and offline references.',
          ),
        ],
      },
    ],
  },
  consumerPage("AGENTS.md"),
  consumerPage("DESIGN.md"),
];

function consumerPage(filename: ConsumerDocument): SitePageDefinition {
  const agents = filename === "AGENTS.md";
  const slug = agents ? "agents-md" : "design-md";
  return {
    slug,
    path: `/docs/${slug}`,
    eyebrow: bi("面向 AI 助手", "UI for Agents"),
    title: bi(filename, filename),
    status: "preview",
    description: agents
      ? bi(
          "为使用 orvui 的项目添加清晰的组件选用、安装与验证约定。",
          "Add clear component selection, installation and verification guidance to projects using orvui.",
        )
      : bi(
          "让编码助手遵循 orvui 的语义主题、组件组合与交互风格。",
          "Guide your coding assistant with orvui’s semantic themes, component composition and interaction style.",
        ),
    sections: [
      {
        id: "add-to-project",
        title: bi("添加到项目", "Add to your project"),
        blocks: [
          paragraph(
            agents
              ? '下载<a href="/orvui-agent/AGENTS.md" download="AGENTS.md">AGENTS.md</a>，阅读后将相关段落合并到项目已有规则中，保留团队自己的约束。'
              : '下载<a href="/orvui-agent/DESIGN.md" download="DESIGN.md">DESIGN.md</a>，作为项目视觉与交互约定。主题定制后，同步本文件中的相关说明。',
            agents
              ? 'Download <a href="/orvui-agent/en/AGENTS.md" download="AGENTS.md">AGENTS.md</a>, review it and merge relevant sections into your existing project rules, preserving your team’s instructions.'
              : 'Download <a href="/orvui-agent/en/DESIGN.md" download="DESIGN.md">DESIGN.md</a> for visual and interaction guidance. Update the relevant sections when customizing your theme.',
          ),
          paragraph(
            "在项目根目录保存为标准文件名，与下方提示词和文件内引用保持一致。如果已有同名文件，请先打开上面的下载链接，合并需要的内容。",
            "Save the file under its standard name in the project root, matching the prompts and references below. If the file already exists, open the download link above and merge the sections you need.",
          ),
          code(
            bi(
              `curl -fsSL {{origin}}/orvui-agent/${filename} -o ${filename}`,
              `curl -fsSL {{origin}}/orvui-agent/en/${filename} -o ${filename}`,
            ),
            "terminal",
          ),
        ],
      },
      {
        id: "usage",
        title: bi("连接到编码助手", "Connect to your assistant"),
        blocks: agents
          ? [
              paragraph(
                'AGENTS.md 记录如何使用组件，<a href="/docs/design-md">DESIGN.md</a> 记录外观与交互。将设计文件保存为 DESIGN.md 后，在已有项目规则中引用。各助手对规则文件的发现方式不同，也可在提示词中显式说明。',
                'AGENTS.md describes how to use components; <a href="/docs/design-md">DESIGN.md</a> describes appearance and interaction. After saving the design file as DESIGN.md, reference it from your project rules. Rule discovery varies by assistant; you can also reference the files explicitly in your prompt.',
              ),
              code(
                bi(
                  "使用 orvui 实现这个界面。遵循项目 AGENTS.md，并读取 DESIGN.md 中的视觉与交互约定。",
                  "Build this interface with orvui. Follow the project’s AGENTS.md and read DESIGN.md for visual and interaction decisions.",
                ),
                "example prompt",
                "text",
              ),
            ]
          : [
              paragraph(
                'DESIGN.md 并非所有助手都会自动发现的规则文件。请在 <a href="/docs/agents-md">AGENTS.md</a>、编辑器规则或提示词中引用。',
                'DESIGN.md is not automatically discovered by every assistant. Reference it from <a href="/docs/agents-md">AGENTS.md</a>, editor rules or your prompt.',
              ),
              code(
                bi(
                  "视觉与交互决策遵循 [DESIGN.md](./DESIGN.md)，使用 orvui 语义颜色与公开组件。",
                  "Follow [DESIGN.md](./DESIGN.md) for visual and interaction decisions. Use orvui semantic colors and public components.",
                ),
                "project rules",
                "markdown",
              ),
            ],
      },
      {
        id: "included",
        title: bi("包含内容", "What’s included"),
        blocks: [
          paragraph(
            agents
              ? "组件选用、两种安装方式、Vue/Nuxt 显式导入、真实状态绑定、验证和许可约定。这里是消费项目指引，不包含 orvui 仓库的内部维护流程。"
              : "语义颜色和默认明暗主题值、十一套配色、布局与层次、组件组合、动效、键盘与焦点及 SSR/hydration。主题值直接读取组件库定义。",
            agents
              ? "Component selection, both installation modes, explicit Vue/Nuxt imports, actual state bindings, verification and licenses. This is consumer guidance, without orvui’s internal repository maintenance workflow."
              : "Semantic colors and default light/dark values, eleven palettes, layout and hierarchy, composition, motion, keyboard and focus, and SSR/hydration. Theme values are read directly from library definitions.",
          ),
        ],
      },
      {
        id: "preview",
        title: bi("文件预览", "File preview"),
        blocks: [
          code(
            bi(consumerDocument(filename), consumerDocument(filename, true)),
            filename,
            "markdown",
          ),
        ],
      },
    ],
  };
}
