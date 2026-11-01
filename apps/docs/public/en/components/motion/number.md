---
title: "Number Animation"
description: "Animate numeric values with counting, rolling or position-preserving digit changes."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/number"
markdown: "https://orvui.efu.me/en/components/motion/number.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Number Animation

> Animate numeric values with counting, rolling or position-preserving digit changes.

<a id="when-to-use"></a>

## When to use it

- Use Number Animation when the interface needs this behavior: animate numeric values with counting, rolling or position-preserving digit changes.

<a id="install"></a>
## Install

### Number Animation — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/number.json
```

### Digit Swap — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/digit-swap.json
```

### Number Ticker — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/number-ticker.json
```

### Animated Number — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-number.json
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Number Animation

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { AnimatedNumber, DigitSwap, NumberTicker } from "@/components/orvui/motion/number";
const amount = ref(4826);
function randomize() { amount.value = Math.round(99999 * Math.random()); }
</script>
<template>
  <div class="space-y-8 text-center">
    <div class="text-5xl font-semibold"><AnimatedNumber :value="amount" /></div>
    <div class="text-4xl font-semibold"><NumberTicker :value="amount" prefix="$" /></div>
    <button class="rounded-full border px-5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" @click="randomize">Change value</button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { AnimatedNumber, DigitSwap, NumberTicker } from "@orvui/vue/motion/number";
const amount = ref(4826);
function randomize() { amount.value = Math.round(99999 * Math.random()); }
</script>
<template>
  <div class="space-y-8 text-center">
    <div class="text-5xl font-semibold"><AnimatedNumber :value="amount" /></div>
    <div class="text-4xl font-semibold"><NumberTicker :value="amount" prefix="$" /></div>
    <button class="rounded-full border px-5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" @click="randomize">Change value</button>
  </div>
</template>
```

<a id="digit-swap"></a>
### Digit Swap

Keep digit positions fixed as changed digits roll with configurable direction and staggering.

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { DigitSwap } from "@/components/orvui/motion/number";
const visible = ref(false);
const number = computed(() => visible.value ? "4242 4242 4242 0806" : "•••• •••• •••• 0806");
function toggle() { visible.value = !visible.value; }
</script>
<template>
  <div class="flex w-80 flex-col gap-5">
    <div class="flex flex-col gap-2"><span class="text-xs font-medium text-muted-foreground">Card number</span>
      <DigitSwap :value="number" :animation-key="visible ? 'revealed' : 'masked'" :direction="visible ? 'up' : 'down'" :suffix-length="4"
        :glyph-class-name="visible ? 'text-foreground' : 'text-muted-foreground'" suffix-class-name="text-foreground" class="font-mono text-lg tracking-[0.08em] tabular-nums" />
    </div>
    <button type="button" :aria-label="visible ? 'Animate masked number' : 'Animate card number'" :aria-pressed="visible" @click="toggle"
      class="h-10 self-start rounded-lg border border-border px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">Animate</button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { DigitSwap } from "@orvui/vue/motion/number";
const visible = ref(false);
const number = computed(() => visible.value ? "4242 4242 4242 0806" : "•••• •••• •••• 0806");
function toggle() { visible.value = !visible.value; }
</script>
<template>
  <div class="flex w-80 flex-col gap-5">
    <div class="flex flex-col gap-2"><span class="text-xs font-medium text-muted-foreground">Card number</span>
      <DigitSwap :value="number" :animation-key="visible ? 'revealed' : 'masked'" :direction="visible ? 'up' : 'down'" :suffix-length="4"
        :glyph-class-name="visible ? 'text-foreground' : 'text-muted-foreground'" suffix-class-name="text-foreground" class="font-mono text-lg tracking-[0.08em] tabular-nums" />
    </div>
    <button type="button" :aria-label="visible ? 'Animate masked number' : 'Animate card number'" :aria-pressed="visible" @click="toggle"
      class="h-10 self-start rounded-lg border border-border px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">Animate</button>
  </div>
