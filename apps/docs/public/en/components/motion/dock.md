---
title: "Dock"
description: "Group compact navigation actions around an indicator that follows the active item."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/dock"
markdown: "https://orvui.efu.me/en/components/motion/dock.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Dock

> Group compact navigation actions around an indicator that follows the active item.

<a id="when-to-use"></a>

## When to use it

- Use Dock when the interface needs this behavior: group compact navigation actions around an indicator that follows the active item.

<a id="install"></a>
## Install

### Dock — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/dock.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

After npm publication, use the package command below. Before publication, install the verified local archive.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Dock

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Calendar, Home, Mail, Music, Settings, Sparkles } from "lucide-vue-next";
import { Dock, DockItem, DockSeparator } from "@/components/orvui/motion/dock";
const selected = ref("home");
const destinations = [
  { id: "home", icon: Home, label: "Home" }, { id: "mail", icon: Mail, label: "Mail" },
  { id: "calendar", icon: Calendar, label: "Calendar" }, { id: "music", icon: Music, label: "Music" },
  { id: "discover", icon: Sparkles, label: "Discover" },
];
// Simple Icons 16.35.0, distributed by @iconify-json/simple-icons 1.2.100; CC0-1.0.
const githubPath = "M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
</script>
<template><div class="w-full overflow-x-auto py-8"><div class="flex min-w-max justify-center px-2"><Dock>
  <DockItem v-for="destination in destinations" :key="destination.id" :aria-label="destination.label" :active="selected === destination.id" @click="selected = destination.id"><component :is="destination.icon" class="h-5 w-5" /></DockItem>
  <DockSeparator /><DockItem aria-label="Settings" :active="selected === 'settings'" @click="selected = 'settings'"><Settings class="h-5 w-5" /></DockItem>
  <DockItem aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5"><path :d="githubPath" /></svg></DockItem>
</Dock></div></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Calendar, Home, Mail, Music, Settings, Sparkles } from "lucide-vue-next";
import { Dock, DockItem, DockSeparator } from "@orvui/vue/motion/dock";
const selected = ref("home");
const destinations = [
  { id: "home", icon: Home, label: "Home" }, { id: "mail", icon: Mail, label: "Mail" },
  { id: "calendar", icon: Calendar, label: "Calendar" }, { id: "music", icon: Music, label: "Music" },
  { id: "discover", icon: Sparkles, label: "Discover" },
];
// Simple Icons 16.35.0, distributed by @iconify-json/simple-icons 1.2.100; CC0-1.0.
const githubPath = "M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
</script>
<template><div class="w-full overflow-x-auto py-8"><div class="flex min-w-max justify-center px-2"><Dock>
  <DockItem v-for="destination in destinations" :key="destination.id" :aria-label="destination.label" :active="selected === destination.id" @click="selected = destination.id"><component :is="destination.icon" class="h-5 w-5" /></DockItem>
  <DockSeparator /><DockItem aria-label="Settings" :active="selected === 'settings'" @click="selected = 'settings'"><Settings class="h-5 w-5" /></DockItem>
  <DockItem aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5"><path :d="githubPath" /></svg></DockItem>
</Dock></div></div></template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### Dock

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `number` | `44` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DockItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `active` | `boolean` | `false` | No | — |
| `as` | `"div" \| "button"` | — | No | — |
| `ariaLabel` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `click` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DockSeparator

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Dock

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Dock?**

Configure Dock through size. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Tabs](https://orvui.efu.me/en/components/motion/tabs): Switch between associated panels using a moving indicator and accessible tab controls.
- [Shared Layout Background](https://orvui.efu.me/en/components/motion/shared-layout-bg): Move one background surface between registered items to indicate a current selection.
- [Preview Rail](https://orvui.efu.me/en/components/motion/preview-rail): Preview navigation targets from a compact rail that expands around the focused item.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/dock.json
- Documentation: https://orvui.efu.me/en/components/motion/dock
- `packages/vue/src/motion/dock/src/Dock.vue`
- `packages/vue/src/motion/dock/src/DockItem.vue`
- `packages/vue/src/motion/dock/src/DockSeparator.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
