<p align="center">
  <a href="https://orvui.efu.me/en/">
    <img src="./assets/readme-logo.svg" width="112" height="112" alt="orvui" />
  </a>
</p>

<h1 align="center">orvui</h1>

<p align="center">An animated component library for Vue 3.5</p>
<p align="center"><b>Composable APIs · Customizable themes · TypeScript · Component source installation</b></p>
<p align="center">Bring interfaces to life and make development easier.</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5%2B-42b883?logo=vuedotjs&amp;logoColor=white" alt="Vue 3.5+" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&amp;logoColor=white" alt="TypeScript" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-18181b" alt="MIT License" /></a>
</p>

<p align="center"><a href="./README.md">简体中文</a> · English</p>
<p align="center">
  <a href="https://orvui.efu.me/en/">Documentation</a> ·
  <a href="https://orvui.efu.me/en/docs/installation">Getting started</a> ·
  <a href="./CONTRIBUTING.md">Contributing</a>
</p>

## Documentation

[orvui.efu.me/en](https://orvui.efu.me/en/) · [中文文档](https://orvui.efu.me)

Start with the [installation guide](https://orvui.efu.me/en/docs/installation), or explore [themes](https://orvui.efu.me/en/docs/theme), [motion](https://orvui.efu.me/en/docs/motion-patterns) and [AI agent interfaces](https://orvui.efu.me/en/docs/ai-agents). Each component page includes interactive demos, usage examples, API documentation and copyable source.

## Features

### From interactive controls to complete interfaces

109 components and 72 registered examples cover four categories.

| Category                                               | Contents                                                 | Components |
| ------------------------------------------------------ | -------------------------------------------------------- | ---------: |
| [Motion](https://orvui.efu.me/en/components/motion)    | Buttons, pickers, overlays and animated interactions     |         54 |
| [Blocks](https://orvui.efu.me/en/components/blocks)    | Forms, uploads, command palettes and composed interfaces |         23 |
| [AI Agents](https://orvui.efu.me/en/components/agents) | Messages, prompt inputs, tool calls and agent workspaces |         18 |
| [Charts](https://orvui.efu.me/en/charts)               | Interactive charts and data visualization                |         14 |

### Customizable themes and responsive motion

Eleven palettes support light and dark themes, with semantic CSS variables for overrides. Components share spring and transition parameters and respect reduced-motion preferences.

### Written for Vue

Built with Vue 3.5, the Composition API and TypeScript. Compose interactions with `v-model`, slots and composables, and import from the package root, a category or an individual component entry. Type declarations, SSR and hydration are verified separately.

### Install component source

Use the shadcn-vue CLI to install individual components and their actual dependencies, then adapt them in your own project. Package exports and registry items use the same Vue implementation and carry the applicable copyright and license notices.

## Installation

### Component source

In a Vue project with Tailwind CSS 4 and a configured `components.json`, run:

```sh
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

Import from the installed public entry and load the theme stylesheet once in your application:

```vue
<script setup lang="ts">
import { Button } from "@/components/orvui/motion/button";
import "@/components/orvui/styles.css";
</script>

<template>
  <Button>Get started</Button>
</template>
```

Find other installation commands on the component pages. See the [installation guide](https://orvui.efu.me/en/docs/installation) for the complete setup.

### Local package

`@orvui/vue` has not been published to npm yet. Build a local archive from the orvui repository root:

```sh
pnpm install
pnpm --filter @orvui/vue pack --pack-destination "$PWD/artifacts/packages/0.1.0"
```

Then install that archive in your Vue project, replacing the path with its actual location:

```sh
pnpm add /path/to/orvui-vue-0.1.0.tgz
```

Import the precompiled stylesheet once. Package consumers do not need to configure Tailwind:

```vue
<script setup lang="ts">
import { Button } from "@orvui/vue/motion/button";
import "@orvui/vue/style.css";
</script>

<template>
  <Button>Get started</Button>
</template>
```

Web is the current target. Nuxt module support remains deferred.

## Local development

Use the pnpm version specified in `package.json`:

```sh
pnpm install
pnpm dev
```

The Nuxt SSR documentation uses the development address printed by Nuxt, normally `http://localhost:3000`. Use `pnpm build` for production, `pnpm preview` for a preview, and `pnpm start` for the standalone Node server. See the [docs README](./apps/docs/README.md) for verification and build configuration.

## Contributing

Contributions to components, examples and documentation are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) (Chinese) for layout conventions, compatibility requirements, build checks and consumer verification. See [design.md](./design.md) for visual and behavioral contracts.

## License

Copyright (c) 2026 **everfu**. orvui project code is licensed under [MIT](./LICENSE).

Third-party code and assets retain their own copyright and terms. Paper Design shaders use a separate PolyForm Shield license, and fonts use SIL OFL. See [NOTICE](./NOTICE) for icon licenses and demo media sources.