</template>
```

<a id="ticker"></a>
### Number Ticker

Roll numeric columns to a new value with staggered arrivals.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NumberTicker } from "@/components/orvui/motion/number";
const users = ref(48273);
let interval: ReturnType<typeof setInterval> | undefined;
function increment() { users.value += Math.floor(50 * Math.random()); }
onMounted(() => { interval = setInterval(increment, 2500); });
onBeforeUnmount(() => { clearInterval(interval); });
const formatCount = (count: number) => count.toLocaleString();
</script>
<template>
  <div class="flex flex-col items-center gap-3"><p class="text-xs text-muted-foreground">Active users</p>
    <NumberTicker :value="users" prefix="" class="text-4xl font-semibold tracking-tight text-foreground tabular-nums" :format="formatCount" />
    <p class="text-xs text-muted-foreground">live · updates every 2.5s</p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NumberTicker } from "@orvui/vue/motion/number";
const users = ref(48273);
let interval: ReturnType<typeof setInterval> | undefined;
function increment() { users.value += Math.floor(50 * Math.random()); }
onMounted(() => { interval = setInterval(increment, 2500); });
onBeforeUnmount(() => { clearInterval(interval); });
const formatCount = (count: number) => count.toLocaleString();
</script>
<template>
  <div class="flex flex-col items-center gap-3"><p class="text-xs text-muted-foreground">Active users</p>
    <NumberTicker :value="users" prefix="" class="text-4xl font-semibold tracking-tight text-foreground tabular-nums" :format="formatCount" />
    <p class="text-xs text-muted-foreground">live · updates every 2.5s</p>
  </div>
</template>
```

<a id="animated"></a>
### Animated Number

Count toward the supplied number after the element enters the viewport.

**Registry source**

```vue
<script setup lang="ts">
import { AnimatedNumber } from "@/components/orvui/motion/number";
const formatRevenue = (amount: number) => `$${Math.round(amount).toLocaleString()}`;
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <p class="text-xs text-muted-foreground">Monthly recurring revenue</p>
    <div class="text-4xl font-semibold tracking-tight text-foreground tabular-nums"><AnimatedNumber :value="129480" :format="formatRevenue" /></div>
    <p class="text-xs text-(--color-success)">+12.4% vs last month</p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { AnimatedNumber } from "@orvui/vue/motion/number";
const formatRevenue = (amount: number) => `$${Math.round(amount).toLocaleString()}`;
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <p class="text-xs text-muted-foreground">Monthly recurring revenue</p>
    <div class="text-4xl font-semibold tracking-tight text-foreground tabular-nums"><AnimatedNumber :value="129480" :format="formatRevenue" /></div>
    <p class="text-xs text-(--color-success)">+12.4% vs last month</p>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### AnimatedNumber

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | Yes | — |
| `duration` | `number` | `1.2` | No | — |
| `format` | `(n: number) => string` | — | No | — |
| `className` | `string` | — | No | — |
| `startOnView` | `boolean` | `true` | No | — |

### DigitSwap

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | — | Yes | — |
| `animationKey` | `string \| number` | `props.replayKey` | No | — |
| `replayKey` | `string \| number` | — | No | Compatibility alias for animationKey. |
| `direction` | `"up" \| "down"` | `"up"` | No | — |
| `duration` | `number` | `0.18` | No | — |
| `stagger` | `number` | `0.006` | No | — |
| `suffixLength` | `number` | `0` | No | — |
| `className` | `string` | — | No | — |
| `glyphClassName` | `string` | — | No | — |
| `suffixClassName` | `string` | — | No | — |
| `suffix` | `string` | — | No | — |

### NumberTicker

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | Yes | — |
| `pad` | `number` | — | No | — |
| `decimals` | `number` | `props.decimalPlaces` | No | — |
| `decimalPlaces` | `number` | — | No | Compatibility alias for decimals. |
| `duration` | `number` | `0.9` | No | — |
| `stagger` | `number` | `0.04` | No | — |
| `startOnView` | `boolean` | `true` | No | — |
| `prefix` | `string` | — | No | — |
| `suffix` | `string` | — | No | — |
| `blur` | `boolean` | `false` | No | — |
| `className` | `string` | — | No | — |
| `digitClassName` | `string` | — | No | — |
| `locale` | `boolean` | `false` | No | — |
| `format` | `(value: number) => string` | — | No | — |

<a id="about"></a>
## About Number Animation

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Number Animation?**

Configure Number Animation through value, duration, format, className, startOnView. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Action Swap](https://orvui.efu.me/en/components/motion/action-swap): Replace short action text or icons using blur, rolling or staggered transitions.
- [Text Animation](https://orvui.efu.me/en/components/motion/text-animation): Reveal, shimmer, scramble or replace text while keeping a stable accessible reading.
- [Loader](https://orvui.efu.me/en/components/motion/loader): Choose a compact animated indicator for an operation whose result is still pending.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/number.json
- Documentation: https://orvui.efu.me/en/components/motion/number
- `packages/vue/src/motion/number/src/AnimatedNumber.vue`
- `packages/vue/src/motion/number/src/DigitSwap.vue`
- `packages/vue/src/motion/number/src/NumberTicker.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
