---
title: "Fixtures"
description: "浏览淘汰赛轮次或径向赛程，并查看队伍与比赛元数据。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/knockout-bracket"
markdown: "https://orvui.efu.me/components/blocks/knockout-bracket.md"
license: "MIT"
productVersion: "0.1.0"
---

# Fixtures

> 浏览淘汰赛轮次或径向赛程，并查看队伍与比赛元数据。

## 安装

### Fixtures — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/knockout-bracket.json
```

### Knockout Wheel — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/knockout-wheel.json
```

### Knockout Bracket — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/knockout-bracket.json
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

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Fixtures

**复制源码**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@/components/orvui/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@orvui/vue/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

### Knockout Wheel

围绕径向轮盘排列淘汰赛对阵，将冠军放在中心。

**复制源码**

```vue
<script setup lang="ts">
import { KnockoutWheel, WHEEL_ROUNDS } from "@/components/orvui/blocks/knockout-bracket";
const season = { rounds: WHEEL_ROUNDS, initialRound: 0 };
</script>
<template>
  <div class="w-full py-8"><KnockoutWheel v-bind="season" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { KnockoutWheel, WHEEL_ROUNDS } from "@orvui/vue/blocks/knockout-bracket";
const season = { rounds: WHEEL_ROUNDS, initialRound: 0 };
</script>
<template>
  <div class="w-full py-8"><KnockoutWheel v-bind="season" /></div>
</template>
```

### Knockout Bracket

浏览锦标赛轮次与队伍信息，并可加入季军赛。

**复制源码**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@/components/orvui/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@orvui/vue/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

## API 参考

### KnockoutBracket

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `rounds` | `Round[]` | — | 是 | — |
| `initialRound` | `number` | `1` | 否 | — |
| `thirdPlace` | `Match` | — | 否 | — |
| `thirdPlaceLabel` | `string` | `"Third place play-off"` | 否 | — |

### KnockoutWheel

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `rounds` | `Round[]` | — | 是 | — |
| `initialRound` | `number` | `0` | 否 | — |

## 关于 Fixtures

浏览淘汰赛轮次或径向赛程，并查看队伍与比赛元数据。

### 适用场景

- 当界面需要以下行为时使用 Fixtures：浏览淘汰赛轮次或径向赛程，并查看队伍与比赛元数据。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Fixtures？**

通过 rounds、initialRound、thirdPlace、thirdPlaceLabel 配置 Fixtures；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/knockout-bracket.json
- 文档: https://orvui.efu.me/components/blocks/knockout-bracket
- `packages/vue/src/blocks/knockout-bracket/src/KnockoutBracket.vue`
- `packages/vue/src/blocks/knockout-bracket/src/KnockoutWheel.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
