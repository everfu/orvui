---
title: "Scroll Animation"
description: "将滚动与进度、视差、内容出现效果及主动定位连接。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/scroll-animation"
markdown: "https://orvui.efu.me/components/motion/scroll-animation.md"
license: "MIT"
productVersion: "0.1.0"
---

# Scroll Animation

> 将滚动与进度、视差、内容出现效果及主动定位连接。

将滚动与进度、视差、内容出现效果及主动定位连接。

## 适用场景

- 当界面需要以下行为时使用 Scroll Animation：将滚动与进度、视差、内容出现效果及主动定位连接。

## 安装

### Scroll Animation — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-animation.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Smooth Scroll — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/smooth-scroll.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Scroll Progress — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-progress.json
```

### Parallax — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/parallax.json
```

### Scroll To — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-to.json
```

### Scroll Reveal — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-reveal.json
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

```bash
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `lenis@^1.3.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Scroll Animation

**复制源码**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@/components/orvui/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@orvui/vue/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

### Smooth Scroll

提供 Lenis 滚动，并通过 useSmoothScroll 共享偏移、速度与进度。

**复制源码**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@/components/orvui/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@orvui/vue/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

### Scroll Progress

将滚动进度呈现为横条或圆环，并可使用弹簧平滑数值。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useMotionValue } from "motion-v";
import { ScrollProgress } from "@/components/orvui/motion/scroll-animation";
const fraction = useMotionValue(0);
function track(event: Event) {
  const viewport = event.currentTarget as HTMLElement;
  fraction.set(viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight));
}
onBeforeUnmount(() => fraction.destroy());
</script>
<template>
  <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card">
    <ScrollProgress :progress="fraction" :fixed="false" :height="3" />
    <div class="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-1 backdrop-blur"><ScrollProgress variant="circle" :progress="fraction" :size="36" /></div>
    <div class="h-64 overflow-y-auto scrollbar-hide" @scroll="track"><div class="space-y-3 p-4">
      <div v-for="section in 18" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div>
    </div></div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useMotionValue } from "motion-v";
import { ScrollProgress } from "@orvui/vue/motion/scroll-animation";
const fraction = useMotionValue(0);
function track(event: Event) {
  const viewport = event.currentTarget as HTMLElement;
  fraction.set(viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight));
}
onBeforeUnmount(() => fraction.destroy());
</script>
<template>
  <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card">
    <ScrollProgress :progress="fraction" :fixed="false" :height="3" />
    <div class="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-1 backdrop-blur"><ScrollProgress variant="circle" :progress="fraction" :size="36" /></div>
    <div class="h-64 overflow-y-auto scrollbar-hide" @scroll="track"><div class="space-y-3 p-4">
      <div v-for="section in 18" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div>
    </div></div>
  </div>
</template>
```

### Parallax

根据内容位置与指定速度系数，沿任一坐标轴偏移内容。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Parallax } from "@/components/orvui/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const layers = [
  { speed: -0.6, wrapper: "absolute inset-x-0 -top-1/4 h-[150%]", src: "https://picsum.photos/id/528/800/600", image: "size-full object-cover" },
  { speed: 0.5, wrapper: "absolute inset-0 grid place-items-center" },
  { speed: 0.9, wrapper: "absolute bottom-4 right-4", src: "https://picsum.photos/id/621/120/120", image: "size-12 rounded-full border-2 border-background object-cover shadow-lg" },
];
</script>
<template>
  <div ref="viewport" class="relative h-[600px] w-full max-w-2xl overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">Scroll down ↓</div>
    <div class="relative h-96 overflow-hidden">
      <Parallax v-for="(layer, index) in layers" :key="index" :container="viewport" :speed="layer.speed" :class="layer.wrapper">
        <img v-if="layer.src" :src="layer.src" alt="" :class="layer.image" />
        <span v-else class="rounded-full bg-background/85 px-5 py-2 text-base font-medium text-foreground backdrop-blur">Parallax</span>
      </Parallax>
    </div>
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">↑ Scroll up</div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Parallax } from "@orvui/vue/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const layers = [
  { speed: -0.6, wrapper: "absolute inset-x-0 -top-1/4 h-[150%]", src: "https://picsum.photos/id/528/800/600", image: "size-full object-cover" },
  { speed: 0.5, wrapper: "absolute inset-0 grid place-items-center" },
  { speed: 0.9, wrapper: "absolute bottom-4 right-4", src: "https://picsum.photos/id/621/120/120", image: "size-12 rounded-full border-2 border-background object-cover shadow-lg" },
];
</script>
<template>
  <div ref="viewport" class="relative h-[600px] w-full max-w-2xl overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">Scroll down ↓</div>
    <div class="relative h-96 overflow-hidden">
      <Parallax v-for="(layer, index) in layers" :key="index" :container="viewport" :speed="layer.speed" :class="layer.wrapper">
        <img v-if="layer.src" :src="layer.src" alt="" :class="layer.image" />
        <span v-else class="rounded-full bg-background/85 px-5 py-2 text-base font-medium text-foreground backdrop-blur">Parallax</span>
      </Parallax>
    </div>
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">↑ Scroll up</div>
  </div>
