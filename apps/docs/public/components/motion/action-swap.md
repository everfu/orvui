---
title: "Action Swap"
description: "使用模糊、滚动或错开过渡替换简短操作文字与图标。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/action-swap"
markdown: "https://orvui.efu.me/components/motion/action-swap.md"
license: "MIT"
productVersion: "0.1.0"
---

# Action Swap

> 使用模糊、滚动或错开过渡替换简短操作文字与图标。

使用模糊、滚动或错开过渡替换简短操作文字与图标。

## 适用场景

- 当界面需要以下行为时使用 Action Swap：使用模糊、滚动或错开过渡替换简短操作文字与图标。

## 安装

### Action Swap — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Cascade — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap-cascade.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Blur — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap-blur.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Roll — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/action-swap-roll.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Action Swap

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Check, Copy, Send, Sparkles } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT } from "@/components/orvui/lib/ease";
import { useReducedMotion } from "@/components/orvui/lib/composables";
import { ActionSwapButton } from "@/components/orvui/motion/action-swap";
const reduced = useReducedMotion(), animation = ref<"blur" | "roll">("blur");
const selected = reactive({ blur: "copy", roll: "send" });
const items = {
  blur: [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }],
  roll: [{ id: "send", label: "Send", icon: Send, ariaLabel: "Send" }, { id: "sent", label: "Sent", icon: Sparkles, ariaLabel: "Sent" }],
};
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { animation.value = animation.value === "blur" ? "roll" : "blur"; }, 2600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="relative flex min-h-12 min-w-36 items-center justify-center"><AnimatePresence mode="wait" :initial="false">
  <motion.div :key="animation" :initial="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(4px)' }"
    :animate="{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-4px)' }" :transition="{ duration: 0.22, ease: EASE_OUT }">
    <ActionSwapButton v-if="animation === 'blur'" v-model="selected.blur" :items="items.blur" animation="blur" variant="secondary" />
    <ActionSwapButton v-else v-model="selected.roll" :items="items.roll" animation="roll" variant="primary" />
  </motion.div>
</AnimatePresence></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Check, Copy, Send, Sparkles } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT } from "@orvui/vue";
import { useReducedMotion } from "@orvui/vue";
import { ActionSwapButton } from "@orvui/vue/motion/action-swap";
const reduced = useReducedMotion(), animation = ref<"blur" | "roll">("blur");
const selected = reactive({ blur: "copy", roll: "send" });
const items = {
  blur: [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }],
  roll: [{ id: "send", label: "Send", icon: Send, ariaLabel: "Send" }, { id: "sent", label: "Sent", icon: Sparkles, ariaLabel: "Sent" }],
};
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { animation.value = animation.value === "blur" ? "roll" : "blur"; }, 2600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="relative flex min-h-12 min-w-36 items-center justify-center"><AnimatePresence mode="wait" :initial="false">
  <motion.div :key="animation" :initial="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(4px)' }"
    :animate="{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-4px)' }" :transition="{ duration: 0.22, ease: EASE_OUT }">
    <ActionSwapButton v-if="animation === 'blur'" v-model="selected.blur" :items="items.blur" animation="blur" variant="secondary" />
    <ActionSwapButton v-else v-model="selected.roll" :items="items.roll" animation="roll" variant="primary" />
  </motion.div>
