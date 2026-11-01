# Select · orvui 0.1.1

## 选择与组合

固定选项使用 Select，可搜索单选使用 Combobox，多选使用 Multi Select；即时设置用 Switch，需要随表单提交的勾选用 Checkbox。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Select"
description: "从浮动列表选择选项，面板可从触发器连续展开。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/select"
markdown: "https://orvui.efu.me/components/motion/select.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Select

> 从浮动列表选择选项，面板可从触发器连续展开。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Select：从浮动列表选择选项，面板可从触发器连续展开。

<a id="install"></a>
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

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="default"></a>
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

<a id="morph"></a>
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Select` | `v-model` | `string` | `update:modelValue` |
| `Select` | `v-model:open` | `boolean` | `update:open` |
| `MorphSelect` | `v-model` | `string` | `update:modelValue` |
| `MorphSelect` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Select

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Select？**

通过 modelValue、value、defaultValue、open、defaultOpen、disabled、className 配置 Select；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、change、update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Radio Group](https://orvui.efu.me/components/motion/radio): 从带标签、支持键盘导航的选项组中选择一个值。
- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。
- [Input](https://orvui.efu.me/components/motion/input): 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

<a id="licenses"></a>
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

