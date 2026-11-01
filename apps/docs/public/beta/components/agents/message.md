---
title: "Message"
description: "使用内容、附件、来源与操作部件组合会话条目。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/message"
markdown: "https://orvui.efu.me/components/agents/message.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Message

> 使用内容、附件、来源与操作部件组合会话条目。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Message：使用内容、附件、来源与操作部件组合会话条目。

<a id="install"></a>
## 安装

### Message — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/message.json https://orvui.efu.me/beta/r/prompt-input.json https://orvui.efu.me/beta/r/streaming-response.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Message

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, User } from "lucide-vue-next";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessageTyping,
} from "@/components/orvui/agents/message";
import { MessageBubble, MessageBubbleContent } from "@/components/orvui/agents/message-bubble";
import { MessageScroller } from "@/components/orvui/agents/message-scroller";
import { PromptInput } from "@/components/orvui/agents/prompt-input";
import { StreamingResponse } from "@/components/orvui/agents/streaming-response";
interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
  animateIn: boolean;
  streaming?: boolean;
}
const messages = ref<ChatMessage[]>([
  {
    id: "welcome-question",
    from: "user",
    content: "What should we include in the first release?",
    animateIn: false,
  },
  {
    id: "welcome-answer",
    from: "assistant",
    content: "Start with the smallest workflow that still feels complete.",
    animateIn: false,
  },
]);
const phase = ref<"idle" | "waiting" | "typing">("idle");
const pending = computed(() => phase.value === "waiting"),
  loading = computed(() => phase.value !== "idle");
let serial = 0,
  reduced = false,
  animation: number | undefined;
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
function stop() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
  phase.value = "idle";
  messages.value.forEach((message) => {
    message.streaming = false;
  });
}
function submit(prompt: string) {
  if (loading.value) return;
  const turn = serial++,
    text =
      "I’d include composing a prompt, following a streamed answer, recovering from an error, and returning to the latest response without losing the reader’s place.";
  messages.value.push({
    id: `sent-user-${turn}`,
    from: "user",
    content: prompt,
    animateIn: true,
  });
  phase.value = "waiting";
  later(reduced ? 0 : 420, () => {
    messages.value.push({
      id: `sent-assistant-${turn}`,
      from: "assistant",
      content: "",
      animateIn: true,
      streaming: true,
    });
    const target = messages.value[messages.value.length - 1];
    phase.value = "typing";
    if (reduced) {
      target.content = text;
      target.streaming = false;
      phase.value = "idle";
      return;
    }
    const start = performance.now() + 140,
      version = epoch;
    const render = (now: number) => {
      if (version !== epoch) return;
      const count = Math.min(
        text.length,
        Math.floor(Math.max(0, now - start) * 0.096),
      );
      target.content = text.substring(0, count);
      if (count < text.length) animation = requestAnimationFrame(render);
      else {
        animation = undefined;
        target.streaming = false;
        phase.value = "idle";
      }
    };
    animation = requestAnimationFrame(render);
  });
}
onMounted(() => {
  reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
onBeforeUnmount(stop);
</script>
<template>
  <div
    class="flex h-[440px] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/70 bg-background"
  >
    <MessageScroller
      :busy="loading"
      class="min-h-0 flex-1"
      viewport-class-name="px-3 py-4"
      content-class-name="min-h-full"
      ><MessageGroup spacing="default"
        ><Message
          v-for="message in messages"
          :key="message.id"
          :id="message.id"
          :from="message.from"
          :animate-in="message.from === 'user' && message.animateIn"
          ><MessageAvatar
            ><User v-if="message.from === 'user'" /><Bot
              v-else /></MessageAvatar
          ><MessageContent
            ><MessageHeader
              ><span class="font-medium text-foreground/70">{{
                message.from === "user" ? "You" : "Assistant"
              }}</span
              ><span>{{
                message.streaming ? "Responding" : "Now"
              }}</span></MessageHeader
            ><MessageBubble
              :variant="message.from === 'user' ? 'solid' : 'ghost'"
              :animate-in="false"
              ><MessageBubbleContent
                ><StreamingResponse
                  v-if="message.from === 'assistant'"
                  :status="message.streaming ? 'streaming' : 'complete'"
                  :show-actions="false"
                  :announce="false"
                  ><template v-if="message.content">{{
                    message.content
                  }}</template
                  ><MessageTyping v-else /></StreamingResponse
                ><template v-else>{{
                  message.content
                }}</template></MessageBubbleContent
              ></MessageBubble
            ><MessageFooter v-if="message.from === 'user'"
              >Sent</MessageFooter
            ></MessageContent
          ></Message
        ><Message v-if="pending" id="pending-assistant" from="assistant"
          ><MessageAvatar><Bot /></MessageAvatar
          ><MessageContent
            ><MessageTyping
              label="Preparing response" /></MessageContent></Message></MessageGroup
    ></MessageScroller>
    <div class="shrink-0 border-t border-border/60 p-2">
      <PromptInput
        :min-rows="1"
        :max-rows="1"
        :loading="loading"
        @submit="submit"
        @stop="stop"
        placeholder="Ask a follow-up…"
        class="border-0 bg-muted shadow-none focus-within:border-transparent"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, User } from "lucide-vue-next";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader, MessageTyping } from "@orvui/vue/agents/message";
