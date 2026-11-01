# MCP Server

通过线上 MCP 查询 orvui 的真实组件 API、源码、样式和主题。公开只读，填入服务器 URL 即可连接，无需安装本地服务或配置令牌。

> 产品版本: 0.2.0-beta.1

<a id="setup"></a>

## 服务器地址

复制下面的地址，在支持 Streamable HTTP 的编码助手中添加远程 MCP。服务器仅提供公开组件知识，不读取或修改你的项目。

```text
https://orvui.efu.me/mcp
```

这是 MCP 协议地址，通过客户端连接；直接在浏览器地址栏打开不会显示文档页。公开服务按 IP 和域名每分钟限制 100 次请求。

<a id="clients"></a>

## 连接编码助手

在当前项目或客户端设置中保存配置。Codex 使用项目内 `.codex/config.toml`，Cursor 使用 `.cursor/mcp.json`；Claude Code 可使用下面的命令添加。保存后重新连接 MCP，确认可以发现七个工具。

```toml
[mcp_servers.orvui]
url = "https://orvui.efu.me/mcp"
```

```json
{
  "mcpServers": {
    "orvui": {
      "url": "https://orvui.efu.me/mcp"
    }
  }
}
```

```bash
claude mcp add --transport http orvui https://orvui.efu.me/mcp
```

<a id="usage"></a>

## 使用示例

先查找组件，再读取所需 API、主题或指南。使用目录中的真实 slug；文档查询支持中文与英文。

```text
list_components({})
get_component_docs({ "slug": "popover", "locale": "zh" })
get_theme_variables({ "palette": "violet", "mode": "dark" })
get_docs({ "path": "/docs/installation", "locale": "en" })
```

<a id="tools"></a>

## 组件级查询

`list_components`：发现组件与变体。

`get_component_docs`：读取 API、状态绑定与两种安装示例。

`get_component_source_code`：读取完整源码闭包、依赖和许可证。

`get_component_source_styles`：读取 CSS 与 SFC 样式。

`get_theme_variables`：读取十一套配色及明暗模式。

`get_docs`：按公开路径读取指南与组件文档。

`get_component_skill`：按需读取组件选用与组合指导。

使用目录中的 slug 查询组件，例如 `button`、`popover`。文档查询支持 `locale: zh | en`，默认中文；`get_component_docs` 的 `variant` 使用组件目录的示例 slug。响应注明产品版本和来源。

<a id="versions"></a>

## 版本与可用范围

线上服务随文档站部署更新。响应注明产品版本，使用前与你的项目版本核对。查询为无状态请求，不保留客户端会话；未知组件、变体或路径会返回明确错误。MCP 需要联网，完整 Skill 参考可以离线读取。

组件使用方式见 [Agent Skills](/beta/docs/agent-skills)，直接读取资源的流程见 [代理指南](/beta/docs/ai-agents)。

<a id="local-development"></a>

## 维护与离线备用

维护者运行 `pnpm mcp:build` 生成数据与本地包；Netlify 构建会将同版本数据打包进函数。需要完全离线的 MCP 时，可保留 `@orvui/vue-mcp` 的 stdio 入口；日常接入优先使用上面的线上 URL。

```bash
pnpm mcp:build
pnpm mcp:dev
# Optional offline archive
pnpm mcp:pack
```

## 下一步

- [Agent Skills](/beta/docs/agent-skills)
- [LLMs.txt](/beta/docs/llms-txt)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
