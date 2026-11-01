---
title: "Card Folder"
description: "通过协调的打开动作，从折叠口袋中展示一组卡片。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/card-folder"
markdown: "https://orvui.efu.me/components/blocks/card-folder.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Card Folder

> 通过协调的打开动作，从折叠口袋中展示一组卡片。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Card Folder：通过协调的打开动作，从折叠口袋中展示一组卡片。

<a id="install"></a>
## 安装

### Card Folder — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/card-folder.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Card Folder

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CardFolder } from "@/components/orvui/blocks/card-folder";
import { DigitSwap } from "@/components/orvui/motion/number";
const details = ref(false),
  number = "3745 6987 4096 0806",
  masked = "•••• •••• •••• 0806";
const rings = Array.from({ length: 18 }, (_, index) => ({
  radius: 72 + index * 24,
  opacity: 0.32 - index * 0.009,
}));
</script>
<template>
  <div class="flex min-h-72 w-full items-center justify-center px-6 py-9">
    <CardFolder
      v-model:details-visible="details"
      title="orvui Demo Member"
      :card-number="number"
      expiry="08/29"
      cvv="123"
      ><template #card
        ><span
          class="relative block h-full w-full overflow-hidden bg-[linear-gradient(135deg,#383a38_0%,#202120_48%,#111211_100%)] text-white"
          ><svg
            aria-hidden="true"
            viewBox="0 0 640 404"
            class="absolute inset-0 h-full w-full"
          >
            <circle
              v-for="ring in rings"
              :key="ring.radius"
              cx="-20"
              cy="-28"
              :r="ring.radius"
              fill="none"
              stroke="currentColor"
              :stroke-opacity="ring.opacity"
              stroke-width="1.5"
            /></svg
          ><span
            class="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgb(255_255_255/0.11),transparent_32%)]" /><span
            class="absolute left-[6%] top-[8%] flex flex-col gap-2"
            ><span
              class="text-[10px] font-medium uppercase tracking-[.22em] text-white/55"
              >orvui Demo Member</span
            ><DigitSwap
              :value="details ? number : masked"
              :animation-key="details ? 'revealed' : 'masked'"
              :direction="details ? 'up' : 'down'"
              :suffix-length="4"
              :glyph-class-name="details ? 'text-white/90' : 'text-white/65'"
              suffix-class-name="text-white/90"
              class="font-mono text-xs tracking-[.13em]" /></span
          ><span
            class="absolute right-[7%] top-[8%] h-[20%] w-[13%] overflow-hidden rounded-[18%] border border-black/30 bg-[linear-gradient(135deg,#f2f0ea_0%,#b9b7b1_45%,#e4e1d9_100%)]"
            ><span
              class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/30" /><span
              class="absolute inset-x-0 top-1/3 h-px bg-black/30" /><span
              class="absolute inset-x-0 bottom-1/3 h-px bg-black/30" /><span
              class="absolute left-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-r-[35%] border border-l-0 border-black/30" /><span
              class="absolute right-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-l-[35%] border border-r-0 border-black/30" /></span
          ><span
            class="absolute bottom-[9%] left-[6%] flex items-center gap-2 text-lg font-semibold tracking-[-.04em]"
            >orvui<span
              class="block size-2.5 rotate-45 rounded-[2px] bg-white/85" /></span
          ><span class="absolute bottom-[10%] right-[7%] flex items-end gap-5"
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >Expiry</span
              ><span class="text-xs font-medium tabular-nums text-white/90"
                >08/29</span
              ></span
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >CVV</span
              ><DigitSwap
                :value="details ? '123' : '•••'"
                :animation-key="details ? 'revealed' : 'masked'"
                :direction="details ? 'up' : 'down'"
                class="font-mono text-xs font-medium text-white/90" /></span></span></span></template
    ></CardFolder>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CardFolder } from "@orvui/vue/blocks/card-folder";
import { DigitSwap } from "@orvui/vue/motion/number";
const details = ref(false),
  number = "3745 6987 4096 0806",
  masked = "•••• •••• •••• 0806";
