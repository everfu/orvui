---
title: "Image Viewer"
description: "从缩略图打开画廊图片，在大图中切换、缩放或平移。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/image-viewer"
markdown: "https://orvui.efu.me/components/motion/image-viewer.md"
license: "MIT"
productVersion: "0.1.0"
---

# Image Viewer

> 从缩略图打开画廊图片，在大图中切换、缩放或平移。

从缩略图打开画廊图片，在大图中切换、缩放或平移。

## 适用场景

- 当界面需要以下行为时使用 Image Viewer：从缩略图打开画廊图片，在大图中切换、缩放或平移。

## 安装

### Image Viewer — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/image-viewer.json
```

### Morphing — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-lightbox.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Image Viewer

**复制源码**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@/components/orvui/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@orvui/vue/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

### Morphing

把选中缩略图连接到完整画廊视图，支持切换图片、缩放与平移。

**复制源码**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@/components/orvui/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@orvui/vue/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

## API 参考

### ImageViewer

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `images` | `LightboxImage[]` | — | 是 | — |
| `modelValue` | `null \| string` | — | 否 | — |
| `value` | `null \| string` | — | 否 | — |
| `defaultValue` | `null \| string` | `null` | 否 | — |
| `label` | `string` | `"Image gallery"` | 否 | — |
| `thumbnailClassName` | `string` | — | 否 | — |
| `className` | `string` | — | 否 | — |
| `renderCaption` | `(image: LightboxImage) => VNodeChild` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `images: images`, `select: select` | — |

### ImageViewerGallery

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerThumbnail

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `imageId` | `string` | — | 是 | — |
| `imageClassName` | `string` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `image: image` | — |

### ImageViewerContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `header` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerCounter

### ImageViewerClose

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerPrevious

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerCaption

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `image: viewer.image.value` | — |

### ImageViewerNext

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Image Viewer

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Image Viewer？**

通过 images、modelValue、value、defaultValue、label、thumbnailClassName、className、renderCaption 配置 Image Viewer；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/image-viewer.json
- 文档: https://orvui.efu.me/components/motion/image-viewer
- `packages/vue/src/motion/image-viewer/src/ImageViewer.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerGallery.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerThumbnail.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerContent.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerCounter.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerClose.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerPrevious.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerCaption.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerNext.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
