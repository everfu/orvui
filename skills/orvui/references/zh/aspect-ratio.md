# Aspect Ratio · orvui 0.1.1

## 选择与组合

先确定内容结构：表格数据使用 Table，层级文件用 File Tree，可展开补充内容用 Collapsible；多个互斥折叠项使用 Bouncy Accordion。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Aspect Ratio"
description: "为媒体预留指定宽高比例，并在比例变化时平滑调整。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/aspect-ratio"
markdown: "https://orvui.efu.me/components/motion/aspect-ratio.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Aspect Ratio

> 为媒体预留指定宽高比例，并在比例变化时平滑调整。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Aspect Ratio：为媒体预留指定宽高比例，并在比例变化时平滑调整。

<a id="install"></a>
## 安装

### Aspect Ratio — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/aspect-ratio.json https://orvui.efu.me/r/tabs.json
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Aspect Ratio

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { AspectRatio, AspectRatioImage } from "@/components/orvui/motion/aspect-ratio";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
const labels = ["21:9", "16:9", "3:2", "4:3", "1:1", "4:5", "3:4", "2:3", "9:16"];
const selected = ref("16:9"), id = useId();
const ratio = computed(() => { const [width, height] = selected.value.split(":").map(Number); return width! / height!; });
const panelId = `${id}-preview`;
</script>
<template>
  <div class="mx-auto w-full max-w-xl min-w-0 px-4 py-6"><Tabs v-model="selected">
    <TabsList aria-label="Aspect ratio" class="mx-auto bg-muted"><TabsTrigger v-for="label in labels" :key="label" :value="label"
      :id="`${id}-${label}`" :aria-controls="panelId" :tabindex="selected === label ? 0 : -1" indicator-class-name="bg-background"
      class="min-h-9 px-3 text-xs [&_[data-tabs-label]]:text-foreground">{{ label }}</TabsTrigger></TabsList>
    <div :id="panelId" role="tabpanel" :aria-labelledby="`${id}-${selected}`" :tabindex="0"
      class="mt-6 flex h-[25rem] w-full items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <AspectRatio :ratio="ratio" class="bg-muted" :style="{ maxWidth: `${Math.min(440, 360 * ratio)}px`, borderRadius: '16px' }">
        <AspectRatioImage src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80"
          alt="A lakeside cabin beneath mountains, reflected in the water" :width="1000" :height="667" />
      </AspectRatio>
    </div>
  </Tabs></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { AspectRatio, AspectRatioImage } from "@orvui/vue/motion/aspect-ratio";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
const labels = ["21:9", "16:9", "3:2", "4:3", "1:1", "4:5", "3:4", "2:3", "9:16"];
const selected = ref("16:9"), id = useId();
const ratio = computed(() => { const [width, height] = selected.value.split(":").map(Number); return width! / height!; });
const panelId = `${id}-preview`;
</script>
<template>
  <div class="mx-auto w-full max-w-xl min-w-0 px-4 py-6"><Tabs v-model="selected">
    <TabsList aria-label="Aspect ratio" class="mx-auto bg-muted"><TabsTrigger v-for="label in labels" :key="label" :value="label"
      :id="`${id}-${label}`" :aria-controls="panelId" :tabindex="selected === label ? 0 : -1" indicator-class-name="bg-background"
      class="min-h-9 px-3 text-xs [&_[data-tabs-label]]:text-foreground">{{ label }}</TabsTrigger></TabsList>
    <div :id="panelId" role="tabpanel" :aria-labelledby="`${id}-${selected}`" :tabindex="0"
      class="mt-6 flex h-[25rem] w-full items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <AspectRatio :ratio="ratio" class="bg-muted" :style="{ maxWidth: `${Math.min(440, 360 * ratio)}px`, borderRadius: '16px' }">
        <AspectRatioImage src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80"
          alt="A lakeside cabin beneath mountains, reflected in the water" :width="1000" :height="667" />
      </AspectRatio>
    </div>
  </Tabs></div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### AspectRatio

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `ratio` | `number` | `1` | 否 | — |
| `animated` | `boolean` | `true` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AspectRatioImage

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `width` | `number` | — | 是 | — |
| `height` | `number` | — | 是 | — |
| `alt` | `string` | — | 是 | — |
| `src` | `string` | — | 是 | — |
| `draggable` | `boolean` | `false` | 否 | — |

<a id="about"></a>
## 关于 Aspect Ratio

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Aspect Ratio？**

绑定数值比例，例如 :ratio="16 / 9"，并在默认插槽放入媒体。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Animated Alert](https://orvui.efu.me/components/motion/alert): 用紧凑消息行呈现反馈，可加入操作并允许关闭。
- [Arc Picker](https://orvui.efu.me/components/motion/arc-picker): 通过手势或键盘让弧形标签列表穿过固定选择点。
- [Image Viewer](https://orvui.efu.me/components/motion/image-viewer): 从缩略图打开画廊图片，在大图中切换、缩放或平移。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/aspect-ratio.json
- 文档: https://orvui.efu.me/components/motion/aspect-ratio
- `packages/vue/src/motion/aspect-ratio/src/AspectRatio.vue`
- `packages/vue/src/motion/aspect-ratio/src/AspectRatioImage.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

