# Project Folder · orvui 0.1.1

## 选择与组合

先确定内容结构：表格数据使用 Table，层级文件用 File Tree，可展开补充内容用 Collapsible；多个互斥折叠项使用 Bouncy Accordion。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Project Folder"
description: "扇形展开文档预览，并将选中文件夹展开为聚焦表面。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/project-folder"
markdown: "https://orvui.efu.me/components/blocks/project-folder.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Project Folder

> 扇形展开文档预览，并将选中文件夹展开为聚焦表面。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Project Folder：扇形展开文档预览，并将选中文件夹展开为聚焦表面。

<a id="install"></a>
## 安装

### Project Folder — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/project-folder.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ProjectFolder` | `v-model:open` | `boolean` | `update:open` |
| `ProjectFolder` | `v-model:expanded` | `boolean` | `update:expanded` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Project Folder

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Project Folder？**

通过 title、description、previews、count、itemLabel、open、defaultOpen、expanded、defaultExpanded、disabled、ariaLabel 配置 Project Folder；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange、update:expanded、expandedChange、click，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Card Folder](https://orvui.efu.me/components/blocks/card-folder): 通过协调的打开动作，从折叠口袋中展示一组卡片。
- [Expandable Action Bar](https://orvui.efu.me/components/blocks/expandable-action-bar): 在紧凑图标操作行中，为当前活动操作展开标签。
- [Notification Stack](https://orvui.efu.me/components/blocks/notification-stack): 将紧凑通知堆叠展开为可以逐条阅读的条目。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/project-folder.json
- 文档: https://orvui.efu.me/components/blocks/project-folder
- `packages/vue/src/blocks/project-folder/src/ProjectFolder.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

