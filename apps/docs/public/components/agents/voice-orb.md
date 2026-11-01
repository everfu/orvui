---
title: "Voice Orb"
description: "呈现运动球形场，其表面响应活动强度或音频输入。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/voice-orb"
markdown: "https://orvui.efu.me/components/agents/voice-orb.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Voice Orb

> 呈现运动球形场，其表面响应活动强度或音频输入。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Voice Orb：呈现运动球形场，其表面响应活动强度或音频输入。

<a id="install"></a>
## 安装

### Voice Orb — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/voice-orb.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Voice Orb

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VoiceOrb } from "@/components/orvui/agents/voice-orb";
const activity = ref(0);
let animation: number | undefined, preference: MediaQueryList | undefined;
let alive = false;
function paint(time: number) {
  if (!alive) return;
  const seconds = time / 1000;
  const phrase = Math.max(0, Math.sin(seconds * 0.85));
  const syllable = Math.max(
    0,
    Math.sin(seconds * 9.3 + Math.sin(seconds * 2.1)),
  );
  activity.value = preference?.matches
    ? 0
    : phrase * (0.12 + syllable * syllable * 0.72);
  animation = requestAnimationFrame(paint);
}
onMounted(() => {
  alive = true;
  preference = matchMedia("(prefers-reduced-motion: reduce)");
  animation = requestAnimationFrame(paint);
});
onBeforeUnmount(() => {
  alive = false;
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <VoiceOrb
    :activity="activity"
    aria-label="Voice visualization"
    class="w-64 sm:w-72"
  />
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VoiceOrb } from "@orvui/vue/agents/voice-orb";
const activity = ref(0);
let animation: number | undefined, preference: MediaQueryList | undefined;
let alive = false;
function paint(time: number) {
  if (!alive) return;
  const seconds = time / 1000;
  const phrase = Math.max(0, Math.sin(seconds * 0.85));
  const syllable = Math.max(
    0,
    Math.sin(seconds * 9.3 + Math.sin(seconds * 2.1)),
  );
  activity.value = preference?.matches
    ? 0
    : phrase * (0.12 + syllable * syllable * 0.72);
  animation = requestAnimationFrame(paint);
}
onMounted(() => {
  alive = true;
  preference = matchMedia("(prefers-reduced-motion: reduce)");
  animation = requestAnimationFrame(paint);
});
onBeforeUnmount(() => {
  alive = false;
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <VoiceOrb
    :activity="activity"
    aria-label="Voice visualization"
    class="w-64 sm:w-72"
  />
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### VoiceOrb

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `activity` | `number \| MotionValue<number>` | `0` | 否 | — |
| `analyser` | `null \| AnalyserNode` | `null` | 否 | — |
| `colors` | `readonly [string, string, string]` | `() => ["#e8754d", "#ffe0ac", "#346b52"] as const` | 否 | — |
| `active` | `boolean` | `true` | 否 | — |
| `speed` | `number` | `1` | 否 | — |
| `label` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `error` | `[error: Error]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `fallback` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Voice Orb

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Voice Orb？**

通过 activity、analyser、colors、active、speed、label 配置 Voice Orb；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 error，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Approval Card](https://orvui.efu.me/components/agents/approval-card): 在助手继续工作前，引导用户完成一个或多个决策步骤。
- [Agent Activity](https://orvui.efu.me/components/agents/agent-activity): 将持续变化的助手活动组织为可展开步骤与完成摘要。
- [Message Bubble](https://orvui.efu.me/components/agents/message-bubble): 呈现紧凑会话气泡，并可组合头像、元数据与操作控件。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/voice-orb.json
- 文档: https://orvui.efu.me/components/agents/voice-orb
- `packages/vue/src/agents/voice-orb/src/VoiceOrb.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
