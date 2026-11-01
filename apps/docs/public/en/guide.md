# Introduction

Build expressive, composable interfaces for Vue.


orvui is an open-source component library built with Vue 3.5, the Composition API and TypeScript. It combines interactive motion, semantic themes and state bindings, with a prebuilt package and individually installable source.

<a id="state"></a>

<a id="why-orvui"></a>

## Why orvui?

- **Considered defaults** — Buttons, forms and charts share typography, spacing and eleven palettes. Start with the defaults and customize the parts your product needs.

- **Motion with purpose** — Press feedback, layout changes and overlay transitions clarify interaction and respect reduced-motion preferences.

- **Compose the Vue way** — Connect state through v-model, slots, child components and composables. Type declarations and component API references describe each interface.

- **Room to make it yours** — Adjust themes with semantic CSS variables and compose content through props and slots. Copy individual components when you need to change their internals.

- **Keyboard and server rendering** — Forms and overlays provide keyboard interactions, focus management and semantics. SSR and hydration are covered; each component documents its behavior and limitations.

- **Context for coding agents** — MCP, Agent Skills and Markdown expose real imports, state bindings, examples and licenses so coding agents can work with existing components.

<a id="import-components"></a>

<a id="copy-source"></a>

<a id="installation"></a>

## Choose how to get started

The package and copied source share the same public APIs. Choose how you want to maintain your components, then follow Quick Start for the complete setup.

- [Install the package](https://orvui.efu.me/en/docs/installation#package): Use prebuilt entrypoints and complete styles, importing the components you need.
- [Copy the source](https://orvui.efu.me/en/docs/installation#source-setup): Install individual components with shadcn-vue and keep the implementation and relative helpers in your project.
<a id="nuxt"></a>

<a id="ecosystem"></a>

## The orvui ecosystem

- [Vue and Nuxt](https://orvui.efu.me/en/docs/installation#package): Import components and styles in Vue. In Nuxt, load the stylesheet through css and keep explicit component imports.
- [Themes and motion](https://orvui.efu.me/en/docs/theme): Choose a palette, set the appearance mode and work with semantic variables and shared motion conventions.
- [MCP Server](https://orvui.efu.me/en/docs/mcp-server): Let development tools query component APIs, examples, source and theme variables.
- [Agent Skills](https://orvui.efu.me/en/docs/agent-skills): Install component references and usage guidance that coding agents can read on demand.
- [Components](https://orvui.efu.me/en/components): Browse interactions, application blocks, AI components and charts by use case.
- [Application templates](https://orvui.efu.me/en/templates): Explore independent Dashboard, Mail, Chat, Finances and CRM demos.
<a id="faq"></a>

## FAQ

### Can I use orvui commercially?

orvui is available under MIT. Preserve copyright, LICENSE and NOTICE when using or distributing it. Separate shader and font resources retain their own licenses; consult the license inventory.

### Do I need Tailwind CSS?

The package includes compiled styles and needs no additional Tailwind setup. Copied source requires Tailwind CSS 4 and the stylesheet and alias setup in Quick Start.

### Does it work with Vue, Nuxt and TypeScript?

Vue and Nuxt use explicit imports, with TypeScript declarations included. Load package styles in nuxt.config.ts and consult component SSR notes for browser-dependent features.

### How can I try Vue 3.6?

Switch to Beta in the header, then follow its Quick Start to install the local archive and pin Vue RC dependencies. The Beta uses virtual DOM rendering; Vapor compilation is not enabled.

<a id="attribution"></a>

## Get involved

Explore the source, report issues or contribute improvements on [GitHub](https://github.com/everfu/orvui). Keep copyright and applicable licenses with copied or distributed components.

- [Source and issues](https://github.com/everfu/orvui): Include reproduction steps, versions and expected behavior when reporting a problem.
- [Copyright and licenses](https://orvui.efu.me/licenses/orvui-NOTICE.txt): Review provenance and licenses for components, shaders and font resources.
## Next steps

- [Quick Start](/en/docs/installation)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
