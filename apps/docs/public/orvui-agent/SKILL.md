---
name: orvui
description: Select, install and compose orvui Vue 3.5 components in Vue or Nuxt projects, using their actual APIs and existing motion.
---

# Build with orvui

1. Inspect the consuming app's framework, installed orvui version and installation mode. Use explicit public imports in Vue and Nuxt. Do not mix package components and copied components unintentionally.
2. Read [the component index](references/index.md), then load only the relevant `references/zh/<slug>.md` or `references/en/<slug>.md`. The index records the bundled product version. If this entrypoint was downloaded alone, use [the online index](https://orvui.efu.me/orvui-agent/references/index.md) or download the [complete offline skill](https://orvui.efu.me/orvui-agent/orvui-skill.zip).
3. Connect the public, read-only orvui MCP at `https://orvui.efu.me/mcp` using Streamable HTTP; no token or local server is required. Use `list_components`, `get_component_docs` and `get_component_skill` to inspect the selected component and registered variants. The online MCP describes its deployed version; offline references describe their bundled version. Compare both with the consuming app and resolve any mismatch before applying guidance. If MCP is unavailable, use the bundled references without substituting another library.
4. For package imports, follow the component's package example and load `@orvui/vue/style.css` globally (in Nuxt, use the `css` configuration). For copied source, inspect [the registry](https://orvui.efu.me/r/registry.json), select actual `items[].name` values, inspect each item's files and dependencies, and install with the documented shadcn-vue command. Get the full closure from `get_component_source_code` or the registry; a single raw Vue file is insufficient.
5. Follow the actual props/events/slots and paired state bindings in the selected reference. Use `modelValue`/`update:modelValue` or `open`/`update:open` only when that component exposes the pair. Preserve optional controlled Boolean defaults of `undefined`; do not invent models for slot-only composition.
6. Preserve geometry, motion parameters, `whilePress`, eleven palettes and semantic CSS overrides. Keep keyboard access, focus management, reduced motion, deterministic SSR/hydration, per-instance IDs and resource cleanup. Prefer composition over rewriting existing controls.
7. Preserve dependencies, relative imports, copyright, provenance and applicable notices, including shader and font licenses. Application data, network requests, model services, persistence and authorization belong to the consuming app; sample actions do not prove those integrations work.
8. Run the consuming app's relevant checks and verify the requested interaction. Installation, type checks, SSR/hydration and browser appearance are separate evidence. This skill does not authorize publishing, pushing, deployment or changes to client configuration.
