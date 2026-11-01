# Agent Skills

Give your coding assistant knowledge of orvui components, composition and themes. One skill loads complete bilingual component references on demand.

> Product version: 0.1.1

<a id="install"></a>

## Installation

Run this command in your project and select your coding assistant when prompted. References are included; no orvui build is needed after installation.

```bash
npx skills add everfu/orvui --skill orvui
```

Supports Codex, Claude Code, Cursor and other assistants through the [Skills CLI](https://github.com/vercel-labs/skills). The skill provides guidance; install components using the [installation guide](/en/docs/installation).

Alternatively, download the [complete offline ZIP](/orvui-agent/orvui-skill.zip) and extract the orvui folder into your assistant’s skills directory. Keep references, LICENSE and NOTICE. [View SKILL.md](/orvui-agent/SKILL.md) separately.

<a id="install-scope"></a>

## Install scope

Installation defaults to the current project, suitable for shared team guidance. Add -g to install in your user directory for multiple projects. Select assistants interactively or specify them explicitly.

```bash
npx skills add everfu/orvui --skill orvui -g
```

```bash
npx skills add everfu/orvui --skill orvui --agent codex
npx skills add everfu/orvui --skill orvui --agent claude-code
npx skills add everfu/orvui --skill orvui --agent cursor
```

In a project, Codex uses .agents/skills, Claude Code uses .claude/skills and Cursor uses .cursor/skills. The CLI manages the shared copy and agent links, so you need not maintain multiple copies manually.

<a id="workflow"></a>

## Usage

After installation, ask your assistant to use the orvui skill. Read references/index.md first, then load only the components needed for the task.

```text
Use the orvui skill to build a settings panel with Popover and Button.
Read their references first, preserve existing motion and use Popover’s actual open binding.
```

<a id="included"></a>

## What’s included

Component selection and related controls, actual props/events/slots, state bindings, registered variants and composition examples.

Package imports and registry source installation, themes and styles, keyboard and focus, reduced motion, SSR/hydration and limitations. Bilingual references share API and version data with the website and MCP.

<a id="structure"></a>

## Structure

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

## Use with MCP

The skill provides selection and composition guidance. [MCP Server](/en/docs/mcp-server) supplies documentation, complete source, styles and themes for the deployed version. Bundled references remain readable offline; downloading components and dependencies requires a network.

Compare the index’s product version with your app before use. For persistent project guidance, see [AGENTS.md](/en/docs/agents-md) and [DESIGN.md](/en/docs/design-md).

## Next steps

- [AGENTS.md](/en/docs/agents-md)
- [MCP Server](/en/docs/mcp-server)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
