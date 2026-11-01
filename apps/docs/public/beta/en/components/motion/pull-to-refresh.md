---
title: "Pull to Refresh"
description: "Turn a downward pull into a deliberate asynchronous refresh with visible progress."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/pull-to-refresh"
markdown: "https://orvui.efu.me/en/components/motion/pull-to-refresh.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Pull to Refresh

> Turn a downward pull into a deliberate asynchronous refresh with visible progress.

<a id="when-to-use"></a>

## When to use it

- Use Pull to Refresh when the interface needs this behavior: turn a downward pull into a deliberate asynchronous refresh with visible progress.

<a id="install"></a>
## Install

### Pull to Refresh — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/pull-to-refresh.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Pull to Refresh

**Registry source**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Bell, CheckCircle2, GitPullRequest, MessageCircle } from "lucide-vue-next";
import { PullToRefresh } from "@/components/orvui/motion/pull-to-refresh";
const activity = [
  { id: 1, icon: GitPullRequest, title: "Motion review approved", detail: "The pull request is ready to merge.", time: "4m" },
  { id: 2, icon: MessageCircle, title: "New component feedback", detail: "The spring feels much closer to native now.", time: "18m" },
  { id: 3, icon: CheckCircle2, title: "Registry checks passed", detail: "All component files resolved successfully.", time: "31m" },
  { id: 4, icon: Bell, title: "Preview deployed", detail: "The latest build is ready to inspect.", time: "1h" },
  { id: 5, icon: MessageCircle, title: "Docs comment resolved", detail: "The usage example now covers async refreshes.", time: "2h" },
];
const refreshes = ref(0);
const latest = ref<number | null>(null);
const updates = computed(() => latest.value ? [{ id: latest.value, icon: Bell, title: "You’re all caught up", detail: "The activity feed was refreshed just now.", time: "now" }, ...activity] : activity);
let timer: ReturnType<typeof setTimeout> | undefined;
let release: (() => void) | undefined;
let disposed = false;
function refresh() { return new Promise<void>(resolve => { release = resolve; timer = setTimeout(() => { if (!disposed) { refreshes.value++; latest.value = Date.now(); } release = undefined; resolve(); }, 900); }); }
onBeforeUnmount(() => { disposed = true; clearTimeout(timer); release?.(); });
</script>
<template><div class="flex min-h-[34rem] w-full items-center justify-center p-4"><div class="w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"><PullToRefresh ariaLabel="Activity feed" class="h-[30rem]" :on-refresh="refresh"><header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-md"><div><p class="font-semibold text-foreground">Activity</p><p class="text-xs text-muted-foreground">Pull down to check for updates</p></div><span class="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{{ refreshes ? `${refreshes} refreshed` : 'live' }}</span></header><div class="divide-y divide-border px-2 pb-3"><article v-for="update in updates" :key="update.id" class="flex gap-3 px-3 py-4"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm"><component :is="update.icon" class="h-4 w-4" /></div><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-3"><p class="text-sm font-medium text-foreground">{{ update.title }}</p><span class="shrink-0 font-mono text-[10px] text-muted-foreground">{{ update.time }}</span></div><p class="mt-1 text-xs leading-relaxed text-muted-foreground">{{ update.detail }}</p></div></article></div></PullToRefresh></div></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Bell, CheckCircle2, GitPullRequest, MessageCircle } from "lucide-vue-next";
import { PullToRefresh } from "@orvui/vue/motion/pull-to-refresh";
const activity = [
  { id: 1, icon: GitPullRequest, title: "Motion review approved", detail: "The pull request is ready to merge.", time: "4m" },
  { id: 2, icon: MessageCircle, title: "New component feedback", detail: "The spring feels much closer to native now.", time: "18m" },
  { id: 3, icon: CheckCircle2, title: "Registry checks passed", detail: "All component files resolved successfully.", time: "31m" },
  { id: 4, icon: Bell, title: "Preview deployed", detail: "The latest build is ready to inspect.", time: "1h" },
  { id: 5, icon: MessageCircle, title: "Docs comment resolved", detail: "The usage example now covers async refreshes.", time: "2h" },
];
const refreshes = ref(0);
const latest = ref<number | null>(null);
const updates = computed(() => latest.value ? [{ id: latest.value, icon: Bell, title: "You’re all caught up", detail: "The activity feed was refreshed just now.", time: "now" }, ...activity] : activity);
let timer: ReturnType<typeof setTimeout> | undefined;
let release: (() => void) | undefined;
let disposed = false;
function refresh() { return new Promise<void>(resolve => { release = resolve; timer = setTimeout(() => { if (!disposed) { refreshes.value++; latest.value = Date.now(); } release = undefined; resolve(); }, 900); }); }
onBeforeUnmount(() => { disposed = true; clearTimeout(timer); release?.(); });
</script>
<template><div class="flex min-h-[34rem] w-full items-center justify-center p-4"><div class="w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"><PullToRefresh ariaLabel="Activity feed" class="h-[30rem]" :on-refresh="refresh"><header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-md"><div><p class="font-semibold text-foreground">Activity</p><p class="text-xs text-muted-foreground">Pull down to check for updates</p></div><span class="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{{ refreshes ? `${refreshes} refreshed` : 'live' }}</span></header><div class="divide-y divide-border px-2 pb-3"><article v-for="update in updates" :key="update.id" class="flex gap-3 px-3 py-4"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm"><component :is="update.icon" class="h-4 w-4" /></div><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-3"><p class="text-sm font-medium text-foreground">{{ update.title }}</p><span class="shrink-0 font-mono text-[10px] text-muted-foreground">{{ update.time }}</span></div><p class="mt-1 text-xs leading-relaxed text-muted-foreground">{{ update.detail }}</p></div></article></div></PullToRefresh></div></div></template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### PullToRefresh

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `onRefresh` | `() => void \| Promise<void>` | — | No | — |
| `refreshing` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `threshold` | `number` | `76` | No | — |
| `maxPull` | `number` | `132` | No | — |
| `holdDistance` | `number` | `68` | No | — |
| `pullingLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Pull to refresh"` | No | — |
| `releaseLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Release to refresh"` | No | — |
| `refreshingLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Refreshing"` | No | — |
| `ariaLabel` | `string` | `"Refreshable content"` | No | — |
| `contentClassName` | `string` | — | No | — |
| `indicatorClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `[error: unknown]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `status: status`, `progress: amount` | — |

<a id="about"></a>
## About Pull to Refresh

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Pull to Refresh?**

Configure Pull to Refresh through onRefresh, refreshing, disabled, threshold, maxPull, holdDistance, pullingLabel, releaseLabel, refreshingLabel, ariaLabel, contentClassName, indicatorClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe error to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Wheel Picker](https://orvui.efu.me/en/components/motion/wheel-picker): Select a value from a rotating wheel with momentum and row snapping.
- [Animated Color Selector](https://orvui.efu.me/en/components/motion/color-selector): Choose one named swatch with a moving selection outline and native radio behavior.
- [Animated Sidebar](https://orvui.efu.me/en/components/motion/animated-sidebar): Compose nested navigation with expanded, icon-only and mobile drawer presentations.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/pull-to-refresh.json
- Documentation: https://orvui.efu.me/en/components/motion/pull-to-refresh
- `packages/vue/src/motion/pull-to-refresh/src/PullToRefresh.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
