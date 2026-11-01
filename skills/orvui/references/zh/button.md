# Button · orvui 0.1.1

## 选择与组合

以明确操作为入口：普通操作使用 Button，需要持续按压或滑动确认时查看 CTA Buttons；紧凑工具栏可选择 Expandable Action Bar。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Button"
description: "使用具有按压反馈的操作表面，并可选磁吸、状态和金属质感变体。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/button"
markdown: "https://orvui.efu.me/components/motion/button.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Button

> 使用具有按压反馈的操作表面，并可选磁吸、状态和金属质感变体。

<a id="when-to-use"></a>

## 适用场景

- 用于表单提交、确认等明确操作；跳转到其他页面时使用链接。

<a id="install"></a>
## 安装

### Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

### Metallic Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-metallic.json
```

### Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-base.json
```

### Stateful Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-stateful.json
```

### Magnetic Button — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-magnetic.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
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
### Button

**复制源码**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

<a id="metallic"></a>
### Metallic Button

在中性操作表面的金属边缘移动一道直线反光。

**复制源码**

```vue
<script setup lang="ts">
import { ArrowUpRight, Sparkles } from "lucide-vue-next";
import { MetallicButton } from "@/components/orvui/motion/button";
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3 px-6 py-10">
  <MetallicButton>Continue<ArrowUpRight class="size-4" /></MetallicButton>
  <MetallicButton size="sm"><Sparkles class="size-3.5" />Generate</MetallicButton>
  <MetallicButton size="icon" aria-label="Magic tools"><Sparkles class="size-4" /></MetallicButton>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowUpRight, Sparkles } from "lucide-vue-next";
import { MetallicButton } from "@orvui/vue/motion/button";
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3 px-6 py-10">
  <MetallicButton>Continue<ArrowUpRight class="size-4" /></MetallicButton>
  <MetallicButton size="sm"><Sparkles class="size-3.5" />Generate</MetallicButton>
  <MetallicButton size="icon" aria-label="Magic tools"><Sparkles class="size-4" /></MetallicButton>
</div></template>
```

<a id="base"></a>
### Button

比较不同尺寸与外观，并查看悬停抬升和按压收缩反馈。

**复制源码**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

<a id="stateful"></a>
### Stateful Button

在空闲、加载、成功与失败之间切换，宽度跟随当前内容调整。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, reactive } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { StatefulButton, type ButtonState } from "@/components/orvui/motion/button";
const states = reactive<{ ok: ButtonState; err: ButtonState }>({ ok: "idle", err: "idle" });
const scheduled = new Set<ReturnType<typeof setTimeout>>();
function after(delay: number, callback: () => void) {
  const timer = setTimeout(() => { scheduled.delete(timer); callback(); }, delay);
  scheduled.add(timer);
}
function run(key: "ok" | "err") {
  if (states[key] === "loading") return;
  states[key] = "loading";
  after(1400, () => { states[key] = key === "ok" ? "success" : "error"; after(1800, () => { states[key] = "idle"; }); });
}
onBeforeUnmount(() => { scheduled.forEach(timer => clearTimeout(timer)); scheduled.clear(); });
</script>
<template><div class="flex flex-col items-center justify-center gap-3">
  <StatefulButton :state="states.ok" loading-text="Saving" success-text="Saved" :icon="ArrowRight" @click="run('ok')">Save changes</StatefulButton>
  <StatefulButton :state="states.err" variant="secondary" loading-text="Submitting" error-text="Failed" @click="run('err')">Submit</StatefulButton>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, reactive } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { StatefulButton, type ButtonState } from "@orvui/vue/motion/button";
const states = reactive<{ ok: ButtonState; err: ButtonState }>({ ok: "idle", err: "idle" });
const scheduled = new Set<ReturnType<typeof setTimeout>>();
function after(delay: number, callback: () => void) {
  const timer = setTimeout(() => { scheduled.delete(timer); callback(); }, delay);
  scheduled.add(timer);
}
function run(key: "ok" | "err") {
  if (states[key] === "loading") return;
  states[key] = "loading";
  after(1400, () => { states[key] = key === "ok" ? "success" : "error"; after(1800, () => { states[key] = "idle"; }); });
}
onBeforeUnmount(() => { scheduled.forEach(timer => clearTimeout(timer)); scheduled.clear(); });
</script>
<template><div class="flex flex-col items-center justify-center gap-3">
  <StatefulButton :state="states.ok" loading-text="Saving" success-text="Saved" :icon="ArrowRight" @click="run('ok')">Save changes</StatefulButton>
  <StatefulButton :state="states.err" variant="secondary" loading-text="Submitting" error-text="Failed" @click="run('err')">Submit</StatefulButton>
</div></template>
```

<a id="magnetic"></a>
### Magnetic Button

用 Magnetic 包装操作控件，让其表面跟随附近的指针移动。

**复制源码**

```vue
<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { MagneticButton } from "@/components/orvui/motion/button";
const alternatives = [{ variant: "secondary", strength: 0.25, label: "Subtle pull" }, { variant: "outline", strength: 0.5, label: "Strong pull" }] as const;
</script>
<template><div class="flex flex-wrap items-center justify-center gap-4">
  <MagneticButton :strength="0.35">Hover me<ArrowRight class="h-4 w-4" /></MagneticButton>
  <MagneticButton v-for="sample in alternatives" :key="sample.variant" :variant="sample.variant" :strength="sample.strength">{{ sample.label }}</MagneticButton>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { MagneticButton } from "@orvui/vue/motion/button";
const alternatives = [{ variant: "secondary", strength: 0.25, label: "Subtle pull" }, { variant: "outline", strength: 0.5, label: "Strong pull" }] as const;
</script>
<template><div class="flex flex-wrap items-center justify-center gap-4">
  <MagneticButton :strength="0.35">Hover me<ArrowRight class="h-4 w-4" /></MagneticButton>
  <MagneticButton v-for="sample in alternatives" :key="sample.variant" :variant="sample.variant" :strength="sample.strength">{{ sample.label }}</MagneticButton>
</div></template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Button

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `"primary"` | 否 | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | 否 | — |
| `pressScale` | `number` | `0.93` | 否 | — |
| `ripple` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MetallicButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | 否 | — |
| `paused` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### StatefulButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `state` | `"success" \| "idle" \| "loading" \| "error"` | `"idle"` | 否 | — |
| `loadingText` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Loading"` | 否 | — |
| `successText` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Done"` | 否 | — |
| `errorText` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Try again"` | 否 | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | 否 | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | 否 | — |
| `pressScale` | `number` | — | 否 | — |
| `ripple` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `type` | `"button" \| "submit" \| "reset"` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |

### MagneticButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `strength` | `number` | `0.25` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `magneticClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Button

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Button？**

通过 variant、size、pressScale、ripple、disabled、type 配置 Button；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。
- [Switch](https://orvui.efu.me/components/motion/switch): 通过移动滑块切换二元设置，并可添加说明标签。
- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/button.json
- 文档: https://orvui.efu.me/components/motion/button
- `packages/vue/src/motion/button/src/Button.vue`
- `packages/vue/src/motion/button/src/MetallicButton.vue`
- `packages/vue/src/motion/button/src/StatefulButton.vue`
- `packages/vue/src/motion/button/src/MagneticButton.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

