---
title: "Timeline"
description: "Browse dated milestones on a draggable track that keeps the selected event in focus."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/timeline"
markdown: "https://orvui.efu.me/en/components/motion/timeline.md"
license: "MIT"
productVersion: "0.1.0"
---

# Timeline

> Browse dated milestones on a draggable track that keeps the selected event in focus.

## Install

### Timeline — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/timeline.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## Usage

### Timeline

**Registry source**

```vue
<script setup lang="ts">
import { defineComponent, h, ref, type PropType, type VNodeChild } from "vue";
import { Heart } from "lucide-vue-next";
import { Timeline } from "@/components/orvui/motion/timeline";
const DemoMedia = defineComponent({
  props: { event: { type: Object as PropType<{ kind: string; points?: number[] }>, required: true }, active: { type: Boolean, required: true } },
  setup(props) {
    const box = (className: string, children: VNodeChild[] = []) => h("div", { class: className }, children);
    const skeletons = () => ["h-2 w-3/4 rounded-full bg-foreground/15", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-2/3 rounded-full bg-foreground/10"].map(style => box(style));
    return () => {
      switch (props.event.kind) {
        case "grid": return box("grid size-full grid-cols-3 gap-2 bg-muted/40 p-4", Array.from({ length: 6 }, (_, index) => h("div", { class: "rounded-xl border border-border bg-background", style: { opacity: 1 - index * .1 } })));
        case "phone": return box("flex size-full items-end justify-center bg-muted/40 pt-5", [box("flex h-full w-1/2 flex-col gap-2 rounded-t-3xl border border-b-0 border-border bg-background p-3", ["mx-auto h-1.5 w-8 rounded-full bg-foreground/15", "h-3 w-2/3 rounded-full bg-foreground/15", "h-16 rounded-xl bg-foreground/[0.06]", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-4/5 rounded-full bg-foreground/10"].map(style => box(style)))]);
        case "sync": return box("flex size-full items-center justify-center gap-3 bg-muted/40 p-5", [box("flex h-full flex-1 flex-col gap-2 rounded-xl border border-border bg-background p-3", [box("flex gap-1", Array.from({ length: 3 }, () => h("span", { class: "size-1.5 rounded-full bg-foreground/20" }))), ...skeletons()]), box("flex h-4/5 w-1/4 flex-col gap-2 rounded-2xl border border-border bg-background p-2", skeletons())]);
        case "chart": { const points = props.event.points ?? []; const peak = Math.max(...points); const path = points.map((value, index) => `${index ? "L" : "M"}${(100 * index / (points.length - 1)).toFixed(1)} ${(56 - value / peak * 44).toFixed(1)}`).join(" "); return h("svg", { viewBox: "0 0 100 64", preserveAspectRatio: "none", class: props.active ? "size-full text-primary" : "size-full text-foreground", role: "img", "aria-label": "Rising line chart" }, [h("path", { d: `${path} L100 64 L0 64 Z`, class: props.active ? "fill-primary/[0.08]" : "fill-foreground/[0.06]" }), h("path", { d: path, fill: "none", stroke: "currentColor", "stroke-width": "1.5", "vector-effect": "non-scaling-stroke" })]); }
        case "keys": return box("flex size-full flex-col items-center justify-center gap-3 bg-muted/40", [box("flex gap-1.5", ["⌘", "K"].map(key => h("kbd", { class: "flex size-11 items-center justify-center rounded-xl border border-border bg-background font-sans text-foreground text-lg shadow-sm" }, key))), box("h-2 w-28 rounded-full bg-foreground/10")]);
        default: return box("flex size-full items-center justify-center bg-foreground text-background", [h("span", { class: "font-medium text-5xl tracking-tighter" }, "2.0")]);
      }
    };
  },
});
const milestones = [
  { id: "beta", date: "2025-06-12", title: "Private beta opens", kind: "grid", likes: "1,204" },
  { id: "android", date: "2025-08-03", title: "Lumen for Android", kind: "phone", likes: "3,918" },
  { id: "offline", date: "2025-10-14", title: "Offline drafts", kind: "sync", likes: "4,827" },
  { id: "signups", date: "2025-11-20", title: "Weekly signups double", kind: "chart", points: [4, 5, 4, 6, 5, 7, 6, 9, 8, 12, 11, 15], likes: "6,175" },
  { id: "spaces", date: "2026-01-09", title: "Shared spaces", kind: "grid", likes: "2,640" },
  { id: "command", date: "2026-03-17", title: "The command menu", kind: "keys", likes: "5,302" },
  { id: "rank", date: "2026-05-28", title: "Top 10 in productivity", kind: "chart", points: [3, 4, 6, 5, 8, 9, 8, 11, 13, 12, 14, 16], likes: "13,916" },
  { id: "two", date: "2026-08-05", title: "Lumen 2.0", kind: "release", likes: "27,130" },
];
const selected = ref("signups");
</script>
<template><div class="w-full py-6"><Timeline v-model="selected" :events="milestones" aria-label="Lumen release history"><template #media="{ event, active }"><DemoMedia :event="event as any" :active="active" /></template><template #meta="{ event }"><Heart aria-hidden="true" :class="['size-4', event.id === selected ? 'text-primary' : undefined]" /><span>{{ event.likes }}</span></template></Timeline></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { defineComponent, h, ref, type PropType, type VNodeChild } from "vue";
import { Heart } from "lucide-vue-next";
import { Timeline } from "@orvui/vue/motion/timeline";
const DemoMedia = defineComponent({
  props: { event: { type: Object as PropType<{ kind: string; points?: number[] }>, required: true }, active: { type: Boolean, required: true } },
  setup(props) {
    const box = (className: string, children: VNodeChild[] = []) => h("div", { class: className }, children);
    const skeletons = () => ["h-2 w-3/4 rounded-full bg-foreground/15", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-2/3 rounded-full bg-foreground/10"].map(style => box(style));
    return () => {
      switch (props.event.kind) {
        case "grid": return box("grid size-full grid-cols-3 gap-2 bg-muted/40 p-4", Array.from({ length: 6 }, (_, index) => h("div", { class: "rounded-xl border border-border bg-background", style: { opacity: 1 - index * .1 } })));
        case "phone": return box("flex size-full items-end justify-center bg-muted/40 pt-5", [box("flex h-full w-1/2 flex-col gap-2 rounded-t-3xl border border-b-0 border-border bg-background p-3", ["mx-auto h-1.5 w-8 rounded-full bg-foreground/15", "h-3 w-2/3 rounded-full bg-foreground/15", "h-16 rounded-xl bg-foreground/[0.06]", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-4/5 rounded-full bg-foreground/10"].map(style => box(style)))]);
        case "sync": return box("flex size-full items-center justify-center gap-3 bg-muted/40 p-5", [box("flex h-full flex-1 flex-col gap-2 rounded-xl border border-border bg-background p-3", [box("flex gap-1", Array.from({ length: 3 }, () => h("span", { class: "size-1.5 rounded-full bg-foreground/20" }))), ...skeletons()]), box("flex h-4/5 w-1/4 flex-col gap-2 rounded-2xl border border-border bg-background p-2", skeletons())]);
        case "chart": { const points = props.event.points ?? []; const peak = Math.max(...points); const path = points.map((value, index) => `${index ? "L" : "M"}${(100 * index / (points.length - 1)).toFixed(1)} ${(56 - value / peak * 44).toFixed(1)}`).join(" "); return h("svg", { viewBox: "0 0 100 64", preserveAspectRatio: "none", class: props.active ? "size-full text-primary" : "size-full text-foreground", role: "img", "aria-label": "Rising line chart" }, [h("path", { d: `${path} L100 64 L0 64 Z`, class: props.active ? "fill-primary/[0.08]" : "fill-foreground/[0.06]" }), h("path", { d: path, fill: "none", stroke: "currentColor", "stroke-width": "1.5", "vector-effect": "non-scaling-stroke" })]); }
        case "keys": return box("flex size-full flex-col items-center justify-center gap-3 bg-muted/40", [box("flex gap-1.5", ["⌘", "K"].map(key => h("kbd", { class: "flex size-11 items-center justify-center rounded-xl border border-border bg-background font-sans text-foreground text-lg shadow-sm" }, key))), box("h-2 w-28 rounded-full bg-foreground/10")]);
        default: return box("flex size-full items-center justify-center bg-foreground text-background", [h("span", { class: "font-medium text-5xl tracking-tighter" }, "2.0")]);
      }
    };
  },
});
const milestones = [
  { id: "beta", date: "2025-06-12", title: "Private beta opens", kind: "grid", likes: "1,204" },
  { id: "android", date: "2025-08-03", title: "Lumen for Android", kind: "phone", likes: "3,918" },
  { id: "offline", date: "2025-10-14", title: "Offline drafts", kind: "sync", likes: "4,827" },
  { id: "signups", date: "2025-11-20", title: "Weekly signups double", kind: "chart", points: [4, 5, 4, 6, 5, 7, 6, 9, 8, 12, 11, 15], likes: "6,175" },
  { id: "spaces", date: "2026-01-09", title: "Shared spaces", kind: "grid", likes: "2,640" },
  { id: "command", date: "2026-03-17", title: "The command menu", kind: "keys", likes: "5,302" },
  { id: "rank", date: "2026-05-28", title: "Top 10 in productivity", kind: "chart", points: [3, 4, 6, 5, 8, 9, 8, 11, 13, 12, 14, 16], likes: "13,916" },
  { id: "two", date: "2026-08-05", title: "Lumen 2.0", kind: "release", likes: "27,130" },
];
const selected = ref("signups");
</script>
<template><div class="w-full py-6"><Timeline v-model="selected" :events="milestones" aria-label="Lumen release history"><template #media="{ event, active }"><DemoMedia :event="event as any" :active="active" /></template><template #meta="{ event }"><Heart aria-hidden="true" :class="['size-4', event.id === selected ? 'text-primary' : undefined]" /><span>{{ event.likes }}</span></template></Timeline></div></template>
```

## API Reference

### Timeline

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `events` | `TimelineEvent[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `props.events[0]?.id` | No | — |
| `itemWidth` | `number` | `340` | No | — |
| `height` | `number` | `600` | No | — |
| `years` | `boolean` | `true` | No | — |
| `ruler` | `boolean` | `true` | No | — |
| `cables` | `boolean` | `true` | No | — |
| `formatDate` | `(date: Date) => string` | — | No | — |
| `formatYear` | `(date: Date) => string` | — | No | — |
| `ariaLabel` | `string` | `"Timeline"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `media` | — | `event: event`, `active: index === active` | — |
| `meta` | — | `event: event` | — |

## About Timeline

Browse dated milestones on a draggable track that keeps the selected event in focus.

### When to use it

- Use Timeline when the interface needs this behavior: browse dated milestones on a draggable track that keeps the selected event in focus.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Timeline?**

Configure Timeline through events, modelValue, defaultValue, itemWidth, height, years, ruler, cables, formatDate, formatYear, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/timeline.json
- Documentation: https://orvui.efu.me/en/components/motion/timeline
- `packages/vue/src/motion/timeline/src/Timeline.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
