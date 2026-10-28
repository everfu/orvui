---
title: "Morphing Modal"
description: "让对话框内容与高度一起变化，同时保持外层表面连续。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/morphing-modal"
markdown: "https://orvui.efu.me/components/motion/morphing-modal.md"
license: "MIT"
productVersion: "0.1.0"
---

# Morphing Modal

> 让对话框内容与高度一起变化，同时保持外层表面连续。

让对话框内容与高度一起变化，同时保持外层表面连续。

## 适用场景

- 当界面需要以下行为时使用 Morphing Modal：让对话框内容与高度一起变化，同时保持外层表面连续。

## 安装

### Morphing Modal — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-modal.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
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

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Morphing Modal

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Ban, Lock, ScanFace, ScrollText, ShieldCheck, Trash2 } from "lucide-vue-next";
import { MorphingModal } from "@/components/orvui/motion/morphing-modal";
type View = "options" | "private-key" | "recovery" | null;
const selected = ref<View>(null);
const actions = [{ icon: Lock, label: "View Private Key", value: "private-key" }, { icon: ScrollText, label: "View Recovery Phrase", value: "recovery" }, { icon: Trash2, label: "Remove Wallet", value: null }] as const;
const notes = [{ icon: ShieldCheck, label: "Keep the private key somewhere safe" }, { icon: ScrollText, label: "Only you should have access to it" }, { icon: Ban, label: "A lost key cannot be restored for you" }];
const words = "forest silver canvas garden maple sunrise meadow compass velvet autumn pebble lantern".split(" ");
</script>
<template><div class="flex flex-col items-center gap-3">
  <button type="button" @click="selected = 'options'" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open wallet options</button>
  <p class="text-xs text-muted-foreground">Choose an option. The surface adjusts to its content.</p>
  <MorphingModal :view-id="selected" @close="selected = null">
    <div v-if="selected === 'options'">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-base font-semibold text-foreground">Options</h2><button type="button" @click="selected = null" aria-label="Close" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <div class="flex flex-col gap-2"><button v-for="action in actions" :key="action.label" type="button" @click="selected = action.value"
        :class="['flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors press', action.value === null ? 'bg-destructive/10 text-destructive hover:bg-destructive/15' : 'bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]']"><component :is="action.icon" class="h-4 w-4" />{{ action.label }}</button></div>
    </div>
    <div v-else-if="selected === 'private-key'">
      <div class="mb-3 flex items-start justify-between"><Lock class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Private Key</h2>
      <p class="mt-2 text-sm text-muted-foreground">The private key gives access to your wallet and its backup. Store it securely and keep it to yourself.</p><hr class="my-4 border-border" />
      <ul class="flex flex-col gap-2.5 text-sm text-muted-foreground"><li v-for="note in notes" :key="note.label" class="flex items-center gap-2.5"><component :is="note.icon" class="h-4 w-4" />{{ note.label }}</li></ul>
      <div class="mt-5 flex gap-2"><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-foreground press">Cancel</button><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background press"><ScanFace class="h-4 w-4" />Reveal</button></div>
    </div>
    <div v-else-if="selected === 'recovery'">
      <div class="mb-3 flex items-start justify-between"><ScrollText class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Recovery Phrase</h2><p class="mt-2 text-sm text-muted-foreground">Use these 12 example words to see the recovery layout. Keep your own phrase recorded in a safe place.</p>
      <div class="mt-4 grid grid-cols-3 gap-2"><div v-for="(word, index) in words" :key="word" class="rounded-lg border border-border bg-background/40 px-2 py-1.5 text-xs text-foreground"><span class="mr-1 text-muted-foreground">{{ index + 1 }}.</span>{{ word }}</div></div>
      <button type="button" @click="selected = 'options'" class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background press">Done</button>
    </div>
  </MorphingModal>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Ban, Lock, ScanFace, ScrollText, ShieldCheck, Trash2 } from "lucide-vue-next";
import { MorphingModal } from "@orvui/vue/motion/morphing-modal";
type View = "options" | "private-key" | "recovery" | null;
const selected = ref<View>(null);
const actions = [{ icon: Lock, label: "View Private Key", value: "private-key" }, { icon: ScrollText, label: "View Recovery Phrase", value: "recovery" }, { icon: Trash2, label: "Remove Wallet", value: null }] as const;
const notes = [{ icon: ShieldCheck, label: "Keep the private key somewhere safe" }, { icon: ScrollText, label: "Only you should have access to it" }, { icon: Ban, label: "A lost key cannot be restored for you" }];
const words = "forest silver canvas garden maple sunrise meadow compass velvet autumn pebble lantern".split(" ");
</script>
<template><div class="flex flex-col items-center gap-3">
  <button type="button" @click="selected = 'options'" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open wallet options</button>
  <p class="text-xs text-muted-foreground">Choose an option. The surface adjusts to its content.</p>
  <MorphingModal :view-id="selected" @close="selected = null">
    <div v-if="selected === 'options'">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-base font-semibold text-foreground">Options</h2><button type="button" @click="selected = null" aria-label="Close" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <div class="flex flex-col gap-2"><button v-for="action in actions" :key="action.label" type="button" @click="selected = action.value"
        :class="['flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors press', action.value === null ? 'bg-destructive/10 text-destructive hover:bg-destructive/15' : 'bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]']"><component :is="action.icon" class="h-4 w-4" />{{ action.label }}</button></div>
    </div>
    <div v-else-if="selected === 'private-key'">
      <div class="mb-3 flex items-start justify-between"><Lock class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Private Key</h2>
      <p class="mt-2 text-sm text-muted-foreground">The private key gives access to your wallet and its backup. Store it securely and keep it to yourself.</p><hr class="my-4 border-border" />
      <ul class="flex flex-col gap-2.5 text-sm text-muted-foreground"><li v-for="note in notes" :key="note.label" class="flex items-center gap-2.5"><component :is="note.icon" class="h-4 w-4" />{{ note.label }}</li></ul>
      <div class="mt-5 flex gap-2"><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-foreground press">Cancel</button><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background press"><ScanFace class="h-4 w-4" />Reveal</button></div>
    </div>
    <div v-else-if="selected === 'recovery'">
      <div class="mb-3 flex items-start justify-between"><ScrollText class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Recovery Phrase</h2><p class="mt-2 text-sm text-muted-foreground">Use these 12 example words to see the recovery layout. Keep your own phrase recorded in a safe place.</p>
      <div class="mt-4 grid grid-cols-3 gap-2"><div v-for="(word, index) in words" :key="word" class="rounded-lg border border-border bg-background/40 px-2 py-1.5 text-xs text-foreground"><span class="mr-1 text-muted-foreground">{{ index + 1 }}.</span>{{ word }}</div></div>
      <button type="button" @click="selected = 'options'" class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background press">Done</button>
    </div>
  </MorphingModal>
</div></template>
```

## API 参考

### MorphingModal

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `viewId` | `string \| null` | — | 是 | — |
| `placement` | `"bottom" \| "center"` | `"bottom"` | 否 | — |
| `ariaLabel` | `string` | `attrs["aria-label"] as string \| undefined` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `close` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `view-id: viewId` | — |

## 关于 Morphing Modal

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Morphing Modal？**

通过 viewId、placement、ariaLabel 配置 Morphing Modal；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 close，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/morphing-modal.json
- 文档: https://orvui.efu.me/components/motion/morphing-modal
- `packages/vue/src/motion/morphing-modal/src/MorphingModal.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
