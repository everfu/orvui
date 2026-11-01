---
title: "Prompt Input"
description: "通过自适应高度文本框、附件与键盘操作编写并提交提示词。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/prompt-input"
markdown: "https://orvui.efu.me/components/agents/prompt-input.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Prompt Input

> 通过自适应高度文本框、附件与键盘操作编写并提交提示词。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Prompt Input：通过自适应高度文本框、附件与键盘操作编写并提交提示词。

<a id="install"></a>
## 安装

### Prompt Input — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/prompt-input.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
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
### Prompt Input

**复制源码**

```vue
<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, FileText, ImagePlus, Puzzle } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { PromptInput } from "@/components/orvui/agents/prompt-input";
const ModelLogo = defineComponent({
  props: { url: { type: String, required: true } },
  setup(props) {
    const image = ref<HTMLImageElement>(),
      failed = ref(false);
    let alive = true;
    onMounted(async () => {
      try {
        await image.value?.decode?.();
      } catch {
        if (alive) failed.value = true;
      }
    });
    onBeforeUnmount(() => {
      alive = false;
    });
    return () =>
      failed.value
        ? h(Bot)
        : h("img", {
            ref: image,
            src: new URL("/favicon.ico", props.url).href,
            alt: "",
            width: 16,
            height: 16,
            referrerpolicy: "no-referrer",
            class: "size-4 rounded-sm object-contain",
            onError: () => {
              failed.value = true;
            },
          });
  },
});
const modelData = [
  ["gpt-5.2", "GPT-5.2", "https://openai.com"],
  ["claude-sonnet-4", "Claude Sonnet 4", "https://www.anthropic.com"],
  ["gemini-3.6-flash", "Gemini 3.6 Flash", "https://deepmind.google"],
  ["grok-4.5", "Grok 4.5", "https://x.ai"],
  ["mistral-large-3", "Mistral Large 3", "https://mistral.ai"],
];
const models = modelData.map(([value, label, url]) => ({
  value,
  label,
  icon: () => h(ModelLogo, { url }),
}));
const actions = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: ImagePlus,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: Puzzle,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: FileText,
  },
];
const loading = ref(false),
  sent = ref<string>(),
  notice = ref<string>(),
  reduce = ref(false);
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
function submit(prompt: string) {
  cancel();
  sent.value = undefined;
  notice.value = undefined;
  loading.value = true;
  later(900, () => {
    loading.value = false;
    sent.value = prompt;
  });
}
function stop() {
  cancel();
  loading.value = false;
}
function action(value: string) {
  const item = actions.find((candidate) => candidate.value === value);
  notice.value = item ? `${item.label} selected.` : undefined;
}
onMounted(() => {
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
</script>
<template>
  <div class="flex h-[360px] w-full max-w-xl flex-col justify-center">
    <PromptInput
      :models="models"
      :actions="actions"
      default-model="gpt-5.2"
      default-value="Review the current implementation and suggest the next improvement."
      :loading="loading"
      @submit="submit"
      @stop="stop"
      @action="action"
    />
    <div class="h-8 px-2 pt-2 text-xs text-muted-foreground">
      <AnimatePresence mode="wait"
        ><motion.p
          v-if="sent || notice"
          :key="sent ?? notice"
          :initial="reduce ? { opacity: 1 } : { opacity: 0, y: 3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }"
          >{{ sent ? "Prompt sent to the selected model." : notice }}</motion.p
        ></AnimatePresence
      >
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, FileText, ImagePlus, Puzzle } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { PromptInput } from "@orvui/vue/agents/prompt-input";
const ModelLogo = defineComponent({
  props: { url: { type: String, required: true } },
  setup(props) {
    const image = ref<HTMLImageElement>(),
      failed = ref(false);
    let alive = true;
    onMounted(async () => {
      try {
        await image.value?.decode?.();
      } catch {
        if (alive) failed.value = true;
      }
    });
    onBeforeUnmount(() => {
      alive = false;
    });
    return () =>
      failed.value
        ? h(Bot)
        : h("img", {
            ref: image,
            src: new URL("/favicon.ico", props.url).href,
            alt: "",
            width: 16,
            height: 16,
            referrerpolicy: "no-referrer",
            class: "size-4 rounded-sm object-contain",
            onError: () => {
              failed.value = true;
            },
          });
  },
});
const modelData = [
  ["gpt-5.2", "GPT-5.2", "https://openai.com"],
  ["claude-sonnet-4", "Claude Sonnet 4", "https://www.anthropic.com"],
  ["gemini-3.6-flash", "Gemini 3.6 Flash", "https://deepmind.google"],
  ["grok-4.5", "Grok 4.5", "https://x.ai"],
  ["mistral-large-3", "Mistral Large 3", "https://mistral.ai"],
];
const models = modelData.map(([value, label, url]) => ({
  value,
  label,
  icon: () => h(ModelLogo, { url }),
}));
const actions = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: ImagePlus,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: Puzzle,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: FileText,
  },
];
const loading = ref(false),
  sent = ref<string>(),
  notice = ref<string>(),
  reduce = ref(false);
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
function submit(prompt: string) {
  cancel();
  sent.value = undefined;
  notice.value = undefined;
  loading.value = true;
  later(900, () => {
    loading.value = false;
    sent.value = prompt;
  });
}
function stop() {
  cancel();
  loading.value = false;
}
function action(value: string) {
  const item = actions.find((candidate) => candidate.value === value);
  notice.value = item ? `${item.label} selected.` : undefined;
}
onMounted(() => {
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
</script>
<template>
  <div class="flex h-[360px] w-full max-w-xl flex-col justify-center">
    <PromptInput
      :models="models"
      :actions="actions"
      default-model="gpt-5.2"
      default-value="Review the current implementation and suggest the next improvement."
      :loading="loading"
      @submit="submit"
      @stop="stop"
      @action="action"
    />
    <div class="h-8 px-2 pt-2 text-xs text-muted-foreground">
      <AnimatePresence mode="wait"
        ><motion.p
          v-if="sent || notice"
          :key="sent ?? notice"
          :initial="reduce ? { opacity: 1 } : { opacity: 0, y: 3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }"
          >{{ sent ? "Prompt sent to the selected model." : notice }}</motion.p
        ></AnimatePresence
      >
    </div>
  </div>
</template>
```

