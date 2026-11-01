---
title: "Animated Collapsible"
description: "将触发器与可展开区域连接，展开时保持周围布局连续。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/collapsible"
markdown: "https://orvui.efu.me/components/motion/collapsible.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Animated Collapsible

> 将触发器与可展开区域连接，展开时保持周围布局连续。

<a id="when-to-use"></a>

## 适用场景

- 用于按需展开补充说明，在保持阅读上下文的同时减少页面占用。

<a id="install"></a>
## 安装

### Animated Collapsible — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/collapsible.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Animated Collapsible

**复制源码**

```vue
<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/orvui/motion/collapsible";
const details = "Open this section whenever you need a little more information.";
</script>
<template>
  <Collapsible class="max-w-sm rounded-xl border border-border bg-background p-1">
    <CollapsibleTrigger>More details<CollapsibleIndicator /></CollapsibleTrigger>
    <CollapsibleContent content-class-name="px-3 pb-3 pt-1 text-sm leading-6 text-muted-foreground"><p>{{ details }}</p></CollapsibleContent>
  </Collapsible>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@orvui/vue/motion/collapsible";
const details = "Open this section whenever you need a little more information.";
</script>
<template>
  <Collapsible class="max-w-sm rounded-xl border border-border bg-background p-1">
    <CollapsibleTrigger>More details<CollapsibleIndicator /></CollapsibleTrigger>
    <CollapsibleContent content-class-name="px-3 pb-3 pt-1 text-sm leading-6 text-muted-foreground"><p>{{ details }}</p></CollapsibleContent>
  </Collapsible>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Collapsible` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Collapsible

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `open: opened`, `toggle: toggle` | — |

### CollapsibleContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `contentClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CollapsibleIndicator

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CollapsibleTrigger

<a id="about"></a>
## 关于 Animated Collapsible

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated Collapsible？**

通过 open、defaultOpen、disabled、contentClassName 配置 Animated Collapsible；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Expandable Control](https://orvui.efu.me/components/motion/expandable-control): 展开紧凑控件以显示标签或尾部操作，保持原位置联系。
- [Tooltip](https://orvui.efu.me/components/motion/tooltip): 在悬停或聚焦时显示简短说明，不挤动周围内容。
- [Aspect Ratio](https://orvui.efu.me/components/motion/aspect-ratio): 为媒体预留指定宽高比例，并在比例变化时平滑调整。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/collapsible.json
- 文档: https://orvui.efu.me/components/motion/collapsible
- `packages/vue/src/motion/collapsible/src/Collapsible.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleContent.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleIndicator.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleTrigger.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