import { MessageBubble, MessageBubbleContent } from "@orvui/vue/agents/message-bubble";
import { MessageScroller } from "@orvui/vue/agents/message-scroller";
import { PromptInput } from "@orvui/vue/agents/prompt-input";
import { StreamingResponse } from "@orvui/vue/agents/streaming-response";
interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
  animateIn: boolean;
  streaming?: boolean;
}
const messages = ref<ChatMessage[]>([
  {
    id: "welcome-question",
    from: "user",
    content: "What should we include in the first release?",
    animateIn: false,
  },
  {
    id: "welcome-answer",
    from: "assistant",
    content: "Start with the smallest workflow that still feels complete.",
    animateIn: false,
  },
]);
const phase = ref<"idle" | "waiting" | "typing">("idle");
const pending = computed(() => phase.value === "waiting"),
  loading = computed(() => phase.value !== "idle");
let serial = 0,
  reduced = false,
  animation: number | undefined;
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
function stop() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
  phase.value = "idle";
  messages.value.forEach((message) => {
    message.streaming = false;
  });
}
function submit(prompt: string) {
  if (loading.value) return;
  const turn = serial++,
    text =
      "I’d include composing a prompt, following a streamed answer, recovering from an error, and returning to the latest response without losing the reader’s place.";
  messages.value.push({
    id: `sent-user-${turn}`,
    from: "user",
    content: prompt,
    animateIn: true,
  });
  phase.value = "waiting";
  later(reduced ? 0 : 420, () => {
    messages.value.push({
      id: `sent-assistant-${turn}`,
      from: "assistant",
      content: "",
      animateIn: true,
      streaming: true,
    });
    const target = messages.value[messages.value.length - 1];
    phase.value = "typing";
    if (reduced) {
      target.content = text;
      target.streaming = false;
      phase.value = "idle";
      return;
    }
    const start = performance.now() + 140,
      version = epoch;
    const render = (now: number) => {
      if (version !== epoch) return;
      const count = Math.min(
        text.length,
        Math.floor(Math.max(0, now - start) * 0.096),
      );
      target.content = text.substring(0, count);
      if (count < text.length) animation = requestAnimationFrame(render);
      else {
        animation = undefined;
        target.streaming = false;
        phase.value = "idle";
      }
    };
    animation = requestAnimationFrame(render);
  });
}
onMounted(() => {
  reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
onBeforeUnmount(stop);
</script>
<template>
  <div
    class="flex h-[440px] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/70 bg-background"
  >
    <MessageScroller
      :busy="loading"
      class="min-h-0 flex-1"
      viewport-class-name="px-3 py-4"
      content-class-name="min-h-full"
      ><MessageGroup spacing="default"
        ><Message
          v-for="message in messages"
          :key="message.id"
          :id="message.id"
          :from="message.from"
          :animate-in="message.from === 'user' && message.animateIn"
          ><MessageAvatar
            ><User v-if="message.from === 'user'" /><Bot
              v-else /></MessageAvatar
          ><MessageContent
            ><MessageHeader
              ><span class="font-medium text-foreground/70">{{
                message.from === "user" ? "You" : "Assistant"
              }}</span
              ><span>{{
                message.streaming ? "Responding" : "Now"
              }}</span></MessageHeader
            ><MessageBubble
              :variant="message.from === 'user' ? 'solid' : 'ghost'"
              :animate-in="false"
              ><MessageBubbleContent
                ><StreamingResponse
                  v-if="message.from === 'assistant'"
                  :status="message.streaming ? 'streaming' : 'complete'"
                  :show-actions="false"
                  :announce="false"
                  ><template v-if="message.content">{{
                    message.content
                  }}</template
                  ><MessageTyping v-else /></StreamingResponse
                ><template v-else>{{
                  message.content
                }}</template></MessageBubbleContent
              ></MessageBubble
            ><MessageFooter v-if="message.from === 'user'"
              >Sent</MessageFooter
            ></MessageContent
          ></Message
        ><Message v-if="pending" id="pending-assistant" from="assistant"
          ><MessageAvatar><Bot /></MessageAvatar
          ><MessageContent
            ><MessageTyping
              label="Preparing response" /></MessageContent></Message></MessageGroup
    ></MessageScroller>
    <div class="shrink-0 border-t border-border/60 p-2">
      <PromptInput
        :min-rows="1"
        :max-rows="1"
        :loading="loading"
        @submit="submit"
        @stop="stop"
        placeholder="Ask a follow-up…"
        class="border-0 bg-muted shadow-none focus-within:border-transparent"
      />
    </div>
  </div>
</template>
```

## 组件指南

<a id="composition"></a>
### 组合结构

使用公开部件 Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader, MessageTyping 组合 Message，并从该组件的公开入口导入。

```text
MessageGroup
└── Message
    ├── MessageAvatar
    └── MessageContent
        ├── MessageHeader
        ├── MessageBubble
        └── MessageFooter
```

<a id="behavior"></a>
### 工作方式

使用内容、附件、来源与操作部件组合会话条目。

### 生命周期

#### 初始化

通过 from、animateIn 配置 Message；API 表列出其类型与默认值。

#### 更新

通过default 插槽提供内容，应用副作用由调用方管理。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Message 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader, MessageTyping，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Message Bubble](https://orvui.efu.me/components/agents/message-bubble): 呈现紧凑会话气泡，并可组合头像、元数据与操作控件。
- [Message Scroller](https://orvui.efu.me/components/agents/message-scroller): 在新消息加入时跟随内容，同时允许读者离开并返回最新位置。
- [Agent Activity](https://orvui.efu.me/components/agents/agent-activity): 将持续变化的助手活动组织为可展开步骤与完成摘要。

### 能力边界

- 负责: Message 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Message：使用内容、附件、来源与操作部件组合会话条目。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Message

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `from` | `MessageFrom` | — | 是 | — |
| `animateIn` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageAvatar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### MessageContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageFooter

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageGroup

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `spacing` | `"default" \| "compact"` | `"compact"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### MessageHeader

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageTyping

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Responding"` | 否 | — |

<a id="about"></a>
## 关于 Message

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Message？**

通过 from、animateIn 配置 Message；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Message Scroller](https://orvui.efu.me/components/agents/message-scroller): 在新消息加入时跟随内容，同时允许读者离开并返回最新位置。
- [Chat App](https://orvui.efu.me/components/agents/chat-app): 将导航、会话内容和提示输入区组合为助手工作空间。
- [Message Bubble](https://orvui.efu.me/components/agents/message-bubble): 呈现紧凑会话气泡，并可组合头像、元数据与操作控件。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/message.json
- 文档: https://orvui.efu.me/components/agents/message
- `packages/vue/src/agents/message/src/Message.vue`
- `packages/vue/src/agents/message/src/MessageAvatar.vue`
- `packages/vue/src/agents/message/src/MessageContent.vue`
- `packages/vue/src/agents/message/src/MessageFooter.vue`
- `packages/vue/src/agents/message/src/MessageGroup.vue`
- `packages/vue/src/agents/message/src/MessageHeader.vue`
- `packages/vue/src/agents/message/src/MessageTyping.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
