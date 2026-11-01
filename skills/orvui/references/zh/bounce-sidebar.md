# Bounce Sidebar · orvui 0.1.1

## 选择与组合

页面内相关视图使用 Tabs；页面层级使用 Breadcrumb；长文章定位使用 Table of Contents；跨功能区导航可使用 Animated Sidebar。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Bounce Sidebar"
description: "在纵向列表中导航，活动标记沿弧线在行间移动。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/bounce-sidebar"
markdown: "https://orvui.efu.me/components/motion/bounce-sidebar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Bounce Sidebar

> 在纵向列表中导航，活动标记沿弧线在行间移动。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Bounce Sidebar：在纵向列表中导航，活动标记沿弧线在行间移动。

<a id="install"></a>
## 安装

### Bounce Sidebar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bounce-sidebar.json
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `BounceSidebar` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Bounce Sidebar

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Bounce Sidebar？**

通过 items、modelValue、defaultValue、ariaLabel、listClassName、itemClassName、indicatorClassName 配置 Bounce Sidebar；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Radio Group](https://orvui.efu.me/components/motion/radio): 从带标签、支持键盘导航的选项组中选择一个值。
- [Animated Sidebar](https://orvui.efu.me/components/motion/animated-sidebar): 组合嵌套导航，支持展开、仅图标和移动抽屉等呈现方式。
- [Preview Rail](https://orvui.efu.me/components/motion/preview-rail): 在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/bounce-sidebar.json
- 文档: https://orvui.efu.me/components/motion/bounce-sidebar
- `packages/vue/src/motion/bounce-sidebar/src/BounceSidebar.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

