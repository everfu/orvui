---
title: "File Diff"
description: "通过对齐行号与可展开上下文检查新增及删除内容。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/file-diff"
markdown: "https://orvui.efu.me/components/agents/file-diff.md"
license: "MIT"
productVersion: "0.1.0"
---

# File Diff

> 通过对齐行号与可展开上下文检查新增及删除内容。

通过对齐行号与可展开上下文检查新增及删除内容。

## 适用场景

- 当界面需要以下行为时使用 File Diff：通过对齐行号与可展开上下文检查新增及删除内容。

## 安装

### File Diff — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/file-diff.json
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
- `shiki@^3.0.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### File Diff

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { FileDiff, type FileDiffLine } from "@/components/orvui/agents/file-diff";
const lines: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 18,
    newLine: 18,
    content: "export async function runTask() {",
  },
  { id: "2", type: "removed", oldLine: 19, content: "  return execute(task);" },
  {
    id: "3",
    type: "added",
    newLine: 19,
    content: "  const result = await execute(task);",
  },
  {
    id: "4",
    type: "added",
    newLine: 20,
    content: "  return normalize(result);",
  },
  { id: "5", oldLine: 20, newLine: 21, content: "}" },
];
const visible = ref(0),
  complete = ref(false),
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
  complete.value = false;
  lines.forEach((_, index) =>
    later(180 + 360 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(lines.length * 360 + 480, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-lg">
    <FileDiff
      :key="run"
      file="src/runner.ts"
      :lines="lines.slice(0, visible)"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="lines.map((line) => line.content).join('\n')"
      :max-height="150"
    /><button
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
import { RotateCcw } from "lucide-vue-next";
import { FileDiff, type FileDiffLine } from "@orvui/vue/agents/file-diff";
const lines: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 18,
    newLine: 18,
    content: "export async function runTask() {",
  },
  { id: "2", type: "removed", oldLine: 19, content: "  return execute(task);" },
  {
    id: "3",
    type: "added",
    newLine: 19,
    content: "  const result = await execute(task);",
  },
  {
    id: "4",
    type: "added",
    newLine: 20,
    content: "  return normalize(result);",
  },
  { id: "5", oldLine: 20, newLine: 21, content: "}" },
];
const visible = ref(0),
  complete = ref(false),
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
  complete.value = false;
  lines.forEach((_, index) =>
    later(180 + 360 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(lines.length * 360 + 480, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-lg">
    <FileDiff
      :key="run"
      file="src/runner.ts"
      :lines="lines.slice(0, visible)"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="lines.map((line) => line.content).join('\n')"
      :max-height="150"
    /><button
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

通过对齐行号与可展开上下文检查新增及删除内容。

### 组合结构

使用公开部件 FileDiff 组合 File Diff，并从该组件的公开入口导入。

```text
ToolResult
└── ToolResultOutput
    └── FileDiff
```

### 生命周期

#### 初始化

通过 file、lines、status、open、defaultOpen、collapseOnComplete、maxHeight、language、copyText、onCopy 配置 File Diff；API 表列出其类型与默认值。

#### 更新

监听 update:open、openChange，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 File Diff 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 FileDiff，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Code Block](https://orvui.efu.me/components/agents/code-block): 呈现带高亮的代码，并支持行控件、文件标签与复制操作。
- [Tool Result](https://orvui.efu.me/components/agents/tool-result): 在同一表面呈现工具调用状态、摘要与可展开结果。
- [Agent Activity](https://orvui.efu.me/components/agents/agent-activity): 将持续变化的助手活动组织为可展开步骤与完成摘要。

### 能力边界

- 负责: File Diff 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 File Diff：通过对齐行号与可展开上下文检查新增及删除内容。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

## API 参考

### FileDiff

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `Content` | — | 是 | — |
| `lines` | `FileDiffLine[]` | — | 是 | — |
| `status` | `"streaming" \| "complete"` | `"streaming"` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `true` | 否 | — |
| `collapseOnComplete` | `boolean` | `true` | 否 | — |
| `maxHeight` | `number` | `220` | 否 | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"typescript"` | 否 | — |
| `copyText` | `string` | `""` | 否 | — |
| `onCopy` | `() => void \| Promise<void>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

## 关于 File Diff

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 File Diff？**

通过 file、lines、status、open、defaultOpen、collapseOnComplete、maxHeight、language、copyText、onCopy 配置 File Diff；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/file-diff.json
- 文档: https://orvui.efu.me/components/agents/file-diff
- `packages/vue/src/agents/file-diff/src/FileDiff.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
