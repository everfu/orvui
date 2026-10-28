---
title: "Morphing Tabs"
description: "在连续布局过渡中切换标签页并调整其排列顺序。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/morphing-tabs"
markdown: "https://orvui.efu.me/components/blocks/morphing-tabs.md"
license: "MIT"
productVersion: "0.1.0"
---

# Morphing Tabs

> 在连续布局过渡中切换标签页并调整其排列顺序。

在连续布局过渡中切换标签页并调整其排列顺序。

## 适用场景

- 当界面需要以下行为时使用 Morphing Tabs：在连续布局过渡中切换标签页并调整其排列顺序。

## 安装

### Morphing Tabs — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-tabs.json
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

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Morphing Tabs

**复制源码**

```vue
<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { MorphingTabs, type MorphingTabsItem } from "@/components/orvui/blocks/morphing-tabs";
const rooms: Record<
  string,
  { eyebrow: string; title: string; detail: string; accent: string }
> = {
  "room-2": {
    eyebrow: "quiet focus",
    title: "Room 2",
    detail:
      "A small space for the work that needs a little more air around it.",
    accent: "#db5b2f",
  },
  general: {
    eyebrow: "shared space",
    title: "General",
    detail:
      "The common room for notes, links and the ideas that are still finding their shape.",
    accent: "#1bb273",
  },
  archive: {
    eyebrow: "kept close",
    title: "Archive",
    detail:
      "Past rooms stay available without competing with the conversations in motion.",
    accent: "#7a6de2",
  },
};
const items = shallowRef<MorphingTabsItem[]>(
    Object.keys(rooms).map((id) => ({
      id,
      label: rooms[id].title,
      content: "",
    })),
  ),
  value = ref<string | null>("room-2");
function order(ids: string[]) {
  items.value = ids.flatMap((id) => {
    const item = items.value.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
}
function close(id: string) {
  items.value = items.value.filter((item) => item.id !== id);
  if (value.value === id) value.value = items.value[0]?.id ?? null;
}
</script>
<template>
  <div
    class="flex w-full min-w-0 items-center justify-center bg-[#242424] p-3 md:p-8"
  >
    <MorphingTabs
      v-model="value"
      :items="items"
      aria-label="Rooms"
      class="w-full max-w-5xl"
      @order-change="order"
      @close="close"
      ><template #content="{ item }"
        ><div
          class="relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#dfe2e3_1px,transparent_1.5px)] bg-[size:4.8rem_4.8rem] px-7 py-8 md:px-12 md:py-10"
        >
          <div class="relative max-w-xl">
            <p
              class="text-[.68rem] font-semibold uppercase tracking-[.24em] text-black/40"
            >
              {{ rooms[item.id].eyebrow }}
            </p>
            <h3
              class="mt-3 text-3xl font-light tracking-[-.055em] text-[#151515] md:text-5xl"
            >
              {{ rooms[item.id].title }}
            </h3>
            <p
              class="mt-4 max-w-md text-sm leading-6 text-black/55 md:text-base"
            >
              {{ rooms[item.id].detail }}
            </p>
            <div
              class="mt-8 flex items-center gap-3 text-xs font-medium text-black/50"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: rooms[item.id].accent }"
              />drag any room to reorder
            </div>
          </div>
        </div></template
      ></MorphingTabs
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { MorphingTabs, type MorphingTabsItem } from "@orvui/vue/blocks/morphing-tabs";
const rooms: Record<
  string,
  { eyebrow: string; title: string; detail: string; accent: string }
> = {
  "room-2": {
    eyebrow: "quiet focus",
    title: "Room 2",
    detail:
      "A small space for the work that needs a little more air around it.",
    accent: "#db5b2f",
  },
  general: {
    eyebrow: "shared space",
    title: "General",
    detail:
      "The common room for notes, links and the ideas that are still finding their shape.",
    accent: "#1bb273",
  },
  archive: {
    eyebrow: "kept close",
    title: "Archive",
    detail:
      "Past rooms stay available without competing with the conversations in motion.",
    accent: "#7a6de2",
  },
};
const items = shallowRef<MorphingTabsItem[]>(
    Object.keys(rooms).map((id) => ({
      id,
      label: rooms[id].title,
      content: "",
    })),
  ),
  value = ref<string | null>("room-2");
function order(ids: string[]) {
  items.value = ids.flatMap((id) => {
    const item = items.value.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
}
function close(id: string) {
  items.value = items.value.filter((item) => item.id !== id);
  if (value.value === id) value.value = items.value[0]?.id ?? null;
}
</script>
<template>
  <div
    class="flex w-full min-w-0 items-center justify-center bg-[#242424] p-3 md:p-8"
  >
    <MorphingTabs
      v-model="value"
      :items="items"
      aria-label="Rooms"
      class="w-full max-w-5xl"
      @order-change="order"
      @close="close"
      ><template #content="{ item }"
        ><div
          class="relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#dfe2e3_1px,transparent_1.5px)] bg-[size:4.8rem_4.8rem] px-7 py-8 md:px-12 md:py-10"
        >
          <div class="relative max-w-xl">
            <p
              class="text-[.68rem] font-semibold uppercase tracking-[.24em] text-black/40"
            >
              {{ rooms[item.id].eyebrow }}
            </p>
            <h3
              class="mt-3 text-3xl font-light tracking-[-.055em] text-[#151515] md:text-5xl"
            >
              {{ rooms[item.id].title }}
            </h3>
            <p
              class="mt-4 max-w-md text-sm leading-6 text-black/55 md:text-base"
            >
              {{ rooms[item.id].detail }}
            </p>
            <div
              class="mt-8 flex items-center gap-3 text-xs font-medium text-black/50"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: rooms[item.id].accent }"
              />drag any room to reorder
            </div>
          </div>
        </div></template
      ></MorphingTabs
    >
  </div>
</template>
```

## API 参考

### MorphingTabs

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `MorphingTabsItem[]` | — | 是 | — |
| `modelValue` | `null \| string` | — | 否 | — |
| `defaultValue` | `null \| string` | `props.items[0]?.id` | 否 | — |
| `ariaLabel` | `string` | `"Tabs"` | 否 | — |
| `closable` | `boolean` | `false` | 否 | — |
| `classNames` | `MorphingTabsClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[id: string \| null]` | — |
| `valueChange` | `[id: string \| null]` | — |
| `orderChange` | `[ids: string[]]` | — |
| `close` | `[id: string]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `content` | — | `item: active` | — |

## 关于 Morphing Tabs

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Morphing Tabs？**

通过 items、modelValue、defaultValue、ariaLabel、closable、classNames 配置 Morphing Tabs；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、orderChange、close，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/morphing-tabs.json
- 文档: https://orvui.efu.me/components/blocks/morphing-tabs
- `packages/vue/src/blocks/morphing-tabs/src/MorphingTabs.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
