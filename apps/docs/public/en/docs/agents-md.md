# AGENTS.md · Preview

Add clear component selection, installation and verification guidance to projects using orvui.

> Product version: 0.1.1

<a id="add-to-project"></a>

## Add to your project

Download [AGENTS.md](/orvui-agent/en/AGENTS.md), review it and merge relevant sections into your existing project rules, preserving your team’s instructions.

Save the file under its standard name in the project root, matching the prompts and references below. If the file already exists, open the download link above and merge the sections you need.

```bash
curl -fsSL https://orvui.efu.me/orvui-agent/en/AGENTS.md -o AGENTS.md
```

<a id="usage"></a>

## Connect to your assistant

AGENTS.md describes how to use components; [DESIGN.md](/en/docs/design-md) describes appearance and interaction. After saving the design file as DESIGN.md, reference it from your project rules. Rule discovery varies by assistant; you can also reference the files explicitly in your prompt.

```text
Build this interface with orvui. Follow the project’s AGENTS.md and read DESIGN.md for visual and interaction decisions.
```

<a id="included"></a>

## What’s included

Component selection, both installation modes, explicit Vue/Nuxt imports, actual state bindings, verification and licenses. This is consumer guidance, without orvui’s internal repository maintenance workflow.

<a id="preview"></a>

## File preview

```markdown
# orvui AGENTS.md

Product version: 0.1.1

Merge the relevant sections into your existing AGENTS.md or agent rules, preserving your project's instructions.

## Choose components

Read the [documentation index](https://orvui.efu.me/llms.txt), then the selected components' APIs, examples and versions. Compose existing components first.

```bash
npx skills add everfu/orvui --skill orvui
```

The skill's references/index.md links to complete bilingual references. Use [MCP](https://orvui.efu.me/en/docs/mcp-server) for deployed documentation and complete source. Compare its version with your project's version.

## Installation and imports

Choose an [installation mode](https://orvui.efu.me/en/docs/installation) for the project. Avoid unintentionally mixing package components and copied source. Use explicit public imports in both Vue and Nuxt.

- Package: install @orvui/vue and load @orvui/vue/style.css once globally; configure the stylesheet in nuxt.config.ts's css array for Nuxt.
- Copied source: select an actual registry install slug and inspect all files and dependencies. Example: npx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json. Source installation requires Tailwind CSS 4.

## Use actual APIs

- Use modelValue/update:modelValue or open/update:open only when the component exposes the pair. Do not invent state models for slot-only compositions.
- Keep optional controlled Boolean defaults undefined. Use documented slots and provide/inject rather than internal implementation details.
- The application supplies real data, services, authorization and persistence. Demo interactions do not establish backend integration.

## Appearance and verification

Follow [DESIGN.md](./DESIGN.md) for visual and interaction decisions. Preserve component geometry, semantic theme overrides and motion.

Run the consuming project's type checks and relevant tests. Verify keyboard and focus, reduced motion, mobile layout and Nuxt SSR/hydration separately. Report checks that actually passed.

## Source and licenses

Preserve actual provenance, copyright and applicable licenses for code and assets, including the Paper Design shader license and font OFL. See [LICENSE](https://orvui.efu.me/licenses/MIT.txt) and [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt).

```

## Next steps

- [DESIGN.md](/en/docs/design-md)
- [Agent Skills](/en/docs/agent-skills)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
