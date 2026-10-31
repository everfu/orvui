---
title: "Dock"
description: "将紧凑导航操作分组，由指示器跟随当前活动项目。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/dock"
markdown: "https://orvui.efu.me/components/motion/dock.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Dock

> 将紧凑导航操作分组，由指示器跟随当前活动项目。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Dock：将紧凑导航操作分组，由指示器跟随当前活动项目。

<a id="install"></a>
## 安装

### Dock — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/dock.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Dock

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Calendar, Home, Mail, Music, Settings, Sparkles } from "lucide-vue-next";
import { Dock, DockItem, DockSeparator } from "@/components/orvui/motion/dock";
const selected = ref("home");
const destinations = [
  { id: "home", icon: Home, label: "Home" }, { id: "mail", icon: Mail, label: "Mail" },
  { id: "calendar", icon: Calendar, label: "Calendar" }, { id: "music", icon: Music, label: "Music" },
  { id: "discover", icon: Sparkles, label: "Discover" },
];
// Simple Icons 16.35.0, distributed by @iconify-json/simple-icons 1.2.100; CC0-1.0.
const githubPath = "M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
</script>
<template><div class="w-full overflow-x-auto py-8"><div class="flex min-w-max justify-center px-2"><Dock>
  <DockItem v-for="destination in destinations" :key="destination.id" :aria-label="destination.label" :active="selected === destination.id" @click="selected = destination.id"><component :is="destination.icon" class="h-5 w-5" /></DockItem>
  <DockSeparator /><DockItem aria-label="Settings" :active="selected === 'settings'" @click="selected = 'settings'"><Settings class="h-5 w-5" /></DockItem>
  <DockItem aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5"><path :d="githubPath" /></svg></DockItem>
</Dock></div></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Calendar, Home, Mail, Music, Settings, Sparkles } from "lucide-vue-next";
import { Dock, DockItem, DockSeparator } from "@orvui/vue/motion/dock";
const selected = ref("home");
const destinations = [
  { id: "home", icon: Home, label: "Home" }, { id: "mail", icon: Mail, label: "Mail" },
  { id: "calendar", icon: Calendar, label: "Calendar" }, { id: "music", icon: Music, label: "Music" },
  { id: "discover", icon: Sparkles, label: "Discover" },
];
// Simple Icons 16.35.0, distributed by @iconify-json/simple-icons 1.2.100; CC0-1.0.
const githubPath = "M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
</script>
<template><div class="w-full overflow-x-auto py-8"><div class="flex min-w-max justify-center px-2"><Dock>
  <DockItem v-for="destination in destinations" :key="destination.id" :aria-label="destination.label" :active="selected === destination.id" @click="selected = destination.id"><component :is="destination.icon" class="h-5 w-5" /></DockItem>
  <DockSeparator /><DockItem aria-label="Settings" :active="selected === 'settings'" @click="selected = 'settings'"><Settings class="h-5 w-5" /></DockItem>
  <DockItem aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5"><path :d="githubPath" /></svg></DockItem>
</Dock></div></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Dock

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `number` | `44` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DockItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `active` | `boolean` | `false` | 否 | — |
| `as` | `"div" \| "button"` | — | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `click` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DockSeparator

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Dock

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Dock？**

通过 size 配置 Dock；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Tabs](https://orvui.efu.me/components/motion/tabs): 通过移动指示器和可访问的标签控件切换对应面板。
- [Shared Layout Background](https://orvui.efu.me/components/motion/shared-layout-bg): 在注册选项之间移动同一个背景表面，表示当前选择。
- [Preview Rail](https://orvui.efu.me/components/motion/preview-rail): 在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/dock.json
- 文档: https://orvui.efu.me/components/motion/dock
- `packages/vue/src/motion/dock/src/Dock.vue`
- `packages/vue/src/motion/dock/src/DockItem.vue`
- `packages/vue/src/motion/dock/src/DockSeparator.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
