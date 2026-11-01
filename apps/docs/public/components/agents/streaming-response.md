---
title: "Streaming Response"
description: "组合持续变化的助手回复，包括文字、附件、引用和操作。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/streaming-response"
markdown: "https://orvui.efu.me/components/agents/streaming-response.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Streaming Response

> 组合持续变化的助手回复，包括文字、附件、引用和操作。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Streaming Response：组合持续变化的助手回复，包括文字、附件、引用和操作。

<a id="install"></a>
## 安装

### Streaming Response — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/streaming-response.json
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
### Streaming Response

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { StreamingResponse } from "@/components/orvui/agents/streaming-response";
const pieces = [
  "This answer adds content a little at a time. Read ",
  "the Vue introduction",
  " while the next paragraph is prepared.",
  "Each update keeps the existing document in place:",
  "Open links without pausing the arriving text",
  "Follow the same list as new items appear",
  "Copy the code after the final line arrives",
  "Set ",
  "aria-busy",
  " until the pending update has finished.",
  'const status = complete ? "ready" : "streaming";',
];
const sources = [
    {
      id: "vue-introduction",
      title: "Vue introduction",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/introduction.html",
    },
    {
      id: "aria-busy",
      title: "ARIA live regions",
      domain: "developer.mozilla.org",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",
    },
    {
      id: "vue-rendering",
      title: "Rendering elements",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/essentials/conditional.html",
    },
  ],
  markdown = `This answer adds content a little at a time. Read [the Vue introduction](https://vuejs.org/guide/introduction.html) while the next paragraph is prepared.\n\nEach update keeps the existing document in place:\n\n- Open links without pausing the arriving text\n- Follow the same list as new items appear\n- Copy the code after the final line arrives\n\nSet \`aria-busy\` until the pending update has finished.\n\n\`\`\`ts\nconst status = complete ? "ready" : "streaming";\n\`\`\``;
let total = 0;
const starts = pieces.map((piece) => {
  const offset = total;
  total += piece.length;
  return offset;
});
const cursor = ref(0),
  complete = ref(false),
  run = ref(0);
const reveal = (index: number) =>
  pieces[index].substring(0, Math.max(0, cursor.value - starts[index]));
