---
title: "Tool Result"
description: "在同一表面呈现工具调用状态、摘要与可展开结果。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/tool-result"
markdown: "https://orvui.efu.me/components/agents/tool-result.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Tool Result

> 在同一表面呈现工具调用状态、摘要与可展开结果。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Tool Result：在同一表面呈现工具调用状态、摘要与可展开结果。

<a id="install"></a>
## 安装

### Tool Result — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tool-result.json
```

### Terminal Output — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tool-result.json
```

### Request Result — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tool-result.json https://orvui.efu.me/r/code-block.json
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

<a id="examples"></a>
## 用法

<a id="default"></a>
### Tool Result

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@/components/orvui/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@orvui/vue/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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

<a id="terminal-output"></a>
### Terminal Output

结合终端外观与执行状态显示命令输出。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@/components/orvui/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@orvui/vue/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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

<a id="request-result"></a>
### Request Result

将请求元数据及返回内容组合为可检查的结果。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@/components/orvui/agents/tool-result";
import { AgentCode } from "@/components/orvui/agents/code-block";
const response = JSON.stringify(
  { error: "rate_limit_exceeded", retryAfter: 30, requestId: "req_8f21" },
  null,
  2,
);
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
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
  status.value = "running";
  for (let index = 1; index <= 3; index++)
    later(180 + (index - 1) * 600, () => {
      visible.value = index;
    });
  later(2280, () => {
    status.value = "error";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="http.request"
      :title="
        status === 'running' ? 'Fetching project activity' : 'Request failed'
      "
      kind="request"
      :status="status"
      :meta="status === 'error' ? '429' : 'GET /v1/activity'"
      :copy-text="response"
      @retry="replay"
      :collapse-on-complete="false"
      :max-height="150"
      ><ToolResultOutput
        v-if="visible < 3"
        :code="
          [
            'Preparing request…',
            'GET /v1/activity\nConnecting…',
            'GET /v1/activity\nWaiting for response…',
          ][visible]
        " /><AgentCode v-else :code="response" language="json" /></ToolResult
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
import { ToolResult, ToolResultOutput } from "@orvui/vue/agents/tool-result";
import { AgentCode } from "@orvui/vue/agents/code-block";
const response = JSON.stringify(
  { error: "rate_limit_exceeded", retryAfter: 30, requestId: "req_8f21" },
  null,
  2,
);
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
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
  status.value = "running";
  for (let index = 1; index <= 3; index++)
    later(180 + (index - 1) * 600, () => {
      visible.value = index;
    });
  later(2280, () => {
    status.value = "error";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="http.request"
      :title="
        status === 'running' ? 'Fetching project activity' : 'Request failed'
      "
      kind="request"
      :status="status"
      :meta="status === 'error' ? '429' : 'GET /v1/activity'"
      :copy-text="response"
      @retry="replay"
      :collapse-on-complete="false"
      :max-height="150"
      ><ToolResultOutput
        v-if="visible < 3"
        :code="
          [
            'Preparing request…',
            'GET /v1/activity\nConnecting…',
            'GET /v1/activity\nWaiting for response…',
          ][visible]
        " /><AgentCode v-else :code="response" language="json" /></ToolResult
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

使用公开部件 ToolResult, ToolResultOutput 组合 Tool Result，并从该组件的公开入口导入。

```text
ToolResult
└── ToolResultOutput
```

<a id="behavior"></a>
### 工作方式

在同一表面呈现工具调用状态、摘要与可展开结果。

### 生命周期

#### 初始化

通过 tool、title、status、kind、meta、icon、open、defaultOpen、collapseOnComplete、maxHeight、copyText、onCopy、contentClassName 配置 Tool Result；API 表列出其类型与默认值。

#### 更新

监听 update:open、openChange、retry，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Tool Result 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 ToolResult, ToolResultOutput，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Tool Approval](https://orvui.efu.me/components/agents/tool-approval): 为待执行工具操作展示说明，并请求明确决策。
- [Code Block](https://orvui.efu.me/components/agents/code-block): 呈现带高亮的代码，并支持行控件、文件标签与复制操作。
- [Agent Activity](https://orvui.efu.me/components/agents/agent-activity): 将持续变化的助手活动组织为可展开步骤与完成摘要。

### 能力边界

- 负责: Tool Result 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Tool Result：在同一表面呈现工具调用状态、摘要与可展开结果。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ToolResult` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ToolResult

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `tool` | `Content` | — | 是 | — |
| `title` | `Content` | — | 是 | — |
| `status` | `"success" \| "error" \| "running" \| "cancelled"` | `"running"` | 否 | — |
| `kind` | `"terminal" \| "request" \| "custom"` | `"custom"` | 否 | — |
| `meta` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `true` | 否 | — |
| `collapseOnComplete` | `boolean` | `true` | 否 | — |
| `maxHeight` | `number` | `220` | 否 | — |
| `copyText` | `string` | `""` | 否 | — |
| `onCopy` | `() => void \| Promise<void>` | — | 否 | — |
| `contentClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `retry` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ToolResultOutput

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `code` | `string` | `(slots.default?.() ?? []).reduce( (text, node) => text + (typeof node.children === "string" ? node.children : ""), "", )` | 否 | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"bash"` | 否 | — |

<a id="about"></a>
## 关于 Tool Result

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Tool Result？**

通过 tool、title、status、kind、meta、icon、open、defaultOpen、collapseOnComplete、maxHeight、copyText、onCopy、contentClassName 配置 Tool Result；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange、retry，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [File Diff](https://orvui.efu.me/components/agents/file-diff): 通过对齐行号与可展开上下文检查新增及删除内容。
- [Code Block](https://orvui.efu.me/components/agents/code-block): 呈现带高亮的代码，并支持行控件、文件标签与复制操作。
- [Todo List](https://orvui.efu.me/components/agents/todo-list): 展示带展开详情和明确任务状态的工作条目序列。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/tool-result.json
- 文档: https://orvui.efu.me/components/agents/tool-result
- `packages/vue/src/agents/tool-result/src/ToolResult.vue`
- `packages/vue/src/agents/tool-result/src/ToolResultOutput.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
