---
title: "Text Animation"
description: "揭示、闪烁、解码或替换文字，同时保持稳定的无障碍读值。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/text-animation"
markdown: "https://orvui.efu.me/components/motion/text-animation.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Text Animation

> 揭示、闪烁、解码或替换文字，同时保持稳定的无障碍读值。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Text Animation：揭示、闪烁、解码或替换文字，同时保持稳定的无障碍读值。

<a id="install"></a>
## 安装

### Text Animation — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-animation.json
```

### Text Scramble — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-scramble.json
```

### Dia Text Animation — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/chromatic-text-reveal.json
```

### Text Reveal — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-reveal.json
```

### Text Shimmer — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-shimmer.json
```

### Text Cascade — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-cascade.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Text Animation

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@/components/orvui/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground press hover:border-(--color-border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Replay</button></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@orvui/vue/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground press hover:border-(--color-border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Replay</button></div></template>
```

<a id="text-scramble"></a>
### Text Scramble

让临时字符逐步解析为目标文字，并提供稳定的无障碍读值。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextScramble } from "@/components/orvui/motion/text-animation";
const steps = ["Inspecting the repository", "Running the checks", "Preparing the update"];
const selected = ref(0);
function advance() { selected.value = (selected.value + 1) % steps.length; }
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><TextScramble :text="steps[selected]" class="font-mono text-xl font-medium text-foreground" /><button type="button" @click="advance" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Next phrase</button></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextScramble } from "@orvui/vue/motion/text-animation";
const steps = ["Inspecting the repository", "Running the checks", "Preparing the update"];
const selected = ref(0);
function advance() { selected.value = (selected.value + 1) % steps.length; }
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><TextScramble :text="steps[selected]" class="font-mono text-xl font-medium text-foreground" /><button type="button" @click="advance" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Next phrase</button></div></template>
```

<a id="chromatic-reveal"></a>
### Dia Text Animation

保持句子前缀静止，用色彩扫过显示不断变化的末尾词语。

**复制源码**

```vue
<script setup lang="ts">
import { ChromaticTextReveal } from "@/components/orvui/motion/text-animation";
const adjectives = ["natural.", "intentional.", "alive."];
</script>
<template><div class="@container flex w-full justify-center"><ChromaticTextReveal prefix="Motion that feels" :words="adjectives" :start-on-view="false" class="shrink-0 font-medium tracking-[-.04em] text-foreground [font-size:clamp(1.25rem,7.8cqw,3rem)]" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ChromaticTextReveal } from "@orvui/vue/motion/text-animation";
const adjectives = ["natural.", "intentional.", "alive."];
</script>
<template><div class="@container flex w-full justify-center"><ChromaticTextReveal prefix="Motion that feels" :words="adjectives" :start-on-view="false" class="shrink-0 font-medium tracking-[-.04em] text-foreground [font-size:clamp(1.25rem,7.8cqw,3rem)]" /></div></template>
```

<a id="reveal"></a>
### Text Reveal

用短距离上移和逐渐消退的模糊显示单词或字符。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@/components/orvui/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Replay</button></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@orvui/vue/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Replay</button></div></template>
```

<a id="shimmer"></a>
### Text Shimmer

在现有文字上移动高光，表示工作仍在进行或强调标签。

**复制源码**

```vue
<script setup lang="ts">
import { TextShimmer } from "@/components/orvui/motion/text-animation";
const examples = [{ text: "Loading projects…", class: "text-3xl font-semibold", duration: 2 }, { text: "Faster shimmer", class: "text-sm", duration: 1.5 }];
</script>
<template><div class="flex flex-col gap-4"><TextShimmer v-for="example in examples" :key="example.text" :duration="example.duration" :class="example.class">{{ example.text }}</TextShimmer></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { TextShimmer } from "@orvui/vue/motion/text-animation";
const examples = [{ text: "Loading projects…", class: "text-3xl font-semibold", duration: 2 }, { text: "Faster shimmer", class: "text-sm", duration: 1.5 }];
</script>
<template><div class="flex flex-col gap-4"><TextShimmer v-for="example in examples" :key="example.text" :duration="example.duration" :class="example.class">{{ example.text }}</TextShimmer></div></template>
```

