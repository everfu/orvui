---
title: "Multi-chain Swap"
description: "组合资产兑换界面，包含代币选择、数量与目标信息。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/swap"
markdown: "https://orvui.efu.me/components/blocks/swap.md"
license: "MIT"
productVersion: "0.1.0"
---

# Multi-chain Swap

> 组合资产兑换界面，包含代币选择、数量与目标信息。

## 安装

### Multi-chain Swap — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/swap.json
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

### Multi-chain Swap

**复制源码**

```vue
<script setup lang="ts">
import { MultiChainSwap } from "@/components/orvui/blocks/swap";
</script>
<template><MultiChainSwap /></template>
```

**组件包**

```vue
<script setup lang="ts">
import { MultiChainSwap } from "@orvui/vue/blocks/swap";
</script>
<template><MultiChainSwap /></template>
```

## API 参考

### MultiChainSwap

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `chains` | `Chain[]` | `() => CHAINS` | 否 | — |
| `tokens` | `Token[]` | `() => TOKENS` | 否 | — |
| `defaultFromId` | `string` | `"eth-eth"` | 否 | — |
| `defaultToId` | `string` | `"sol-sol"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `swap` | `[order: SwapOrder]` | — |
| `connect` | `[]` | — |

## 关于 Multi-chain Swap

组合资产兑换界面，包含代币选择、数量与目标信息。

### 适用场景

- 当界面需要以下行为时使用 Multi-chain Swap：组合资产兑换界面，包含代币选择、数量与目标信息。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Multi-chain Swap？**

通过 chains、tokens、defaultFromId、defaultToId 配置 Multi-chain Swap；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 swap、connect，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/swap.json
- 文档: https://orvui.efu.me/components/blocks/swap
- `packages/vue/src/blocks/swap/src/MultiChainSwap.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
