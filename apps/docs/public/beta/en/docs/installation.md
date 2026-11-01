# Quick Start

Try orvui 0.2.0-beta.1 with Vue 3.6.0-rc.14. This development package is not on npm; install the local archive.


<a id="choose-path"></a>

## Choose an installation path

- [Component package](#package): Prebuilt components and complete styles, with no additional Tailwind setup.
- [Copy source](#source-setup): Install individual components with shadcn-vue and edit their implementation. Requires Tailwind CSS 4.
<a id="requirements"></a>

## Prepare your project

```bash
pnpm add vue@3.6.0-rc.14
```

This release supports Vue 3.6 virtual DOM rendering and SSR / hydration. Vapor compilation is not enabled. In both Vue and Nuxt applications, merge the package.json configuration below to pin Vue and the @vue/* runtimes and compilers to the same RC version, then run pnpm install.

```json
{
  "pnpm": {
    "overrides": {
      "vue": "3.6.0-rc.14",
      "@vue/compiler-core": "3.6.0-rc.14",
      "@vue/compiler-dom": "3.6.0-rc.14",
      "@vue/compiler-sfc": "3.6.0-rc.14",
      "@vue/compiler-ssr": "3.6.0-rc.14",
      "@vue/reactivity": "3.6.0-rc.14",
      "@vue/runtime-core": "3.6.0-rc.14",
      "@vue/runtime-dom": "3.6.0-rc.14",
      "@vue/server-renderer": "3.6.0-rc.14",
      "@vue/shared": "3.6.0-rc.14"
    }
  }
}
```

```bash
pnpm install
```

Use Node.js 22.12+, pnpm 10, and a Vue 3.6+ TypeScript application. The package includes compiled styles; source installation requires Tailwind CSS 4.

If you do not have a Vue application, create one and select TypeScript. Otherwise continue in your existing project. Run consumer commands below from your application directory.

```bash
pnpm create vite@7 orvui-web-app --template vue-ts
cd orvui-web-app
pnpm install
```

<a id="package"></a>

## Option 1: component package

Build the local package in the orvui checkout, then copy the archive into your application directory. It includes compiled components, declarations, source registry and licenses.

```bash
pnpm beta:pack
# artifacts/packages/0.2.0-beta.1/orvui-vue-0.2.0-beta.1.tgz
```

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
```

```vue
<script setup lang="ts">
import { Button } from '@orvui/vue/motion/button'
import '@orvui/vue/style.css'
</script>

<template><Button>Continue</Button></template>
```

Import `@orvui/vue/style.css` once in your application entry or root component. It includes component styles and the Tailwind base layer; the package path needs no separate Tailwind setup. A `.dark` class on the document root enables dark mode. Select Package Usage on a component page for `@orvui/vue/…` imports.

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

The source registry is served at `orvui.efu.me`. Complete the source setup above, then run the complete command from the component page. Local development can use the documentation server’s /beta/r/ endpoint.

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/button.json
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

The type-check command targets the Vite template’s tsconfig.app.json. For an existing project, select the configuration that checks src/. Check the button’s styles and press feedback, then verify state and events for your chosen components. Install dependencies imported directly by an example. Keep MIT, NOTICE and separate shader licenses with the installed source. See [Theme setup](/beta/en/docs/theme) for overrides, then explore the [component catalog](/beta/en/components).

## Next steps

- [Theme setup](/beta/en/docs/theme)
- [Motion that explains, not distracts](/beta/en/docs/motion-patterns)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
