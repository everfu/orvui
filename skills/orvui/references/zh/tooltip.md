# Tooltip · orvui 0.1.1

## 选择与组合

简短非交互提示使用 Tooltip，触发器附近的内容使用 Popover；需要聚焦完成任务时使用 Modal、Drawer 或移动端 Bottom Sheet。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Tooltip"
description: "在悬停或聚焦时显示简短说明，不挤动周围内容。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/tooltip"
markdown: "https://orvui.efu.me/components/motion/tooltip.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Tooltip

> 在悬停或聚焦时显示简短说明，不挤动周围内容。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Tooltip：在悬停或聚焦时显示简短说明，不挤动周围内容。

<a id="install"></a>
## 安装

### Tooltip — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tooltip.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Tooltip — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tooltip.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Toolbar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tooltip.json
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

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Tooltip

**复制源码**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@/components/orvui/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@orvui/vue/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

<a id="default"></a>
### Tooltip

为单个触发器提供简短标签，并选择显示方向与箭头。

**复制源码**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@/components/orvui/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@orvui/vue/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

<a id="toolbar"></a>
### Toolbar

在工具栏提示之间共享时序，并为仅图标控件提供名称。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Bold, Italic, Link2, Strikethrough, Underline } from "lucide-vue-next";
import { cn } from "@/components/orvui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/orvui/motion/tooltip";
const selected = ref(new Set(["bold"]));
const actions = [
  { id: "bold", label: "Bold", shortcut: "⌘B", keys: "Meta+B", icon: Bold },
  {
    id: "italic",
    label: "Italic",
    shortcut: "⌘I",
    keys: "Meta+I",
    icon: Italic,
  },
  {
    id: "underline",
    label: "Underline",
    shortcut: "⌘U",
    keys: "Meta+U",
    icon: Underline,
  },
  {
    id: "strike",
    label: "Strikethrough",
    shortcut: "⌘⇧X",
    keys: "Meta+Shift+X",
    icon: Strikethrough,
  },
];
function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}
</script>
<template>
  <TooltipProvider :delay="300" :skip-delay="400"
    ><div class="flex w-full flex-col items-center gap-8 py-6">
      <div
        class="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
      >
        <Tooltip v-for="action in actions" :key="action.id" as-label
          ><TooltipTrigger
            :aria-pressed="selected.has(action.id)"
            :aria-keyshortcuts="action.keys"
            :class="
              cn(
                'grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                selected.has(action.id) && 'bg-muted text-foreground',
              )
            "
            @click="toggle(action.id)"
            ><component
              :is="action.icon"
              aria-hidden="true"
              class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" arrow
            ><span class="flex items-center gap-2"
              >{{ action.label
              }}<span
                aria-hidden="true"
                class="text-[10px] text-muted-foreground"
                >{{ action.shortcut }}</span
              ></span
            ></TooltipContent
          ></Tooltip
        ><span aria-hidden="true" class="mx-1 h-5 w-px bg-border" /><Tooltip
          as-label
          :disabled="selected.size === 0"
          ><TooltipTrigger
            :disabled="selected.size === 0"
            class="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            ><Link2 aria-hidden="true" class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" align="end" arrow
            >Insert link</TooltipContent
          ></Tooltip
        >
      </div>
      <p class="max-w-xs text-center text-xs text-muted-foreground">
        The first label waits, the next ones open instantly. Click hides it
        until the pointer leaves.
      </p>
    </div></TooltipProvider
  >
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Bold, Italic, Link2, Strikethrough, Underline } from "lucide-vue-next";
import { cn } from "@orvui/vue";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@orvui/vue/motion/tooltip";
const selected = ref(new Set(["bold"]));
const actions = [
  { id: "bold", label: "Bold", shortcut: "⌘B", keys: "Meta+B", icon: Bold },
  {
    id: "italic",
    label: "Italic",
    shortcut: "⌘I",
    keys: "Meta+I",
    icon: Italic,
  },
  {
    id: "underline",
    label: "Underline",
    shortcut: "⌘U",
    keys: "Meta+U",
    icon: Underline,
  },
  {
    id: "strike",
    label: "Strikethrough",
    shortcut: "⌘⇧X",
    keys: "Meta+Shift+X",
    icon: Strikethrough,
  },
];
function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}
</script>
<template>
  <TooltipProvider :delay="300" :skip-delay="400"
    ><div class="flex w-full flex-col items-center gap-8 py-6">
      <div
        class="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
      >
        <Tooltip v-for="action in actions" :key="action.id" as-label
          ><TooltipTrigger
            :aria-pressed="selected.has(action.id)"
            :aria-keyshortcuts="action.keys"
            :class="
              cn(
                'grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                selected.has(action.id) && 'bg-muted text-foreground',
              )
            "
            @click="toggle(action.id)"
            ><component
              :is="action.icon"
              aria-hidden="true"
              class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" arrow
            ><span class="flex items-center gap-2"
              >{{ action.label
              }}<span
                aria-hidden="true"
                class="text-[10px] text-muted-foreground"
                >{{ action.shortcut }}</span
              ></span
            ></TooltipContent
          ></Tooltip
        ><span aria-hidden="true" class="mx-1 h-5 w-px bg-border" /><Tooltip
          as-label
          :disabled="selected.size === 0"
          ><TooltipTrigger
            :disabled="selected.size === 0"
            class="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            ><Link2 aria-hidden="true" class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" align="end" arrow
            >Insert link</TooltipContent
          ></Tooltip
        >
      </div>
      <p class="max-w-xs text-center text-xs text-muted-foreground">
        The first label waits, the next ones open instantly. Click hides it
        until the pointer leaves.
      </p>
    </div></TooltipProvider
  >
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Tooltip` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Tooltip

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren` | `undefined` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `delay` | `number` | `timing.value.delay` | 否 | — |
| `closeDelay` | `number` | `timing.value.closeDelay` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `asLabel` | `boolean` | `false` | 否 | — |
| `followCursor` | `boolean` | `false` | 否 | — |
| `anchorRef` | `null \| HTMLElement \| SVGElement \| Ref<TooltipAnchor \| null, TooltipAnchor \| null>` | — | 否 | — |
| `id` | `string` | `useId()` | 否 | — |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | — | 否 | — |
| `align` | `"start" \| "center" \| "end"` | — | 否 | — |
| `sideOffset` | `number` | — | 否 | — |
| `arrow` | `boolean` | `false` | 否 | — |
| `anchorPoint` | `TooltipPoint` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TooltipTrigger

### TooltipContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 否 | — |
| `align` | `"start" \| "center" \| "end"` | `"center"` | 否 | — |
| `sideOffset` | `number` | `(point ? 12 : 8)` | 否 | — |
| `arrow` | `boolean` | `false` | 否 | — |
| `anchorPoint` | `TooltipPoint` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TooltipProvider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `delay` | `number` | `inherited.value.delay` | 否 | — |
| `closeDelay` | `number` | `inherited.value.closeDelay` | 否 | — |
| `skipDelay` | `number` | `props.skipDelayDuration` | 否 | — |
| `skipDelayDuration` | `number` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Tooltip

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Tooltip？**

通过 content、open、defaultOpen、delay、closeDelay、disabled、asLabel、followCursor、anchorRef、id、side、align、sideOffset、arrow、anchorPoint 配置 Tooltip；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Popover](https://orvui.efu.me/components/motion/popover): 将浮动表面连接到触发器，支持常规过渡与连续变形过渡。
- [Morphing Modal](https://orvui.efu.me/components/motion/morphing-modal): 让对话框内容与高度一起变化，同时保持外层表面连续。
- [Drawer](https://orvui.efu.me/components/motion/drawer): 从视口左右一侧呈现对话框，并管理焦点与背景滚动。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/tooltip.json
- 文档: https://orvui.efu.me/components/motion/tooltip
- `packages/vue/src/motion/tooltip/src/Tooltip.vue`
- `packages/vue/src/motion/tooltip/src/TooltipTrigger.vue`
- `packages/vue/src/motion/tooltip/src/TooltipContent.vue`
- `packages/vue/src/motion/tooltip/src/TooltipProvider.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

