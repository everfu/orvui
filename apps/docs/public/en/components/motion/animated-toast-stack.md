---
title: "Animated Toast Stack"
description: "Manage transient notifications in a stack with actions and gesture dismissal."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/animated-toast-stack"
markdown: "https://orvui.efu.me/en/components/motion/animated-toast-stack.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Animated Toast Stack

> Manage transient notifications in a stack with actions and gesture dismissal.

<a id="when-to-use"></a>

## When to use it

- Use Animated Toast Stack when the interface needs this behavior: manage transient notifications in a stack with actions and gesture dismissal.

<a id="install"></a>
## Install

### Animated Toast Stack — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-toast-stack.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
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
### Animated Toast Stack

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Check, LoaderCircle, Sparkles, X } from "lucide-vue-next";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
  type ToastInput,
  type ToastPosition,
} from "@/components/orvui/motion/animated-toast-stack";
const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const examples: (ToastInput & { label: string })[] = [
  { label: "Title only", status: "success", title: "Saved", duration: 0 },
  {
    label: "Promise",
    status: "loading",
    title: "Publishing component",
    description: "Bundling source, preview, and registry metadata.",
    duration: 0,
  },
  {
    label: "Success",
    status: "success",
    title: "Component published",
    description: "Registry endpoint and raw source are available.",
  },
  {
    label: "Error",
    status: "error",
    title: "Snapshot failed",
    description: "Retry after the browser target settles.",
  },
];
const position = ref<ToastPosition>("bottom-right"),
  { toasts, showToast, updateToast, dismissToast, clearToasts } =
    useAnimatedToastStack({ defaultDuration: 3600, limit: 5 }),
  timers = new Set<ReturnType<typeof setTimeout>>();
function openToast(input: ToastInput) {
  const id = showToast(input);
  if (input.status !== "loading") return;
  const timer = setTimeout(() => {
    timers.delete(timer);
    updateToast(id, {
      status: "success",
      title: "Publish complete",
      description: "Toast updated in-place from loading to success.",
      duration: 3200,
    });
  }, 1800);
  timers.add(timer);
}
function moveStack(value: ToastPosition) {
  position.value = value;
  showToast({
    status: "info",
    title: "Position changed",
    description: `New toasts open from ${value}.`,
  });
}
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
});
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <AnimatedToastStack
      :toasts="toasts"
      :position="position"
      placement="fixed"
      :max-visible="4"
      :class-names="{ surface: 'bg-card/95' }"
      :icons="{ neutral: Sparkles }"
      @dismiss="dismissToast"
    />
    <div class="flex flex-col items-center gap-2 text-center">
      <p class="text-sm font-medium text-foreground">Open a real toast</p>
      <p class="max-w-sm text-xs leading-5 text-muted-foreground">
        Toasts render fixed on the screen. Change position to open a toast from
        that edge.
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="example in examples"
        :key="example.label"
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors press hover:border-(--color-border-strong)"
        @click="openToast(example)"
      >
        <component
          :is="
            example.status === 'loading'
              ? LoaderCircle
              : example.status === 'success'
                ? Check
                : X
          "
          class="h-3.5 w-3.5"
        />{{ example.label }}</button
      ><button
        type="button"
        class="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-muted-foreground press hover:bg-foreground/[0.06] hover:text-foreground"
        @click="clearToasts"
      >
        Clear
      </button>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-1.5">
      <button
        v-for="option in positions"
        :key="option"
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors press',
          position === option
            ? 'bg-foreground text-background'
            : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground',
        ]"
        @click="moveStack(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Check, LoaderCircle, Sparkles, X } from "lucide-vue-next";
import { AnimatedToastStack, useAnimatedToastStack, type ToastInput, type ToastPosition } from "@orvui/vue/motion/animated-toast-stack";
const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const examples: (ToastInput & { label: string })[] = [
  { label: "Title only", status: "success", title: "Saved", duration: 0 },
  {
    label: "Promise",
    status: "loading",
    title: "Publishing component",
    description: "Bundling source, preview, and registry metadata.",
    duration: 0,
  },
  {
    label: "Success",
    status: "success",
    title: "Component published",
    description: "Registry endpoint and raw source are available.",
  },
  {
    label: "Error",
    status: "error",
    title: "Snapshot failed",
    description: "Retry after the browser target settles.",
  },
];
const position = ref<ToastPosition>("bottom-right"),
  { toasts, showToast, updateToast, dismissToast, clearToasts } =
    useAnimatedToastStack({ defaultDuration: 3600, limit: 5 }),
  timers = new Set<ReturnType<typeof setTimeout>>();