const rings = Array.from({ length: 18 }, (_, index) => ({
  radius: 72 + index * 24,
  opacity: 0.32 - index * 0.009,
}));
</script>
<template>
  <div class="flex min-h-72 w-full items-center justify-center px-6 py-9">
    <CardFolder
      v-model:details-visible="details"
      title="orvui Demo Member"
      :card-number="number"
      expiry="08/29"
      cvv="123"
      ><template #card
        ><span
          class="relative block h-full w-full overflow-hidden bg-[linear-gradient(135deg,#383a38_0%,#202120_48%,#111211_100%)] text-white"
          ><svg
            aria-hidden="true"
            viewBox="0 0 640 404"
            class="absolute inset-0 h-full w-full"
          >
            <circle
              v-for="ring in rings"
              :key="ring.radius"
              cx="-20"
              cy="-28"
              :r="ring.radius"
              fill="none"
              stroke="currentColor"
              :stroke-opacity="ring.opacity"
              stroke-width="1.5"
            /></svg
          ><span
            class="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgb(255_255_255/0.11),transparent_32%)]" /><span
            class="absolute left-[6%] top-[8%] flex flex-col gap-2"
            ><span
              class="text-[10px] font-medium uppercase tracking-[.22em] text-white/55"
              >orvui Demo Member</span
            ><DigitSwap
              :value="details ? number : masked"
              :animation-key="details ? 'revealed' : 'masked'"
              :direction="details ? 'up' : 'down'"
              :suffix-length="4"
              :glyph-class-name="details ? 'text-white/90' : 'text-white/65'"
              suffix-class-name="text-white/90"
              class="font-mono text-xs tracking-[.13em]" /></span
          ><span
            class="absolute right-[7%] top-[8%] h-[20%] w-[13%] overflow-hidden rounded-[18%] border border-black/30 bg-[linear-gradient(135deg,#f2f0ea_0%,#b9b7b1_45%,#e4e1d9_100%)]"
            ><span
              class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/30" /><span
              class="absolute inset-x-0 top-1/3 h-px bg-black/30" /><span
              class="absolute inset-x-0 bottom-1/3 h-px bg-black/30" /><span
              class="absolute left-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-r-[35%] border border-l-0 border-black/30" /><span
              class="absolute right-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-l-[35%] border border-r-0 border-black/30" /></span
          ><span
            class="absolute bottom-[9%] left-[6%] flex items-center gap-2 text-lg font-semibold tracking-[-.04em]"
            >orvui<span
              class="block size-2.5 rotate-45 rounded-[2px] bg-white/85" /></span
          ><span class="absolute bottom-[10%] right-[7%] flex items-end gap-5"
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >Expiry</span
              ><span class="text-xs font-medium tabular-nums text-white/90"
                >08/29</span
              ></span
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >CVV</span
              ><DigitSwap
                :value="details ? '123' : '•••'"
                :animation-key="details ? 'revealed' : 'masked'"
                :direction="details ? 'up' : 'down'"
                class="font-mono text-xs font-medium text-white/90" /></span></span></span></template
    ></CardFolder>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `CardFolder` | `v-model:open` | `boolean` | `update:open` |
| `CardFolder` | `v-model:detailsVisible` | `boolean` | `update:detailsVisible` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### CardFolder

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | 是 | — |
| `cardNumber` | `string` | — | 是 | — |
| `expiry` | `string` | — | 是 | — |
| `cvv` | `string` | — | 是 | — |
| `card` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `detailsVisible` | `boolean` | `undefined` | 否 | — |
| `defaultDetailsVisible` | `boolean` | `false` | 否 | — |
| `actionLabel` | `string` | — | 否 | — |
| `ariaLabel` | `string` | `` `${open.value ? "Close" : "Open"} ${props.title}, card ending in ${lastFour.value}, expires ${props.expiry}` `` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `cardClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `update:detailsVisible` | `[visible: boolean]` | — |
| `detailsVisibleChange` | `[visible: boolean]` | — |
| `click` | `[]` | — |
| `action` | `[]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `card` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Card Folder

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Card Folder？**

通过 title、cardNumber、expiry、cvv、card、open、defaultOpen、detailsVisible、defaultDetailsVisible、actionLabel、ariaLabel、disabled、cardClassName 配置 Card Folder；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange、update:detailsVisible、detailsVisibleChange、click、action，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Project Folder](https://orvui.efu.me/components/blocks/project-folder): 扇形展开文档预览，并将选中文件夹展开为聚焦表面。
- [Wallet Card](https://orvui.efu.me/components/blocks/wallet-card): 在紧凑卡片中查看余额、切换账户并隐藏敏感金额。
- [Expandable Action Bar](https://orvui.efu.me/components/blocks/expandable-action-bar): 在紧凑图标操作行中，为当前活动操作展开标签。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/card-folder.json
- 文档: https://orvui.efu.me/components/blocks/card-folder
- `packages/vue/src/blocks/card-folder/src/CardFolder.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