</AnimatePresence></div></template>
```

### Cascade

让旧标签字符离开，再逐字带入替换内容。

**复制源码**

```vue
<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { ActionSwapCascadeButton } from "@/components/orvui/motion/action-swap";
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied!", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex w-full justify-center"><ActionSwapCascadeButton :items="actions" variant="primary" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { ActionSwapCascadeButton } from "@orvui/vue/motion/action-swap";
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied!", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex w-full justify-center"><ActionSwapCascadeButton :items="actions" variant="primary" /></div></template>
```

### Blur

使用短暂模糊和缩放过渡交叉切换操作内容。

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Check, Copy, Moon, Sun } from "lucide-vue-next";
import { ActionSwapBlurButton } from "@/components/orvui/motion/action-swap";
const selected = reactive({ text: "copy", icon: "light", action: "copy" });
const labels = [{ id: "copy", label: "Copy" }, { id: "copied", label: "Copied" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapBlurButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapBlurButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapBlurButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Check, Copy, Moon, Sun } from "lucide-vue-next";
import { ActionSwapBlurButton } from "@orvui/vue/motion/action-swap";
const selected = reactive({ text: "copy", icon: "light", action: "copy" });
const labels = [{ id: "copy", label: "Copy" }, { id: "copied", label: "Copied" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapBlurButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapBlurButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapBlurButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

### Roll

让下一段标签或图标从下方向上进入原有空间。

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Moon, Send, Sparkles, Sun } from "lucide-vue-next";
import { ActionSwapRollButton } from "@/components/orvui/motion/action-swap";
const selected = reactive({ text: "idle", icon: "light", action: "send" });
const labels = [{ id: "idle", label: "Save" }, { id: "done", label: "Saved" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "send", label: "Send invite", icon: Send, ariaLabel: "Send invite" }, { id: "sent", label: "Invite sent", icon: Sparkles, ariaLabel: "Invite sent" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapRollButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapRollButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapRollButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Moon, Send, Sparkles, Sun } from "lucide-vue-next";
import { ActionSwapRollButton } from "@orvui/vue/motion/action-swap";
const selected = reactive({ text: "idle", icon: "light", action: "send" });
const labels = [{ id: "idle", label: "Save" }, { id: "done", label: "Saved" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "send", label: "Send invite", icon: Send, ariaLabel: "Send invite" }, { id: "sent", label: "Invite sent", icon: Sparkles, ariaLabel: "Invite sent" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapRollButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapRollButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapRollButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
```

## API 参考

### ActionSwapButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `value` | `string` | `value.value` | 否 | — |
| `defaultValue` | `string` | `props.items[0]?.id` | 否 | — |
| `animation` | `"blur" \| "cascade" \| "roll"` | `"blur"` | 否 | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `"secondary"` | 否 | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | 否 | — |
| `iconOnly` | `boolean` | `undefined` | 否 | — |
| `cycle` | `boolean` | `true` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |
| `click` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | — | `item: selected` | — |
| `default` | — | `item: selected` | — |

### ActionSwapIcon

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | — | 是 | — |
| `animation` | `"blur" \| "cascade" \| "roll"` | `"blur"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ActionSwapText

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | — | 是 | — |
| `animation` | `"blur" \| "cascade" \| "roll"` | `"blur"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ActionSwapCascadeButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | — | 否 | — |
| `cycle` | `boolean` | `undefined` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | 否 | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `v-bind: slotProps` | — |
| `icon` | — | `v-bind: slotProps` | — |

### ActionSwapBlurButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | — | 否 | — |
| `cycle` | `boolean` | `undefined` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | 否 | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `v-bind: slotProps` | — |
| `icon` | — | `v-bind: slotProps` | — |

### ActionSwapRollButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; label: VNodeChild \| Component; icon?: VNodeChild \| Component; ariaLabel?: string; }[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | — | 否 | — |
| `cycle` | `boolean` | `undefined` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | 否 | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:value` | — | — |
| `valueChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `v-bind: slotProps` | — |
| `icon` | — | `v-bind: slotProps` | — |

## 关于 Action Swap

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Action Swap？**

通过 items、modelValue、value、defaultValue、animation、variant、size、iconOnly、cycle、disabled 配置 Action Swap；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change、update:value、valueChange、click，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/action-swap.json
- 文档: https://orvui.efu.me/components/motion/action-swap
- `packages/vue/src/motion/action-swap/src/ActionSwapButton.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapIcon.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapText.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapCascadeButton.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapBlurButton.vue`
- `packages/vue/src/motion/action-swap/src/ActionSwapRollButton.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
