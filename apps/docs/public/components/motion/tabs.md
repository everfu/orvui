---
title: "Tabs"
description: "通过移动指示器和可访问的标签控件切换对应面板。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/tabs"
markdown: "https://orvui.efu.me/components/motion/tabs.md"
license: "MIT"
productVersion: "0.1.0"
---

# Tabs

> 通过移动指示器和可访问的标签控件切换对应面板。

通过移动指示器和可访问的标签控件切换对应面板。

## 适用场景

- 当界面需要以下行为时使用 Tabs：通过移动指示器和可访问的标签控件切换对应面板。

## 安装

### Tabs — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tabs.json
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

## 用法

### Tabs

**复制源码**

```vue
<script setup lang="ts">
import { BarChart3, Bell, Home } from "lucide-vue-next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/orvui/motion/tabs";
const sections = [{ value: "overview", label: "Overview", content: "High-level summary." }, { value: "activity", label: "Activity", content: "Recent events." }, { value: "settings", label: "Settings", content: "Preferences." }];
const icons = [{ value: "home", text: "Home", icon: Home }, { value: "stats", text: "Stats", icon: BarChart3 }, { value: "alerts", text: "Alerts", icon: Bell }];
</script>
<template><div class="flex w-full max-w-md flex-col gap-8"><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pill</span><Tabs default-value="overview" variant="pill"><TabsList><TabsTrigger v-for="section in sections" :key="section.value" :value="section.value">{{ section.label }}</TabsTrigger></TabsList><TabsContent v-for="section in sections" :key="section.value" :value="section.value" class="text-sm text-muted-foreground">{{ section.content }}</TabsContent></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Overflow</span><Tabs default-value="Overview" class="w-full max-w-xs"><TabsList><TabsTrigger v-for="label in ['Overview', 'Activity', 'Analytics', 'Members', 'Billing', 'Settings']" :key="label" :value="label">{{ label }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Segment</span><Tabs default-value="day" variant="segment"><TabsList><TabsTrigger v-for="value in ['day', 'week', 'month']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Icon on selected</span><Tabs default-value="home" variant="pill" icons="selected"><TabsList><TabsTrigger v-for="entry in icons" :key="entry.value" :value="entry.value"><template #icon><component :is="entry.icon" class="size-3.5" /></template>{{ entry.text }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Underline</span><Tabs default-value="all" variant="underline"><TabsList><TabsTrigger v-for="value in ['all', 'open', 'closed']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { BarChart3, Bell, Home } from "lucide-vue-next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@orvui/vue/motion/tabs";
const sections = [{ value: "overview", label: "Overview", content: "High-level summary." }, { value: "activity", label: "Activity", content: "Recent events." }, { value: "settings", label: "Settings", content: "Preferences." }];
const icons = [{ value: "home", text: "Home", icon: Home }, { value: "stats", text: "Stats", icon: BarChart3 }, { value: "alerts", text: "Alerts", icon: Bell }];
</script>
<template><div class="flex w-full max-w-md flex-col gap-8"><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pill</span><Tabs default-value="overview" variant="pill"><TabsList><TabsTrigger v-for="section in sections" :key="section.value" :value="section.value">{{ section.label }}</TabsTrigger></TabsList><TabsContent v-for="section in sections" :key="section.value" :value="section.value" class="text-sm text-muted-foreground">{{ section.content }}</TabsContent></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Overflow</span><Tabs default-value="Overview" class="w-full max-w-xs"><TabsList><TabsTrigger v-for="label in ['Overview', 'Activity', 'Analytics', 'Members', 'Billing', 'Settings']" :key="label" :value="label">{{ label }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Segment</span><Tabs default-value="day" variant="segment"><TabsList><TabsTrigger v-for="value in ['day', 'week', 'month']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Icon on selected</span><Tabs default-value="home" variant="pill" icons="selected"><TabsList><TabsTrigger v-for="entry in icons" :key="entry.value" :value="entry.value"><template #icon><component :is="entry.icon" class="size-3.5" /></template>{{ entry.text }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Underline</span><Tabs default-value="all" variant="underline"><TabsList><TabsTrigger v-for="value in ['all', 'open', 'closed']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div></div></template>
```

## API 参考

### Tabs

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `""` | 否 | — |
| `variant` | `"pill" \| "underline" \| "segment"` | `"pill"` | 否 | — |
| `icons` | `"always" \| "selected"` | `"always"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TabsList

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `wrapperClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TabsTrigger

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `icon` | `any` | — | 否 | — |
| `indicatorClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### TabsContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `forceMount` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Tabs

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Tabs？**

通过 modelValue、defaultValue、variant、icons 配置 Tabs；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/tabs.json
- 文档: https://orvui.efu.me/components/motion/tabs
- `packages/vue/src/motion/tabs/src/Tabs.vue`
- `packages/vue/src/motion/tabs/src/TabsList.vue`
- `packages/vue/src/motion/tabs/src/TabsTrigger.vue`
- `packages/vue/src/motion/tabs/src/TabsContent.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
