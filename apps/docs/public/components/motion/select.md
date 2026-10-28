---
title: "Select"
description: "从浮动列表选择选项，面板可从触发器连续展开。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/select"
markdown: "https://orvui.efu.me/components/motion/select.md"
license: "MIT"
productVersion: "0.1.0"
---

# Select

> 从浮动列表选择选项，面板可从触发器连续展开。

从浮动列表选择选项，面板可从触发器连续展开。

## 适用场景

- 当界面需要以下行为时使用 Select：从浮动列表选择选项，面板可从触发器连续展开。

## 安装

### Select — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/select.json
```

### Select — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/select.json
```

### Morph Select — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/select-morph.json
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

- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## 用法

### Select

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/orvui/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@orvui/vue/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

### Select

组合触发器、当前值与选项，分离式面板根据可用空间选择展开方向。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/orvui/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@orvui/vue/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

### Morph Select

通过共享 layoutId 的配套部件，让触发器连续生长为选项表面。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  MorphSelect,
  MorphSelectTrigger,
  MorphSelectValue,
  MorphSelectContent,
  MorphSelectItem,
} from "@/components/orvui/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <MorphSelect v-model="selected"
      ><MorphSelectTrigger
        ><MorphSelectValue placeholder="Pick a Vue tool" /></MorphSelectTrigger
      ><MorphSelectContent
        ><MorphSelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</MorphSelectItem
        ></MorphSelectContent
      ></MorphSelect
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MorphSelect, MorphSelectTrigger, MorphSelectValue, MorphSelectContent, MorphSelectItem } from "@orvui/vue/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <MorphSelect v-model="selected"
      ><MorphSelectTrigger
        ><MorphSelectValue placeholder="Pick a Vue tool" /></MorphSelectTrigger
      ><MorphSelectContent
        ><MorphSelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</MorphSelectItem
        ></MorphSelectContent
      ></MorphSelect
    >
  </div>
</template>
```

## API 参考

### Select

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `props.value` | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | — | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value` | — |

### SelectTrigger

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SelectValue

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Select"` | 否 | — |
| `className` | `string` | — | 否 | — |

### SelectContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SelectItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `label` | `string` | `element.value?.textContent?.trim()` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphSelect

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `props.value` | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | — | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value` | — |

### MorphSelectTrigger

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphSelectValue

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | — | 否 | — |
| `className` | `string` | — | 否 | — |

### MorphSelectContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphSelectItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `label` | `string` | — | 否 | — |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Select

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Select？**

通过 modelValue、value、defaultValue、open、defaultOpen、disabled、className 配置 Select；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、change、update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/select.json
- 文档: https://orvui.efu.me/components/motion/select
- `packages/vue/src/motion/select/src/Select.vue`
- `packages/vue/src/motion/select/src/SelectTrigger.vue`
- `packages/vue/src/motion/select/src/SelectValue.vue`
- `packages/vue/src/motion/select/src/SelectContent.vue`
- `packages/vue/src/motion/select/src/SelectItem.vue`
- `packages/vue/src/motion/select/src/MorphSelect.vue`
- `packages/vue/src/motion/select/src/MorphSelectTrigger.vue`
- `packages/vue/src/motion/select/src/MorphSelectValue.vue`
- `packages/vue/src/motion/select/src/MorphSelectContent.vue`
- `packages/vue/src/motion/select/src/MorphSelectItem.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
