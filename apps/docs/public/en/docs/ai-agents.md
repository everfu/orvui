# For AI agents

Query components with the [MCP Server](/en/docs/mcp-server) or install the complete [Agent Skills](/en/docs/agent-skills) to load component knowledge on demand. This page retains the direct registry workflow. Coding agents can inspect source and dependencies before installing into your project with shadcn-vue.

> Product version: 0.1.1

<a id="workflow"></a>

## Start with the workflow

1. **Discover existing capabilities** — Read component names, APIs and dependencies from the documentation and registry.

2. **Install and register explicitly** — Use actual registry items and public imports, then integrate with your application's framework.

3. **Run and verify** — Check the generated output, interaction state and any required server capabilities.

> **Tip**: Integration snippets explain composition. Your application provides model calls, permissions and backend behavior.

<a id="agent-skill"></a>

## Agent skill

Install the complete skill from [Agent Skills](/en/docs/agent-skills), including bilingual references and npx skills installation. For project-wide guidance, merge the relevant sections from [AGENTS.md](/en/docs/agents-md).

<a id="endpoints"></a>

## Endpoints

- [llms.txt](https://orvui.efu.me/llms.txt): Markdown index in llmstxt.org format.
- [Registry index](https://orvui.efu.me/r/registry.json): JSON catalogue of every component.
- [Component detail](/r/{slug}.json): shadcn-vue install item with every file, dependency and source.
- [shadcn catalog](https://orvui.efu.me/registry.json): Directory-compatible registry catalog.
- [Theme item](https://orvui.efu.me/r/orvui-theme.json): Install item with semantic color classes and theme configuration.
- [Raw source](/r/{slug}/raw.txt): Plain-text Vue source of the default component; use component detail for every dependency.
<a id="agent-flow"></a>

## Agent flow

Read the catalog and component detail, inspect files and dependencies, then install the complete item with shadcn-vue.

```ts
// 1. Discover what exists
const index = await fetch('https://orvui.efu.me/r/registry.json').then(r => r.json());

// 2. Fetch a component selected from index.items[].name
const entry = await fetch(`https://orvui.efu.me/r/${slug}.json`).then(r => r.json());

// 3. Inspect the source targets and dependencies before installing
console.log(entry.files.map(file => file.target), entry.dependencies);

// 4. Install the complete item with shadcn-vue
await runShell(['pnpm', 'dlx', 'shadcn-vue@2.8.2', 'add',
  `https://orvui.efu.me/r/${slug}.json`]);
```

<a id="shadcn-flow"></a>

## shadcn flow

The install item includes source files and package dependencies. Components use shadcn semantic color utilities directly, so they inherit the target app's theme without orvui-specific color variables.

```bash
# Direct URL: no published registry namespace is required
npx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-toast-stack.json
```

<a id="entry-shape"></a>

## Entry shape

Internal helpers (for example `lib/utils.ts`) ship inline as `registry:lib` files so the agent does not have to chase imports. `target` specifies the consumer path, and `content` contains the full source.

```json
{
  "name": "swap",
  "type": "registry:block",
  "title": "Multi-chain Swap",
  "description": "Cross-chain swap widget with chain + token selectors, morphing views, animated flip and quote.",
  "dependencies": [
    "motion-v@^1.10.0",
    "lucide-vue-next@^0.468.0"
  ],
  "meta": {
    "category": "blocks",
    "productVersion": "0.1.1"
  },
  "files": [
    {
      "path": "registry/orvui/blocks/swap/MultiChainSwap.vue",
      "target": "src/components/orvui/blocks/swap/MultiChainSwap.vue",
      "type": "registry:component",
      "content": "..."
    },
    {
      "path": "registry/orvui/lib/utils.ts",
      "target": "src/components/orvui/lib/utils.ts",
      "type": "registry:lib",
      "content": "..."
    }
  ]
}
```

<a id="generative-ui"></a>

## Generative UI

Want the model to compose these components into a live interface? Follow the [OpenUI integration guide](/en/docs/openui) to register a custom component library, generate its system prompt, and render interactive OpenUI Lang as it streams.

## Next steps

- [Installation](/en/docs/installation)
- [Use orvui with OpenUI](/en/docs/openui)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
