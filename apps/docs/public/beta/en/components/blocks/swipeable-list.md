---
title: "Swipeable List"
description: "Reveal actions on either side of a list row with pointer or keyboard input."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/swipeable-list"
markdown: "https://orvui.efu.me/en/components/blocks/swipeable-list.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Swipeable List

> Reveal actions on either side of a list row with pointer or keyboard input.

<a id="when-to-use"></a>

## When to use it

- Use Swipeable List when the interface needs this behavior: reveal actions on either side of a list row with pointer or keyboard input.

<a id="install"></a>
## Install

### Swipeable List — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/swipeable-list.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Swipeable List

**Registry source**

```vue
<script setup lang="ts">
import { h, shallowRef } from "vue";
import {
  Check,
  Clock3,
  FileText,
  Flag,
  Mail,
  Pin,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-vue-next";
import {
  SwipeableList,
  type SwipeAction,
  type SwipeableListItem,
} from "@/components/orvui/blocks/swipeable-list";
const leftActions: SwipeAction[] = [
  { id: "done", label: "Done", icon: Check, tone: "success" },
  { id: "pin", label: "Pin", icon: Pin, tone: "primary" },
];
const rightActions: SwipeAction[] = [
  { id: "later", label: "Later", icon: Clock3, tone: "warning" },
  { id: "trash", label: "Trash", icon: Trash2, tone: "danger" },
];
const descriptions = [
  {
    id: "brief",
    title: "Launch brief",
    description: "Finalize the announcement copy",
    meta: "9:41",
    icon: FileText,
  },
  {
    id: "feedback",
    title: "Client feedback",
    description: "Three comments need a response",
    meta: "11:08",
    icon: Mail,
  },
  {
    id: "review",
    title: "Design review",
    description: "Check spacing before handoff",
    meta: "13:20",
    icon: UserRound,
  },
  {
    id: "incident",
    title: "Flagged run",
    description: "Retry queue has one failed job",
    meta: "Now",
    icon: Flag,
  },
];
const initial: SwipeableListItem[] = descriptions.map(({ icon, ...item }) => ({
  ...item,
  leftActions,
  rightActions,
  leading: () =>
    h(
      "div",
      {
        class:
          "grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground",
      },
      [h(icon, { class: "h-4 w-4" })],
    ),
}));
const items = shallowRef(initial),
  lastAction = shallowRef("Ready");
function action({
  item,
  action,
}: {
  item: SwipeableListItem;
  action: SwipeAction;
}) {
  lastAction.value = `${action.label} · ${item.title}`;
  if (action.id === "trash")
    items.value = items.value.filter((row) => row.id !== item.id);
}
function reset() {
  items.value = initial;
  lastAction.value = "Queue restored";
}
</script>
<template>
  <div class="flex min-h-96 w-full items-center justify-center">
    <div
      class="w-full max-w-sm rounded-[2rem] border border-border bg-background p-3 shadow-2xl"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <div>
          <p class="text-sm font-semibold text-foreground">Priority queue</p>
          <p class="text-xs text-muted-foreground">{{ lastAction }}</p>
        </div>
        <button
          type="button"
          @click="reset"
          class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw class="h-3.5 w-3.5" />Reset
        </button>
      </div>
      <SwipeableList :items="items" @action="action" />
      <div
        class="mt-3 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground"
      >
        <span>{{ items.length }} open</span><span>Today</span>
      </div>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h, shallowRef } from "vue";
import {
  Check,
  Clock3,
  FileText,
  Flag,
  Mail,
  Pin,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-vue-next";
import { SwipeableList, type SwipeAction, type SwipeableListItem } from "@orvui/vue/blocks/swipeable-list";
const leftActions: SwipeAction[] = [
  { id: "done", label: "Done", icon: Check, tone: "success" },
  { id: "pin", label: "Pin", icon: Pin, tone: "primary" },
];
const rightActions: SwipeAction[] = [
  { id: "later", label: "Later", icon: Clock3, tone: "warning" },
  { id: "trash", label: "Trash", icon: Trash2, tone: "danger" },
];
const descriptions = [
  {
    id: "brief",
    title: "Launch brief",
    description: "Finalize the announcement copy",
    meta: "9:41",
    icon: FileText,
  },
  {
    id: "feedback",
    title: "Client feedback",
    description: "Three comments need a response",
    meta: "11:08",
    icon: Mail,
  },
  {
    id: "review",
    title: "Design review",
    description: "Check spacing before handoff",
    meta: "13:20",
    icon: UserRound,
  },
  {
    id: "incident",
    title: "Flagged run",
    description: "Retry queue has one failed job",
    meta: "Now",
    icon: Flag,
  },
];
const initial: SwipeableListItem[] = descriptions.map(({ icon, ...item }) => ({
  ...item,
  leftActions,
  rightActions,
  leading: () =>
    h(
      "div",
      {
        class:
          "grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground",
      },
      [h(icon, { class: "h-4 w-4" })],
    ),
}));
const items = shallowRef(initial),
  lastAction = shallowRef("Ready");
function action({
  item,
  action,
}: {
  item: SwipeableListItem;
  action: SwipeAction;
}) {
  lastAction.value = `${action.label} · ${item.title}`;
  if (action.id === "trash")
    items.value = items.value.filter((row) => row.id !== item.id);
}
function reset() {
  items.value = initial;
  lastAction.value = "Queue restored";
}
</script>
<template>
  <div class="flex min-h-96 w-full items-center justify-center">
    <div
      class="w-full max-w-sm rounded-[2rem] border border-border bg-background p-3 shadow-2xl"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <div>
          <p class="text-sm font-semibold text-foreground">Priority queue</p>
          <p class="text-xs text-muted-foreground">{{ lastAction }}</p>
        </div>
        <button
          type="button"
          @click="reset"
          class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw class="h-3.5 w-3.5" />Reset
        </button>
      </div>
      <SwipeableList :items="items" @action="action" />
      <div
        class="mt-3 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground"
      >
        <span>{{ items.length }} open</span><span>Today</span>
      </div>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `SwipeableList` | `v-model` | `null \| SwipeableListValue` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### SwipeableList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `SwipeableListItem[]` | — | Yes | — |
| `modelValue` | `null \| SwipeableListValue` | — | No | — |
| `defaultValue` | `null \| SwipeableListValue` | `null` | No | — |
| `actionWidth` | `number` | `56` | No | — |
| `revealThreshold` | `number` | `34` | No | — |
| `closeOnAction` | `boolean` | `true` | No | — |
| `classNames` | `SwipeableListClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[value: SwipeableListValue \| null]` | — |
| `valueChange` | `[value: SwipeableListValue \| null]` | — |
| `action` | `[payload: { item: SwipeableListItem; action: SwipeAction; side: SwipeSide; }]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `item` | — | `v-bind: scope` | — |

<a id="about"></a>
## About Swipeable List

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Swipeable List?**

Configure Swipeable List through items, modelValue, defaultValue, actionWidth, revealThreshold, closeOnAction, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, action to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Dynamic Island](https://orvui.efu.me/en/components/blocks/dynamic-island): Switch a compact capsule between live activity views without changing its identity.
- [404 / Not Found](https://orvui.efu.me/en/components/blocks/not-found): Present a missing destination with an animated visual and a route back to useful content.
- [Sign Up Form](https://orvui.efu.me/en/components/blocks/signup-form): Move through registration fields with local validation and explicit submission states.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/swipeable-list.json
- Documentation: https://orvui.efu.me/en/components/blocks/swipeable-list
- `packages/vue/src/blocks/swipeable-list/src/SwipeableList.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