const started = (index: number) => cursor.value > starts[index];
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
let animation: number | undefined;
function replay() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  cursor.value = 0;
  complete.value = false;
  run.value++;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.value = total;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    cursor.value = Math.min(total, Math.floor((now - origin) * 0.11));
    if (cursor.value < total) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(450, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
onBeforeUnmount(() => {
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <div class="relative h-[500px] w-full max-w-xl">
    <StreamingResponse
      :key="run"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="markdown"
      @retry="replay"
      :sources="sources"
      ><p>
        {{ reveal(0)
        }}<a
          v-if="started(1)"
          href="https://vuejs.org/guide/introduction.html"
          target="_blank"
          rel="noreferrer noopener"
          >{{ reveal(1) }}</a
        >{{ reveal(2) }}
      </p>
      <p v-if="started(3)">{{ reveal(3) }}</p>
      <ul v-if="started(4)">
        <li v-for="index in [4, 5, 6].filter(started)" :key="index">
          {{ reveal(index) }}
        </li>
      </ul>
      <p v-if="started(7)">
        {{ reveal(7) }}<code v-if="started(8)">{{ reveal(8) }}</code
        >{{ reveal(9) }}
      </p>
      <pre
        v-if="started(10)"
      ><code>{{ reveal(10) }}</code></pre></StreamingResponse
    ><button
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
import { StreamingResponse } from "@orvui/vue/agents/streaming-response";
const pieces = [
  "This answer adds content a little at a time. Read ",
  "the Vue introduction",
  " while the next paragraph is prepared.",
  "Each update keeps the existing document in place:",
  "Open links without pausing the arriving text",
  "Follow the same list as new items appear",
  "Copy the code after the final line arrives",
  "Set ",
  "aria-busy",
  " until the pending update has finished.",
  'const status = complete ? "ready" : "streaming";',
];
const sources = [
    {
      id: "vue-introduction",
      title: "Vue introduction",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/introduction.html",
    },
    {
      id: "aria-busy",
      title: "ARIA live regions",
      domain: "developer.mozilla.org",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",
    },
    {
      id: "vue-rendering",
      title: "Rendering elements",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/essentials/conditional.html",
    },
  ],
  markdown = `This answer adds content a little at a time. Read [the Vue introduction](https://vuejs.org/guide/introduction.html) while the next paragraph is prepared.\n\nEach update keeps the existing document in place:\n\n- Open links without pausing the arriving text\n- Follow the same list as new items appear\n- Copy the code after the final line arrives\n\nSet \`aria-busy\` until the pending update has finished.\n\n\`\`\`ts\nconst status = complete ? "ready" : "streaming";\n\`\`\``;
let total = 0;
const starts = pieces.map((piece) => {
  const offset = total;
  total += piece.length;
  return offset;
});
const cursor = ref(0),
  complete = ref(false),
  run = ref(0);
const reveal = (index: number) =>
  pieces[index].substring(0, Math.max(0, cursor.value - starts[index]));
const started = (index: number) => cursor.value > starts[index];
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
let animation: number | undefined;
function replay() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  cursor.value = 0;
  complete.value = false;
  run.value++;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.value = total;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    cursor.value = Math.min(total, Math.floor((now - origin) * 0.11));
    if (cursor.value < total) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(450, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
onBeforeUnmount(() => {
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <div class="relative h-[500px] w-full max-w-xl">
    <StreamingResponse
      :key="run"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="markdown"
      @retry="replay"
      :sources="sources"
      ><p>
        {{ reveal(0)
        }}<a
          v-if="started(1)"
          href="https://vuejs.org/guide/introduction.html"
          target="_blank"
          rel="noreferrer noopener"
          >{{ reveal(1) }}</a
        >{{ reveal(2) }}
      </p>
      <p v-if="started(3)">{{ reveal(3) }}</p>
      <ul v-if="started(4)">
        <li v-for="index in [4, 5, 6].filter(started)" :key="index">
          {{ reveal(index) }}
        </li>
      </ul>
      <p v-if="started(7)">
        {{ reveal(7) }}<code v-if="started(8)">{{ reveal(8) }}</code
        >{{ reveal(9) }}
      </p>
      <pre
        v-if="started(10)"
      ><code>{{ reveal(10) }}</code></pre></StreamingResponse
    ><button
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

使用公开部件 StreamingResponse 组合 Streaming Response，并从该组件的公开入口导入。

```text
Message
└── MessageContent
    └── MessageBubble
        └── StreamingResponse
```

<a id="behavior"></a>
### 工作方式

组合持续变化的助手回复，包括文字、附件、引用和操作。

### 生命周期

#### 初始化

将变化中的回复内容放在默认插槽，通过 streaming 控制等待状态的呈现。

#### 更新

监听 retry、update:sourcesOpen、sourcesOpenChange、update:feedback、feedbackChange，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Streaming Response 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 StreamingResponse，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Message](https://orvui.efu.me/components/agents/message): 使用内容、附件、来源与操作部件组合会话条目。
- [Citations](https://orvui.efu.me/components/agents/citations): 将行内引用标记与可检查的来源条目和链接连接。
- [Code Block](https://orvui.efu.me/components/agents/code-block): 呈现带高亮的代码，并支持行控件、文件标签与复制操作。

### 能力边界

- 负责: Streaming Response 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Streaming Response：组合持续变化的助手回复，包括文字、附件、引用和操作。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `StreamingResponse` | `v-model:sourcesOpen` | `boolean` | `update:sourcesOpen` |
| `StreamingResponse` | `v-model:feedback` | `null \| "up" \| "down"` | `update:feedback` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### StreamingResponse

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `status` | `"error" \| "streaming" \| "complete"` | `"streaming"` | 否 | — |
| `copyText` | `string` | `""` | 否 | — |
| `onCopy` | `() => void \| Promise<void>` | — | 否 | — |
| `sources` | `CitationItem[]` | `() => []` | 否 | — |
| `sourcesOpen` | `boolean` | `undefined` | 否 | — |
| `defaultSourcesOpen` | `boolean` | `false` | 否 | — |
| `sourceIdPrefix` | `string` | — | 否 | — |
| `feedback` | `null \| "up" \| "down"` | — | 否 | — |
| `defaultFeedback` | `null \| "up" \| "down"` | `null` | 否 | — |
| `announce` | `boolean` | `true` | 否 | — |
| `showActions` | `boolean` | `true` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |
| `actionsClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `retry` | `[]` | — |
| `update:sourcesOpen` | `[open: boolean]` | — |
| `sourcesOpenChange` | `[open: boolean]` | — |
| `update:feedback` | `[feedback: StreamingResponseFeedback]` | — |
| `feedbackChange` | `[feedback: StreamingResponseFeedback]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Streaming Response

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Streaming Response？**

将变化中的回复内容放在默认插槽，通过 streaming 控制等待状态的呈现。

**如何连接到应用状态？**

监听 retry、update:sourcesOpen、sourcesOpenChange、update:feedback、feedbackChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Code Block](https://orvui.efu.me/components/agents/code-block): 呈现带高亮的代码，并支持行控件、文件标签与复制操作。
- [Citations](https://orvui.efu.me/components/agents/citations): 将行内引用标记与可检查的来源条目和链接连接。
- [Chat App](https://orvui.efu.me/components/agents/chat-app): 将导航、会话内容和提示输入区组合为助手工作空间。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/streaming-response.json
- 文档: https://orvui.efu.me/components/agents/streaming-response
- `packages/vue/src/agents/streaming-response/src/StreamingResponse.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
