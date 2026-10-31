---
title: "Image Generation"
description: "展示图像创建状态，预览输出并提供结果操作。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/image-generation"
markdown: "https://orvui.efu.me/components/agents/image-generation.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Image Generation

> 展示图像创建状态，预览输出并提供结果操作。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Image Generation：展示图像创建状态，预览输出并提供结果操作。

<a id="install"></a>
## 安装

### Image Generation — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/image-generation.json
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
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Image Generation

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ImageGeneration, type ImageGenerationStatus } from "@/components/orvui/agents/image-generation";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const status = ref<ImageGenerationStatus>("queued"),
  identity = useId(),
  reduced = useReducedMotion();
// orvui-owned illustration: seeded midpoint displacement creates new terrain contours.
// The canvas, color bands and animation are compatibility inputs; ridge silhouettes differ.
function terrain(
  seed: number,
  baseline: number,
  peak: number,
  roughness: number,
  smooth = false,
) {
  let state = seed >>> 0;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
  const heights = Array<number>(33).fill(0);
  heights[0] = (random() - 0.5) * roughness;
  heights[32] = (random() - 0.5) * roughness;
  for (
    let stride = 32, displacement = roughness;
    stride > 1;
    stride /= 2, displacement *= 0.57
  ) {
    for (let left = 0; left < 32; left += stride) {
      const right = left + stride;
      heights[left + stride / 2] =
        (heights[left]! + heights[right]!) / 2 +
        (random() - 0.5) * displacement;
    }
  }
  const points = heights.map((height, index) => {
    const x = index * 25;
    const summit = Math.max(0, 1 - Math.abs(x - 350) / 250);
    return { x, y: Number((baseline + height - peak * summit).toFixed(2)) };
  });
  let outline = `M${points[0]!.x} ${points[0]!.y}`;
  if (smooth) {
    for (let index = 1; index < points.length - 1; index++) {
      const current = points[index]!,
        next = points[index + 1]!;
      outline += `Q${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
    }
    const last = points.at(-1)!;
    outline += `T${last.x} ${last.y}`;
  } else
    for (const point of points.slice(1)) outline += `L${point.x} ${point.y}`;
  return outline + "L800 600H0Z";
}
const landscape = {
  distant: terrain(0x49554931, 386, 145, 120),
  middle: terrain(0x49554932, 431, 74, 95),
  foreground: terrain(0x49554933, 509, 8, 54, true),
};
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  status.value = reduced.value ? "complete" : "queued";
  if (reduced.value) return;
  const stages = [
    { after: 500, status: "generating" },
    { after: 3000, status: "refining" },
    { after: 5200, status: "complete" },
  ] as const;
  stages.forEach((stage) =>
    later(stage.after, () => {
      status.value = stage.status;
    }),
  );
}
watch(reduced, replay);
onMounted(replay);
</script>
<template>
  <div class="w-full max-w-xl">
    <div class="flex w-full flex-col items-center">
      <ImageGeneration
        label="A quiet mountain landscape at sunset"
        prompt="a quiet mountain landscape at sunset"
        resolution="1024 × 1024"
        :status="status"
        @retry="replay"
        ><svg
          viewBox="0 0 800 600"
          aria-hidden="true"
          class="size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient :id="`${identity}-sky`" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#191b33" />
              <stop offset="0.48" stop-color="#60538d" />
              <stop offset="1" stop-color="#e59b7b" />
            </linearGradient>
            <linearGradient
              :id="`${identity}-ground`"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stop-color="#314946" />
              <stop offset="1" stop-color="#101817" />
            </linearGradient>
            <radialGradient :id="`${identity}-glow`">
              <stop offset="0" stop-color="#ffe6b2" stop-opacity="0.95" />
              <stop offset="1" stop-color="#efb47e" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" :fill="`url(#${identity}-sky)`" />
          <circle cx="570" cy="210" r="150" :fill="`url(#${identity}-glow)`" />
          <circle cx="570" cy="210" r="54" fill="#ffe5ad" />
          <path :d="landscape.distant" fill="#283d43" opacity="0.9" />
          <path :d="landscape.middle" :fill="`url(#${identity}-ground)`" />
          <path :d="landscape.foreground" fill="#13201f" />
          <g fill="#c9d7c3" opacity="0.65">
            <circle cx="108" cy="142" r="2" />
            <circle cx="168" cy="102" r="1.5" />
            <circle cx="248" cy="154" r="2" />
            <circle cx="332" cy="84" r="1.5" />
            <circle cx="414" cy="138" r="2" />
          </g></svg></ImageGeneration
      ><button
        type="button"
        class="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        @click="replay"
      >
        <RotateCcw class="size-4" />Replay
      </button>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ImageGeneration, type ImageGenerationStatus } from "@orvui/vue/agents/image-generation";
import { useReducedMotion } from "@orvui/vue";
const status = ref<ImageGenerationStatus>("queued"),
  identity = useId(),
  reduced = useReducedMotion();
// orvui-owned illustration: seeded midpoint displacement creates new terrain contours.
// The canvas, color bands and animation are compatibility inputs; ridge silhouettes differ.
function terrain(
  seed: number,
  baseline: number,
  peak: number,
  roughness: number,
  smooth = false,
) {
  let state = seed >>> 0;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
  const heights = Array<number>(33).fill(0);
  heights[0] = (random() - 0.5) * roughness;
  heights[32] = (random() - 0.5) * roughness;
  for (
    let stride = 32, displacement = roughness;
    stride > 1;
    stride /= 2, displacement *= 0.57
  ) {
    for (let left = 0; left < 32; left += stride) {
      const right = left + stride;
      heights[left + stride / 2] =
        (heights[left]! + heights[right]!) / 2 +
        (random() - 0.5) * displacement;
    }
  }
  const points = heights.map((height, index) => {
    const x = index * 25;
    const summit = Math.max(0, 1 - Math.abs(x - 350) / 250);
    return { x, y: Number((baseline + height - peak * summit).toFixed(2)) };
  });
  let outline = `M${points[0]!.x} ${points[0]!.y}`;
  if (smooth) {
    for (let index = 1; index < points.length - 1; index++) {
      const current = points[index]!,
        next = points[index + 1]!;
      outline += `Q${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
    }
    const last = points.at(-1)!;
    outline += `T${last.x} ${last.y}`;
  } else
    for (const point of points.slice(1)) outline += `L${point.x} ${point.y}`;
  return outline + "L800 600H0Z";
}
const landscape = {
  distant: terrain(0x49554931, 386, 145, 120),
  middle: terrain(0x49554932, 431, 74, 95),
  foreground: terrain(0x49554933, 509, 8, 54, true),
};
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  status.value = reduced.value ? "complete" : "queued";
  if (reduced.value) return;
  const stages = [
    { after: 500, status: "generating" },
    { after: 3000, status: "refining" },
    { after: 5200, status: "complete" },
  ] as const;
  stages.forEach((stage) =>
    later(stage.after, () => {
      status.value = stage.status;
    }),
  );
}
watch(reduced, replay);
onMounted(replay);
</script>
<template>
  <div class="w-full max-w-xl">
    <div class="flex w-full flex-col items-center">
      <ImageGeneration
        label="A quiet mountain landscape at sunset"
        prompt="a quiet mountain landscape at sunset"
        resolution="1024 × 1024"
        :status="status"
        @retry="replay"
        ><svg
          viewBox="0 0 800 600"
          aria-hidden="true"
          class="size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient :id="`${identity}-sky`" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#191b33" />
              <stop offset="0.48" stop-color="#60538d" />
              <stop offset="1" stop-color="#e59b7b" />
            </linearGradient>
            <linearGradient
              :id="`${identity}-ground`"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stop-color="#314946" />
              <stop offset="1" stop-color="#101817" />
            </linearGradient>
            <radialGradient :id="`${identity}-glow`">
              <stop offset="0" stop-color="#ffe6b2" stop-opacity="0.95" />
              <stop offset="1" stop-color="#efb47e" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" :fill="`url(#${identity}-sky)`" />
          <circle cx="570" cy="210" r="150" :fill="`url(#${identity}-glow)`" />
          <circle cx="570" cy="210" r="54" fill="#ffe5ad" />
          <path :d="landscape.distant" fill="#283d43" opacity="0.9" />
          <path :d="landscape.middle" :fill="`url(#${identity}-ground)`" />
          <path :d="landscape.foreground" fill="#13201f" />
          <g fill="#c9d7c3" opacity="0.65">
            <circle cx="108" cy="142" r="2" />
            <circle cx="168" cy="102" r="1.5" />
            <circle cx="248" cy="154" r="2" />
            <circle cx="332" cy="84" r="1.5" />
            <circle cx="414" cy="138" r="2" />
          </g></svg></ImageGeneration
      ><button
        type="button"
        class="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        @click="replay"
      >
        <RotateCcw class="size-4" />Replay
      </button>
    </div>
  </div>
</template>
```

## 组件指南

<a id="composition"></a>
### 组合结构

使用公开部件 ImageGeneration 组合 Image Generation，并从该组件的公开入口导入。

```text
Message
└── MessageContent
    └── ImageGeneration
        └── GeneratedMedia
```

<a id="behavior"></a>
### 工作方式

展示图像创建状态，预览输出并提供结果操作。

### 生命周期

#### 初始化

通过 status、label、prompt、resolution、aspectRatio、size、interactive、statusText、showStatus、mediaClassName、statusClassName 配置 Image Generation；API 表列出其类型与默认值。

#### 更新

监听 retry，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Image Generation 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 ImageGeneration，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Message](https://orvui.efu.me/components/agents/message): 使用内容、附件、来源与操作部件组合会话条目。
- [Streaming Response](https://orvui.efu.me/components/agents/streaming-response): 组合持续变化的助手回复，包括文字、附件、引用和操作。
- [Prompt Input](https://orvui.efu.me/components/agents/prompt-input): 通过自适应高度文本框、附件与键盘操作编写并提交提示词。

### 能力边界

- 负责: Image Generation 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Image Generation：展示图像创建状态，预览输出并提供结果操作。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### ImageGeneration

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `status` | `"error" \| "complete" \| "queued" \| "generating" \| "refining"` | `"generating"` | 否 | — |
| `label` | `string` | ``(props.prompt ? `${message.value}: ${props.prompt}` : message.value)`` | 否 | — |
| `prompt` | `string` | — | 否 | — |
| `resolution` | `string` | `"1024 × 1024"` | 否 | — |
| `aspectRatio` | `string \| number` | `"1 / 1"` | 否 | — |
| `size` | `"compact" \| "fluid"` | `"compact"` | 否 | — |
| `interactive` | `boolean` | `true` | 否 | — |
| `statusText` | `string` | `{ queued: "Waiting to generate", generating: "Generating image", refining: "Refining details", complete: "Image ready", error: "Generation failed", }[props.status]` | 否 | — |
| `showStatus` | `boolean` | `true` | 否 | — |
| `mediaClassName` | `string` | — | 否 | — |
| `statusClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `retry` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Image Generation

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Image Generation？**

通过 status、label、prompt、resolution、aspectRatio、size、interactive、statusText、showStatus、mediaClassName、statusClassName 配置 Image Generation；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 retry，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Chat App](https://orvui.efu.me/components/agents/chat-app): 将导航、会话内容和提示输入区组合为助手工作空间。
- [Agent Loading States](https://orvui.efu.me/components/agents/loading-states): 通过进度、推理和微光显示传达助手工作仍在进行。
- [Code Block](https://orvui.efu.me/components/agents/code-block): 呈现带高亮的代码，并支持行控件、文件标签与复制操作。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/image-generation.json
- 文档: https://orvui.efu.me/components/agents/image-generation
- `packages/vue/src/agents/image-generation/src/ImageGeneration.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
