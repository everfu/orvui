---
title: "Infinite Masonry"
description: "将不同高度项目排列为多列，并在可见范围推进时请求更多内容。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/infinite-masonry"
markdown: "https://orvui.efu.me/components/blocks/infinite-masonry.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Infinite Masonry

> 将不同高度项目排列为多列，并在可见范围推进时请求更多内容。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Infinite Masonry：将不同高度项目排列为多列，并在可见范围推进时请求更多内容。

<a id="install"></a>
## 安装

### Infinite Masonry — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/infinite-masonry.json
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

- `@tanstack/vue-virtual@^3.13.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Infinite Masonry

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { InfiniteMasonry } from "@/components/orvui/blocks/infinite-masonry";
const scenes = [
  ["Soft geometry", "Architecture", "1511818966892-d7d671e672a2", 260],
  ["Open horizon", "Landscape", "1500530855697-b586d89ba3ee", 190],
  ["Working rhythm", "Workspace", "1497366754035-f200968a6e72", 230],
  ["Shared table", "Studio", "1524758631624-e2822e304c36", 300],
  ["In session", "People", "1521737711867-e3b97375f902", 210],
  ["After hours", "Office", "1504384308090-c894fdcc538d", 280],
] as const;
function page(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset,
      [title, category, photo, imageHeight] = scenes[index % scenes.length];
    return {
      id: `gallery-${index}`,
      title: `${title} ${Math.floor(index / scenes.length) + 1}`,
      category,
      image: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=720&q=80`,
      imageHeight,
    };
  });
}
const items = ref(page(0, 12)),
  loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function load() {
  if (loading.value || items.value.length >= 42) return;
  loading.value = true;
  timer = setTimeout(() => {
    items.value.push(
      ...page(items.value.length, Math.min(6, 42 - items.value.length)),
    );
    loading.value = false;
  }, 650);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <div class="w-full max-w-5xl">
    <div class="mb-3 flex items-end justify-between gap-4 px-1">
      <div>
        <p class="text-sm font-semibold text-foreground">Visual index</p>
        <p class="mt-0.5 text-xs text-muted-foreground">
          Scroll to load the next page
        </p>
      </div>
      <p class="font-mono text-xs tabular-nums text-muted-foreground">
        {{ items.length }} items
      </p>
    </div>
    <InfiniteMasonry
      :items="items"
      :get-item-key="(item) => item.id"
      :has-more="items.length < 42"
      :loading="loading"
      :estimate-size="(item) => item.imageHeight + 66"
      aria-label="Visual inspiration gallery"
      class="h-[34rem]"
      @load-more="load"
      ><template #default="{ item }"
        ><figure
          class="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div
            class="relative w-full overflow-hidden"
            :style="{ height: item.imageHeight + 'px' }"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="absolute inset-0 size-full object-cover"
            />
          </div>
          <figcaption class="flex items-start justify-between gap-3 p-3">
            <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
            <p
              class="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {{ item.category }}
            </p>
          </figcaption>
        </figure></template
      ></InfiniteMasonry
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { InfiniteMasonry } from "@orvui/vue/blocks/infinite-masonry";
const scenes = [
  ["Soft geometry", "Architecture", "1511818966892-d7d671e672a2", 260],
  ["Open horizon", "Landscape", "1500530855697-b586d89ba3ee", 190],
  ["Working rhythm", "Workspace", "1497366754035-f200968a6e72", 230],
  ["Shared table", "Studio", "1524758631624-e2822e304c36", 300],
  ["In session", "People", "1521737711867-e3b97375f902", 210],
  ["After hours", "Office", "1504384308090-c894fdcc538d", 280],
] as const;
function page(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset,
      [title, category, photo, imageHeight] = scenes[index % scenes.length];
    return {
      id: `gallery-${index}`,
      title: `${title} ${Math.floor(index / scenes.length) + 1}`,
      category,
      image: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=720&q=80`,
      imageHeight,
    };
  });
}
const items = ref(page(0, 12)),
  loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function load() {
  if (loading.value || items.value.length >= 42) return;
  loading.value = true;
  timer = setTimeout(() => {
    items.value.push(
      ...page(items.value.length, Math.min(6, 42 - items.value.length)),
    );
    loading.value = false;
  }, 650);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <div class="w-full max-w-5xl">
    <div class="mb-3 flex items-end justify-between gap-4 px-1">
      <div>
        <p class="text-sm font-semibold text-foreground">Visual index</p>
        <p class="mt-0.5 text-xs text-muted-foreground">
          Scroll to load the next page
        </p>
      </div>
      <p class="font-mono text-xs tabular-nums text-muted-foreground">
        {{ items.length }} items
      </p>
    </div>
    <InfiniteMasonry
      :items="items"
      :get-item-key="(item) => item.id"
      :has-more="items.length < 42"
      :loading="loading"
      :estimate-size="(item) => item.imageHeight + 66"
      aria-label="Visual inspiration gallery"
      class="h-[34rem]"
      @load-more="load"
      ><template #default="{ item }"
        ><figure
          class="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div
            class="relative w-full overflow-hidden"
            :style="{ height: item.imageHeight + 'px' }"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="absolute inset-0 size-full object-cover"
            />
          </div>
          <figcaption class="flex items-start justify-between gap-3 p-3">
            <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
            <p
              class="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {{ item.category }}
            </p>
          </figcaption>
        </figure></template
      ></InfiniteMasonry
    >
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### InfiniteMasonry

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `readonly T[]` | — | 是 | — |
| `getItemKey` | `(item: T, index: number) => string \| number \| bigint` | — | 是 | — |
| `hasMore` | `boolean` | `false` | 是 | — |
| `onLoadMore` | `() => void \| Promise<void>` | — | 否 | — |
| `loading` | `boolean` | `false` | 否 | — |
| `error` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |
| `estimateSize` | `(item: T, index: number) => number` | — | 否 | — |
| `minColumnWidth` | `number` | `208` | 否 | — |
| `maxColumns` | `number` | `4` | 否 | — |
| `gap` | `number` | `12` | 否 | — |
| `overscan` | `number` | `4` | 否 | — |
| `prefetch` | `number` | `3` | 否 | — |
| `animateItems` | `boolean` | `true` | 否 | — |
| `ariaLabel` | `string` | `"Infinite masonry feed"` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |
| `itemClassName` | `string` | — | 否 | — |
| `emptyState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `endState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `retry` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `empty` | `() => VNodeChild` | — | — |
| `loading` | — | `index: row.index - items.length` | — |
| `default` | — | `item: items[row.index]!`, `index: row.index` | — |
| `end` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Infinite Masonry

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Infinite Masonry？**

通过 items、getItemKey、hasMore、onLoadMore、loading、error、estimateSize、minColumnWidth、maxColumns、gap、overscan、prefetch、animateItems、ariaLabel、contentClassName、itemClassName、emptyState、endState 配置 Infinite Masonry；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 retry，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Notification Stack](https://orvui.efu.me/components/blocks/notification-stack): 将紧凑通知堆叠展开为可以逐条阅读的条目。
- [Expandable Tabs](https://orvui.efu.me/components/blocks/expandable-tabs): 在图标条中导航，选中项展开以显示标签。
- [Bloom Menu](https://orvui.efu.me/components/blocks/bloom-menu): 围绕共同中心展开一组操作，并在关闭时恢复焦点。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/infinite-masonry.json
- 文档: https://orvui.efu.me/components/blocks/infinite-masonry
- `packages/vue/src/blocks/infinite-masonry/src/InfiniteMasonry.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
