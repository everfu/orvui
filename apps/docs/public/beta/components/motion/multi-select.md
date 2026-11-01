---
title: "Multi Select"
description: "在可搜索控件中选择多个选项，并管理生成的标签。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/multi-select"
markdown: "https://orvui.efu.me/components/motion/multi-select.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Multi Select

> 在可搜索控件中选择多个选项，并管理生成的标签。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Multi Select：在可搜索控件中选择多个选项，并管理生成的标签。

<a id="install"></a>
## 安装

### Multi Select — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/multi-select.json
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
### Multi Select

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Circle } from "lucide-vue-next";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectInput,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectGroup,
  MultiSelectLabel,
  MultiSelectItem,
  MultiSelectEmpty,
} from "@/components/orvui/motion/multi-select";
const selected = ref(["design", "engineering"]);
const groups = [
  {
    label: "Product teams",
    items: [
      {
        value: "design",
        label: "Design",
        color: "fill-rose-500 text-rose-500",
      },
      {
        value: "engineering",
        label: "Engineering",
        color: "fill-sky-500 text-sky-500",
      },
      {
        value: "product",
        label: "Product",
        color: "fill-amber-500 text-amber-500",
      },
      {
        value: "research",
        label: "Research",
        color: "fill-violet-500 text-violet-500",
      },
    ],
  },
  {
    label: "Business teams",
    items: [
      {
        value: "marketing",
        label: "Marketing",
        color: "fill-emerald-500 text-emerald-500",
      },
      {
        value: "operations",
        label: "Operations",
        color: "fill-slate-500 text-slate-500",
      },
    ],
  },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-24">
    <div class="w-full max-w-sm">
      <MultiSelect v-model="selected"
        ><MultiSelectTrigger
          ><MultiSelectValue placeholder="Choose teams" /><MultiSelectInput
            aria-label="Search teams" /></MultiSelectTrigger
        ><MultiSelectContent
          ><MultiSelectList aria-label="Teams"
            ><MultiSelectGroup v-for="group in groups" :key="group.label"
              ><MultiSelectLabel>{{ group.label }}</MultiSelectLabel
              ><MultiSelectItem
                v-for="team in group.items"
                :key="team.value"
                :value="team.value"
                :text-value="team.label"
                ><span class="flex items-center gap-2.5"
                  ><Circle
                    aria-hidden="true"
                    :class="['size-2.5', team.color]"
                  />{{ team.label }}</span
                ></MultiSelectItem
              ></MultiSelectGroup
            ><MultiSelectEmpty
              >No teams found.</MultiSelectEmpty
            ></MultiSelectList
          ></MultiSelectContent
        ></MultiSelect
      >
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Circle } from "lucide-vue-next";
import { MultiSelect, MultiSelectTrigger, MultiSelectValue, MultiSelectInput, MultiSelectContent, MultiSelectList, MultiSelectGroup, MultiSelectLabel, MultiSelectItem, MultiSelectEmpty } from "@orvui/vue/motion/multi-select";
const selected = ref(["design", "engineering"]);
const groups = [
  {
    label: "Product teams",
    items: [
      {
        value: "design",
        label: "Design",
        color: "fill-rose-500 text-rose-500",
      },
      {
        value: "engineering",
        label: "Engineering",
        color: "fill-sky-500 text-sky-500",
      },
      {
        value: "product",
        label: "Product",
        color: "fill-amber-500 text-amber-500",
      },
      {
        value: "research",
        label: "Research",
        color: "fill-violet-500 text-violet-500",
      },
    ],
  },
  {
    label: "Business teams",
    items: [
      {
        value: "marketing",
        label: "Marketing",
        color: "fill-emerald-500 text-emerald-500",
      },
      {
        value: "operations",
        label: "Operations",
        color: "fill-slate-500 text-slate-500",
      },
    ],
  },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-24">
    <div class="w-full max-w-sm">
      <MultiSelect v-model="selected"
        ><MultiSelectTrigger
          ><MultiSelectValue placeholder="Choose teams" /><MultiSelectInput
            aria-label="Search teams" /></MultiSelectTrigger
        ><MultiSelectContent
          ><MultiSelectList aria-label="Teams"
            ><MultiSelectGroup v-for="group in groups" :key="group.label"
              ><MultiSelectLabel>{{ group.label }}</MultiSelectLabel
              ><MultiSelectItem
                v-for="team in group.items"
                :key="team.value"
                :value="team.value"
                :text-value="team.label"
                ><span class="flex items-center gap-2.5"
                  ><Circle
                    aria-hidden="true"
                    :class="['size-2.5', team.color]"
                  />{{ team.label }}</span
                ></MultiSelectItem
              ></MultiSelectGroup
            ><MultiSelectEmpty
              >No teams found.</MultiSelectEmpty
            ></MultiSelectList
          ></MultiSelectContent
        ></MultiSelect
      >
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `MultiSelect` | `v-model` | `string[]` | `update:modelValue` |
| `MultiSelect` | `v-model:open` | `boolean` | `update:open` |
| `MultiSelect` | `v-model:query` | `string` | `update:query` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### MultiSelect

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string[]` | — | 否 | — |
| `defaultValue` | `string[]` | `(multiple ? [] : undefined)` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `query` | `string` | — | 否 | — |
| `defaultQuery` | `string` | `""` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `filter` | `(value: string, query: string, keywords: string[]) => boolean` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `update:query` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value`, `query: state.query.value` | — |

### MultiSelectTrigger

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectValue

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Select options"` | 否 | — |
| `chipClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: value`, `label: state.labelFor(value)` | — |

### MultiSelectInput

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Search…"` | 否 | — |
| `wrapperClassName` | `string` | — | 否 | — |
| `showIcon` | `boolean` | `false` | 否 | — |

### MultiSelectContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom"` | `"bottom"` | 否 | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | 否 | — |
| `sideOffset` | `number` | `6` | 否 | — |
| `avoidCollisions` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectList

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Options"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectGroup

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectLabel

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `textValue` | `string` | — | 否 | — |
| `label` | `string` | — | 否 | — |
| `keywords` | `string[]` | `() => []` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | `[value: string]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectEmpty

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Multi Select

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Multi Select？**

通过字符串数组 modelValue 与 update:modelValue 管理选中值；非受控用法使用 defaultValue。

**如何连接到应用状态？**

监听 update:modelValue、change、update:open、update:query，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Combobox](https://orvui.efu.me/components/motion/combobox): 通过输入框筛选分组选项，键盘焦点保持在输入区域。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。
- [Tooltip](https://orvui.efu.me/components/motion/tooltip): 在悬停或聚焦时显示简短说明，不挤动周围内容。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/multi-select.json
- 文档: https://orvui.efu.me/components/motion/multi-select
- `packages/vue/src/motion/multi-select/src/MultiSelect.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectTrigger.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectValue.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectInput.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectContent.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectList.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectGroup.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectLabel.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectItem.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectEmpty.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
