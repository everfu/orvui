# Citations · orvui 0.1.1

## 选择与组合

从 Prompt Input、Message 和 Streaming Response 组织对话，再加入工具结果、审核和引用；模型请求与消息存储由应用提供。
当界面需要以下行为时使用 Citations：将行内引用标记与可检查的来源条目和链接连接。
如果文档定义的交互模型不适合任务，应选择其他组合。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Citations"
description: "将行内引用标记与可检查的来源条目和链接连接。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/citations"
markdown: "https://orvui.efu.me/components/agents/citations.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Citations

> 将行内引用标记与可检查的来源条目和链接连接。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Citations：将行内引用标记与可检查的来源条目和链接连接。

<a id="install"></a>
## 安装

### Citations — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/citations.json
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

- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Citations

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FileText, RotateCcw } from "lucide-vue-next";
import { Citation, Citations, type CitationItem } from "@/components/orvui/agents/citations";
const citations: CitationItem[] = [
  {
    id: "motion",
    title: "Motion documentation",
    domain: "motion.dev",
    url: "https://motion.dev/docs/vue",
  },
  {
    id: "wai",
    title: "WAI accessibility patterns",
    domain: "w3.org",
    url: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    id: "guidelines",
    title: "Motion guidelines",
    domain: "Design handbook · PDF",
    icon: FileText,
  },
];
const visible = ref(0),
  run = ref(0);
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  run.value++;
  visible.value = 0;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visible.value = citations.length;
    return;
  }
  citations.forEach((_, index) =>
    later(500 + index * 700, () => {
      visible.value = index + 1;
    }),
  );
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[410px] w-full max-w-lg">
    <div :key="run" class="space-y-4">
      <p class="text-sm leading-6 text-foreground/90">
        Use layout-aware motion for newly appended results
        <Citation citation-id="motion" :index="1" id-prefix="preview-source" />
        and preserve accessible disclosure behavior
        <Citation citation-id="wai" :index="2" id-prefix="preview-source" /> as
        the list grows, keeping exits shorter than entrances
        <Citation
          citation-id="guidelines"
          :index="3"
          id-prefix="preview-source"
          label="Citation 3: Motion guidelines"
        />.
      </p>
      <Citations
        id-prefix="preview-source"
        :citations="citations.slice(0, visible)"
        default-open
      />
    </div>
    <button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FileText, RotateCcw } from "lucide-vue-next";
import { Citation, Citations, type CitationItem } from "@orvui/vue/agents/citations";
const citations: CitationItem[] = [
  {
    id: "motion",
    title: "Motion documentation",
    domain: "motion.dev",
    url: "https://motion.dev/docs/vue",
  },
  {
    id: "wai",
    title: "WAI accessibility patterns",
    domain: "w3.org",
    url: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    id: "guidelines",
    title: "Motion guidelines",
    domain: "Design handbook · PDF",
    icon: FileText,
  },
];
const visible = ref(0),
  run = ref(0);
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  run.value++;
  visible.value = 0;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visible.value = citations.length;
    return;
  }
  citations.forEach((_, index) =>
    later(500 + index * 700, () => {
      visible.value = index + 1;
    }),
  );
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[410px] w-full max-w-lg">
    <div :key="run" class="space-y-4">
      <p class="text-sm leading-6 text-foreground/90">
        Use layout-aware motion for newly appended results
        <Citation citation-id="motion" :index="1" id-prefix="preview-source" />
        and preserve accessible disclosure behavior
        <Citation citation-id="wai" :index="2" id-prefix="preview-source" /> as
        the list grows, keeping exits shorter than entrances
        <Citation
          citation-id="guidelines"
          :index="3"
          id-prefix="preview-source"
          label="Citation 3: Motion guidelines"
        />.
      </p>
      <Citations
        id-prefix="preview-source"
        :citations="citations.slice(0, visible)"
        default-open
      />
    </div>
    <button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

## 组件指南

<a id="composition"></a>
### 组合结构

使用公开部件 Citation, Citations, CitationList, CitationFavicon 组合 Citations，并从该组件的公开入口导入。

```text
StreamingResponse
├── Citation
└── Citations
    ├── CitationStack
    └── CitationList
```

<a id="behavior"></a>
### 工作方式

将行内引用标记与可检查的来源条目和链接连接。

### 生命周期

#### 初始化

通过 citationId、index、idPrefix、label 配置 Citations；API 表列出其类型与默认值。

#### 更新

通过文档中的组合方式提供内容，应用副作用由调用方管理。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Citations 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 Citation, Citations, CitationList, CitationFavicon，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Streaming Response](https://orvui.efu.me/components/agents/streaming-response): 组合持续变化的助手回复，包括文字、附件、引用和操作。
- [Message](https://orvui.efu.me/components/agents/message): 使用内容、附件、来源与操作部件组合会话条目。

### 能力边界

- 负责: Citations 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Citations：将行内引用标记与可检查的来源条目和链接连接。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Citations` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Citation

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `citationId` | `string` | — | 是 | — |
| `index` | `number` | — | 是 | — |
| `idPrefix` | `string` | — | 是 | — |
| `label` | `string` | — | 否 | — |

### Citations

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `citations` | `CitationItem[]` | — | 是 | — |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Sources"` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `idPrefix` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

### CitationList

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `citations` | `CitationItem[]` | — | 是 | — |
| `idPrefix` | `string` | `` `citation-list-${instanceId.replace(/:/g, "")}` `` | 否 | — |

### CitationFavicon

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `url` | `string` | — | 否 | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |

<a id="about"></a>
## 关于 Citations

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Citations？**

通过 citationId、index、idPrefix、label 配置 Citations；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Message](https://orvui.efu.me/components/agents/message): 使用内容、附件、来源与操作部件组合会话条目。
- [Todo List](https://orvui.efu.me/components/agents/todo-list): 展示带展开详情和明确任务状态的工作条目序列。
- [Streaming Response](https://orvui.efu.me/components/agents/streaming-response): 组合持续变化的助手回复，包括文字、附件、引用和操作。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/citations.json
- 文档: https://orvui.efu.me/components/agents/citations
- `packages/vue/src/agents/citations/src/Citation.vue`
- `packages/vue/src/agents/citations/src/Citations.vue`
- `packages/vue/src/agents/citations/src/CitationList.vue`
- `packages/vue/src/agents/citations/src/CitationFavicon.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

