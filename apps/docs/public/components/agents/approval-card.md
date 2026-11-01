---
title: "Approval Card"
description: "在助手继续工作前，引导用户完成一个或多个决策步骤。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/approval-card"
markdown: "https://orvui.efu.me/components/agents/approval-card.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Approval Card

> 在助手继续工作前，引导用户完成一个或多个决策步骤。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Approval Card：在助手继续工作前，引导用户完成一个或多个决策步骤。

<a id="install"></a>
## 安装

### Approval Card — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/approval-card.json
```

### Questions — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/approval-card.json
```

### Review and Approve — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/approval-card.json
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
### Approval Card

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/orvui/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
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
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardQuestion, type ApprovalCardStatus } from "@orvui/vue/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
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

<a id="questions"></a>
### Questions

逐步完成决策问题，并保留每题答案以便复核。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/orvui/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
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
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardQuestion, type ApprovalCardStatus } from "@orvui/vue/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
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

<a id="review"></a>
### Review and Approve

在确认待执行操作前，复核已经收集的答案。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardStatus } from "@/components/orvui/agents/approval-card";
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
const details = [
  { label: "Release", text: "approval-card", mono: true },
  { label: "Checks", text: "4 passed", mono: false },
  { label: "Visibility", text: "Public registry", mono: false },
];
const results = {
  approved: "Publishing was approved.",
  "changes-requested": "The agent will wait for revision notes.",
  rejected: "Publishing was declined.",
};
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
function finish(value: ApprovalCardStatus) {
  cancel();
  status.value = "submitting";
  later(700, () => {
    status.value = value;
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      title="Publish the component update?"
      description="The agent has prepared the release and is waiting for your decision."
      :status="status"
      @approve="finish('approved')"
      @request-changes="finish('changes-requested')"
      @reject="finish('rejected')"
      :result="results[status as keyof typeof results] ?? results.rejected"
      ><dl class="grid gap-1 text-xs">
        <div
          v-for="item in details"
          :key="item.label"
          class="flex items-center justify-between gap-4 py-1"
        >
          <dt class="text-muted-foreground">{{ item.label }}</dt>
          <dd :class="[item.mono && 'font-mono', 'text-foreground/80']">
            {{ item.text }}
          </dd>
        </div>
      </dl></ApprovalCard
    ><button
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
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardStatus } from "@orvui/vue/agents/approval-card";
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
const details = [
  { label: "Release", text: "approval-card", mono: true },
  { label: "Checks", text: "4 passed", mono: false },
  { label: "Visibility", text: "Public registry", mono: false },
];
const results = {
  approved: "Publishing was approved.",
  "changes-requested": "The agent will wait for revision notes.",
  rejected: "Publishing was declined.",
};
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
function finish(value: ApprovalCardStatus) {
  cancel();
  status.value = "submitting";
  later(700, () => {
    status.value = value;
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      title="Publish the component update?"
      description="The agent has prepared the release and is waiting for your decision."
      :status="status"
      @approve="finish('approved')"
      @request-changes="finish('changes-requested')"
      @reject="finish('rejected')"
      :result="results[status as keyof typeof results] ?? results.rejected"
      ><dl class="grid gap-1 text-xs">
        <div
          v-for="item in details"
          :key="item.label"
          class="flex items-center justify-between gap-4 py-1"
        >
          <dt class="text-muted-foreground">{{ item.label }}</dt>
          <dd :class="[item.mono && 'font-mono', 'text-foreground/80']">
            {{ item.text }}
          </dd>
        </div>
      </dl></ApprovalCard
    ><button
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

<a id="composition"></a>
### 组合结构

使用公开部件 ApprovalCard 组合 Approval Card，并从该组件的公开入口导入。

```text
Message
└── MessageContent
    └── ApprovalCard
```

<a id="behavior"></a>
### 工作方式

在助手继续工作前，引导用户完成一个或多个决策步骤。

### 生命周期

#### 初始化

通过 title、description、questions、status、answers、defaultAnswers、step、defaultStep、approveLabel、submitLabel、result 配置 Approval Card；API 表列出其类型与默认值。

#### 更新

监听 update:answers、answersChange、update:step、stepChange、submit、approve、reject、requestChanges、dismiss，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Approval Card 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 ApprovalCard，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Tool Approval](https://orvui.efu.me/components/agents/tool-approval): 为待执行工具操作展示说明，并请求明确决策。
- [Message](https://orvui.efu.me/components/agents/message): 使用内容、附件、来源与操作部件组合会话条目。
- [Todo List](https://orvui.efu.me/components/agents/todo-list): 展示带展开详情和明确任务状态的工作条目序列。

### 能力边界

- 负责: Approval Card 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Approval Card：在助手继续工作前，引导用户完成一个或多个决策步骤。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ApprovalCard` | `v-model:answers` | `ApprovalCardAnswers` | `update:answers` |
| `ApprovalCard` | `v-model:step` | `number` | `update:step` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ApprovalCard

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Approval required"` | 否 | — |
| `description` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `questions` | `ApprovalCardQuestion[]` | `() => []` | 否 | — |
| `status` | `"pending" \| "submitting" \| "approved" \| "rejected" \| "changes-requested" \| "answered"` | `"pending"` | 否 | — |
| `answers` | `ApprovalCardAnswers` | — | 否 | — |
| `defaultAnswers` | `ApprovalCardAnswers` | `() => ({})` | 否 | — |
| `step` | `number` | — | 否 | — |
| `defaultStep` | `number` | `0` | 否 | — |
| `approveLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Approve"` | 否 | — |
| `submitLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Submit response"` | 否 | — |
| `result` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:answers` | `[answers: ApprovalCardAnswers]` | — |
| `answersChange` | `[answers: ApprovalCardAnswers]` | — |
| `update:step` | `[step: number]` | — |
| `stepChange` | `[step: number]` | — |
| `submit` | `[answers: ApprovalCardAnswers]` | — |
| `approve` | `[]` | — |
| `reject` | `[]` | — |
| `requestChanges` | `[]` | — |
| `dismiss` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Approval Card

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Approval Card？**

通过 title、description、questions、status、answers、defaultAnswers、step、defaultStep、approveLabel、submitLabel、result 配置 Approval Card；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:answers、answersChange、update:step、stepChange、submit、approve、reject、requestChanges、dismiss，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Tool Approval](https://orvui.efu.me/components/agents/tool-approval): 为待执行工具操作展示说明，并请求明确决策。
- [Chat App](https://orvui.efu.me/components/agents/chat-app): 将导航、会话内容和提示输入区组合为助手工作空间。
- [Tool Result](https://orvui.efu.me/components/agents/tool-result): 在同一表面呈现工具调用状态、摘要与可展开结果。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/approval-card.json
- 文档: https://orvui.efu.me/components/agents/approval-card
- `packages/vue/src/agents/approval-card/src/ApprovalCard.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
