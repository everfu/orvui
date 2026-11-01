# Multi-chain Swap · orvui 0.1.1

## 选择与组合

这些组件组合多个基础能力。先阅读用法与状态，再替换样例数据，并将保存、提交与持久化连接到应用。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Multi-chain Swap"
description: "组合资产兑换界面，包含代币选择、数量与目标信息。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/swap"
markdown: "https://orvui.efu.me/components/blocks/swap.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Multi-chain Swap

> 组合资产兑换界面，包含代币选择、数量与目标信息。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Multi-chain Swap：组合资产兑换界面，包含代币选择、数量与目标信息。

<a id="install"></a>
## 安装

### Multi-chain Swap — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/swap.json
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

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Multi-chain Swap

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Multi-chain Swap？**

通过 chains、tokens、defaultFromId、defaultToId 配置 Multi-chain Swap；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 swap、connect，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Wallet Card](https://orvui.efu.me/components/blocks/wallet-card): 在紧凑卡片中查看余额、切换账户并隐藏敏感金额。
- [Prediction Market](https://orvui.efu.me/components/blocks/prediction-market): 查看市场信息，选择结果并组合包含收益估算的买卖票据。
- [Dynamic Island](https://orvui.efu.me/components/blocks/dynamic-island): 在多个实时活动视图间切换紧凑胶囊，保持对象身份连续。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/swap.json
- 文档: https://orvui.efu.me/components/blocks/swap
- `packages/vue/src/blocks/swap/src/MultiChainSwap.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

