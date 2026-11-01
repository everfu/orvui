---
title: "404 / Not Found"
description: "Present a missing destination with an animated visual and a route back to useful content."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/not-found"
markdown: "https://orvui.efu.me/en/components/blocks/not-found.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# 404 / Not Found

> Present a missing destination with an animated visual and a route back to useful content.

<a id="when-to-use"></a>

## When to use it

- Use 404 / Not Found when the interface needs this behavior: present a missing destination with an animated visual and a route back to useful content.

<a id="install"></a>
## Install

### 404 / Not Found — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found.json
```

### Glitch — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-glitch.json
```

### Magnetic — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-magnetic.json
```

### Spotlight — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-spotlight.json
```

### Stacked — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-stacked.json
```

### Terminal — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-terminal.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### 404 / Not Found

**Registry source**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

<a id="glitch"></a>
### Glitch

Resolve an unstable character display into a missing-page status code.

**Registry source**

```vue
<script setup lang="ts">
import { NotFoundGlitch } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundGlitch v-bind="navigation" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { NotFoundGlitch } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundGlitch v-bind="navigation" /></div>
</template>
```

<a id="magnetic"></a>
### Magnetic

Let each status digit follow nearby pointer movement before returning to its place.

**Registry source**

```vue
<script setup lang="ts">
import { NotFoundMagnetic } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundMagnetic v-bind="navigation" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { NotFoundMagnetic } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundMagnetic v-bind="navigation" /></div>
</template>
```

<a id="spotlight"></a>
### Spotlight

Reveal the status code with a pointer-following light over a dark surface.

**Registry source**

```vue
<script setup lang="ts">
import { NotFoundSpotlight } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundSpotlight v-bind="navigation" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { NotFoundSpotlight } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundSpotlight v-bind="navigation" /></div>
</template>
```

<a id="stacked"></a>
### Stacked

Fan out cards beneath the status panel when it is hovered or focused.

**Registry source**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

<a id="terminal"></a>
### Terminal

Type the failed navigation command and status code inside a terminal-like surface.

**Registry source**

```vue
<script setup lang="ts">
import { NotFoundTerminal } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundTerminal v-bind="navigation" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { NotFoundTerminal } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundTerminal v-bind="navigation" /></div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### NotFoundStacked

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | No | — |
| `title` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `homeHref` | `string` | — | No | — |
| `homeLabel` | `string` | — | No | — |
| `browseHref` | `string` | — | No | — |
| `browseLabel` | `string` | — | No | — |

### NotFoundStage

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### NotFoundActions

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `browseLabel` | `string` | `NOT_FOUND_DEFAULTS.browseLabel` | No | — |
| `homeHref` | `string` | `NOT_FOUND_DEFAULTS.homeHref` | No | — |
| `homeLabel` | `string` | `NOT_FOUND_DEFAULTS.homeLabel` | No | — |
| `browseHref` | `string` | `NOT_FOUND_DEFAULTS.browseHref` | No | — |

### NotFoundGlitch

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | No | — |
| `title` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `homeHref` | `string` | — | No | — |
| `homeLabel` | `string` | — | No | — |
| `browseHref` | `string` | — | No | — |
| `browseLabel` | `string` | — | No | — |

### NotFoundMagnetic

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | No | — |
| `title` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `homeHref` | `string` | — | No | — |
| `homeLabel` | `string` | — | No | — |
| `browseHref` | `string` | — | No | — |
| `browseLabel` | `string` | — | No | — |

### NotFoundSpotlight

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | No | — |
| `title` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `homeHref` | `string` | — | No | — |
| `homeLabel` | `string` | — | No | — |
| `browseHref` | `string` | — | No | — |
| `browseLabel` | `string` | — | No | — |

### NotFoundTerminal

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | No | — |
| `title` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `homeHref` | `string` | — | No | — |
| `homeLabel` | `string` | — | No | — |
| `browseHref` | `string` | — | No | — |
| `browseLabel` | `string` | — | No | — |

<a id="about"></a>
## About 404 / Not Found

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure 404 / Not Found?**

Configure 404 / Not Found through code, title, description, homeHref, homeLabel, browseHref, browseLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Dynamic Island](https://orvui.efu.me/en/components/blocks/dynamic-island): Switch a compact capsule between live activity views without changing its identity.
- [Swipeable List](https://orvui.efu.me/en/components/blocks/swipeable-list): Reveal actions on either side of a list row with pointer or keyboard input.
- [Fixtures](https://orvui.efu.me/en/components/blocks/knockout-bracket): Browse elimination rounds or a radial bracket with team and match metadata.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/not-found.json
- Documentation: https://orvui.efu.me/en/components/blocks/not-found
- `packages/vue/src/blocks/not-found/src/NotFoundStacked.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundStage.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundActions.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundGlitch.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundMagnetic.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundSpotlight.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundTerminal.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
