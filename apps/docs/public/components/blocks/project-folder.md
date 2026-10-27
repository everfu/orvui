---
title: "Project Folder"
description: "扇形展开文档预览，并将选中文件夹展开为聚焦表面。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/project-folder"
markdown: "https://orvui.efu.me/components/blocks/project-folder.md"
license: "MIT"
productVersion: "0.1.0"
---

# Project Folder

> 扇形展开文档预览，并将选中文件夹展开为聚焦表面。

## 安装

### Project Folder — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/project-folder.json
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

### Project Folder

**复制源码**

```vue
<script setup lang="ts">
import { h } from "vue";
import { ProjectFolder } from "@/components/orvui/blocks/project-folder";
const sheets = [
  ["emerald", "#a7f3d0"],
  ["orange", "#fed7aa"],
  ["sky", "#bae6fd"],
  ["violet", "#ddd6fe"],
  ["amber", "#fef3c7"],
];
const previews = sheets.map(([id, background], index) => ({
  id,
  content: h(
    "span",
    { class: "relative block h-full w-full", style: { background } },
    [
      h("span", {
        class: "absolute left-3 top-3 h-2 w-8 rounded-full bg-black/15",
      }),
      ...["top-8", "top-11"].map((top) =>
        h("span", { class: `absolute inset-x-3 ${top} h-px bg-black/10` }),
      ),
      h(
        "span",
        {
          class: "absolute bottom-3 right-3 text-sm font-medium text-black/50",
        },
        String.fromCharCode(65 + index),
      ),
    ],
  ),
}));
</script>
<template>
  <div class="flex min-h-80 w-full items-center justify-center px-6 py-10">
    <ProjectFolder
      title="Brand direction"
      description="Updated recently"
      :count="5"
      :previews="previews"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h } from "vue";
import { ProjectFolder } from "@orvui/vue/blocks/project-folder";
const sheets = [
  ["emerald", "#a7f3d0"],
  ["orange", "#fed7aa"],
  ["sky", "#bae6fd"],
  ["violet", "#ddd6fe"],
  ["amber", "#fef3c7"],
];
const previews = sheets.map(([id, background], index) => ({
  id,
  content: h(
    "span",
    { class: "relative block h-full w-full", style: { background } },
    [
      h("span", {
        class: "absolute left-3 top-3 h-2 w-8 rounded-full bg-black/15",
      }),
      ...["top-8", "top-11"].map((top) =>
        h("span", { class: `absolute inset-x-3 ${top} h-px bg-black/10` }),
      ),
      h(
        "span",
        {
          class: "absolute bottom-3 right-3 text-sm font-medium text-black/50",
        },
        String.fromCharCode(65 + index),
      ),
    ],
  ),
}));
</script>
<template>
  <div class="flex min-h-80 w-full items-center justify-center px-6 py-10">
    <ProjectFolder
      title="Brand direction"
      description="Updated recently"
      :count="5"
      :previews="previews"
    />
  </div>
</template>
```

## API 参考

### ProjectFolder

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | 是 | — |
| `description` | `string` | `"Updated recently"` | 否 | — |
| `previews` | `ProjectFolderPreview[]` | `() => []` | 否 | — |
| `count` | `number` | `props.previews.length` | 否 | — |
| `itemLabel` | `string` | `"file"` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `expanded` | `boolean` | `undefined` | 否 | — |
| `defaultExpanded` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `update:expanded` | `[expanded: boolean]` | — |
| `expandedChange` | `[expanded: boolean]` | — |
| `click` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `preview` | — | `preview: preview` | — |

## 关于 Project Folder

扇形展开文档预览，并将选中文件夹展开为聚焦表面。

### 适用场景

- 当界面需要以下行为时使用 Project Folder：扇形展开文档预览，并将选中文件夹展开为聚焦表面。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Project Folder？**

通过 title、description、previews、count、itemLabel、open、defaultOpen、expanded、defaultExpanded、disabled、ariaLabel 配置 Project Folder；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange、update:expanded、expandedChange、click，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/project-folder.json
- 文档: https://orvui.efu.me/components/blocks/project-folder
- `packages/vue/src/blocks/project-folder/src/ProjectFolder.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
