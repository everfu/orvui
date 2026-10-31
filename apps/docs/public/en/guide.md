# Get started with orvui

Add composable, interactive components to a Vue 3.5 application. Choose a component, install its source or a local package, and adapt its appearance and behavior to your product.


<a id="installation"></a>

## Start with one component

1. **Prepare your project** — Use Vue 3.5 and TypeScript. Source installation uses Tailwind CSS 4; the package includes compiled styles.

2. **Choose an installation path** — Copy the source to edit the implementation in your app, or use the package for prebuilt imports.

3. **Run your first example** — Check the button styles and press feedback before connecting application state.

Follow the [installation guide](/en/docs/installation). This example installs the Button source.

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

> **Tip**: The package is not published to npm. Use the local archive workflow in the installation guide for package installation.

<a id="import-components"></a>

## Add your first button

Complete [source setup](/en/docs/installation#source-setup), then import the installed component.

```vue
<script setup lang="ts">
import { Button } from '@/components/orvui/motion/button'
</script>

<template>
  <Button>Continue</Button>
</template>
```

You should see an interactive button with a visible keyboard focus indicator and press feedback.

<a id="copy-source"></a>

## Make the source your own

Source lives in `src/components/orvui/`, including relative helpers, styles and licenses. Install individual components and add extra dependencies only when the selected example needs them.

<a id="state"></a>

## Connect state and compose components

Form components use `v-model`; overlays typically use `v-model:open`. Compose related parts with child components, slots and composables. Each API reference defines exact names and defaults.

<a id="nuxt"></a>

## Use Nuxt and SSR

This documentation uses Nuxt SSR. Examples explicitly import Vue components; a dedicated Nuxt module and auto-imports remain deferred. Check measurement, browser APIs and animation after hydration.

<a id="attribution"></a>

## Keep notices and continue

Keep MIT, NOTICE and applicable shader and font licenses with copied source. Continue with [theme setup](/en/docs/theme) or browse the [component catalog](/en/components).


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
