---
title: "Agent Loading States"
description: "通过进度、推理和微光显示传达助手工作仍在进行。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/loading-states"
markdown: "https://orvui.efu.me/components/agents/loading-states.md"
license: "MIT"
productVersion: "0.1.0"
---

# Agent Loading States

> 通过进度、推理和微光显示传达助手工作仍在进行。

## 安装

### Agent Loading States — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/loading-states.json
```

### Reasoning Text — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/reasoning-text.json
```

### Thinking Shimmer — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/thinking-shimmer.json
```

### Agent Progress — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-progress.json
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

### Agent Loading States

**复制源码**

```vue
<script setup lang="ts">
import { AgentProgress, ReasoningText, ThinkingShimmer } from "@/components/orvui/agents/loading-states";
const variants = ["cascade", "swap", "scramble"] as const;
</script>
<template>
  <div class="flex min-h-72 flex-col items-start justify-center gap-7">
    <ReasoningText
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
    /><ThinkingShimmer>Searching for the right words…</ThinkingShimmer
    ><AgentProgress label="Churning" />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { AgentProgress, ReasoningText, ThinkingShimmer } from "@orvui/vue/agents/loading-states";
const variants = ["cascade", "swap", "scramble"] as const;
</script>
<template>
  <div class="flex min-h-72 flex-col items-start justify-center gap-7">
    <ReasoningText
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
    /><ThinkingShimmer>Searching for the right words…</ThinkingShimmer
    ><AgentProgress label="Churning" />
  </div>
</template>
```

### Reasoning Text

呈现持续变化的推理文字，并明确表示工作尚未结束。

**复制源码**

```vue
<script setup lang="ts">
import { ReasoningText, type ReasoningTextVariant } from "@/components/orvui/agents/loading-states";
const ordinary = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
];
const examples = (
  ["cascade", "swap", "scramble"] as ReasoningTextVariant[]
).map((variant) => ({
  variant,
  label: variant[0].toUpperCase() + variant.slice(1),
  phrases:
    variant === "scramble"
      ? ["Thinking", "Searching", "Reasoning", "Composing"]
      : ordinary,
}));
</script>
<template>
  <div class="grid w-full max-w-sm gap-7">
    <div v-for="example in examples" :key="example.variant" class="grid gap-2">
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60"
        >{{ example.label }}</span
      ><ReasoningText
        :variant="example.variant"
        :phrases="example.phrases"
        class="text-base"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ReasoningText, type ReasoningTextVariant } from "@orvui/vue/agents/loading-states";
const ordinary = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
];
const examples = (
  ["cascade", "swap", "scramble"] as ReasoningTextVariant[]
).map((variant) => ({
  variant,
  label: variant[0].toUpperCase() + variant.slice(1),
  phrases:
    variant === "scramble"
      ? ["Thinking", "Searching", "Reasoning", "Composing"]
      : ordinary,
}));
</script>
<template>
  <div class="grid w-full max-w-sm gap-7">
    <div v-for="example in examples" :key="example.variant" class="grid gap-2">
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60"
        >{{ example.label }}</span
      ><ReasoningText
        :variant="example.variant"
        :phrases="example.phrases"
        class="text-base"
      />
    </div>
  </div>
</template>
```

### Thinking Shimmer

在移动文字高光下保持可读的等待标签。

**复制源码**

```vue
<script setup lang="ts">
import { ThinkingShimmer } from "@/components/orvui/agents/loading-states";
const duration = 1.8;
</script>
<template>
  <ThinkingShimmer class="text-lg" :duration="duration"
    >Thinking…</ThinkingShimmer
  >
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ThinkingShimmer } from "@orvui/vue/agents/loading-states";
const duration = 1.8;
</script>
<template>
  <ThinkingShimmer class="text-lg" :duration="duration"
    >Thinking…</ThinkingShimmer
  >
</template>
```

### Agent Progress

将进度指示器与描述当前阶段的标签组合。

**复制源码**

```vue
<script setup lang="ts">
import { AgentProgress } from "@/components/orvui/agents/loading-states";
const initial = 151.6;
</script>
<template>
  <AgentProgress
    label="Churning"
    :initial-seconds="initial"
    class="text-base"
  />
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { AgentProgress } from "@orvui/vue/agents/loading-states";
const initial = 151.6;
</script>
<template>
  <AgentProgress
    label="Churning"
    :initial-seconds="initial"
    class="text-base"
  />
</template>
```

## API 参考

### AgentProgress

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Churning"` | 否 | — |
| `elapsedSeconds` | `number` | `internal.value` | 否 | — |
| `initialSeconds` | `number` | `0` | 否 | — |
| `running` | `boolean` | `true` | 否 | — |

### ReasoningText

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `phrases` | `string[]` | `() => [ "Thinking", "Reading the context", "Connecting the details", "Forming a response", ]` | 否 | — |
| `variant` | `"cascade" \| "scramble" \| "swap"` | `"cascade"` | 否 | — |
| `interval` | `number` | `1800` | 否 | — |
| `shimmerDuration` | `number` | `2.2` | 否 | — |
| `indicator` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `indicator` | `() => VNodeChild` | — | — |

### ThinkingShimmer

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `duration` | `number` | `1.8` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 组件指南

通过进度、推理和微光显示传达助手工作仍在进行。

### 组合结构

使用公开部件 AgentProgress, ReasoningText, ThinkingShimmer 组合 Agent Loading States，并从该组件的公开入口导入。

```text
Message
└── MessageContent
    ├── ThinkingShimmer
    ├── AgentProgress
    └── ReasoningText
```

### 生命周期

#### 初始化

通过 label、elapsedSeconds、initialSeconds、running 配置 Agent Loading States；API 表列出其类型与默认值。

#### 更新

通过文档中的组合方式提供内容，应用副作用由调用方管理。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Agent Loading States 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 AgentProgress, ReasoningText, ThinkingShimmer，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Agent Activity](https://orvui.efu.me/components/agents/agent-activity): 将持续变化的助手活动组织为可展开步骤与完成摘要。
- [Todo List](https://orvui.efu.me/components/agents/todo-list): 展示带展开详情和明确任务状态的工作条目序列。
- [Streaming Response](https://orvui.efu.me/components/agents/streaming-response): 组合持续变化的助手回复，包括文字、附件、引用和操作。

### 能力边界

- 负责: Agent Loading States 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Agent Loading States：通过进度、推理和微光显示传达助手工作仍在进行。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

## 关于 Agent Loading States

通过进度、推理和微光显示传达助手工作仍在进行。

### 适用场景

- 当界面需要以下行为时使用 Agent Loading States：通过进度、推理和微光显示传达助手工作仍在进行。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Agent Loading States？**

通过 label、elapsedSeconds、initialSeconds、running 配置 Agent Loading States；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/loading-states.json
- 文档: https://orvui.efu.me/components/agents/loading-states
- `packages/vue/src/agents/loading-states/src/AgentProgress.vue`
- `packages/vue/src/agents/loading-states/src/ReasoningText.vue`
- `packages/vue/src/agents/loading-states/src/ThinkingShimmer.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
