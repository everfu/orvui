---
title: "Animated Breadcrumb"
description: "展示层级中的当前位置，在空间有限时折叠中间链接。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/breadcrumb"
markdown: "https://orvui.efu.me/components/motion/breadcrumb.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Animated Breadcrumb

> 展示层级中的当前位置，在空间有限时折叠中间链接。

<a id="when-to-use"></a>

## 适用场景

- 用于具有层级关系的页面，帮助读者确认当前位置并返回上级页面。

<a id="install"></a>
## 安装

### Animated Breadcrumb — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/breadcrumb.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Animated Breadcrumb

**复制源码**

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { ArrowUpRight, Folder, Home } from "lucide-vue-next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/orvui/motion/breadcrumb";
const segments = "Workspace/Projects/Website/Design system/Components/Navigation/Breadcrumb".split("/");
const current = ref(5), root = ref<HTMLElement | null>(null);
async function navigate(index: number, event?: MouseEvent) {
  if (event && (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;
  event?.preventDefault(); current.value = index;
  await nextTick(); root.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
}
</script>
<template>
  <div ref="root" class="w-full max-w-lg space-y-8 px-4">
    <Breadcrumb class="min-h-[4.25rem] sm:min-h-8"><BreadcrumbList :max-items="3">
      <BreadcrumbItem v-for="(segment, index) in segments.slice(0, current + 1)" :key="segment">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbPage v-if="index === current" :tabindex="-1"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbPage>
        <BreadcrumbLink v-else :href="`#${segment.toLowerCase()}`" @click="navigate(index, $event)"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>
    <div class="min-h-20 border-t border-border/60 pt-5">
      <button v-if="current < segments.length - 1" type="button" @click="navigate(Math.min(current + 1, segments.length - 1))"
        class="flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-start text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Folder aria-hidden="true" class="size-4 text-muted-foreground" /><span class="flex-1">{{ segments[current + 1] }}</span><ArrowUpRight aria-hidden="true" class="size-3.5 text-muted-foreground" />
      </button>
      <p v-else class="py-3 text-center text-sm text-muted-foreground">Choose a parent path to go back.</p>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { ArrowUpRight, Folder, Home } from "lucide-vue-next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@orvui/vue/motion/breadcrumb";
const segments = "Workspace/Projects/Website/Design system/Components/Navigation/Breadcrumb".split("/");
const current = ref(5), root = ref<HTMLElement | null>(null);
async function navigate(index: number, event?: MouseEvent) {
  if (event && (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;
  event?.preventDefault(); current.value = index;
  await nextTick(); root.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
}
</script>
<template>
  <div ref="root" class="w-full max-w-lg space-y-8 px-4">
    <Breadcrumb class="min-h-[4.25rem] sm:min-h-8"><BreadcrumbList :max-items="3">
      <BreadcrumbItem v-for="(segment, index) in segments.slice(0, current + 1)" :key="segment">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbPage v-if="index === current" :tabindex="-1"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbPage>
        <BreadcrumbLink v-else :href="`#${segment.toLowerCase()}`" @click="navigate(index, $event)"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>
    <div class="min-h-20 border-t border-border/60 pt-5">
      <button v-if="current < segments.length - 1" type="button" @click="navigate(Math.min(current + 1, segments.length - 1))"
        class="flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-start text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Folder aria-hidden="true" class="size-4 text-muted-foreground" /><span class="flex-1">{{ segments[current + 1] }}</span><ArrowUpRight aria-hidden="true" class="size-3.5 text-muted-foreground" />
      </button>
      <p v-else class="py-3 text-center text-sm text-muted-foreground">Choose a parent path to go back.</p>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Breadcrumb

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Breadcrumb"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbItem

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbLink

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | 否 | — |
| `as` | `any` | `"a"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbList

### BreadcrumbPage

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### BreadcrumbSeparator

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbEllipsis

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Show hidden paths"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Animated Breadcrumb

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated Breadcrumb？**

通过 as 属性选择原生目标元素，并提供对应的链接属性。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Animated Context Menu](https://orvui.efu.me/components/motion/context-menu): 在指针位置打开菜单，并可组合复选项、单选项和子菜单。
- [Image Viewer](https://orvui.efu.me/components/motion/image-viewer): 从缩略图打开画廊图片，在大图中切换、缩放或平移。
- [Date Range Picker](https://orvui.efu.me/components/motion/date-range-picker): 在行内或浮动日历中选择日期区间的起点与终点。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/breadcrumb.json
- 文档: https://orvui.efu.me/components/motion/breadcrumb
- `packages/vue/src/motion/breadcrumb/src/Breadcrumb.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbItem.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbLink.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbList.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbPage.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbSeparator.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbEllipsis.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
