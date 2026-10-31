---
title: "Dynamic Island"
description: "在多个实时活动视图间切换紧凑胶囊，保持对象身份连续。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/dynamic-island"
markdown: "https://orvui.efu.me/components/blocks/dynamic-island.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Dynamic Island

> 在多个实时活动视图间切换紧凑胶囊，保持对象身份连续。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Dynamic Island：在多个实时活动视图间切换紧凑胶囊，保持对象身份连续。

<a id="install"></a>
## 安装

### Dynamic Island — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/dynamic-island.json https://orvui.efu.me/r/button.json https://orvui.efu.me/r/number.json
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
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Dynamic Island

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { motion } from "motion-v";
import { Music, Phone, PhoneOff, Timer } from "lucide-vue-next";
import { DynamicIsland, DynamicIslandView } from "@/components/orvui/blocks/dynamic-island";
import { Button } from "@/components/orvui/motion/button";
import { NumberTicker } from "@/components/orvui/motion/number";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const view = ref<"call" | "timer" | "music" | null>(null),
  seconds = ref(154),
  reduce = useReducedMotion(),
  delays = [0, 0.18, 0.09, 0.27];
let tick: ReturnType<typeof setInterval> | undefined;
watch(view, (next) => {
  clearInterval(tick);
  if (next === "timer")
    tick = setInterval(() => {
      seconds.value = Math.max(0, seconds.value - 1);
    }, 1000);
});
onBeforeUnmount(() => clearInterval(tick));
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex h-32 w-full items-start justify-center pt-2">
      <DynamicIsland :view="view"
        ><template #compact
          ><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)" /><span
            >9:41</span
          ></template
        ><DynamicIslandView id="call" class="gap-4"
          ><div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider opacity-60"
              >Incoming call</span
            ><span class="text-sm font-semibold">orvui Demo</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="action in [
                { label: 'Decline', icon: PhoneOff, tone: 'bg-destructive' },
                { label: 'Accept', icon: Phone, tone: 'bg-(--color-success)' },
              ]"
              :key="action.label"
              type="button"
              :aria-label="action.label"
              class="flex h-8 w-8 items-center justify-center rounded-full text-white"
              :class="action.tone"
              @click="view = null"
            >
              <component :is="action.icon" class="h-3.5 w-3.5" />
            </button></div></DynamicIslandView
        ><DynamicIslandView id="timer" class="gap-3"
          ><Timer class="h-4 w-4 text-(--color-warning)" /><span
            class="text-[10px] uppercase tracking-wider opacity-60"
            >Timer</span
          ><NumberTicker
            :value="seconds"
            :format="clock"
            :start-on-view="false"
            :duration="0.5"
            class="text-sm font-semibold" /></DynamicIslandView
        ><DynamicIslandView id="music" class="gap-3"
          ><span
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-background/15"
            ><Music class="h-3.5 w-3.5"
          /></span>
          <div class="flex flex-col text-left">
            <span class="text-xs font-semibold leading-tight"
              >Midnight City</span
            ><span class="text-[10px] opacity-60">M83</span>
          </div>
          <span class="flex h-4 items-end gap-0.5" aria-hidden="true"
            ><motion.span
              v-for="delay in delays"
              :key="delay"
              :animate="
                reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
              "
              :transition="{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }"
              class="h-full w-0.5 origin-bottom rounded-full bg-(--color-success)"
              :style="{ scaleY: 0.6 }" /></span></DynamicIslandView
      ></DynamicIsland>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button size="sm" variant="secondary" @click="view = 'call'">Call</Button
      ><Button
        size="sm"
        variant="secondary"
        @click="
          seconds = 154;
          view = 'timer';
        "
        >Timer</Button
      ><Button size="sm" variant="secondary" @click="view = 'music'"
        >Music</Button
      ><Button size="sm" variant="ghost" @click="view = null">Dismiss</Button>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { motion } from "motion-v";
