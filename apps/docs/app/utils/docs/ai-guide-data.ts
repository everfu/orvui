import type { SiteBlock, SitePageDefinition } from "./site-page-data";
import { mcpEndpointUrl } from "../../../../../tools/distribution";

const bi = (zh: string, en: string) => ({ zh, en });
const paragraph = (zh: string, en: string): SiteBlock => ({
  kind: "paragraph",
  text: bi(zh, en),
});
const code = (value: string, filename: string, lang: string): SiteBlock => ({
  kind: "code",
  code: value,
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
    eyebrow: bi("AI 接入", "Building with AI"),
    title: bi("MCP 服务器", "MCP Server"),
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
          code(
            'get_component_docs({ "slug": "popover", "locale": "zh" })\nget_theme_variables({ "palette": "violet", "mode": "dark" })\nget_docs({ "path": "/docs/installation", "locale": "en" })',
            "MCP tool calls",
            "text",
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
    eyebrow: bi("AI 接入", "Building with AI"),
    title: bi("Agent Skills", "Agent Skills"),
    description: bi(
      "一个 orvui 技能入口，按需读取单个组件的知识。组件参考与网站、MCP 使用相同的 API、示例和版本。",
      "One orvui skill entrypoint with component knowledge loaded on demand. References share their APIs, examples and version with the website and MCP.",
    ),
    sections: [
      {
        id: "install",
        title: bi("安装完整技能", "Install the complete skill"),
        blocks: [
          paragraph(
            '下载 <a href="/orvui-agent/orvui-skill.zip" download="orvui-skill.zip">完整离线 Skill</a>，将其中的 <code>orvui</code> 文件夹解压到项目的 <code>.agents/skills/</code>。从源码使用时，先运行 <code>pnpm ai:build</code>，再复制 <code>skills/orvui</code> 整个文件夹。保留全部 <code>references</code> 和许可证文件。',
            'Download the <a href="/orvui-agent/orvui-skill.zip" download="orvui-skill.zip">complete offline skill</a> and extract its <code>orvui</code> folder into your project’s <code>.agents/skills/</code>. From a checkout, run <code>pnpm ai:build</code>, then copy the entire <code>skills/orvui</code> folder. Keep all references and license files.',
          ),
          paragraph(
            "Codex 使用 <code>.agents/skills/orvui</code>；Cursor 可放在 <code>.cursor/skills/orvui</code>；Claude Code 可放在 <code>.claude/skills/orvui</code>。选择当前助手使用的位置即可。",
            "Use <code>.agents/skills/orvui</code> for Codex, <code>.cursor/skills/orvui</code> for Cursor or <code>.claude/skills/orvui</code> for Claude Code. Choose the location used by your assistant.",
          ),
          code(
            "orvui/\n  SKILL.md\n  LICENSE\n  NOTICE\n  references/\n    index.md\n    zh/button.md\n    en/button.md\n    …",
            "skill folder",
            "text",
          ),
          paragraph(
            '旧的 <a href="/orvui-agent/SKILL.md">SKILL.md 地址</a>继续可用。单独保存入口时，可通过其中的在线索引读取参考；完整离线使用需要下载整个文件夹。',
            'The existing <a href="/orvui-agent/SKILL.md">SKILL.md URL</a> remains available. If you save only the entrypoint, follow its online index; offline use requires the complete folder.',
          ),
        ],
      },
      {
        id: "workflow",
        title: bi("按需加载组件知识", "Load component knowledge on demand"),
        blocks: [
          paragraph(
            "让助手先读索引，再只读取本次需要的组件参考。每份参考包含选用场景、相关组件取舍、包导入、源码安装、真实状态绑定、变体、无障碍、SSR、动效和常见限制。",
            "Ask the assistant to read the index, then only the component references needed for the task. Each reference includes selection guidance, related controls, package imports, source installation, actual state bindings, variants, accessibility, SSR, motion and limitations.",
          ),
          code(
            "使用 orvui 的 Popover 和 Button 构建一个设置面板。\n先读取对应组件参考，保持现有动效，使用真实的 open 状态绑定。\n\nBuild a settings panel with orvui Popover and Button.\nRead the matching references first, preserve motion and use the actual open binding.",
            "example prompt",
            "text",
          ),
        ],
      },
      {
        id: "mcp",
        title: bi("与 MCP 配合", "Use with MCP"),
        blocks: [
          paragraph(
            'Skill 指导如何选用与组合组件，<a href="/docs/mcp-server">线上 MCP</a> 提供当前部署版本的文档、完整源码、样式与主题查询，填 URL 即可连接。没有 MCP 时，完整参考仍可离线读取；安装依赖或从在线注册表下载源码可能需要网络。',
            'The skill teaches component selection and composition. The <a href="/docs/mcp-server">online MCP</a> supplies docs, full source, styles and themes for the deployed version; connect with its URL. Complete references remain readable offline without MCP; installing dependencies or downloading online registry source may require a network.',
          ),
          paragraph(
            "核对参考索引中的产品版本与消费项目版本。Skill 不会自动升级组件、修改客户端配置或授权发布。",
            "Compare the reference index’s product version with the consuming app. The skill does not automatically upgrade components, change client configuration or authorize publication.",
          ),
        ],
      },
    ],
  },
];
