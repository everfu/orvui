# Agent Skills

One orvui skill entrypoint with component knowledge loaded on demand. References share their APIs, examples and version with the website and MCP.

> Product version: 0.1.1

<a id="install"></a>

## Install the complete skill

Download the [complete offline skill](/orvui-agent/orvui-skill.zip) and extract its `orvui` folder into your project’s `.agents/skills/`. From a checkout, run `pnpm ai:build`, then copy the entire `skills/orvui` folder. Keep all references and license files.

Use `.agents/skills/orvui` for Codex, `.cursor/skills/orvui` for Cursor or `.claude/skills/orvui` for Claude Code. Choose the location used by your assistant.

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

The existing [SKILL.md URL](/orvui-agent/SKILL.md) remains available. If you save only the entrypoint, follow its online index; offline use requires the complete folder.

<a id="workflow"></a>

## Load component knowledge on demand

Ask the assistant to read the index, then only the component references needed for the task. Each reference includes selection guidance, related controls, package imports, source installation, actual state bindings, variants, accessibility, SSR, motion and limitations.

```text
使用 orvui 的 Popover 和 Button 构建一个设置面板。
先读取对应组件参考，保持现有动效，使用真实的 open 状态绑定。

Build a settings panel with orvui Popover and Button.
Read the matching references first, preserve motion and use the actual open binding.
```

<a id="mcp"></a>

## Use with MCP

The skill teaches component selection and composition. The [online MCP](/en/docs/mcp-server) supplies docs, full source, styles and themes for the deployed version; connect with its URL. Complete references remain readable offline without MCP; installing dependencies or downloading online registry source may require a network.

Compare the reference index’s product version with the consuming app. The skill does not automatically upgrade components, change client configuration or authorize publication.

## Next steps

- [MCP Server](/en/docs/mcp-server)
- [Installation](/en/docs/installation)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
