---
title: "Code Block"
description: "呈现带高亮的代码，并支持行控件、文件标签与复制操作。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/code-block"
markdown: "https://orvui.efu.me/components/agents/code-block.md"
license: "MIT"
productVersion: "0.1.0"
---

# Code Block

> 呈现带高亮的代码，并支持行控件、文件标签与复制操作。

呈现带高亮的代码，并支持行控件、文件标签与复制操作。

## 适用场景

- 当界面需要以下行为时使用 Code Block：呈现带高亮的代码，并支持行控件、文件标签与复制操作。

## 安装

### Code Block — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/code-block.json
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

### Code Block

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { CodeBlock } from "@/components/orvui/agents/code-block";
const lines = [
  'import { generateText } from "ai";',
  "",
  "export async function summarize(input: string) {",
  "  const { text } = await generateText({",
  '    model: "openai/gpt-5",',
  "    prompt: `Summarize this clearly: ${input}`,",
  "  });",
  "",
  "  return {",
  "    text,",
  "    generatedAt: new Date().toISOString(),",
  "  };",
  "}",
];
const visible = ref(1),
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
  visible.value = 1;
  for (let index = 2; index <= lines.length; index++)
    later((index - 1) * 260, () => {
      visible.value = index;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[340px] w-full max-w-xl">
    <CodeBlock
      :key="run"
      filename="summarize.ts"
      language="typescript"
      :code="lines.slice(0, visible).join('\n')"
      :status="visible === lines.length ? 'complete' : 'streaming'"
      :highlight-lines="[4, 5, 6, 7]"
      :max-height="224"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
import { CodeBlock } from "@orvui/vue/agents/code-block";
const lines = [
  'import { generateText } from "ai";',
  "",
  "export async function summarize(input: string) {",
  "  const { text } = await generateText({",
  '    model: "openai/gpt-5",',
  "    prompt: `Summarize this clearly: ${input}`,",
  "  });",
  "",
  "  return {",
  "    text,",
  "    generatedAt: new Date().toISOString(),",
  "  };",
  "}",
];
const visible = ref(1),
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
  visible.value = 1;
  for (let index = 2; index <= lines.length; index++)
    later((index - 1) * 260, () => {
      visible.value = index;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[340px] w-full max-w-xl">
    <CodeBlock
      :key="run"
      filename="summarize.ts"
      language="typescript"
      :code="lines.slice(0, visible).join('\n')"
      :status="visible === lines.length ? 'complete' : 'streaming'"
      :highlight-lines="[4, 5, 6, 7]"
      :max-height="224"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

## 组件指南

呈现带高亮的代码，并支持行控件、文件标签与复制操作。

### 组合结构

使用公开部件 CodeBlock, AgentCodeLine 组合 Code Block，并从该组件的公开入口导入。

```text
StreamingResponse
└── CodeBlock
```

### 生命周期

#### 初始化

通过 code、language、filename、status、showLineNumbers、highlightLines、maxHeight、wrap、copyable、onCopy 配置 Code Block；API 表列出其类型与默认值。

#### 更新

通过文档中的组合方式提供内容，应用副作用由调用方管理。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Code Block 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 CodeBlock, AgentCodeLine，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [File Diff](https://orvui.efu.me/components/agents/file-diff): 通过对齐行号与可展开上下文检查新增及删除内容。
- [Tool Result](https://orvui.efu.me/components/agents/tool-result): 在同一表面呈现工具调用状态、摘要与可展开结果。
- [Streaming Response](https://orvui.efu.me/components/agents/streaming-response): 组合持续变化的助手回复，包括文字、附件、引用和操作。

### 能力边界

- 负责: Code Block 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Code Block：呈现带高亮的代码，并支持行控件、文件标签与复制操作。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

## API 参考

### CodeBlock

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 是 | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"typescript"` | 否 | — |
| `filename` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `status` | `"streaming" \| "complete"` | `"complete"` | 否 | — |
| `showLineNumbers` | `boolean` | `true` | 否 | — |
| `highlightLines` | `number[]` | `() => []` | 否 | — |
| `maxHeight` | `number` | `280` | 否 | — |
| `wrap` | `boolean` | `false` | 否 | — |
| `copyable` | `boolean` | `true` | 否 | — |
| `onCopy` | `() => void \| Promise<void>` | — | 否 | — |

### AgentCodeLine

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | 是 | — |
| `tokens` | `AgentCodeToken[]` | — | 否 | — |

## 关于 Code Block

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Code Block？**

通过 code、language、filename、status、showLineNumbers、highlightLines、maxHeight、wrap、copyable、onCopy 配置 Code Block；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/code-block.json
- 文档: https://orvui.efu.me/components/agents/code-block
- `packages/vue/src/agents/code-block/src/CodeBlock.vue`
- `packages/vue/src/agents/code-block/src/AgentCodeLine.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