function openToast(input: ToastInput) {
  const id = showToast(input);
  if (input.status !== "loading") return;
  const timer = setTimeout(() => {
    timers.delete(timer);
    updateToast(id, {
      status: "success",
      title: "Publish complete",
      description: "Toast updated in-place from loading to success.",
      duration: 3200,
    });
  }, 1800);
  timers.add(timer);
}
function moveStack(value: ToastPosition) {
  position.value = value;
  showToast({
    status: "info",
    title: "Position changed",
    description: `New toasts open from ${value}.`,
  });
}
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
});
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <AnimatedToastStack
      :toasts="toasts"
      :position="position"
      placement="fixed"
      :max-visible="4"
      :class-names="{ surface: 'bg-card/95' }"
      :icons="{ neutral: Sparkles }"
      @dismiss="dismissToast"
    />
    <div class="flex flex-col items-center gap-2 text-center">
      <p class="text-sm font-medium text-foreground">Open a real toast</p>
      <p class="max-w-sm text-xs leading-5 text-muted-foreground">
        Toasts render fixed on the screen. Change position to open a toast from
        that edge.
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="example in examples"
        :key="example.label"
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors press hover:border-(--color-border-strong)"
        @click="openToast(example)"
      >
        <component
          :is="
            example.status === 'loading'
              ? LoaderCircle
              : example.status === 'success'
                ? Check
                : X
          "
          class="h-3.5 w-3.5"
        />{{ example.label }}</button
      ><button
        type="button"
        class="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-muted-foreground press hover:bg-foreground/[0.06] hover:text-foreground"
        @click="clearToasts"
      >
        Clear
      </button>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-1.5">
      <button
        v-for="option in positions"
        :key="option"
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors press',
          position === option
            ? 'bg-foreground text-background'
            : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground',
        ]"
        @click="moveStack(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### AnimatedToastStack

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `toasts` | `AnimatedToast[]` | — | Yes | — |
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `"bottom-right"` | No | — |
| `placement` | `"static" \| "fixed" \| "absolute"` | `(props.fixed ? "fixed" : "static")` | No | — |
| `fixed` | `boolean` | `false` | No | — |
| `portal` | `boolean` | `undefined` | No | — |
| `portalRoot` | `null \| Element` | — | No | — |
| `maxVisible` | `number` | `4` | No | — |
| `className` | `string` | — | No | — |
| `classNames` | `Partial<Record<"action" \| "description" \| "content" \| "root" \| "item" \| "surface" \| "iconWrap" \| "title" \| "close" \| "progress", string>>` | — | No | — |
| `icons` | `Partial<Record<ToastStatus, any>>` | — | No | — |
| `renderToast` | `(toast: AnimatedToast) => VNodeChild` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `dismiss` | `[id: string]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `toast` | — | `toast: toast` | — |

<a id="about"></a>
## About Animated Toast Stack

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Animated Toast Stack?**

Configure Animated Toast Stack through toasts, position, placement, fixed, portal, portalRoot, maxVisible, className, classNames, icons, renderToast. The API table describes their types and defaults.

**How does it connect to application state?**

Observe dismiss to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Badge](https://orvui.efu.me/en/components/motion/animated-badge): Pair a compact status label with an icon and optional pulse feedback.
- [Loader](https://orvui.efu.me/en/components/motion/loader): Choose a compact animated indicator for an operation whose result is still pending.
- [Text Animation](https://orvui.efu.me/en/components/motion/text-animation): Reveal, shimmer, scramble or replace text while keeping a stable accessible reading.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/animated-toast-stack.json
- Documentation: https://orvui.efu.me/en/components/motion/animated-toast-stack
- `packages/vue/src/motion/animated-toast-stack/src/AnimatedToastStack.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
