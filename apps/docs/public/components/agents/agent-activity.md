---
title: "Agent Activity"
description: "将持续变化的助手活动组织为可展开步骤与完成摘要。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/agent-activity"
markdown: "https://orvui.efu.me/components/agents/agent-activity.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Agent Activity

> 将持续变化的助手活动组织为可展开步骤与完成摘要。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Agent Activity：将持续变化的助手活动组织为可展开步骤与完成摘要。

<a id="install"></a>
## 安装

### Agent Activity — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
```

### Streaming Text — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
```

### Reasoning Steps — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
```

### Web Search — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
```

### Tool Calls — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
```

### Mixed Activity — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
```

### Agent Trace — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-activity.json
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
### Agent Activity

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
const ACTIVE_BRIEF = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
};
const COMPLETE_BRIEF = {
  ...ACTIVE_BRIEF,
  status: "complete",
};
const PENDING_SEARCH = {
  id: "search",
  type: "search",
  query: "independent coffee roasters in Portland",
  results: [],
};
const COMPLETE_SEARCH = {
  ...PENDING_SEARCH,
  results: [
    { id: "heart", title: "Heart Coffee", domain: "heartroasters.com" },
    {
      id: "coava",
      title: "Coava Coffee",
      domain: "coavacoffee.com",
    },
    {
      id: "upper-left",
      title: "Upper Left Roasters",
      domain: "upperleftroasters.com",
    },
  ],
  moreCount: 5,
};
const READ_TOOL = {
  id: "read",
  type: "tool",
  action: "read",
  target: "campaign-notes.md",
};
const ACTIVITY_FRAMES = [
  [ACTIVE_BRIEF],
  [COMPLETE_BRIEF, PENDING_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH, READ_TOOL],
  [
    COMPLETE_BRIEF,
    COMPLETE_SEARCH,
    READ_TOOL,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "launch-plan.ts",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "bun test launch" },
    {
      id: "verify",
      type: "step",
      label: "Checking the final campaign plan",
      status: "complete",
    },
  ],
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const frame = ref(0);
const items = computed(
  () => ACTIVITY_FRAMES[frame.value] as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  frame.value = 0;
  if (reduce.value) {
    frame.value = ACTIVITY_FRAMES.length - 1;
    complete.value = true;
    return;
  }
  for (let index = 1; index < ACTIVITY_FRAMES.length; index++)
    later(850 + (index - 1) * 1050, () => {
      frame.value = index;
    });
  later(4900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      :duration="5.1"
      :max-height="220"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
const ACTIVE_BRIEF = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
};
const COMPLETE_BRIEF = {
  ...ACTIVE_BRIEF,
  status: "complete",
};
const PENDING_SEARCH = {
  id: "search",
  type: "search",
  query: "independent coffee roasters in Portland",
  results: [],
};
const COMPLETE_SEARCH = {
  ...PENDING_SEARCH,
  results: [
    { id: "heart", title: "Heart Coffee", domain: "heartroasters.com" },
    {
      id: "coava",
      title: "Coava Coffee",
      domain: "coavacoffee.com",
    },
    {
      id: "upper-left",
      title: "Upper Left Roasters",
      domain: "upperleftroasters.com",
    },
  ],
  moreCount: 5,
};
const READ_TOOL = {
  id: "read",
  type: "tool",
  action: "read",
  target: "campaign-notes.md",
};
const ACTIVITY_FRAMES = [
  [ACTIVE_BRIEF],
  [COMPLETE_BRIEF, PENDING_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH, READ_TOOL],
  [
    COMPLETE_BRIEF,
    COMPLETE_SEARCH,
    READ_TOOL,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "launch-plan.ts",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "bun test launch" },
    {
      id: "verify",
      type: "step",
      label: "Checking the final campaign plan",
      status: "complete",
    },
  ],
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const frame = ref(0);
const items = computed(
  () => ACTIVITY_FRAMES[frame.value] as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  frame.value = 0;
  if (reduce.value) {
    frame.value = ACTIVITY_FRAMES.length - 1;
    complete.value = true;
    return;
  }
  for (let index = 1; index < ACTIVITY_FRAMES.length; index++)
    later(850 + (index - 1) * 1050, () => {
      frame.value = index;
    });
  later(4900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      :duration="5.1"
      :max-height="220"
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

<a id="streaming-text"></a>
### Streaming Text

随内容到达追加活动文字，并在分组中保留已完成步骤。

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
const REASONING = [
  "Reading the request and separating the content model from its presentation.",
  "The activity shell can stay consistent while each event supplies its own compact renderer.",
  "Text remains freeform so partial tokens can update without recreating the surrounding timeline.",
  "As each sentence wraps, the measured stream moves upward through a single transform instead of repeatedly jumping the native scroll position.",
  "Older context stays available above the fold while the newest tokens remain crisp at the bottom edge.",
  "Once the run finishes, the viewport switches from automatic following to ordinary user-controlled scrolling.",
  "Opening the completed disclosure returns to the beginning so the reasoning can be read in order.",
  "The capped viewport follows the latest sentence and preserves the full log after completion.",
].join("\n");
const CHARACTERS_PER_SECOND = 90;
const STREAM_SECONDS = REASONING.length / CHARACTERS_PER_SECOND;
const complete = ref(false),
  run = ref(0),
  reduce = ref(false),
  stream = ref("");
const items = computed<AgentActivityItem[]>(() =>
  stream.value
    .split("\n")
    .filter(Boolean)
    .map((content, index) => ({
      id: `reasoning-${index}`,
      type: "text",
      content,
    })),
);
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
function stopFrame() {
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
}
onBeforeUnmount(stopFrame);
function replay() {
  cancel();
  stopFrame();
  run.value++;
  complete.value = false;
  stream.value = "";
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce.value) {
    stream.value = REASONING;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    const count = Math.min(
      REASONING.length,
      Math.floor(((now - origin) * CHARACTERS_PER_SECOND) / 1000),
    );
    stream.value = REASONING.substring(0, count);
    if (count < REASONING.length) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(500, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="text"
      :duration="STREAM_SECONDS"
      :max-height="180"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
const REASONING = [
  "Reading the request and separating the content model from its presentation.",
  "The activity shell can stay consistent while each event supplies its own compact renderer.",
  "Text remains freeform so partial tokens can update without recreating the surrounding timeline.",
  "As each sentence wraps, the measured stream moves upward through a single transform instead of repeatedly jumping the native scroll position.",
  "Older context stays available above the fold while the newest tokens remain crisp at the bottom edge.",
  "Once the run finishes, the viewport switches from automatic following to ordinary user-controlled scrolling.",
  "Opening the completed disclosure returns to the beginning so the reasoning can be read in order.",
  "The capped viewport follows the latest sentence and preserves the full log after completion.",
].join("\n");
const CHARACTERS_PER_SECOND = 90;
const STREAM_SECONDS = REASONING.length / CHARACTERS_PER_SECOND;
const complete = ref(false),
  run = ref(0),
  reduce = ref(false),
  stream = ref("");
const items = computed<AgentActivityItem[]>(() =>
  stream.value
    .split("\n")
    .filter(Boolean)
    .map((content, index) => ({
      id: `reasoning-${index}`,
      type: "text",
      content,
    })),
);
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
function stopFrame() {
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
}
onBeforeUnmount(stopFrame);
function replay() {
  cancel();
  stopFrame();
  run.value++;
  complete.value = false;
  stream.value = "";
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce.value) {
    stream.value = REASONING;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    const count = Math.min(
      REASONING.length,
      Math.floor(((now - origin) * CHARACTERS_PER_SECOND) / 1000),
    );
    stream.value = REASONING.substring(0, count);
    if (count < REASONING.length) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(500, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="text"
      :duration="STREAM_SECONDS"
      :max-height="180"
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

<a id="reasoning-steps"></a>
### Reasoning Steps

将推理序列展示为独立步骤，并可折叠为摘要。

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
const STEPS = [
  { id: "brief", label: "Reading the product brief" },
  { id: "patterns", label: "Mapping the interaction patterns" },
  {
    id: "states",
    label: "Connecting the loading and completion states",
    meta: "3 states",
  },
  { id: "verify", label: "Verifying the final behavior" },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(1),
  settled = ref(false);
const items = computed<AgentActivityItem[]>(() =>
  STEPS.slice(0, visible.value).map((item, index) => ({
    ...item,
    type: "step",
    status: settled.value || index + 1 < visible.value ? "complete" : "active",
  })),
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 1;
  settled.value = false;
  if (reduce.value) {
    visible.value = STEPS.length;
    settled.value = true;
    complete.value = true;
    return;
  }
  for (let index = 2; index <= STEPS.length; index++)
    later(850 + (index - 2) * 800, () => {
      visible.value = index;
    });
  later(3300, () => {
    settled.value = true;
  });
  later(4200, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="step"
      :duration="4.2"
      :max-height="220"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
const STEPS = [
  { id: "brief", label: "Reading the product brief" },
  { id: "patterns", label: "Mapping the interaction patterns" },
  {
    id: "states",
    label: "Connecting the loading and completion states",
    meta: "3 states",
  },
  { id: "verify", label: "Verifying the final behavior" },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(1),
  settled = ref(false);
const items = computed<AgentActivityItem[]>(() =>
  STEPS.slice(0, visible.value).map((item, index) => ({
    ...item,
    type: "step",
    status: settled.value || index + 1 < visible.value ? "complete" : "active",
  })),
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 1;
  settled.value = false;
  if (reduce.value) {
    visible.value = STEPS.length;
    settled.value = true;
    complete.value = true;
    return;
  }
  for (let index = 2; index <= STEPS.length; index++)
    later(850 + (index - 2) * 800, () => {
      visible.value = index;
    });
  later(3300, () => {
    settled.value = true;
  });
  later(4200, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="step"
      :duration="4.2"
      :max-height="220"
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

<a id="web-search"></a>
### Web Search

用可识别的来源图标展示搜索及其结果。

**复制源码**

```vue
<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
// SVG bodies: @iconify-json/simple-icons 1.2.100, Simple Icons 16.35.0, CC0-1.0. See ../LICENSE.simple-icons.
const brandBodies = [
  '<path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133c-1.147 1.147-2.933 2.4-6.053 2.4c-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0C5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36c2.16-2.16 2.84-5.213 2.84-7.667c0-.76-.053-1.467-.173-2.053z"/>',
  '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  '<path fill="currentColor" d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728c-.616 1.074-1.127.931-1.532.029c-1.406-3.321-4.293-9.144-5.651-12.409c-.251-.601-.441-.987-.619-1.139q-.27-.225-1.122-.271q-.314-.034-.313-.159v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434q0 .177-.225.176l-.564.031c-.485.029-.727.164-.727.436c0 .135.053.33.166.601c1.082 2.646 4.818 10.521 4.818 10.521l.136.046l2.411-4.81l-.482-1.067l-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617c-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252l1.758-3.504c.293-.64.233-.801.111-.947c-.07-.084-.305-.22-.812-.24l-.201-.021a.23.23 0 0 1-.145-.051a.15.15 0 0 1-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178c-.646.03-.782.095-1.023.439c-.12.186-.375.589-.646 1.039l-2.301 4.273l-.065.135l2.792 5.712l.17.048l4.396-10.438c.154-.422.129-.722-.064-.895c-.197-.172-.346-.273-.857-.295l-.42-.016a.26.26 0 0 1-.152-.045c-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18c-.648.03-1.127.18-1.443.421c-.314.255-.557.616-.736 1.067c0 0-4.043 9.258-5.426 12.339c-.525 1.007-1.053.917-1.503-.031c-.571-1.171-1.773-3.786-2.646-5.71z"/>',
  '<path fill="currentColor" d="m12 1.608l12 20.784H0Z"/>',
];
const logos = brandBodies.map(
  (body) => () =>
    h("svg", {
      "aria-hidden": true,
      viewBox: "0 0 24 24",
      class: "size-3.5",
      fill: "currentColor",
      innerHTML: body,
    }),
);
const SEARCH_RESULTS = [
  {
    id: "google",
    title: "Google for Developers",
    domain: "developers.google.com",
    icon: logos[0],
  },
  { id: "github", title: "GitHub", domain: "github.com", icon: logos[1] },
  {
    id: "wikipedia",
    title: "Wikipedia",
    domain: "wikipedia.org",
    icon: logos[2],
  },
  {
    id: "vercel",
    title: "Vercel Docs",
    domain: "vercel.com/docs",
    icon: logos[3],
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed<AgentActivityItem[]>(() => [
  {
    id: "search",
    type: "search",
    query: "accessible animation patterns for Vue",
    results: SEARCH_RESULTS.slice(0, visible.value),
    moreCount: visible.value === SEARCH_RESULTS.length ? 7 : undefined,
  },
]);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = SEARCH_RESULTS.length;
    complete.value = true;
    return;
  }
  SEARCH_RESULTS.forEach((_, index) =>
    later(650 + 650 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(3900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="search"
      :max-height="220"
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
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
// SVG bodies: @iconify-json/simple-icons 1.2.100, Simple Icons 16.35.0, CC0-1.0. See ../LICENSE.simple-icons.
const brandBodies = [
  '<path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133c-1.147 1.147-2.933 2.4-6.053 2.4c-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0C5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36c2.16-2.16 2.84-5.213 2.84-7.667c0-.76-.053-1.467-.173-2.053z"/>',
  '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  '<path fill="currentColor" d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728c-.616 1.074-1.127.931-1.532.029c-1.406-3.321-4.293-9.144-5.651-12.409c-.251-.601-.441-.987-.619-1.139q-.27-.225-1.122-.271q-.314-.034-.313-.159v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434q0 .177-.225.176l-.564.031c-.485.029-.727.164-.727.436c0 .135.053.33.166.601c1.082 2.646 4.818 10.521 4.818 10.521l.136.046l2.411-4.81l-.482-1.067l-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617c-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252l1.758-3.504c.293-.64.233-.801.111-.947c-.07-.084-.305-.22-.812-.24l-.201-.021a.23.23 0 0 1-.145-.051a.15.15 0 0 1-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178c-.646.03-.782.095-1.023.439c-.12.186-.375.589-.646 1.039l-2.301 4.273l-.065.135l2.792 5.712l.17.048l4.396-10.438c.154-.422.129-.722-.064-.895c-.197-.172-.346-.273-.857-.295l-.42-.016a.26.26 0 0 1-.152-.045c-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18c-.648.03-1.127.18-1.443.421c-.314.255-.557.616-.736 1.067c0 0-4.043 9.258-5.426 12.339c-.525 1.007-1.053.917-1.503-.031c-.571-1.171-1.773-3.786-2.646-5.71z"/>',
  '<path fill="currentColor" d="m12 1.608l12 20.784H0Z"/>',
];
const logos = brandBodies.map(
  (body) => () =>
    h("svg", {
      "aria-hidden": true,
      viewBox: "0 0 24 24",
      class: "size-3.5",
      fill: "currentColor",
      innerHTML: body,
    }),
);
const SEARCH_RESULTS = [
  {
    id: "google",
    title: "Google for Developers",
    domain: "developers.google.com",
    icon: logos[0],
  },
  { id: "github", title: "GitHub", domain: "github.com", icon: logos[1] },
  {
    id: "wikipedia",
    title: "Wikipedia",
    domain: "wikipedia.org",
    icon: logos[2],
  },
  {
    id: "vercel",
    title: "Vercel Docs",
    domain: "vercel.com/docs",
    icon: logos[3],
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed<AgentActivityItem[]>(() => [
  {
    id: "search",
    type: "search",
    query: "accessible animation patterns for Vue",
    results: SEARCH_RESULTS.slice(0, visible.value),
    moreCount: visible.value === SEARCH_RESULTS.length ? 7 : undefined,
  },
]);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = SEARCH_RESULTS.length;
    complete.value = true;
    return;
  }
  SEARCH_RESULTS.forEach((_, index) =>
    later(650 + 650 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(3900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="search"
      :max-height="220"
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

<a id="tool-calls"></a>
### Tool Calls

跟踪工具调用，并展示等待与完成状态。

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
const TOOLS = [
  {
    id: "read",
    type: "tool",
    action: "read",
    target: "campaign-notes.md",
  },
  {
    id: "edit",
    type: "tool",
    action: "edit",
    target: "launch-plan.ts",
    additions: 42,
    deletions: 8,
  },
  {
    id: "run",
    type: "tool",
    action: "run",
    target: "bun test launch",
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed(
  () => TOOLS.slice(0, visible.value) as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = TOOLS.length;
    complete.value = true;
    return;
  }
  TOOLS.forEach((_, index) =>
    later(550 + 850 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(3600, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="tool"
      :max-height="220"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
const TOOLS = [
  {
    id: "read",
    type: "tool",
    action: "read",
    target: "campaign-notes.md",
  },
  {
    id: "edit",
    type: "tool",
    action: "edit",
    target: "launch-plan.ts",
    additions: 42,
    deletions: 8,
  },
  {
    id: "run",
    type: "tool",
    action: "run",
    target: "bun test launch",
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed(
  () => TOOLS.slice(0, visible.value) as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = TOOLS.length;
    complete.value = true;
    return;
  }
  TOOLS.forEach((_, index) =>
    later(550 + 850 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(3600, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="tool"
      :max-height="220"
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

<a id="mixed-activity"></a>
### Mixed Activity

把推理、搜索、消息和工具组合为同一变化中的活动分组。

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
const ACTIVE_BRIEF = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
};
const COMPLETE_BRIEF = {
  ...ACTIVE_BRIEF,
  status: "complete",
};
const PENDING_SEARCH = {
  id: "search",
  type: "search",
  query: "independent coffee roasters in Portland",
  results: [],
};
const COMPLETE_SEARCH = {
  ...PENDING_SEARCH,
  results: [
    { id: "heart", title: "Heart Coffee", domain: "heartroasters.com" },
    {
      id: "coava",
      title: "Coava Coffee",
      domain: "coavacoffee.com",
    },
    {
      id: "upper-left",
      title: "Upper Left Roasters",
      domain: "upperleftroasters.com",
    },
  ],
  moreCount: 5,
};
const READ_TOOL = {
  id: "read",
  type: "tool",
  action: "read",
  target: "campaign-notes.md",
};
const ACTIVITY_FRAMES = [
  [ACTIVE_BRIEF],
  [COMPLETE_BRIEF, PENDING_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH, READ_TOOL],
  [
    COMPLETE_BRIEF,
    COMPLETE_SEARCH,
    READ_TOOL,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "launch-plan.ts",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "bun test launch" },
    {
      id: "verify",
      type: "step",
      label: "Checking the final campaign plan",
      status: "complete",
    },
  ],
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const frame = ref(0);
const items = computed(
  () => ACTIVITY_FRAMES[frame.value] as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  frame.value = 0;
  if (reduce.value) {
    frame.value = ACTIVITY_FRAMES.length - 1;
    complete.value = true;
    return;
  }
  for (let index = 1; index < ACTIVITY_FRAMES.length; index++)
    later(850 + (index - 1) * 1050, () => {
      frame.value = index;
    });
  later(4900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      :duration="5.1"
      :max-height="220"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
const ACTIVE_BRIEF = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
};
const COMPLETE_BRIEF = {
  ...ACTIVE_BRIEF,
  status: "complete",
};
const PENDING_SEARCH = {
  id: "search",
  type: "search",
  query: "independent coffee roasters in Portland",
  results: [],
};
const COMPLETE_SEARCH = {
  ...PENDING_SEARCH,
  results: [
    { id: "heart", title: "Heart Coffee", domain: "heartroasters.com" },
    {
      id: "coava",
      title: "Coava Coffee",
      domain: "coavacoffee.com",
    },
    {
      id: "upper-left",
      title: "Upper Left Roasters",
      domain: "upperleftroasters.com",
    },
  ],
  moreCount: 5,
};
const READ_TOOL = {
  id: "read",
  type: "tool",
  action: "read",
  target: "campaign-notes.md",
};
const ACTIVITY_FRAMES = [
  [ACTIVE_BRIEF],
  [COMPLETE_BRIEF, PENDING_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH, READ_TOOL],
  [
    COMPLETE_BRIEF,
    COMPLETE_SEARCH,
    READ_TOOL,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "launch-plan.ts",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "bun test launch" },
    {
      id: "verify",
      type: "step",
      label: "Checking the final campaign plan",
      status: "complete",
    },
  ],
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const frame = ref(0);
const items = computed(
  () => ACTIVITY_FRAMES[frame.value] as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  frame.value = 0;
  if (reduce.value) {
    frame.value = ACTIVITY_FRAMES.length - 1;
    complete.value = true;
    return;
  }
  for (let index = 1; index < ACTIVITY_FRAMES.length; index++)
    later(850 + (index - 1) * 1050, () => {
      frame.value = index;
    });
  later(4900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      :duration="5.1"
      :max-height="220"
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

<a id="agent-trace"></a>
### Agent Trace

汇总工具调用数和消息数，同时保留各个独立步骤。

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@/components/orvui/agents/agent-activity";
const TRACE_ITEMS = [
  {
    id: "plan",
    type: "trace",
    kind: "thinking",
    label: "Thinking",
    detail: "Mapping the interaction flow…",
  },
  {
    id: "decision",
    type: "trace",
    kind: "message",
    label: "Decision",
    detail: "Use one compact disclosure",
  },
  {
    id: "write",
    type: "trace",
    kind: "write",
    label: "Draft component",
    detail: "components/agents/RunLog.vue",
  },
  {
    id: "verify",
    type: "trace",
    kind: "run",
    label: "Validate types",
    detail: "pnpm typecheck",
  },
  {
    id: "inspect",
    type: "trace",
    kind: "read",
    label: "Inspect preview",
    detail: "activity-preview.png",
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed(
  () => TRACE_ITEMS.slice(0, visible.value) as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = TRACE_ITEMS.length;
    complete.value = true;
    return;
  }
  TRACE_ITEMS.forEach((_, index) =>
    later(250 + 650 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(250 + TRACE_ITEMS.length * 650, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="trace"
      active-label="Running the agent trace…"
      :max-height="190"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "@orvui/vue/agents/agent-activity";
const TRACE_ITEMS = [
  {
    id: "plan",
    type: "trace",
    kind: "thinking",
    label: "Thinking",
    detail: "Mapping the interaction flow…",
  },
  {
    id: "decision",
    type: "trace",
    kind: "message",
    label: "Decision",
    detail: "Use one compact disclosure",
  },
  {
    id: "write",
    type: "trace",
    kind: "write",
    label: "Draft component",
    detail: "components/agents/RunLog.vue",
  },
  {
    id: "verify",
    type: "trace",
    kind: "run",
    label: "Validate types",
    detail: "pnpm typecheck",
  },
  {
    id: "inspect",
    type: "trace",
    kind: "read",
    label: "Inspect preview",
    detail: "activity-preview.png",
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed(
  () => TRACE_ITEMS.slice(0, visible.value) as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = TRACE_ITEMS.length;
    complete.value = true;
    return;
  }
  TRACE_ITEMS.forEach((_, index) =>
    later(250 + 650 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(250 + TRACE_ITEMS.length * 650, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="trace"
      active-label="Running the agent trace…"
      :max-height="190"
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

<a id="composition"></a>
### 组合结构

使用公开部件 AgentActivity 组合 Agent Activity，并从该组件的公开入口导入。

```text
Message
└── MessageContent
    └── AgentActivity
```

<a id="behavior"></a>
### 工作方式

将持续变化的助手活动组织为可展开步骤与完成摘要。

### 生命周期

#### 初始化

通过 items、contentType、status、duration、open、defaultOpen、collapseOnComplete、activeLabel、summary、maxHeight、contentClassName 配置 Agent Activity；API 表列出其类型与默认值。

#### 更新

监听 update:open、openChange，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Agent Activity 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 AgentActivity，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Agent Loading States](https://orvui.efu.me/components/agents/loading-states): 通过进度、推理和微光显示传达助手工作仍在进行。
- [Todo List](https://orvui.efu.me/components/agents/todo-list): 展示带展开详情和明确任务状态的工作条目序列。
- [Tool Result](https://orvui.efu.me/components/agents/tool-result): 在同一表面呈现工具调用状态、摘要与可展开结果。

### 能力边界

- 负责: Agent Activity 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Agent Activity：将持续变化的助手活动组织为可展开步骤与完成摘要。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `AgentActivity` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### AgentActivity

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `AgentActivityItem[]` | — | 是 | — |
| `contentType` | `"step" \| "text" \| "search" \| "tool" \| "trace" \| "mixed"` | — | 否 | — |
| `status` | `"complete" \| "working"` | `"working"` | 否 | — |
| `duration` | `number` | `0` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `collapseOnComplete` | `boolean` | `true` | 否 | — |
| `activeLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |
| `summary` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |
| `maxHeight` | `number` | `208` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `working-status` | `(context: { label: Content; duration: number; }) => VNodeChild` | `label: label`, `duration: duration` | — |
| `completed-status` | `(context: { summary: Content; duration: number; }) => VNodeChild` | `summary: summary`, `duration: duration` | — |

<a id="about"></a>
## 关于 Agent Activity

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Agent Activity？**

通过 items、contentType、status、duration、open、defaultOpen、collapseOnComplete、activeLabel、summary、maxHeight、contentClassName 配置 Agent Activity；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Tool Result](https://orvui.efu.me/components/agents/tool-result): 在同一表面呈现工具调用状态、摘要与可展开结果。
- [Tool Approval](https://orvui.efu.me/components/agents/tool-approval): 为待执行工具操作展示说明，并请求明确决策。
- [Agent Loading States](https://orvui.efu.me/components/agents/loading-states): 通过进度、推理和微光显示传达助手工作仍在进行。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/agent-activity.json
- 文档: https://orvui.efu.me/components/agents/agent-activity
- `packages/vue/src/agents/agent-activity/src/AgentActivity.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
