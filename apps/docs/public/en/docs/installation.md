# Installation

Choose the component package or shadcn-vue for a Vue Web application. Component-page Usage modes correspond to these installation paths.


<a id="choose-path"></a>

## Choose your installation path

1. **Copy the source** — Install individual components into your project and edit them directly. Requires Tailwind CSS 4.

2. **Use the package** — Install prebuilt components from npm and import the package stylesheet once.

> **Tip**: Install the package from npm, or copy source with shadcn-vue to edit the implementation in your project.

<a id="requirements"></a>

## Prepare your project

Use Node.js 22.12+, pnpm 10, and a Vue 3.5+ TypeScript application. The package includes compiled styles; source installation requires Tailwind CSS 4.

If you do not have a Vue application, create one and select TypeScript. Otherwise continue in your existing project. Run consumer commands below from your application directory.

```bash
pnpm create vite@7 orvui-web-app --template vue-ts
cd orvui-web-app
pnpm install
```

<a id="package"></a>

## Option 1: component package

The package is available on npm. Install it directly in your Vue or Nuxt application. It includes prebuilt components and complete styles, with no additional Tailwind setup.

```bash
pnpm add @orvui/vue
```

To pin version 0.1.1, or upgrade an existing application from an earlier release to 0.1.1, use the command below. Keep your imports and theme overrides, then run your application's type check and build.

```bash
pnpm add @orvui/vue@0.1.1
```

```vue
<script setup lang="ts">
import { Button } from '@orvui/vue/motion/button'
import '@orvui/vue/style.css'
</script>

<template><Button>Continue</Button></template>
```

Import `@orvui/vue/style.css` once in your application entry or root component. It includes component styles and the Tailwind base layer; the package path needs no separate Tailwind setup. A `.dark` class on the document root enables dark mode. Select Package Usage on a component page for `@orvui/vue/…` imports.

In Nuxt, load the stylesheet through `css` in `nuxt.config.ts`. Import components explicitly in your pages or components; global registration is not required.

```typescript
export default defineNuxtConfig({
  css: ['@orvui/vue/style.css'],
})
```

<a id="source-setup"></a>

## Source setup: Tailwind and aliases

Complete this setup before installing with shadcn-vue. Source uses Tailwind CSS 4 and `@/components/orvui/…` imports. Merge the plugins, alias and TypeScript paths below into your existing configuration.

```bash
pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4
```

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

For a new project using the orvui registry, create components.json at the project root with the minimal configuration below. Leave baseColor empty because orvui supplies complete theme tokens. Existing shadcn-vue projects can retain their configuration.

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "new-york",
  "typescript": true,
  "tailwind": {
    "css": "src/style.css",
    "baseColor": "",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "composables": "@/composables"
  }
}
```

Merge paths into the TypeScript configuration that checks `src/` (usually `tsconfig.app.json` in the Vite template). After installing with shadcn-vue, import the generated stylesheet. It includes complete theme tokens and helpers; use it as the source stylesheet.

```css
@import "tailwindcss";
@import "./components/orvui/styles.css";
```

```typescript
import './style.css'
```

<a id="shadcn-vue"></a>

## Option 2: shadcn-vue source

The source registry is served at `orvui.efu.me`. Complete the source setup above, then run the complete command from the component page. Local development can use the documentation server’s /r/ endpoint.

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

An item includes component source, relative helpers, theme styles and package dependencies, under `src/components/orvui/`. Some variants need multiple items in one command. Use the command and “This example also needs” dependencies shown for the selected example.

```vue
<script setup lang="ts">
import { Button } from '@/components/orvui/motion/button'
</script>

<template><Button>Continue</Button></template>
```

<a id="verify"></a>

## Run and verify

```bash
pnpm exec vue-tsc --noEmit -p tsconfig.app.json
pnpm build
pnpm dev
```

The type-check command targets the Vite template’s tsconfig.app.json. For an existing project, select the configuration that checks src/. Check the button’s styles and press feedback, then verify state and events for your chosen components. Install dependencies imported directly by an example. Keep MIT, NOTICE and separate shader licenses with the installed source. See [Theme setup](/en/docs/theme) for overrides, then explore the [component catalog](/en/components).

## Next steps

- [Theme setup](/en/docs/theme)
- [Motion that explains, not distracts](/en/docs/motion-patterns)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
