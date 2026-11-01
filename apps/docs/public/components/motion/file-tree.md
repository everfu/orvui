---
title: "File Tree"
description: "通过展开分支和键盘选择浏览嵌套文件与文件夹。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/file-tree"
markdown: "https://orvui.efu.me/components/motion/file-tree.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# File Tree

> 通过展开分支和键盘选择浏览嵌套文件与文件夹。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 File Tree：通过展开分支和键盘选择浏览嵌套文件与文件夹。

<a id="install"></a>
## 安装

### File Tree — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/file-tree.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
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

<a id="examples"></a>
## 用法

<a id="default"></a>
### File Tree

**复制源码**

```vue
<script setup lang="ts">
import { h } from "vue";
import { Braces, FileCode2, FileJson2, FileText, Palette } from "lucide-vue-next";
import { FileTree, FileTreeFile, FileTreeFolder } from "@/components/orvui/motion/file-tree";
const source = () => h(Braces, { class: "size-4 text-sky-500" });
const entries = [
  { value: "app", name: "App.vue", icon: () => h(FileCode2, { class: "size-4 text-sky-500" }) },
  { value: "styles", name: "style.css", icon: () => h(Palette, { class: "size-4 text-violet-500" }) },
];
const documents = [
  { value: "package", name: "package.json", icon: () => h(FileJson2, { class: "size-4 text-amber-500" }) },
  { value: "readme", name: "README.md", icon: () => h(FileText, { class: "size-4 text-muted-foreground" }) },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-10"><div class="w-full max-w-xs p-2">
    <FileTree default-value="file-tree" :default-expanded-ids="['src', 'components']" aria-label="Project files">
      <FileTreeFolder value="src" name="src"><FileTreeFolder value="components" name="components"><FileTreeFile v-for="file in ['file-tree', 'button']" :key="file" :value="file" :name="`${file}.vue`" :icon="source" /></FileTreeFolder><FileTreeFile v-for="entry in entries" :key="entry.value" v-bind="entry" /></FileTreeFolder>
      <FileTreeFolder value="public" name="public"><FileTreeFile v-for="file in ['logo', 'grid']" :key="file" :value="file" :name="`${file}.svg`" /></FileTreeFolder>
      <FileTreeFile v-for="entry in documents" :key="entry.value" v-bind="entry" />
    </FileTree>
  </div></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h } from "vue";
import { Braces, FileCode2, FileJson2, FileText, Palette } from "lucide-vue-next";
import { FileTree, FileTreeFile, FileTreeFolder } from "@orvui/vue/motion/file-tree";
const source = () => h(Braces, { class: "size-4 text-sky-500" });
const entries = [
  { value: "app", name: "App.vue", icon: () => h(FileCode2, { class: "size-4 text-sky-500" }) },
  { value: "styles", name: "style.css", icon: () => h(Palette, { class: "size-4 text-violet-500" }) },
];
const documents = [
  { value: "package", name: "package.json", icon: () => h(FileJson2, { class: "size-4 text-amber-500" }) },
  { value: "readme", name: "README.md", icon: () => h(FileText, { class: "size-4 text-muted-foreground" }) },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-10"><div class="w-full max-w-xs p-2">
    <FileTree default-value="file-tree" :default-expanded-ids="['src', 'components']" aria-label="Project files">
      <FileTreeFolder value="src" name="src"><FileTreeFolder value="components" name="components"><FileTreeFile v-for="file in ['file-tree', 'button']" :key="file" :value="file" :name="`${file}.vue`" :icon="source" /></FileTreeFolder><FileTreeFile v-for="entry in entries" :key="entry.value" v-bind="entry" /></FileTreeFolder>
      <FileTreeFolder value="public" name="public"><FileTreeFile v-for="file in ['logo', 'grid']" :key="file" :value="file" :name="`${file}.svg`" /></FileTreeFolder>
      <FileTreeFile v-for="entry in documents" :key="entry.value" v-bind="entry" />
    </FileTree>
  </div></div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `FileTree` | `v-model` | `null \| string` | `update:modelValue` |
| `FileTree` | `v-model:expandedIds` | `string[]` | `update:expandedIds` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### FileTree

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `null \| string` | — | 否 | — |
| `defaultValue` | `null \| string` | `null` | 否 | — |
| `expandedIds` | `string[]` | — | 否 | — |
| `defaultExpandedIds` | `string[]` | `() => []` | 否 | — |
| `ariaLabel` | `string` | `"Files"` | 否 | — |
| `indent` | `number` | `18` | 否 | — |
| `classNames` | `FileTreeClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:expandedIds` | — | — |
| `expandedChange` | — | — |

### FileTreeFile

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `name` | `string` | — | 是 | — |
| `icon` | `any` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

### FileTreeFolder

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `name` | `string` | — | 是 | — |
| `icon` | `any` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

<a id="about"></a>
## 关于 File Tree

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 File Tree？**

通过 modelValue、defaultValue、expandedIds、defaultExpandedIds、ariaLabel、indent、classNames 配置 File Tree；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change、update:expandedIds、expandedChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Animated Context Menu](https://orvui.efu.me/components/motion/context-menu): 在指针位置打开菜单，并可组合复选项、单选项和子菜单。
- [Image Viewer](https://orvui.efu.me/components/motion/image-viewer): 从缩略图打开画廊图片，在大图中切换、缩放或平移。
- [Animated Color Selector](https://orvui.efu.me/components/motion/color-selector): 用移动选择轮廓与原生单选行为选择命名色块。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/file-tree.json
- 文档: https://orvui.efu.me/components/motion/file-tree
- `packages/vue/src/motion/file-tree/src/FileTree.vue`
- `packages/vue/src/motion/file-tree/src/FileTreeFile.vue`
- `packages/vue/src/motion/file-tree/src/FileTreeFolder.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
