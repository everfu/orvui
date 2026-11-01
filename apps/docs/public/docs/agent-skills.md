# Agent Skills

一个 orvui 技能入口，按需读取单个组件的知识。组件参考与网站、MCP 使用相同的 API、示例和版本。

> 产品版本: 0.1.1

<a id="install"></a>

## 安装完整技能

下载 [完整离线 Skill](/orvui-agent/orvui-skill.zip)，将其中的 `orvui` 文件夹解压到项目的 `.agents/skills/`。从源码使用时，先运行 `pnpm ai:build`，再复制 `skills/orvui` 整个文件夹。保留全部 `references` 和许可证文件。

Codex 使用 `.agents/skills/orvui`；Cursor 可放在 `.cursor/skills/orvui`；Claude Code 可放在 `.claude/skills/orvui`。选择当前助手使用的位置即可。

```text
orvui/
  SKILL.md
  LICENSE
  NOTICE
  references/
    index.md
    zh/button.md
    en/button.md
    …
```

旧的 [SKILL.md 地址](/orvui-agent/SKILL.md)继续可用。单独保存入口时，可通过其中的在线索引读取参考；完整离线使用需要下载整个文件夹。

<a id="workflow"></a>

## 按需加载组件知识

让助手先读索引，再只读取本次需要的组件参考。每份参考包含选用场景、相关组件取舍、包导入、源码安装、真实状态绑定、变体、无障碍、SSR、动效和常见限制。

```text
使用 orvui 的 Popover 和 Button 构建一个设置面板。
先读取对应组件参考，保持现有动效，使用真实的 open 状态绑定。

Build a settings panel with orvui Popover and Button.
Read the matching references first, preserve motion and use the actual open binding.
```

<a id="mcp"></a>

## 与 MCP 配合

Skill 指导如何选用与组合组件，[线上 MCP](/docs/mcp-server) 提供当前部署版本的文档、完整源码、样式与主题查询，填 URL 即可连接。没有 MCP 时，完整参考仍可离线读取；安装依赖或从在线注册表下载源码可能需要网络。

核对参考索引中的产品版本与消费项目版本。Skill 不会自动升级组件、修改客户端配置或授权发布。

## 下一步

- [MCP 服务器](/docs/mcp-server)
- [安装指南](/docs/installation)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
