---
title: "Timeline"
description: "沿可拖动轨道浏览日期事件，当前事件保持在焦点位置。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/timeline"
markdown: "https://orvui.efu.me/components/motion/timeline.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Timeline

> 沿可拖动轨道浏览日期事件，当前事件保持在焦点位置。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Timeline：沿可拖动轨道浏览日期事件，当前事件保持在焦点位置。

<a id="install"></a>
## 安装

### Timeline — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/timeline.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Timeline

**复制源码**

```vue
<script setup lang="ts">
import { defineComponent, h, ref, type PropType, type VNodeChild } from "vue";
import { Heart } from "lucide-vue-next";
import { Timeline } from "@/components/orvui/motion/timeline";
const DemoMedia = defineComponent({
  props: { event: { type: Object as PropType<{ kind: string; points?: number[] }>, required: true }, active: { type: Boolean, required: true } },
  setup(props) {
    const box = (className: string, children: VNodeChild[] = []) => h("div", { class: className }, children);
    const skeletons = () => ["h-2 w-3/4 rounded-full bg-foreground/15", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-2/3 rounded-full bg-foreground/10"].map(style => box(style));
    return () => {
      switch (props.event.kind) {
        case "grid": return box("grid size-full grid-cols-3 gap-2 bg-muted/40 p-4", Array.from({ length: 6 }, (_, index) => h("div", { class: "rounded-xl border border-border bg-background", style: { opacity: 1 - index * .1 } })));
        case "phone": return box("flex size-full items-end justify-center bg-muted/40 pt-5", [box("flex h-full w-1/2 flex-col gap-2 rounded-t-3xl border border-b-0 border-border bg-background p-3", ["mx-auto h-1.5 w-8 rounded-full bg-foreground/15", "h-3 w-2/3 rounded-full bg-foreground/15", "h-16 rounded-xl bg-foreground/[0.06]", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-4/5 rounded-full bg-foreground/10"].map(style => box(style)))]);
        case "sync": return box("flex size-full items-center justify-center gap-3 bg-muted/40 p-5", [box("flex h-full flex-1 flex-col gap-2 rounded-xl border border-border bg-background p-3", [box("flex gap-1", Array.from({ length: 3 }, () => h("span", { class: "size-1.5 rounded-full bg-foreground/20" }))), ...skeletons()]), box("flex h-4/5 w-1/4 flex-col gap-2 rounded-2xl border border-border bg-background p-2", skeletons())]);
        case "chart": { const points = props.event.points ?? []; const peak = Math.max(...points); const path = points.map((value, index) => `${index ? "L" : "M"}${(100 * index / (points.length - 1)).toFixed(1)} ${(56 - value / peak * 44).toFixed(1)}`).join(" "); return h("svg", { viewBox: "0 0 100 64", preserveAspectRatio: "none", class: props.active ? "size-full text-primary" : "size-full text-foreground", role: "img", "aria-label": "Rising line chart" }, [h("path", { d: `${path} L100 64 L0 64 Z`, class: props.active ? "fill-primary/[0.08]" : "fill-foreground/[0.06]" }), h("path", { d: path, fill: "none", stroke: "currentColor", "stroke-width": "1.5", "vector-effect": "non-scaling-stroke" })]); }
        case "keys": return box("flex size-full flex-col items-center justify-center gap-3 bg-muted/40", [box("flex gap-1.5", ["⌘", "K"].map(key => h("kbd", { class: "flex size-11 items-center justify-center rounded-xl border border-border bg-background font-sans text-foreground text-lg shadow-sm" }, key))), box("h-2 w-28 rounded-full bg-foreground/10")]);
        default: return box("flex size-full items-center justify-center bg-foreground text-background", [h("span", { class: "font-medium text-5xl tracking-tighter" }, "2.0")]);
      }
    };
  },
});
const milestones = [
  { id: "beta", date: "2025-06-12", title: "Private beta opens", kind: "grid", likes: "1,204" },
  { id: "android", date: "2025-08-03", title: "Lumen for Android", kind: "phone", likes: "3,918" },
  { id: "offline", date: "2025-10-14", title: "Offline drafts", kind: "sync", likes: "4,827" },
  { id: "signups", date: "2025-11-20", title: "Weekly signups double", kind: "chart", points: [4, 5, 4, 6, 5, 7, 6, 9, 8, 12, 11, 15], likes: "6,175" },
  { id: "spaces", date: "2026-01-09", title: "Shared spaces", kind: "grid", likes: "2,640" },
  { id: "command", date: "2026-03-17", title: "The command menu", kind: "keys", likes: "5,302" },
  { id: "rank", date: "2026-05-28", title: "Top 10 in productivity", kind: "chart", points: [3, 4, 6, 5, 8, 9, 8, 11, 13, 12, 14, 16], likes: "13,916" },
  { id: "two", date: "2026-08-05", title: "Lumen 2.0", kind: "release", likes: "27,130" },
];
const selected = ref("signups");
</script>
<template><div class="w-full py-6"><Timeline v-model="selected" :events="milestones" aria-label="Lumen release history"><template #media="{ event, active }"><DemoMedia :event="event as any" :active="active" /></template><template #meta="{ event }"><Heart aria-hidden="true" :class="['size-4', event.id === selected ? 'text-primary' : undefined]" /><span>{{ event.likes }}</span></template></Timeline></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { defineComponent, h, ref, type PropType, type VNodeChild } from "vue";
import { Heart } from "lucide-vue-next";
import { Timeline } from "@orvui/vue/motion/timeline";
const DemoMedia = defineComponent({
  props: { event: { type: Object as PropType<{ kind: string; points?: number[] }>, required: true }, active: { type: Boolean, required: true } },
  setup(props) {
    const box = (className: string, children: VNodeChild[] = []) => h("div", { class: className }, children);
    const skeletons = () => ["h-2 w-3/4 rounded-full bg-foreground/15", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-2/3 rounded-full bg-foreground/10"].map(style => box(style));
    return () => {
      switch (props.event.kind) {
        case "grid": return box("grid size-full grid-cols-3 gap-2 bg-muted/40 p-4", Array.from({ length: 6 }, (_, index) => h("div", { class: "rounded-xl border border-border bg-background", style: { opacity: 1 - index * .1 } })));
        case "phone": return box("flex size-full items-end justify-center bg-muted/40 pt-5", [box("flex h-full w-1/2 flex-col gap-2 rounded-t-3xl border border-b-0 border-border bg-background p-3", ["mx-auto h-1.5 w-8 rounded-full bg-foreground/15", "h-3 w-2/3 rounded-full bg-foreground/15", "h-16 rounded-xl bg-foreground/[0.06]", "h-2 w-full rounded-full bg-foreground/10", "h-2 w-4/5 rounded-full bg-foreground/10"].map(style => box(style)))]);
        case "sync": return box("flex size-full items-center justify-center gap-3 bg-muted/40 p-5", [box("flex h-full flex-1 flex-col gap-2 rounded-xl border border-border bg-background p-3", [box("flex gap-1", Array.from({ length: 3 }, () => h("span", { class: "size-1.5 rounded-full bg-foreground/20" }))), ...skeletons()]), box("flex h-4/5 w-1/4 flex-col gap-2 rounded-2xl border border-border bg-background p-2", skeletons())]);
        case "chart": { const points = props.event.points ?? []; const peak = Math.max(...points); const path = points.map((value, index) => `${index ? "L" : "M"}${(100 * index / (points.length - 1)).toFixed(1)} ${(56 - value / peak * 44).toFixed(1)}`).join(" "); return h("svg", { viewBox: "0 0 100 64", preserveAspectRatio: "none", class: props.active ? "size-full text-primary" : "size-full text-foreground", role: "img", "aria-label": "Rising line chart" }, [h("path", { d: `${path} L100 64 L0 64 Z`, class: props.active ? "fill-primary/[0.08]" : "fill-foreground/[0.06]" }), h("path", { d: path, fill: "none", stroke: "currentColor", "stroke-width": "1.5", "vector-effect": "non-scaling-stroke" })]); }
        case "keys": return box("flex size-full flex-col items-center justify-center gap-3 bg-muted/40", [box("flex gap-1.5", ["⌘", "K"].map(key => h("kbd", { class: "flex size-11 items-center justify-center rounded-xl border border-border bg-background font-sans text-foreground text-lg shadow-sm" }, key))), box("h-2 w-28 rounded-full bg-foreground/10")]);
        default: return box("flex size-full items-center justify-center bg-foreground text-background", [h("span", { class: "font-medium text-5xl tracking-tighter" }, "2.0")]);
      }
    };
  },
});
const milestones = [
  { id: "beta", date: "2025-06-12", title: "Private beta opens", kind: "grid", likes: "1,204" },
  { id: "android", date: "2025-08-03", title: "Lumen for Android", kind: "phone", likes: "3,918" },
  { id: "offline", date: "2025-10-14", title: "Offline drafts", kind: "sync", likes: "4,827" },
  { id: "signups", date: "2025-11-20", title: "Weekly signups double", kind: "chart", points: [4, 5, 4, 6, 5, 7, 6, 9, 8, 12, 11, 15], likes: "6,175" },
  { id: "spaces", date: "2026-01-09", title: "Shared spaces", kind: "grid", likes: "2,640" },
  { id: "command", date: "2026-03-17", title: "The command menu", kind: "keys", likes: "5,302" },
  { id: "rank", date: "2026-05-28", title: "Top 10 in productivity", kind: "chart", points: [3, 4, 6, 5, 8, 9, 8, 11, 13, 12, 14, 16], likes: "13,916" },
  { id: "two", date: "2026-08-05", title: "Lumen 2.0", kind: "release", likes: "27,130" },
];
const selected = ref("signups");
</script>
<template><div class="w-full py-6"><Timeline v-model="selected" :events="milestones" aria-label="Lumen release history"><template #media="{ event, active }"><DemoMedia :event="event as any" :active="active" /></template><template #meta="{ event }"><Heart aria-hidden="true" :class="['size-4', event.id === selected ? 'text-primary' : undefined]" /><span>{{ event.likes }}</span></template></Timeline></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Timeline` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Timeline

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `events` | `TimelineEvent[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `props.events[0]?.id` | 否 | — |
| `itemWidth` | `number` | `340` | 否 | — |
| `height` | `number` | `600` | 否 | — |
| `years` | `boolean` | `true` | 否 | — |
| `ruler` | `boolean` | `true` | 否 | — |
| `cables` | `boolean` | `true` | 否 | — |
| `formatDate` | `(date: Date) => string` | — | 否 | — |
| `formatYear` | `(date: Date) => string` | — | 否 | — |
| `ariaLabel` | `string` | `"Timeline"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `media` | — | `event: event`, `active: index === active` | — |
| `meta` | — | `event: event` | — |

<a id="about"></a>
## 关于 Timeline

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Timeline？**

通过 events、modelValue、defaultValue、itemWidth、height、years、ruler、cables、formatDate、formatYear、ariaLabel 配置 Timeline；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Arc Picker](https://orvui.efu.me/components/motion/arc-picker): 通过手势或键盘让弧形标签列表穿过固定选择点。
- [Card](https://orvui.efu.me/components/motion/card): 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。
- [Tilt Card](https://orvui.efu.me/components/motion/tilt-card): 让卡片朝指针方向倾斜，并在表面移动高光。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/timeline.json
- 文档: https://orvui.efu.me/components/motion/timeline
- `packages/vue/src/motion/timeline/src/Timeline.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
