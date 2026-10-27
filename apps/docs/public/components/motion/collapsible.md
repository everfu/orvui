---
title: "Animated Collapsible"
description: "将触发器与可展开区域连接，展开时保持周围布局连续。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/collapsible"
markdown: "https://orvui.efu.me/components/motion/collapsible.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Collapsible

> 将触发器与可展开区域连接，展开时保持周围布局连续。

## 安装

### Animated Collapsible — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/collapsible.json
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

## 关于 Animated Collapsible

将触发器与可展开区域连接，展开时保持周围布局连续。

### 适用场景

- 当界面需要以下行为时使用 Animated Collapsible：将触发器与可展开区域连接，展开时保持周围布局连续。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Animated Collapsible？**

通过 open、defaultOpen、disabled、contentClassName 配置 Animated Collapsible；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/collapsible.json
- 文档: https://orvui.efu.me/components/motion/collapsible
- `packages/vue/src/motion/collapsible/src/Collapsible.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleContent.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleIndicator.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleTrigger.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
