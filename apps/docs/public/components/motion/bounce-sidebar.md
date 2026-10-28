---
title: "Bounce Sidebar"
description: "在纵向列表中导航，活动标记沿弧线在行间移动。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/bounce-sidebar"
markdown: "https://orvui.efu.me/components/motion/bounce-sidebar.md"
license: "MIT"
productVersion: "0.1.0"
---

# Bounce Sidebar

> 在纵向列表中导航，活动标记沿弧线在行间移动。

在纵向列表中导航，活动标记沿弧线在行间移动。

## 适用场景

- 当界面需要以下行为时使用 Bounce Sidebar：在纵向列表中导航，活动标记沿弧线在行间移动。

## 安装

### Bounce Sidebar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bounce-sidebar.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Bounce Sidebar

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BounceSidebar } from "@/components/orvui/motion/bounce-sidebar";
const selected = ref("components");
const sections = ["Overview", "Components", "Motion", "Templates", "Changelog"].map(label => ({ id: label.toLowerCase(), label }));
</script>
<template><div class="flex min-h-[360px] w-full items-center justify-center"><BounceSidebar v-model="selected" :items="sections" aria-label="orvui sections" class="w-52" list-class-name="w-full" item-class-name="text-base" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BounceSidebar } from "@orvui/vue/motion/bounce-sidebar";
const selected = ref("components");
const sections = ["Overview", "Components", "Motion", "Templates", "Changelog"].map(label => ({ id: label.toLowerCase(), label }));
</script>
<template><div class="flex min-h-[360px] w-full items-center justify-center"><BounceSidebar v-model="selected" :items="sections" aria-label="orvui sections" class="w-52" list-class-name="w-full" item-class-name="text-base" /></div></template>
```

## API 参考

### BounceSidebar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `BounceSidebarItem[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `props.items[0]?.id` | 否 | — |
| `ariaLabel` | `string` | `"Sidebar navigation"` | 否 | — |
| `listClassName` | `string` | — | 否 | — |
| `itemClassName` | `string` | — | 否 | — |
| `indicatorClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `item` | — | `item: item`, `active: selected === item.id` | — |

## 关于 Bounce Sidebar

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Bounce Sidebar？**

通过 items、modelValue、defaultValue、ariaLabel、listClassName、itemClassName、indicatorClassName 配置 Bounce Sidebar；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/bounce-sidebar.json
- 文档: https://orvui.efu.me/components/motion/bounce-sidebar
- `packages/vue/src/motion/bounce-sidebar/src/BounceSidebar.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
