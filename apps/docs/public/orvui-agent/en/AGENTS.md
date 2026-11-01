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
