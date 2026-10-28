---
title: "Number Animation"
description: "通过计数、滚动或保持数位位置的方式呈现数值变化。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/number"
markdown: "https://orvui.efu.me/components/motion/number.md"
license: "MIT"
productVersion: "0.1.0"
---

# Number Animation

> 通过计数、滚动或保持数位位置的方式呈现数值变化。

通过计数、滚动或保持数位位置的方式呈现数值变化。

## 适用场景

- 当界面需要以下行为时使用 Number Animation：通过计数、滚动或保持数位位置的方式呈现数值变化。

## 安装

### Number Animation — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/number.json
```

### Digit Swap — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/digit-swap.json
```

### Number Ticker — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/number-ticker.json
```

### Animated Number — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-number.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

npm 发布后使用下方命令；发布前可安装验证后的本地归档。

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Number Animation

**复制源码**

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

**组件包**

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

### Digit Swap

保持数位位置固定，让变化数字按指定方向和错开时序滚动。

**复制源码**

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

**组件包**

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

### Number Ticker

让各数字列滚动到新值，并依次到达。

**复制源码**

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

**组件包**

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

### Animated Number

元素进入视口后，逐步计数到指定数值。

**复制源码**

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

**组件包**

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

## API 参考

### AnimatedNumber

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | 是 | — |
| `duration` | `number` | `1.2` | 否 | — |
| `format` | `(n: number) => string` | — | 否 | — |
| `className` | `string` | — | 否 | — |
| `startOnView` | `boolean` | `true` | 否 | — |

### DigitSwap

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | — | 是 | — |
| `animationKey` | `string \| number` | `props.replayKey` | 否 | — |
| `replayKey` | `string \| number` | — | 否 | Compatibility alias for animationKey. |
| `direction` | `"up" \| "down"` | `"up"` | 否 | — |
| `duration` | `number` | `0.18` | 否 | — |
| `stagger` | `number` | `0.006` | 否 | — |
| `suffixLength` | `number` | `0` | 否 | — |
| `className` | `string` | — | 否 | — |
| `glyphClassName` | `string` | — | 否 | — |
| `suffixClassName` | `string` | — | 否 | — |
| `suffix` | `string` | — | 否 | — |

### NumberTicker

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | 是 | — |
| `pad` | `number` | — | 否 | — |
| `decimals` | `number` | `props.decimalPlaces` | 否 | — |
| `decimalPlaces` | `number` | — | 否 | Compatibility alias for decimals. |
| `duration` | `number` | `0.9` | 否 | — |
| `stagger` | `number` | `0.04` | 否 | — |
| `startOnView` | `boolean` | `true` | 否 | — |
| `prefix` | `string` | — | 否 | — |
| `suffix` | `string` | — | 否 | — |
| `blur` | `boolean` | `false` | 否 | — |
| `className` | `string` | — | 否 | — |
| `digitClassName` | `string` | — | 否 | — |
| `locale` | `boolean` | `false` | 否 | — |
| `format` | `(value: number) => string` | — | 否 | — |

## 关于 Number Animation

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Number Animation？**

通过 value、duration、format、className、startOnView 配置 Number Animation；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/number.json
- 文档: https://orvui.efu.me/components/motion/number
- `packages/vue/src/motion/number/src/AnimatedNumber.vue`
- `packages/vue/src/motion/number/src/DigitSwap.vue`
- `packages/vue/src/motion/number/src/NumberTicker.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
