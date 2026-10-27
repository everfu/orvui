---
title: "Action Swap"
description: "Replace short action text or icons using blur, rolling or staggered transitions."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/action-swap"
markdown: "https://orvui.efu.me/en/components/motion/action-swap.md"
license: "MIT"
productVersion: "0.1.0"
---

# Action Swap

> Replace short action text or icons using blur, rolling or staggered transitions.

## Install

### Action Swap — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Cascade — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap-cascade.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Blur — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap-blur.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Roll — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap-roll.json
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
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Action Swap

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Check, Copy, Send, Sparkles } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT } from "@/components/orvui/lib/ease";
import { useReducedMotion } from "@/components/orvui/lib/composables";
import { ActionSwapButton } from "@/components/orvui/motion/action-swap";
const reduced = useReducedMotion(), animation = ref<"blur" | "roll">("blur");
const selected = reactive({ blur: "copy", roll: "send" });
const items = {
  blur: [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }],
  roll: [{ id: "send", label: "Send", icon: Send, ariaLabel: "Send" }, { id: "sent", label: "Sent", icon: Sparkles, ariaLabel: "Sent" }],
};
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { animation.value = animation.value === "blur" ? "roll" : "blur"; }, 2600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="relative flex min-h-12 min-w-36 items-center justify-center"><AnimatePresence mode="wait" :initial="false">
  <motion.div :key="animation" :initial="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(4px)' }"
    :animate="{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-4px)' }" :transition="{ duration: 0.22, ease: EASE_OUT }">
    <ActionSwapButton v-if="animation === 'blur'" v-model="selected.blur" :items="items.blur" animation="blur" variant="secondary" />
    <ActionSwapButton v-else v-model="selected.roll" :items="items.roll" animation="roll" variant="primary" />
  </motion.div>
</AnimatePresence></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Check, Copy, Send, Sparkles } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT } from "@orvui/vue";
import { useReducedMotion } from "@orvui/vue";
import { ActionSwapButton } from "@orvui/vue/motion/action-swap";
const reduced = useReducedMotion(), animation = ref<"blur" | "roll">("blur");
const selected = reactive({ blur: "copy", roll: "send" });
const items = {
  blur: [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }],
  roll: [{ id: "send", label: "Send", icon: Send, ariaLabel: "Send" }, { id: "sent", label: "Sent", icon: Sparkles, ariaLabel: "Sent" }],
};
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { animation.value = animation.value === "blur" ? "roll" : "blur"; }, 2600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="relative flex min-h-12 min-w-36 items-center justify-center"><AnimatePresence mode="wait" :initial="false">
  <motion.div :key="animation" :initial="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(4px)' }"
    :animate="{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-4px)' }" :transition="{ duration: 0.22, ease: EASE_OUT }">
    <ActionSwapButton v-if="animation === 'blur'" v-model="selected.blur" :items="items.blur" animation="blur" variant="secondary" />
    <ActionSwapButton v-else v-model="selected.roll" :items="items.roll" animation="roll" variant="primary" />
  </motion.div>
</AnimatePresence></div></template>
```

### Cascade

Send the old label's characters out and bring the replacement in one character at a time.

**Registry source**

```vue
<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { ActionSwapCascadeButton } from "@/components/orvui/motion/action-swap";
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied!", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex w-full justify-center"><ActionSwapCascadeButton :items="actions" variant="primary" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { ActionSwapCascadeButton } from "@orvui/vue/motion/action-swap";
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied!", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex w-full justify-center"><ActionSwapCascadeButton :items="actions" variant="primary" /></div></template>
```

### Blur

Crossfade action content with a short blur and scale transition.

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Check, Copy, Moon, Sun } from "lucide-vue-next";
import { ActionSwapBlurButton } from "@/components/orvui/motion/action-swap";
const selected = reactive({ text: "copy", icon: "light", action: "copy" });
const labels = [{ id: "copy", label: "Copy" }, { id: "copied", label: "Copied" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapBlurButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapBlurButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapBlurButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Check, Copy, Moon, Sun } from "lucide-vue-next";
import { ActionSwapBlurButton } from "@orvui/vue/motion/action-swap";
const selected = reactive({ text: "copy", icon: "light", action: "copy" });
const labels = [{ id: "copy", label: "Copy" }, { id: "copied", label: "Copied" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapBlurButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapBlurButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapBlurButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

### Roll

Bring the next label or icon upward into its existing space.

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Moon, Send, Sparkles, Sun } from "lucide-vue-next";
import { ActionSwapRollButton } from "@/components/orvui/motion/action-swap";
const selected = reactive({ text: "idle", icon: "light", action: "send" });
const labels = [{ id: "idle", label: "Save" }, { id: "done", label: "Saved" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "send", label: "Send invite", icon: Send, ariaLabel: "Send invite" }, { id: "sent", label: "Invite sent", icon: Sparkles, ariaLabel: "Invite sent" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapRollButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapRollButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapRollButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Moon, Send, Sparkles, Sun } from "lucide-vue-next";
import { ActionSwapRollButton } from "@orvui/vue/motion/action-swap";
const selected = reactive({ text: "idle", icon: "light", action: "send" });
const labels = [{ id: "idle", label: "Save" }, { id: "done", label: "Saved" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "send", label: "Send invite", icon: Send, ariaLabel: "Send invite" }, { id: "sent", label: "Invite sent", icon: Sparkles, ariaLabel: "Invite sent" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapRollButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapRollButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapRollButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

## API Reference

### ActionSwapButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `value` | `string` | `value.value` | No | — |
| `defaultValue` | `string` | `props.items[0]?.id` | No | — |
| `animation` | `"blur" \| "cascade" \| "roll"` | `"blur"` | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `"secondary"` | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | No | — |
| `iconOnly` | `boolean` | `undefined` | No | — |
| `cycle` | `boolean` | `true` | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |
| `click` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | — | `item: selected` | — |
| `default` | — | `item: selected` | — |

### ActionSwapIcon

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | — | Yes | — |
| `animation` | `"blur" \| "cascade" \| "roll"` | `"blur"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ActionSwapText

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | — | Yes | — |
| `animation` | `"blur" \| "cascade" \| "roll"` | `"blur"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ActionSwapCascadeButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `cycle` | `boolean` | `undefined` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `v-bind: slotProps` | — |
| `icon` | — | `v-bind: slotProps` | — |

### ActionSwapBlurButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `cycle` | `boolean` | `undefined` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `v-bind: slotProps` | — |
| `icon` | — | `v-bind: slotProps` | — |

### ActionSwapRollButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `cycle` | `boolean` | `undefined` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `v-bind: slotProps` | — |
| `icon` | — | `v-bind: slotProps` | — |

## About Action Swap

Replace short action text or icons using blur, rolling or staggered transitions.

### When to use it

- Use Action Swap when the interface needs this behavior: replace short action text or icons using blur, rolling or staggered transitions.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Action Swap?**

Configure Action Swap through items, modelValue, value, defaultValue, animation, variant, size, iconOnly, cycle, disabled. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change, update:value, valueChange, click to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/action-swap.json
- Documentation: https://orvui.efu.me/en/components/motion/action-swap
- `packages/vue/src/motion/action-swap/src/ActionSwapButton.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapIcon.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapText.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapCascadeButton.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapBlurButton.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapRollButton.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
