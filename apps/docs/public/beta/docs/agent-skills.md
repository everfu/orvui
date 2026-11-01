# Agent Skills

让编码助手了解 orvui 的组件、组合方式与主题。一个技能入口，按需读取完整的双语组件参考。

> 产品版本: 0.2.0-beta.1

<a id="install"></a>

## 安装

在项目目录运行以下命令，按提示选择你的编码助手。技能包含参考文件，安装后无需构建 orvui 即可阅读。

```bash
npx skills add everfu/orvui --skill orvui
```

支持 Codex、Claude Code、Cursor 等助手。安装由 [Skills CLI](https://github.com/vercel-labs/skills) 完成；技能提供使用指导，组件仍按[安装指南](/beta/docs/installation)接入。

也可下载[完整离线 ZIP](/orvui-agent/orvui-skill.zip)，将 orvui 文件夹解压到助手的 skills 目录，保留 references、LICENSE 和 NOTICE。[单独查看 SKILL.md](/orvui-agent/SKILL.md)。

<a id="install-scope"></a>

## 安装范围

默认安装到当前项目，适合团队共享规则；添加 -g 安装到用户目录，供多个项目使用。安装时可选择助手，也可显式指定。

```bash
npx skills add everfu/orvui --skill orvui -g
```

```bash
npx skills add everfu/orvui --skill orvui --agent codex
npx skills add everfu/orvui --skill orvui --agent claude-code
npx skills add everfu/orvui --skill orvui --agent cursor
```

项目内 Codex 使用 .agents/skills，Claude Code 使用 .claude/skills，Cursor 使用 .cursor/skills。CLI 管理共享副本与客户端链接，无需手动复制多个版本。

<a id="workflow"></a>

## 使用

安装后让助手使用 orvui 技能。先读 references/index.md，再只加载当前任务需要的组件参考。

```text
使用 orvui 技能，用 Popover 和 Button 构建一个设置面板。
先查阅对应组件参考，保持现有动效，并使用 Popover 的真实 open 状态绑定。
```

<a id="included"></a>

## 包含内容

组件选用场景与相关控件取舍、真实 props/events/slots、状态绑定、注册变体和组合示例。

组件包导入与注册表源码安装、主题与样式、键盘与焦点、减少动态效果、SSR/hydration 和常见限制。中英文参考与网站、MCP 使用相同的 API 和版本数据。

<a id="structure"></a>

## 目录结构

```text
orvui/
├── SKILL.md
├── LICENSE
├── NOTICE
└── references/
    ├── index.md
    ├── zh/
    │   └── button.md
    └── en/
        └── button.md
    …
```

<a id="mcp"></a>

## 与 MCP 配合

Skill 提供选用与组合指导，[MCP Server](/beta/docs/mcp-server) 可查询当前部署版本的文档、完整源码、样式和主题。无网络时仍可阅读技能包的参考；下载组件和依赖需要网络。

使用前核对索引中的产品版本与应用版本。需要持续的项目约定时，参阅 [AGENTS.md](/beta/docs/agents-md) 和 [DESIGN.md](/beta/docs/design-md)。

## 下一步

- [AGENTS.md](/beta/docs/agents-md)
- [MCP Server](/beta/docs/mcp-server)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
