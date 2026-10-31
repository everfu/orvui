---
title: "Wallet Card"
description: "Inspect an account balance, change accounts and hide sensitive amounts in a compact card."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/wallet-card"
markdown: "https://orvui.efu.me/en/components/blocks/wallet-card.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Wallet Card

> Inspect an account balance, change accounts and hide sensitive amounts in a compact card.

<a id="when-to-use"></a>

## When to use it

- Use Wallet Card when the interface needs this behavior: inspect an account balance, change accounts and hide sensitive amounts in a compact card.

<a id="install"></a>
## Install

### Wallet Card — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/wallet-card.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

After npm publication, use the package command below. Before publication, install the verified local archive.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Wallet Card

**Registry source**

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

**Package**

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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `WalletCard` | `v-model:accountId` | `string` | `update:accountId` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### WalletCard

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `accounts` | `WalletAccount[]` | — | Yes | — |
| `accountId` | `string` | — | No | — |
| `defaultAccountId` | `string` | `props.accounts[0]?.id` | No | — |
| `balance` | `number` | — | Yes | — |
| `balancePrefix` | `string` | `"$"` | No | — |
| `defaultChange` | `number` | — | No | — |
| `defaultBalanceHidden` | `boolean` | `false` | No | — |
| `searchPlaceholder` | `string` | — | No | — |
| `searchRecent` | `string[]` | `() => []` | No | — |
| `hasNotifications` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
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

<a id="about"></a>
## About Wallet Card

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Wallet Card?**

Configure Wallet Card through accounts, accountId, defaultAccountId, balance, balancePrefix, defaultChange, defaultBalanceHidden, searchPlaceholder, searchRecent, hasNotifications. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:accountId, accountChange, send, deposit, swap, buy, searchChange, searchSubmit, notifications to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Multi-chain Swap](https://orvui.efu.me/en/components/blocks/swap): Compose an asset exchange with token choices, amounts and destination information.
- [Prediction Market](https://orvui.efu.me/en/components/blocks/prediction-market): Inspect a market and compose a buy or sell ticket with outcomes and return estimates.
- [Card Folder](https://orvui.efu.me/en/components/blocks/card-folder): Reveal a group of cards from a folded pocket with a coordinated opening movement.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/wallet-card.json
- Documentation: https://orvui.efu.me/en/components/blocks/wallet-card
- `packages/vue/src/blocks/wallet-card/src/WalletCard.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