import { Music, Phone, PhoneOff, Timer } from "lucide-vue-next";
import { DynamicIsland, DynamicIslandView } from "@orvui/vue/blocks/dynamic-island";
import { Button } from "@orvui/vue/motion/button";
import { NumberTicker } from "@orvui/vue/motion/number";
import { useReducedMotion } from "@orvui/vue";
const view = ref<"call" | "timer" | "music" | null>(null),
  seconds = ref(154),
  reduce = useReducedMotion(),
  delays = [0, 0.18, 0.09, 0.27];
let tick: ReturnType<typeof setInterval> | undefined;
watch(view, (next) => {
  clearInterval(tick);
  if (next === "timer")
    tick = setInterval(() => {
      seconds.value = Math.max(0, seconds.value - 1);
    }, 1000);
});
onBeforeUnmount(() => clearInterval(tick));
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex h-32 w-full items-start justify-center pt-2">
      <DynamicIsland :view="view"
        ><template #compact
          ><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)" /><span
            >9:41</span
          ></template
        ><DynamicIslandView id="call" class="gap-4"
          ><div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider opacity-60"
              >Incoming call</span
            ><span class="text-sm font-semibold">orvui Demo</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="action in [
                { label: 'Decline', icon: PhoneOff, tone: 'bg-destructive' },
                { label: 'Accept', icon: Phone, tone: 'bg-(--color-success)' },
              ]"
              :key="action.label"
              type="button"
              :aria-label="action.label"
              class="flex h-8 w-8 items-center justify-center rounded-full text-white"
              :class="action.tone"
              @click="view = null"
            >
              <component :is="action.icon" class="h-3.5 w-3.5" />
            </button></div></DynamicIslandView
        ><DynamicIslandView id="timer" class="gap-3"
          ><Timer class="h-4 w-4 text-(--color-warning)" /><span
            class="text-[10px] uppercase tracking-wider opacity-60"
            >Timer</span
          ><NumberTicker
            :value="seconds"
            :format="clock"
            :start-on-view="false"
            :duration="0.5"
            class="text-sm font-semibold" /></DynamicIslandView
        ><DynamicIslandView id="music" class="gap-3"
          ><span
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-background/15"
            ><Music class="h-3.5 w-3.5"
          /></span>
          <div class="flex flex-col text-left">
            <span class="text-xs font-semibold leading-tight"
              >Midnight City</span
            ><span class="text-[10px] opacity-60">M83</span>
          </div>
          <span class="flex h-4 items-end gap-0.5" aria-hidden="true"
            ><motion.span
              v-for="delay in delays"
              :key="delay"
              :animate="
                reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
              "
              :transition="{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }"
              class="h-full w-0.5 origin-bottom rounded-full bg-(--color-success)"
              :style="{ scaleY: 0.6 }" /></span></DynamicIslandView
      ></DynamicIsland>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button size="sm" variant="secondary" @click="view = 'call'">Call</Button
      ><Button
        size="sm"
        variant="secondary"
        @click="
          seconds = 154;
          view = 'timer';
        "
        >Timer</Button
      ><Button size="sm" variant="secondary" @click="view = 'music'"
        >Music</Button
      ><Button size="sm" variant="ghost" @click="view = null">Dismiss</Button>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### DynamicIsland

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `view` | `string \| null` | — | 是 | — |
| `compact` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `compact` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### DynamicIslandView

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | 是 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Dynamic Island

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Dynamic Island？**

通过 view、compact 配置 Dynamic Island；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过compact、default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Swipeable List](https://orvui.efu.me/components/blocks/swipeable-list): 通过指针或键盘输入，展示列表行左右两侧的操作。
- [404 / Not Found](https://orvui.efu.me/components/blocks/not-found): 通过动态视觉呈现缺失目标，并提供返回有效内容的路径。
- [Expandable Tabs](https://orvui.efu.me/components/blocks/expandable-tabs): 在图标条中导航，选中项展开以显示标签。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/dynamic-island.json
- 文档: https://orvui.efu.me/components/blocks/dynamic-island
- `packages/vue/src/blocks/dynamic-island/src/DynamicIsland.vue`
- `packages/vue/src/blocks/dynamic-island/src/DynamicIslandView.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
