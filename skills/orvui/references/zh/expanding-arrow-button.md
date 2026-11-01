# Animated CTA Buttons · orvui 0.1.1

## 选择与组合

以明确操作为入口：普通操作使用 Button，需要持续按压或滑动确认时查看 CTA Buttons；紧凑工具栏可选择 Expandable Action Bar。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Animated CTA Buttons"
description: "通过展开箭头、持续按压或滑动手势确认操作。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/expanding-arrow-button"
markdown: "https://orvui.efu.me/components/motion/expanding-arrow-button.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Animated CTA Buttons

> 通过展开箭头、持续按压或滑动手势确认操作。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Animated CTA Buttons：通过展开箭头、持续按压或滑动手势确认操作。

<a id="install"></a>
## 安装

### Animated CTA Buttons — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expanding-arrow-button.json
```

### Expanding Arrow Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expanding-arrow-button.json
```

### Hold Action Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/hold-action-button.json
```

### Slide Action Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/slide-action-button.json
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

<a id="examples"></a>
## 用法

<a id="default"></a>
### Animated CTA Buttons

**复制源码**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@/components/orvui/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@orvui/vue/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

<a id="expanding-arrow"></a>
### Expanding Arrow Button

聚焦或悬停时展开强调色端部，并延伸点状箭头路径。

**复制源码**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@/components/orvui/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@orvui/vue/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

<a id="hold-action"></a>
### Hold Action Button

持续按压直到横向或纵向填充到达终点，提前松开可取消。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { HoldActionButton } from "@/components/orvui/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <HoldActionButton @hold-complete="feedback">Hold for vertical fill</HoldActionButton><HoldActionButton type="horizontal" @hold-complete="feedback">Hold for horizontal fill</HoldActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action confirmed" : "Release early to cancel" }}</p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { HoldActionButton } from "@orvui/vue/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <HoldActionButton @hold-complete="feedback">Hold for vertical fill</HoldActionButton><HoldActionButton type="horizontal" @hold-complete="feedback">Hold for horizontal fill</HoldActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action confirmed" : "Release early to cancel" }}</p>
  </div>
</template>
```

<a id="slide-action"></a>
### Slide Action Button

将手柄拖到终点以确认，未完成的手势会回弹且不提交。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SlideActionButton } from "@/components/orvui/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <SlideActionButton complete-label="Ready" @complete="feedback">Slide to continue</SlideActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action completed" : "Drag the arrow to the end" }}</p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SlideActionButton } from "@orvui/vue/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <SlideActionButton complete-label="Ready" @complete="feedback">Slide to continue</SlideActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action completed" : "Drag the arrow to the end" }}</p>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### ExpandingArrowButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |
| `accentClassName` | `string` | — | 否 | — |
| `labelClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### HoldActionButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `type` | `"vertical" \| "horizontal"` | `"vertical"` | 否 | — |
| `holdingLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Keep holding"` | 否 | — |
| `completeLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Done"` | 否 | — |
| `holdDuration` | `number` | `1600` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `fillClassName` | `string` | — | 否 | — |
| `labelClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `holdComplete` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |
| `holdingLabel` | `() => VNodeChild` | — | — |
| `completeLabel` | `() => VNodeChild` | — | — |

### SlideActionButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `completeLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Complete"` | 否 | — |
| `threshold` | `number` | `.82` | 否 | — |
| `resetDelay` | `number` | `1200` | 否 | — |
| `thumbClassName` | `string` | — | 否 | — |
| `fillClassName` | `string` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `complete` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |
| `completeLabel` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Animated CTA Buttons

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated CTA Buttons？**

通过 disabled、accentClassName、labelClassName 配置 Animated CTA Buttons；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Action Swap](https://orvui.efu.me/components/motion/action-swap): 使用模糊、滚动或错开过渡替换简短操作文字与图标。
- [Expandable Control](https://orvui.efu.me/components/motion/expandable-control): 展开紧凑控件以显示标签或尾部操作，保持原位置联系。
- [Card](https://orvui.efu.me/components/motion/card): 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/expanding-arrow-button.json
- 文档: https://orvui.efu.me/components/motion/expanding-arrow-button
- `packages/vue/src/motion/expanding-arrow-button/src/ExpandingArrowButton.vue`
- `packages/vue/src/motion/expanding-arrow-button/src/HoldActionButton.vue`
- `packages/vue/src/motion/expanding-arrow-button/src/SlideActionButton.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

