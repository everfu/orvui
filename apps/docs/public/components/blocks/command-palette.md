---
title: "Command Palette"
description: "在支持键盘操作的搜索面板中查找并执行分组命令。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/command-palette"
markdown: "https://orvui.efu.me/components/blocks/command-palette.md"
license: "MIT"
productVersion: "0.1.0"
---

# Command Palette

> 在支持键盘操作的搜索面板中查找并执行分组命令。

## 安装

### Command Palette — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/command-palette.json
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

### Command Palette

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FileText, Home, Plus, Settings, User } from "lucide-vue-next";
import { CommandPalette } from "@/components/orvui/blocks/command-palette";
const open = ref(false);
const items = [
  {
    id: "home",
    label: "Go to Home",
    group: "Navigation",
    icon: Home,
    hint: "G H",
  },
  {
    id: "profile",
    label: "Open profile",
    group: "Navigation",
    icon: User,
    hint: "G P",
  },
  { id: "settings", label: "Settings", group: "Navigation", icon: Settings },
  {
    id: "new-doc",
    label: "Create document",
    group: "Actions",
    icon: FileText,
    hint: "⌘ N",
  },
  {
    id: "new-project",
    label: "New project",
    group: "Actions",
    icon: Plus,
    hint: "⌘ ⇧ N",
  },
];
</script>
<template>
  <div class="flex flex-col items-start gap-3">
    <button
      type="button"
      @click="open = true"
      class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)"
    >
      Open command palette
    </button>
    <p class="text-sm text-muted-foreground">
      Press
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >⌘ J</kbd
      >
      (or
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >Ctrl J</kbd
      >) to open.
    </p>
    <CommandPalette v-model:open="open" shortcut="j" :items="items" />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FileText, Home, Plus, Settings, User } from "lucide-vue-next";
import { CommandPalette } from "@orvui/vue/blocks/command-palette";
const open = ref(false);
const items = [
  {
    id: "home",
    label: "Go to Home",
    group: "Navigation",
    icon: Home,
    hint: "G H",
  },
  {
    id: "profile",
    label: "Open profile",
    group: "Navigation",
    icon: User,
    hint: "G P",
  },
  { id: "settings", label: "Settings", group: "Navigation", icon: Settings },
  {
    id: "new-doc",
    label: "Create document",
    group: "Actions",
    icon: FileText,
    hint: "⌘ N",
  },
  {
    id: "new-project",
    label: "New project",
    group: "Actions",
    icon: Plus,
    hint: "⌘ ⇧ N",
  },
];
</script>
<template>
  <div class="flex flex-col items-start gap-3">
    <button
      type="button"
      @click="open = true"
      class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)"
    >
      Open command palette
    </button>
    <p class="text-sm text-muted-foreground">
      Press
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >⌘ J</kbd
      >
      (or
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >Ctrl J</kbd
      >) to open.
    </p>
    <CommandPalette v-model:open="open" shortcut="j" :items="items" />
  </div>
</template>
```

## API 参考

### CommandPalette

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `CommandItem[]` | — | 是 | — |
| `shortcut` | `string` | `"k"` | 否 | — |
| `placeholder` | `string` | `"Type a command or search…"` | 否 | — |
| `emptyMessage` | `string` | `"No results found."` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `select` | `[item: CommandItem]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `trigger` | — | `open: () => (open = true)` | — |

## 关于 Command Palette

在支持键盘操作的搜索面板中查找并执行分组命令。

### 适用场景

- 当界面需要以下行为时使用 Command Palette：在支持键盘操作的搜索面板中查找并执行分组命令。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Command Palette？**

通过 items、shortcut、placeholder、emptyMessage、open、defaultOpen 配置 Command Palette；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange、select，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/command-palette.json
- 文档: https://orvui.efu.me/components/blocks/command-palette
- `packages/vue/src/blocks/command-palette/src/CommandPalette.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
