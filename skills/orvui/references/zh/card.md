# Card · orvui 0.1.1

## 选择与组合

先确定内容结构：表格数据使用 Table，层级文件用 File Tree，可展开补充内容用 Collapsible；多个互斥折叠项使用 Bouncy Accordion。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Card"
description: "组合标题、正文、操作和页脚形成卡片，也可加入选择状态。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/card"
markdown: "https://orvui.efu.me/components/motion/card.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Card

> 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Card：组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

<a id="install"></a>
## 安装

### Card — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/card.json https://orvui.efu.me/r/button.json https://orvui.efu.me/r/checkbox.json https://orvui.efu.me/r/switch.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Card

**复制源码**

```vue
<script setup lang="ts">
import { reactive, ref, useId } from "vue";
import { Button } from "@/components/orvui/motion/button";
import { Checkbox } from "@/components/orvui/motion/checkbox";
import { Switch } from "@/components/orvui/motion/switch";
import { CARD_TARGET_CLASS, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/orvui/motion/card";
const instanceId = useId();
const documents = ref([
  { id: "agreement", title: "Signed contract", description: "The final PDF with every signature and the audit trail.", checked: true },
  { id: "billing", title: "Invoice", description: "Itemised billing for the period, ready for accounting.", checked: false },
]);
const preferences = reactive({ notifications: true, digest: false });
const rows = Object.entries({ Plan: "Team, yearly", Seats: "12", "Billing email": "billing@acme.co" });
</script>
<template>
  <div class="grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
    <div class="flex flex-col gap-3">
      <Card v-for="document in documents" :key="document.id" size="compact" interactive :selected="document.checked">
        <CardHeader><CardTitle>{{ document.title }}</CardTitle><CardDescription :id="`${instanceId}-${document.id}`">{{ document.description }}</CardDescription>
          <CardAction><Checkbox v-model="document.checked" :aria-label="document.title" :aria-describedby="`${instanceId}-${document.id}`" :class="CARD_TARGET_CLASS" /></CardAction>
        </CardHeader>
      </Card>
      <Card variant="muted" size="compact">
        <CardHeader><CardTitle as="h3">Notifications</CardTitle><CardDescription>Choose what reaches your inbox.</CardDescription></CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-4"><span>Mentions and replies</span><Switch v-model="preferences.notifications" aria-label="Mentions and replies" /></div>
          <div class="flex items-center justify-between gap-4"><span>Weekly digest</span><Switch v-model="preferences.digest" aria-label="Weekly digest" /></div>
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle as="h3">Review order</CardTitle><CardDescription>Check the details before you confirm.</CardDescription><CardAction><Button variant="ghost" size="sm">Edit</Button></CardAction></CardHeader>
        <CardContent><dl class="divide-y divide-border"><div v-for="[label, value] in rows" :key="label" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"><dt class="text-muted-foreground">{{ label }}</dt><dd class="font-medium text-foreground">{{ value }}</dd></div></dl></CardContent>
        <CardFooter class="justify-end"><Button variant="secondary" size="sm">Back</Button><Button size="sm">Confirm order</Button></CardFooter>
      </Card>
      <Card class="overflow-hidden pt-0">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80" alt="Bright open-plan studio with long desks and plants" :width="720" :height="405" loading="lazy" class="aspect-video w-full object-cover" />
        <CardHeader><CardTitle as="h3">Studio, Lisbon</CardTitle><CardDescription>Desks for 12 people, booked for the March offsite.</CardDescription></CardHeader>
        <CardFooter class="justify-between"><span class="text-sm text-muted-foreground"><span class="font-medium text-foreground">€1,840</span> · 3 days</span><Button variant="secondary" size="sm">View booking</Button></CardFooter>
      </Card>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive, ref, useId } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { Checkbox } from "@orvui/vue/motion/checkbox";
import { Switch } from "@orvui/vue/motion/switch";
import { CARD_TARGET_CLASS, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@orvui/vue/motion/card";
const instanceId = useId();
const documents = ref([
  { id: "agreement", title: "Signed contract", description: "The final PDF with every signature and the audit trail.", checked: true },
  { id: "billing", title: "Invoice", description: "Itemised billing for the period, ready for accounting.", checked: false },
]);
const preferences = reactive({ notifications: true, digest: false });
const rows = Object.entries({ Plan: "Team, yearly", Seats: "12", "Billing email": "billing@acme.co" });
</script>
<template>
  <div class="grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
    <div class="flex flex-col gap-3">
      <Card v-for="document in documents" :key="document.id" size="compact" interactive :selected="document.checked">
        <CardHeader><CardTitle>{{ document.title }}</CardTitle><CardDescription :id="`${instanceId}-${document.id}`">{{ document.description }}</CardDescription>
          <CardAction><Checkbox v-model="document.checked" :aria-label="document.title" :aria-describedby="`${instanceId}-${document.id}`" :class="CARD_TARGET_CLASS" /></CardAction>
        </CardHeader>
      </Card>
      <Card variant="muted" size="compact">
        <CardHeader><CardTitle as="h3">Notifications</CardTitle><CardDescription>Choose what reaches your inbox.</CardDescription></CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-4"><span>Mentions and replies</span><Switch v-model="preferences.notifications" aria-label="Mentions and replies" /></div>
          <div class="flex items-center justify-between gap-4"><span>Weekly digest</span><Switch v-model="preferences.digest" aria-label="Weekly digest" /></div>
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle as="h3">Review order</CardTitle><CardDescription>Check the details before you confirm.</CardDescription><CardAction><Button variant="ghost" size="sm">Edit</Button></CardAction></CardHeader>
        <CardContent><dl class="divide-y divide-border"><div v-for="[label, value] in rows" :key="label" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"><dt class="text-muted-foreground">{{ label }}</dt><dd class="font-medium text-foreground">{{ value }}</dd></div></dl></CardContent>
        <CardFooter class="justify-end"><Button variant="secondary" size="sm">Back</Button><Button size="sm">Confirm order</Button></CardFooter>
      </Card>
      <Card class="overflow-hidden pt-0">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80" alt="Bright open-plan studio with long desks and plants" :width="720" :height="405" loading="lazy" class="aspect-video w-full object-cover" />
        <CardHeader><CardTitle as="h3">Studio, Lisbon</CardTitle><CardDescription>Desks for 12 people, booked for the March offsite.</CardDescription></CardHeader>
        <CardFooter class="justify-between"><span class="text-sm text-muted-foreground"><span class="font-medium text-foreground">€1,840</span> · 3 days</span><Button variant="secondary" size="sm">View booking</Button></CardFooter>
      </Card>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Card

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"outlined" \| "muted"` | `"outlined"` | 否 | — |
| `size` | `"default" \| "compact"` | `"default"` | 否 | — |
| `interactive` | `boolean` | `false` | 否 | — |
| `selected` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CardAction

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardDescription

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardFooter

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardHeader

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardTitle

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `as` | `"div" \| "h2" \| "h3" \| "h4"` | `"div"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Card

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Card？**

通过 variant、size、interactive、selected 配置 Card；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Date Range Picker](https://orvui.efu.me/components/motion/date-range-picker): 在行内或浮动日历中选择日期区间的起点与终点。
- [Animated Color Selector](https://orvui.efu.me/components/motion/color-selector): 用移动选择轮廓与原生单选行为选择命名色块。
- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/card.json
- 文档: https://orvui.efu.me/components/motion/card
- `packages/vue/src/motion/card/src/Card.vue`
- `packages/vue/src/motion/card/src/CardAction.vue`
- `packages/vue/src/motion/card/src/CardContent.vue`
- `packages/vue/src/motion/card/src/CardDescription.vue`
- `packages/vue/src/motion/card/src/CardFooter.vue`
- `packages/vue/src/motion/card/src/CardHeader.vue`
- `packages/vue/src/motion/card/src/CardTitle.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

