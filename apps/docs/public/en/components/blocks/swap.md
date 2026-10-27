---
title: "Multi-chain Swap"
description: "Compose an asset exchange with token choices, amounts and destination information."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/swap"
markdown: "https://orvui.efu.me/en/components/blocks/swap.md"
license: "MIT"
productVersion: "0.1.0"
---

# Multi-chain Swap

> Compose an asset exchange with token choices, amounts and destination information.

## Install

### Multi-chain Swap — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/swap.json
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

## Usage

### Multi-chain Swap

**Registry source**

```vue
<script setup lang="ts">
import { MultiChainSwap } from "@/components/orvui/blocks/swap";
</script>
<template><MultiChainSwap /></template>
```

**Package**

```vue
<script setup lang="ts">
import { MultiChainSwap } from "@orvui/vue/blocks/swap";
</script>
<template><MultiChainSwap /></template>
```

## API Reference

### MultiChainSwap

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `chains` | `Chain[]` | `() => CHAINS` | No | — |
| `tokens` | `Token[]` | `() => TOKENS` | No | — |
| `defaultFromId` | `string` | `"eth-eth"` | No | — |
| `defaultToId` | `string` | `"sol-sol"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `swap` | `[order: SwapOrder]` | — |
| `connect` | `[]` | — |

## About Multi-chain Swap

Compose an asset exchange with token choices, amounts and destination information.

### When to use it

- Use Multi-chain Swap when the interface needs this behavior: compose an asset exchange with token choices, amounts and destination information.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Multi-chain Swap?**

Configure Multi-chain Swap through chains, tokens, defaultFromId, defaultToId. The API table describes their types and defaults.

**How does it connect to application state?**

Observe swap, connect to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/swap.json
- Documentation: https://orvui.efu.me/en/components/blocks/swap
- `packages/vue/src/blocks/swap/src/MultiChainSwap.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