<a id="cascade"></a>
### Text Cascade

逐字替换内容，让旧字符离开后新字符依次落定。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TextCascade } from "@/components/orvui/motion/text-animation";
const actions = ["Install skills", "Open settings", "Ship updates"];
const selected = ref(0);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => selected.value = (selected.value + 1) % actions.length, 2400); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="flex w-full justify-center"><p class="text-lg font-medium text-foreground"><TextCascade :text="actions[selected]" /></p></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TextCascade } from "@orvui/vue/motion/text-animation";
const actions = ["Install skills", "Open settings", "Ship updates"];
const selected = ref(0);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => selected.value = (selected.value + 1) % actions.length, 2400); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="flex w-full justify-center"><p class="text-lg font-medium text-foreground"><TextCascade :text="actions[selected]" /></p></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### TextReveal

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `text` | `string \| string[]` | — | 是 | — |
| `as` | `string` | `"span"` | 否 | — |
| `split` | `"word" \| "char"` | `"word"` | 否 | — |
| `stagger` | `number` | `.09` | 否 | — |
| `delay` | `number` | `0` | 否 | — |
| `blur` | `number` | `12` | 否 | — |
| `yOffset` | `string \| number` | `"40%"` | 否 | — |
| `spring` | `{ stiffness?: number; damping?: number; mass?: number; }` | — | 否 | — |
| `once` | `boolean` | `true` | 否 | — |
| `whileInView` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TextScramble

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `text` | `string` | — | 是 | — |
| `duration` | `number` | `Math.min(760, Math.max(420, target.length * 32))` | 否 | — |
| `glyphs` | `string` | `"ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/"` | 否 | — |
| `trigger` | `string \| number` | — | 否 | — |

### ChromaticTextReveal

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `prefix` | `string` | — | 是 | — |
| `words` | `string[]` | — | 是 | — |
| `colors` | `string[]` | `() => ["#60a5fa", "#818cf8", "#c084fc", "#fb7185", "#fbbf24"]` | 否 | — |
| `foregroundColor` | `string` | `"var(--foreground)"` | 否 | — |
| `duration` | `number` | `1.2` | 否 | — |
| `delay` | `number` | `0` | 否 | — |
| `pauseDuration` | `number` | `.8` | 否 | — |
| `loop` | `boolean` | `true` | 否 | — |
| `startOnView` | `boolean` | `true` | 否 | — |
| `once` | `boolean` | `true` | 否 | — |
| `inViewMargin` | `string` | — | 否 | — |

### TextShimmer

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `as` | `string` | `"span"` | 否 | — |
| `duration` | `number` | `2` | 否 | — |
| `spread` | `number` | `2` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TextCascade

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `text` | `string` | — | 是 | — |

<a id="about"></a>
## 关于 Text Animation

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Text Animation？**

通过 text、as、split、stagger、delay、blur、yOffset、spring、once、whileInView 配置 Text Animation；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Number Animation](https://orvui.efu.me/components/motion/number): 通过计数、滚动或保持数位位置的方式呈现数值变化。
- [Action Swap](https://orvui.efu.me/components/motion/action-swap): 使用模糊、滚动或错开过渡替换简短操作文字与图标。
- [Loader](https://orvui.efu.me/components/motion/loader): 为结果尚未返回的操作选择紧凑动态指示器。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/text-animation.json
- 文档: https://orvui.efu.me/components/motion/text-animation
- `packages/vue/src/motion/text-animation/src/TextReveal.vue`
- `packages/vue/src/motion/text-animation/src/TextScramble.vue`
- `packages/vue/src/motion/text-animation/src/ChromaticTextReveal.vue`
- `packages/vue/src/motion/text-animation/src/TextShimmer.vue`
- `packages/vue/src/motion/text-animation/src/TextCascade.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