## 组件指南

<a id="composition"></a>
### 组合结构

使用公开部件 PromptInput 组合 Prompt Input，并从该组件的公开入口导入。

```text
Chat
├── MessageScroller
│   └── MessageGroup
└── PromptInput
```

<a id="behavior"></a>
### 工作方式

通过自适应高度文本框、附件与键盘操作编写并提交提示词。

### 生命周期

#### 初始化

通过 modelValue、defaultValue、models、model、defaultModel、actions、loading、minRows、maxRows、disabled、placeholder 配置 Prompt Input；API 表列出其类型与默认值。

#### 更新

监听 update:modelValue、valueChange、update:model、modelChange、action、submit、stop，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Prompt Input 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 PromptInput，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Message Scroller](https://orvui.efu.me/components/agents/message-scroller): 在新消息加入时跟随内容，同时允许读者离开并返回最新位置。
- [Tool Approval](https://orvui.efu.me/components/agents/tool-approval): 为待执行工具操作展示说明，并请求明确决策。
- [Approval Card](https://orvui.efu.me/components/agents/approval-card): 在助手继续工作前，引导用户完成一个或多个决策步骤。

### 能力边界

- 负责: Prompt Input 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Prompt Input：通过自适应高度文本框、附件与键盘操作编写并提交提示词。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `PromptInput` | `v-model` | `string` | `update:modelValue` |
| `PromptInput` | `v-model:model` | `string` | `update:model` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### PromptInput

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `""` | 否 | — |
| `models` | `PromptModel[]` | `() => []` | 否 | — |
| `model` | `string` | — | 否 | — |
| `defaultModel` | `string` | `props.models[0]?.value` | 否 | — |
| `actions` | `PromptAction[]` | `() => []` | 否 | — |
| `loading` | `boolean` | `false` | 否 | — |
| `minRows` | `number` | `2` | 否 | — |
| `maxRows` | `number` | `8` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `placeholder` | `string` | `"Ask the agent to do something…"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[value: string]` | — |
| `valueChange` | `[value: string]` | — |
| `update:model` | `[value: string]` | — |
| `modelChange` | `[value: string]` | — |
| `action` | `[action: string]` | — |
| `submit` | `[value: string, model?: string \| undefined]` | — |
| `stop` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `leading-action` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Prompt Input

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Prompt Input？**

通过 modelValue、defaultValue、models、model、defaultModel、actions、loading、minRows、maxRows、disabled、placeholder 配置 Prompt Input；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、update:model、modelChange、action、submit、stop，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Chat App](https://orvui.efu.me/components/agents/chat-app): 将导航、会话内容和提示输入区组合为助手工作空间。
- [Streaming Response](https://orvui.efu.me/components/agents/streaming-response): 组合持续变化的助手回复，包括文字、附件、引用和操作。
- [Citations](https://orvui.efu.me/components/agents/citations): 将行内引用标记与可检查的来源条目和链接连接。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/prompt-input.json
- 文档: https://orvui.efu.me/components/agents/prompt-input
- `packages/vue/src/agents/prompt-input/src/PromptInput.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
