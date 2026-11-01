---
title: "Animated Alert"
description: "用紧凑消息行呈现反馈，可加入操作并允许关闭。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/alert"
markdown: "https://orvui.efu.me/components/motion/alert.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Animated Alert

> 用紧凑消息行呈现反馈，可加入操作并允许关闭。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Animated Alert：用紧凑消息行呈现反馈，可加入操作并允许关闭。

<a id="install"></a>
## 安装

### Animated Alert — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/alert.json https://orvui.efu.me/r/button.json https://orvui.efu.me/r/tabs.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
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
### Animated Alert

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Alert, AlertAction, AlertClose, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/orvui/motion/alert";
import { Button } from "@/components/orvui/motion/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import { resolveElement } from "@/components/orvui/lib/composables";
const messages = {
  info: { label: "Info", title: "A quick update", description: "Edits are stored in the background while you work." },
  success: { label: "Success", title: "Ready to go", description: "Your latest edits are now stored." },
  warning: { label: "Warning", title: "Storage is nearly full", description: "There is only a little storage left. Remove a few unused files to make room for your next upload." },
  destructive: { label: "Error", title: "Please try once more", description: "The latest edits could not be stored. Try saving again." },
};
type Variant = keyof typeof messages;
const selected = ref<Variant>("info"), opened = ref(true), showButton = ref<HTMLElement | null>(null);
const message = computed(() => messages[selected.value]);
function choose(value: string) { selected.value = value as Variant; opened.value = true; }
</script>
<template>
  <div class="flex w-full max-w-md flex-col items-center gap-6">
    <Tabs :model-value="selected" @update:model-value="choose" class="w-full"><TabsList aria-label="Alert variant" class="bg-muted">
      <TabsTrigger v-for="(item, variant) in messages" :key="variant" :value="variant" class="px-3 py-1.5 text-xs">{{ item.label }}</TabsTrigger>
    </TabsList></Tabs>
    <Alert v-model:open="opened" :variant="selected" :return-focus-ref="showButton ?? undefined"><AlertIcon /><AlertContent>
      <AlertTitle>{{ message.title }}</AlertTitle><AlertDescription>{{ message.description }}</AlertDescription>
      <AlertAction v-if="selected === 'destructive'"><Button size="sm" variant="outline" @click="selected = 'success'">Try again</Button></AlertAction>
    </AlertContent><AlertClose /></Alert>
    <Button :ref="node => showButton = resolveElement<HTMLElement>(node)" variant="ghost" size="sm" @click="opened = true" :disabled="opened">Show alert</Button>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Alert, AlertAction, AlertClose, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@orvui/vue/motion/alert";
import { Button } from "@orvui/vue/motion/button";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { resolveElement } from "@orvui/vue";
const messages = {
  info: { label: "Info", title: "A quick update", description: "Edits are stored in the background while you work." },
  success: { label: "Success", title: "Ready to go", description: "Your latest edits are now stored." },
  warning: { label: "Warning", title: "Storage is nearly full", description: "There is only a little storage left. Remove a few unused files to make room for your next upload." },
  destructive: { label: "Error", title: "Please try once more", description: "The latest edits could not be stored. Try saving again." },
};
type Variant = keyof typeof messages;
const selected = ref<Variant>("info"), opened = ref(true), showButton = ref<HTMLElement | null>(null);
const message = computed(() => messages[selected.value]);
function choose(value: string) { selected.value = value as Variant; opened.value = true; }
</script>
<template>
  <div class="flex w-full max-w-md flex-col items-center gap-6">
    <Tabs :model-value="selected" @update:model-value="choose" class="w-full"><TabsList aria-label="Alert variant" class="bg-muted">
      <TabsTrigger v-for="(item, variant) in messages" :key="variant" :value="variant" class="px-3 py-1.5 text-xs">{{ item.label }}</TabsTrigger>
    </TabsList></Tabs>
    <Alert v-model:open="opened" :variant="selected" :return-focus-ref="showButton ?? undefined"><AlertIcon /><AlertContent>
      <AlertTitle>{{ message.title }}</AlertTitle><AlertDescription>{{ message.description }}</AlertDescription>
      <AlertAction v-if="selected === 'destructive'"><Button size="sm" variant="outline" @click="selected = 'success'">Try again</Button></AlertAction>
    </AlertContent><AlertClose /></Alert>
    <Button :ref="node => showButton = resolveElement<HTMLElement>(node)" variant="ghost" size="sm" @click="opened = true" :disabled="opened">Show alert</Button>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Alert` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Alert

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"default" \| "info" \| "success" \| "warning" \| "destructive"` | `"default"` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `true` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |
| `role` | `"alert" \| "status"` | — | 否 | — |
| `returnFocusRef` | `HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `dismiss: dismiss` | — |

### AlertAction

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### AlertClose

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AlertContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### AlertDescription

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### AlertIcon

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AlertTitle

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

<a id="about"></a>
## 关于 Animated Alert

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated Alert？**

通过 variant、open、defaultOpen、contentClassName、role、returnFocusRef 配置 Animated Alert；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Aspect Ratio](https://orvui.efu.me/components/motion/aspect-ratio): 为媒体预留指定宽高比例，并在比例变化时平滑调整。
- [Date Range Picker](https://orvui.efu.me/components/motion/date-range-picker): 在行内或浮动日历中选择日期区间的起点与终点。
- [Card](https://orvui.efu.me/components/motion/card): 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/alert.json
- 文档: https://orvui.efu.me/components/motion/alert
- `packages/vue/src/motion/alert/src/Alert.vue`
- `packages/vue/src/motion/alert/src/AlertAction.vue`
- `packages/vue/src/motion/alert/src/AlertClose.vue`
- `packages/vue/src/motion/alert/src/AlertContent.vue`
- `packages/vue/src/motion/alert/src/AlertDescription.vue`
- `packages/vue/src/motion/alert/src/AlertIcon.vue`
- `packages/vue/src/motion/alert/src/AlertTitle.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