</template>
```

### Scroll To

将当前滚动容器移动到指定元素、选择器或数值偏移。

**复制源码**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ScrollTo, SmoothScroll } from "@/components/orvui/motion/scroll-animation";
const instanceId = useId();
const sections = ["Intro", "Features", "Pricing", "FAQ"].map(label => ({ label, id: `${instanceId}-${label.toLowerCase()}` }));
</script>
<template>
  <SmoothScroll :root="false" class="relative h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <nav class="sticky top-0 z-10 flex gap-1.5 border-b border-border bg-background/80 p-2 backdrop-blur">
      <ScrollTo v-for="section in sections" :key="section.id" :to="`#${section.id}`" :offset="-48" class="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{{ section.label }}</ScrollTo>
    </nav>
    <section v-for="section in sections" :id="section.id" :key="section.id" class="flex h-64 items-center justify-center text-lg font-medium text-foreground">{{ section.label }}</section>
  </SmoothScroll>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ScrollTo, SmoothScroll } from "@orvui/vue/motion/scroll-animation";
const instanceId = useId();
const sections = ["Intro", "Features", "Pricing", "FAQ"].map(label => ({ label, id: `${instanceId}-${label.toLowerCase()}` }));
</script>
<template>
  <SmoothScroll :root="false" class="relative h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <nav class="sticky top-0 z-10 flex gap-1.5 border-b border-border bg-background/80 p-2 backdrop-blur">
      <ScrollTo v-for="section in sections" :key="section.id" :to="`#${section.id}`" :offset="-48" class="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{{ section.label }}</ScrollTo>
    </nav>
    <section v-for="section in sections" :id="section.id" :key="section.id" class="flex h-64 items-center justify-center text-lg font-medium text-foreground">{{ section.label }}</section>
  </SmoothScroll>
</template>
```

### Scroll Reveal

内容越过视口边界时显示，可选择仅执行一次或每次执行。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ScrollReveal } from "@/components/orvui/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const samples = ["Spring slide", "Blur in", "Staggered by delay", "Reveal once"];
</script>
<template>
  <div ref="viewport" class="h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex flex-col gap-16 p-6"><div class="text-center text-sm text-muted-foreground">Scroll ↓</div>
      <ScrollReveal v-for="(label, index) in samples" :key="label" :root="viewport" :once="false" :delay="index * 0.05"
        class="rounded-xl border border-border bg-muted/50 px-4 py-16 text-center text-base font-medium text-foreground">{{ label }}</ScrollReveal>
      <div class="text-center text-sm text-muted-foreground">End</div>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ScrollReveal } from "@orvui/vue/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const samples = ["Spring slide", "Blur in", "Staggered by delay", "Reveal once"];
</script>
<template>
  <div ref="viewport" class="h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex flex-col gap-16 p-6"><div class="text-center text-sm text-muted-foreground">Scroll ↓</div>
      <ScrollReveal v-for="(label, index) in samples" :key="label" :root="viewport" :once="false" :delay="index * 0.05"
        class="rounded-xl border border-border bg-muted/50 px-4 py-16 text-center text-base font-medium text-foreground">{{ label }}</ScrollReveal>
      <div class="text-center text-sm text-muted-foreground">End</div>
    </div>
  </div>
</template>
```

## API 参考

### ScrollTo

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `to` | `string \| number \| HTMLElement` | `props.target` | 否 | — |
| `target` | `string \| number \| HTMLElement` | — | 否 | — |
| `offset` | `number` | — | 否 | — |
| `duration` | `number` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SmoothScroll

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `root` | `boolean` | `true` | 否 | — |
| `lerp` | `number` | `0.1` | 否 | — |
| `duration` | `number` | `1.2` | 否 | — |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 否 | — |
| `wheelMultiplier` | `number` | `1` | 否 | — |
| `touch` | `boolean` | `false` | 否 | — |
| `enabled` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ScrollProgress

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"circle" \| "bar"` | `"bar"` | 否 | — |
| `progress` | `MotionValue<number>` | `fallback` | 否 | — |
| `spring` | `boolean` | `true` | 否 | — |
| `position` | `"top" \| "bottom"` | `"top"` | 否 | — |
| `height` | `number` | `2` | 否 | — |
| `fixed` | `boolean` | `true` | 否 | — |
| `size` | `number` | `40` | 否 | — |
| `thickness` | `number` | `3` | 否 | — |

### Parallax

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `speed` | `number` | `0.3` | 否 | — |
| `axis` | `"x" \| "y"` | `"y"` | 否 | — |
| `container` | `null \| HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | 否 | — |
| `spring` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ScrollReveal

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `y` | `number` | `16` | 否 | — |
| `blur` | `number` | `8` | 否 | — |
| `duration` | `number` | `0.6` | 否 | — |
| `delay` | `number` | `0` | 否 | — |
| `once` | `boolean` | `true` | 否 | — |
| `amount` | `number \| "some" \| "all"` | `0.3` | 否 | — |
| `root` | `null \| HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Scroll Animation

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Scroll Animation？**

通过 to、target、offset、duration、disabled 配置 Scroll Animation；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/scroll-animation.json
- 文档: https://orvui.efu.me/components/motion/scroll-animation
- `packages/vue/src/motion/scroll-animation/src/ScrollTo.vue`
- `packages/vue/src/motion/scroll-animation/src/SmoothScroll.vue`
- `packages/vue/src/motion/scroll-animation/src/ScrollProgress.vue`
- `packages/vue/src/motion/scroll-animation/src/Parallax.vue`
- `packages/vue/src/motion/scroll-animation/src/ScrollReveal.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
