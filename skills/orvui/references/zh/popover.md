# Popover · orvui 0.1.1

## 选择与组合

简短非交互提示使用 Tooltip，触发器附近的内容使用 Popover；需要聚焦完成任务时使用 Modal、Drawer 或移动端 Bottom Sheet。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Popover"
description: "将浮动表面连接到触发器，支持常规过渡与连续变形过渡。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/popover"
markdown: "https://orvui.efu.me/components/motion/popover.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Popover

> 将浮动表面连接到触发器，支持常规过渡与连续变形过渡。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Popover：将浮动表面连接到触发器，支持常规过渡与连续变形过渡。

<a id="install"></a>
## 安装

### Popover — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/popover.json https://orvui.efu.me/r/button.json
```

### Gooey Popover — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/popover.json https://orvui.efu.me/r/button.json
```

### Morph Popover — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/popover-morph.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Popover

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@/components/orvui/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/orvui/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@orvui/vue/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

<a id="gooey"></a>
### Gooey Popover

用液态连接区域衔接触发器与浮动面板，同时保持面板内容清晰。

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@/components/orvui/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/orvui/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@orvui/vue/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

<a id="morph"></a>
### Morph Popover

通过锚定的裁剪路径显示完整面板，不缩放其中的文字。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Copy, Pencil, Share2, Trash2 } from "lucide-vue-next";
import {
  MorphPopover,
  MorphPopoverTrigger,
  MorphPopoverContent,
} from "@/components/orvui/motion/popover";
const expanded = ref(false);
const actions = [
  ["Edit", Pencil],
  ["Duplicate", Copy],
  ["Share", Share2],
  ["Delete", Trash2],
].map(([label, icon]) => ({ label: label as string, icon }));
function choose() {
  expanded.value = false;
}
</script>
<template>
  <MorphPopover v-model:open="expanded"
    ><MorphPopoverTrigger
      ><button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
      >
        Options<ChevronDown
          class="h-4 w-4 text-muted-foreground"
        /></button></MorphPopoverTrigger
    ><MorphPopoverContent align="start" class="w-48 p-1.5"
      ><button
        v-for="action in actions"
        :key="action.label"
        type="button"
        @click="choose"
        class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
      >
        <component :is="action.icon" class="h-4 w-4 text-muted-foreground" />{{
          action.label
        }}
      </button></MorphPopoverContent
    ></MorphPopover
  >
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Copy, Pencil, Share2, Trash2 } from "lucide-vue-next";
import { MorphPopover, MorphPopoverTrigger, MorphPopoverContent } from "@orvui/vue/motion/popover";
const expanded = ref(false);
const actions = [
  ["Edit", Pencil],
  ["Duplicate", Copy],
  ["Share", Share2],
  ["Delete", Trash2],
].map(([label, icon]) => ({ label: label as string, icon }));
function choose() {
  expanded.value = false;
}
</script>
<template>
  <MorphPopover v-model:open="expanded"
    ><MorphPopoverTrigger
      ><button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
      >
        Options<ChevronDown
          class="h-4 w-4 text-muted-foreground"
        /></button></MorphPopoverTrigger
    ><MorphPopoverContent align="start" class="w-48 p-1.5"
      ><button
        v-for="action in actions"
        :key="action.label"
        type="button"
        @click="choose"
        class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
      >
        <component :is="action.icon" class="h-4 w-4 text-muted-foreground" />{{
          action.label
        }}
      </button></MorphPopoverContent
    ></MorphPopover
  >
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Popover` | `v-model:open` | `boolean` | `update:open` |
| `MorphPopover` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Popover

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `trigger` | `"click" \| "hover"` | `"click"` | 否 | — |
| `side` | `"top" \| "bottom"` | `"bottom"` | 否 | — |
| `align` | `"start" \| "center" \| "end"` | `"center"` | 否 | — |
| `sideOffset` | `number` | `14` | 否 | — |
| `panelRadius` | `number` | `16` | 否 | — |
| `gooStrength` | `number` | `8` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `open: state.open.value` | — |

### PopoverTrigger

### PopoverContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphPopover

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `open: state.open.value` | — |

### MorphPopoverTrigger

### MorphPopoverContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom"` | `"bottom"` | 否 | — |
| `align` | `"start" \| "end"` | `"end"` | 否 | — |
| `sideOffset` | `number` | `8` | 否 | — |
| `radius` | `number` | `16` | 否 | — |
| `shadow` | `boolean` | `true` | 否 | — |
| `initialFocus` | `null \| HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | 否 | — |
| `onOpenAutoFocus` | `(content: HTMLDivElement) => void` | — | 否 | — |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Popover

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Popover？**

通过 open、defaultOpen、trigger、side、align、sideOffset、panelRadius、gooStrength、className 配置 Popover；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Morphing Modal](https://orvui.efu.me/components/motion/morphing-modal): 让对话框内容与高度一起变化，同时保持外层表面连续。
- [Drawer](https://orvui.efu.me/components/motion/drawer): 从视口左右一侧呈现对话框，并管理焦点与背景滚动。
- [Tooltip](https://orvui.efu.me/components/motion/tooltip): 在悬停或聚焦时显示简短说明，不挤动周围内容。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/popover.json
- 文档: https://orvui.efu.me/components/motion/popover
- `packages/vue/src/motion/popover/src/Popover.vue`
- `packages/vue/src/motion/popover/src/PopoverTrigger.vue`
- `packages/vue/src/motion/popover/src/PopoverContent.vue`
- `packages/vue/src/motion/popover/src/MorphPopover.vue`
- `packages/vue/src/motion/popover/src/MorphPopoverTrigger.vue`
- `packages/vue/src/motion/popover/src/MorphPopoverContent.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

