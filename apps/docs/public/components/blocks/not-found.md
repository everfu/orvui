---
title: "404 / Not Found"
description: "通过动态视觉呈现缺失目标，并提供返回有效内容的路径。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/not-found"
markdown: "https://orvui.efu.me/components/blocks/not-found.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# 404 / Not Found

> 通过动态视觉呈现缺失目标，并提供返回有效内容的路径。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 404 / Not Found：通过动态视觉呈现缺失目标，并提供返回有效内容的路径。

<a id="install"></a>
## 安装

### 404 / Not Found — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found.json
```

### Glitch — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-glitch.json
```

### Magnetic — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-magnetic.json
```

### Spotlight — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-spotlight.json
```

### Stacked — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-stacked.json
```

### Terminal — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/not-found-terminal.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### 404 / Not Found

**复制源码**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

<a id="glitch"></a>
### Glitch

让不稳定的字符显示解析为页面缺失状态码。

**复制源码**

```vue
<script setup lang="ts">
import { NotFoundGlitch } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundGlitch v-bind="navigation" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { NotFoundGlitch } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundGlitch v-bind="navigation" /></div>
</template>
```

<a id="magnetic"></a>
### Magnetic

让各状态数字跟随附近的指针移动，再回到原位。

**复制源码**

```vue
<script setup lang="ts">
import { NotFoundMagnetic } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundMagnetic v-bind="navigation" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { NotFoundMagnetic } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundMagnetic v-bind="navigation" /></div>
</template>
```

<a id="spotlight"></a>
### Spotlight

在深色表面上，用跟随指针的光照显示状态码。

**复制源码**

```vue
<script setup lang="ts">
import { NotFoundSpotlight } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundSpotlight v-bind="navigation" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { NotFoundSpotlight } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundSpotlight v-bind="navigation" /></div>
</template>
```

<a id="stacked"></a>
### Stacked

悬停或聚焦时，让状态面板下方的卡片扇形展开。

**复制源码**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { NotFoundStacked } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
```

<a id="terminal"></a>
### Terminal

在终端式表面内逐字输入失败的导航命令与状态码。

**复制源码**

```vue
<script setup lang="ts">
import { NotFoundTerminal } from "@/components/orvui/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundTerminal v-bind="navigation" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { NotFoundTerminal } from "@orvui/vue/blocks/not-found";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundTerminal v-bind="navigation" /></div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### NotFoundStacked

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 否 | — |
| `title` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `homeHref` | `string` | — | 否 | — |
| `homeLabel` | `string` | — | 否 | — |
| `browseHref` | `string` | — | 否 | — |
| `browseLabel` | `string` | — | 否 | — |

### NotFoundStage

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### NotFoundActions

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `browseLabel` | `string` | `NOT_FOUND_DEFAULTS.browseLabel` | 否 | — |
| `homeHref` | `string` | `NOT_FOUND_DEFAULTS.homeHref` | 否 | — |
| `homeLabel` | `string` | `NOT_FOUND_DEFAULTS.homeLabel` | 否 | — |
| `browseHref` | `string` | `NOT_FOUND_DEFAULTS.browseHref` | 否 | — |

### NotFoundGlitch

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 否 | — |
| `title` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `homeHref` | `string` | — | 否 | — |
| `homeLabel` | `string` | — | 否 | — |
| `browseHref` | `string` | — | 否 | — |
| `browseLabel` | `string` | — | 否 | — |

### NotFoundMagnetic

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 否 | — |
| `title` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `homeHref` | `string` | — | 否 | — |
| `homeLabel` | `string` | — | 否 | — |
| `browseHref` | `string` | — | 否 | — |
| `browseLabel` | `string` | — | 否 | — |

### NotFoundSpotlight

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 否 | — |
| `title` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `homeHref` | `string` | — | 否 | — |
| `homeLabel` | `string` | — | 否 | — |
| `browseHref` | `string` | — | 否 | — |
| `browseLabel` | `string` | — | 否 | — |

### NotFoundTerminal

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 否 | — |
| `title` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `homeHref` | `string` | — | 否 | — |
| `homeLabel` | `string` | — | 否 | — |
| `browseHref` | `string` | — | 否 | — |
| `browseLabel` | `string` | — | 否 | — |

<a id="about"></a>
## 关于 404 / Not Found

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 404 / Not Found？**

通过 code、title、description、homeHref、homeLabel、browseHref、browseLabel 配置 404 / Not Found；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Dynamic Island](https://orvui.efu.me/components/blocks/dynamic-island): 在多个实时活动视图间切换紧凑胶囊，保持对象身份连续。
- [Swipeable List](https://orvui.efu.me/components/blocks/swipeable-list): 通过指针或键盘输入，展示列表行左右两侧的操作。
- [Fixtures](https://orvui.efu.me/components/blocks/knockout-bracket): 浏览淘汰赛轮次或径向赛程，并查看队伍与比赛元数据。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/not-found.json
- 文档: https://orvui.efu.me/components/blocks/not-found
- `packages/vue/src/blocks/not-found/src/NotFoundStacked.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundStage.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundActions.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundGlitch.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundMagnetic.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundSpotlight.vue`
- `packages/vue/src/blocks/not-found/src/NotFoundTerminal.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
