---
title: "Table of Contents"
description: "通过锚点链接浏览文章章节，目录指示器随阅读位置更新。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/table-of-contents"
markdown: "https://orvui.efu.me/components/motion/table-of-contents.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Table of Contents

> 通过锚点链接浏览文章章节，目录指示器随阅读位置更新。

<a id="when-to-use"></a>

## 适用场景

- 用于较长的指南、参考文档或文章，让读者快速跳转章节并确认阅读位置。

<a id="install"></a>
## 安装

### Table of Contents — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/table-of-contents.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Table of Contents

**复制源码**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { TableOfContents } from "@/components/orvui/motion/table-of-contents";
const target = ref<HTMLElement | null>(null);
const instance = useId();
const items = ["Overview", "Installation", "Usage", "Accessibility"].map(
  (label, i) => ({ id: `${instance}-section-${i}`, label }),
);
</script>
<template>
  <div class="grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_9rem] gap-5 p-4">
    <div
      ref="target"
      class="h-72 overflow-y-auto rounded-xl border border-border bg-background px-5"
      tabindex="0"
      aria-label="Example article"
    >
      <section
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="min-h-52 py-6"
      >
        <h3 class="text-base font-medium">{{ item.label }}</h3>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">
          Follow this article using the links alongside it. The active section
          updates as you scroll.
        </p>
      </section>
    </div>
    <TableOfContents
      :items="items"
      :target="target ?? undefined"
      :offset="16"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { TableOfContents } from "@orvui/vue/motion/table-of-contents";
const target = ref<HTMLElement | null>(null);
const instance = useId();
const items = ["Overview", "Installation", "Usage", "Accessibility"].map(
  (label, i) => ({ id: `${instance}-section-${i}`, label }),
);
</script>
<template>
  <div class="grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_9rem] gap-5 p-4">
    <div
      ref="target"
      class="h-72 overflow-y-auto rounded-xl border border-border bg-background px-5"
      tabindex="0"
      aria-label="Example article"
    >
      <section
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="min-h-52 py-6"
      >
        <h3 class="text-base font-medium">{{ item.label }}</h3>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">
          Follow this article using the links alongside it. The active section
          updates as you scroll.
        </p>
      </section>
    </div>
    <TableOfContents
      :items="items"
      :target="target ?? undefined"
      :offset="16"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `TableOfContents` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### TableOfContents

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `TableOfContentsItem[]` | — | 是 | — |
| `target` | `string \| HTMLElement \| ComponentPublicInstance \| Ref<HTMLElement \| ComponentPublicInstance \| null \| undefined, HTMLElement \| ComponentPublicInstance \| null \| undefined> \| () => HTMLElement \| null` | — | 否 | — |
| `offset` | `number` | `88` | 否 | — |
| `modelValue` | `string` | `local.value` | 否 | — |
| `title` | `string` | `"On this page"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[id: string]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `title` | `() => unknown` | — | — |
| `item` | `(props: { item: TableOfContentsItem; active: boolean; }) => unknown` | `item: item`, `active: active === item.id` | — |

<a id="about"></a>
## 关于 Table of Contents

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Table of Contents？**

传入包含稳定章节 ID 的 items，以及正文元素或选择器 target。通过 modelValue 与 update:modelValue 读取阅读位置；offset 默认 88px。

**如何连接到应用状态？**

监听 update:modelValue，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Timeline](https://orvui.efu.me/components/motion/timeline): 沿可拖动轨道浏览日期事件，当前事件保持在焦点位置。
- [Animated Alert](https://orvui.efu.me/components/motion/alert): 用紧凑消息行呈现反馈，可加入操作并允许关闭。
- [Animated Collapsible](https://orvui.efu.me/components/motion/collapsible): 将触发器与可展开区域连接，展开时保持周围布局连续。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/table-of-contents.json
- 文档: https://orvui.efu.me/components/motion/table-of-contents
- `packages/vue/src/motion/table-of-contents/src/TableOfContents.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
