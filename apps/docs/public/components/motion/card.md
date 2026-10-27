---
title: "Card"
description: "组合标题、正文、操作和页脚形成卡片，也可加入选择状态。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/card"
markdown: "https://orvui.efu.me/components/motion/card.md"
license: "MIT"
productVersion: "0.1.0"
---

# Card

> 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

## 安装

### Card — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/card.json https://orvui.efu.me/r/button.json https://orvui.efu.me/r/checkbox.json https://orvui.efu.me/r/switch.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

## 用法

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

## 关于 Card

组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

### 适用场景

- 当界面需要以下行为时使用 Card：组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Card？**

通过 variant、size、interactive、selected 配置 Card；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

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
