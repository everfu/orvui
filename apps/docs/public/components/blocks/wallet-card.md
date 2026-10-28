---
title: "Wallet Card"
description: "在紧凑卡片中查看余额、切换账户并隐藏敏感金额。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/wallet-card"
markdown: "https://orvui.efu.me/components/blocks/wallet-card.md"
license: "MIT"
productVersion: "0.1.0"
---

# Wallet Card

> 在紧凑卡片中查看余额、切换账户并隐藏敏感金额。

在紧凑卡片中查看余额、切换账户并隐藏敏感金额。

## 适用场景

- 当界面需要以下行为时使用 Wallet Card：在紧凑卡片中查看余额、切换账户并隐藏敏感金额。

## 安装

### Wallet Card — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/wallet-card.json
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

### Wallet Card

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { WalletCard } from "@/components/orvui/blocks/wallet-card";
import { Button } from "@/components/orvui/motion/button";
const accounts = [
  {
    id: "main",
    name: "Main Wallet",
    address: "0x8f3Cb1a29e4D7c6F1B2a3E9d0C4b5A6f7D8e9C0b",
  },
  {
    id: "trading",
    name: "Trading",
    address: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
  },
  {
    id: "cold",
    name: "Cold Storage",
    address: "0x9F8e7D6c5B4a3E2d1C0b9A8f7E6d5C4b3A2e1F0d",
  },
];
const recent = ["vitalik.eth", "0xA0b8…6EB4", "Uniswap", "Send to Trading"],
  balance = ref(12480.32);
function change() {
  balance.value += (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 400);
}
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <WalletCard
      :accounts="accounts"
      :balance="balance"
      :default-change="124.5"
      :search-recent="recent"
      has-notifications
    /><Button variant="ghost" size="sm" @click="change"
      >Simulate balance change</Button
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { WalletCard } from "@orvui/vue/blocks/wallet-card";
import { Button } from "@orvui/vue/motion/button";
const accounts = [
  {
    id: "main",
    name: "Main Wallet",
    address: "0x8f3Cb1a29e4D7c6F1B2a3E9d0C4b5A6f7D8e9C0b",
  },
  {
    id: "trading",
    name: "Trading",
    address: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
  },
  {
    id: "cold",
    name: "Cold Storage",
    address: "0x9F8e7D6c5B4a3E2d1C0b9A8f7E6d5C4b3A2e1F0d",
  },
];
const recent = ["vitalik.eth", "0xA0b8…6EB4", "Uniswap", "Send to Trading"],
  balance = ref(12480.32);
function change() {
  balance.value += (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 400);
}
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <WalletCard
      :accounts="accounts"
      :balance="balance"
      :default-change="124.5"
      :search-recent="recent"
      has-notifications
    /><Button variant="ghost" size="sm" @click="change"
      >Simulate balance change</Button
    >
  </div>
</template>
```

## API 参考

### WalletCard

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `accounts` | `WalletAccount[]` | — | 是 | — |
| `accountId` | `string` | — | 否 | — |
| `defaultAccountId` | `string` | `props.accounts[0]?.id` | 否 | — |
| `balance` | `number` | — | 是 | — |
| `balancePrefix` | `string` | `"$"` | 否 | — |
| `defaultChange` | `number` | — | 否 | — |
| `defaultBalanceHidden` | `boolean` | `false` | 否 | — |
| `searchPlaceholder` | `string` | — | 否 | — |
| `searchRecent` | `string[]` | `() => []` | 否 | — |
| `hasNotifications` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:accountId` | `[id: string]` | — |
| `accountChange` | `[id: string]` | — |
| `send` | `[]` | — |
| `deposit` | `[]` | — |
| `swap` | `[]` | — |
| `buy` | `[]` | — |
| `searchChange` | `[value: string]` | — |
| `searchSubmit` | `[value: string]` | — |
| `notifications` | `[]` | — |

## 关于 Wallet Card

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Wallet Card？**

通过 accounts、accountId、defaultAccountId、balance、balancePrefix、defaultChange、defaultBalanceHidden、searchPlaceholder、searchRecent、hasNotifications 配置 Wallet Card；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:accountId、accountChange、send、deposit、swap、buy、searchChange、searchSubmit、notifications，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/wallet-card.json
- 文档: https://orvui.efu.me/components/blocks/wallet-card
- `packages/vue/src/blocks/wallet-card/src/WalletCard.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
