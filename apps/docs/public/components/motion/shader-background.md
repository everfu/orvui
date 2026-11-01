---
title: "Shader Background"
description: "通过 Vue 适配器调用 Paper Design Shader 运行时呈现动态背景。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/shader-background"
markdown: "https://orvui.efu.me/components/motion/shader-background.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Shader Background

> 通过 Vue 适配器调用 Paper Design Shader 运行时呈现动态背景。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Shader Background：通过 Vue 适配器调用 Paper Design Shader 运行时呈现动态背景。

<a id="install"></a>
## 安装

### Shader Background — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/shader-background.json https://orvui.efu.me/r/tabs.json
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

- `@paper-design/shaders@^0.0.76`
- `clsx@^2.1.1`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Shader Background

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ShaderBackground, type ShaderBackgroundVariant } from "@/components/orvui/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const variants: {
  id: string;
  value: ShaderBackgroundVariant;
  label: string;
  props: Record<string, unknown>;
}[] = [
  {
    id: "mesh-gradient",
    value: "mesh-gradient",
    label: "Mesh",
    props: {
      colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"],
      distortion: 0.8,
      swirl: 0.3,
      speed: 0.4,
    },
  },
  {
    id: "grain-gradient",
    value: "grain-gradient",
    label: "Grain",
    props: {
      colors: ["#7300ff", "#eba8ff", "#00bfff", "#2a00ff"],
      colorBack: "#000000",
      softness: 0.6,
      speed: 0.5,
    },
  },
  {
    id: "grain-sunset",
    value: "grain-gradient",
    label: "Grain — Sunset",
    props: {
      colors: ["#ff7a00", "#ff2e93", "#ffce54", "#8a2be2"],
      colorBack: "#1a0500",
      softness: 0.7,
      speed: 0.4,
    },
  },
  {
    id: "grain-pastel",
    value: "grain-gradient",
    label: "Grain — Pastel",
    props: {
      colors: ["#ffd6e8", "#c9e4ff", "#fff3c4", "#d9c9ff"],
      colorBack: "#ffffff",
      softness: 0.85,
      speed: 0.3,
    },
  },
  {
    id: "mesh-aurora",
    value: "mesh-gradient",
    label: "Mesh — Aurora",
    props: {
      colors: ["#00ffb2", "#0072ff", "#a200ff", "#001a2c"],
      distortion: 0.6,
      swirl: 0.5,
      speed: 0.3,
    },
  },
  {
    id: "mesh-citrus",
    value: "mesh-gradient",
    label: "Mesh — Citrus",
    props: {
      colors: ["#fff200", "#ff8a00", "#ff3d00", "#ffe08a"],
      distortion: 0.7,
      swirl: 0.4,
      speed: 0.5,
    },
  },
  {
    id: "warp",
    value: "warp",
    label: "Warp",
    props: {
      colors: ["#121212", "#9470ff", "#121212", "#8838ff"],
      speed: 0.4,
    },
  },
  {
    id: "waves",
    value: "waves",
    label: "Waves",
    props: { colorFront: "#ffbb00", colorBack: "#000000" },
  },
  {
    id: "voronoi",
    value: "voronoi",
    label: "Voronoi",
    props: { colors: ["#ff8247", "#ffe53d"], speed: 0.3 },
  },
  {
    id: "swirl",
    value: "swirl",
    label: "Swirl",
    props: {
      colorBack: "#180018",
      colors: ["#ffd1d1", "#ff8a8a", "#660000"],
      speed: 0.2,
    },
  },
  {
    id: "dot-orbit",
    value: "dot-orbit",
    label: "Orbit",
    props: {
      colors: ["#ffc96b", "#ff6200", "#ff2f00"],
      colorBack: "#000000",
      speed: 0.6,
    },
  },
  {
    id: "dot-grid",
    value: "dot-grid",
    label: "Grid",
    props: {
      colorBack: "#000000",
      colorFill: "#ffffff",
      colorStroke: "#ffaa00",
    },
  },
  {
    id: "smoke-ring",
    value: "smoke-ring",
    label: "Smoke",
    props: { colorBack: "#000000", colors: ["#ffffff"], speed: 0.3 },
  },
  {
    id: "static-radial-gradient",
    value: "static-radial-gradient",
    label: "Radial",
    props: { colorBack: "#000000", colors: ["#00bbff", "#00ffe1", "#ffffff"] },
  },
  {
    id: "neuro-noise",
    value: "neuro-noise",
    label: "Neuro",
    props: {
      colorFront: "#ffffff",
      colorMid: "#47a6ff",
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "water",
    value: "water",
    label: "Water",
    props: { colorBack: "#909090", colorHighlight: "#ffffff", speed: 0.4 },
  },
  {
    id: "metaballs",
    value: "metaballs",
    label: "Metaballs",
    props: {
      colors: ["#ff5cf4", "#4d9eff", "#000000"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "god-rays",
    value: "god-rays",
    label: "Rays",
    props: {
      colors: ["#ffcc66", "#ff6a00"],
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "spiral",
    value: "spiral",
    label: "Spiral",
    props: { colors: ["#7a5cff", "#ff5ca6", "#000000"], speed: 0.4 },
  },
  {
    id: "dithering",
    value: "dithering",
    label: "Dither",
    props: {
      colorBack: "#000000",
      colorFront: "#00ff9d",
      speed: 0.4,
    },
  },
  {
    id: "pulsing-border",
    value: "pulsing-border",
    label: "Pulse",
    props: {
      colors: ["#00e5ff", "#7000ff", "#ff00c8"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "color-panels",
    value: "color-panels",
    label: "Panels",
    props: { colors: ["#ff3d68", "#ffb800", "#3d7aff", "#00ffb2"], speed: 0.3 },
  },
  {
    id: "static-mesh-gradient",
    value: "static-mesh-gradient",
    label: "Static Mesh",
    props: { colors: ["#ff8a3d", "#ff3d9a", "#3d5aff", "#0a0a0a"] },
  },
  {
    id: "static-mesh-dusk",
    value: "static-mesh-gradient",
    label: "Static Mesh — Dusk",
    props: { colors: ["#2b1055", "#7597de", "#f6a1c8", "#0d0221"] },
  },
  {
    id: "radial-ember",
    value: "static-radial-gradient",
    label: "Radial — Ember",
    props: { colorBack: "#0a0000", colors: ["#ff5100", "#ffce00", "#4a0000"] },
  },
  {
    id: "simplex-noise",
    value: "simplex-noise",
    label: "Simplex",
    props: { colors: ["#ff6ec7", "#6ec7ff", "#000000"], speed: 0.4 },
  },
  {
    id: "perlin-noise",
    value: "perlin-noise",
    label: "Perlin",
    props: { colorFront: "#00ffd5", colorBack: "#000000", speed: 0.3 },
  },
];

const active = ref(variants[0]!.id), paused = ref(false);
const current = computed(() => variants.find(scene => scene.id === active.value) ?? variants[0]!);
const reduce = useReducedMotion();
let mounted = false;
let next: ReturnType<typeof setTimeout> | undefined;
function schedule() {
  clearTimeout(next);
  if (!mounted || reduce.value || paused.value) return;
  next = setTimeout(() => {
    const index = variants.findIndex(scene => scene.id === active.value);
    active.value = variants[(index + 1) % variants.length]!.id;
    schedule();
  }, 2400);
}
watch([reduce, paused], schedule);
onMounted(() => { mounted = true; schedule(); });
onBeforeUnmount(() => { mounted = false; clearTimeout(next); });
</script>
<template>
  <div
    class="flex w-full max-w-2xl flex-col gap-5 p-6"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      class="relative h-80 w-full overflow-hidden rounded-2xl border border-border"
    >
      <ShaderBackground
        :key="current.id"
        :variant="current.value"
        v-bind="current.props"
        class="absolute inset-0"
      />
    </div>
    <Tabs v-model="active"
      ><TabsList class="flex-wrap justify-center gap-2 rounded-2xl"
        ><TabsTrigger
          v-for="item in variants"
          :key="item.id"
          :value="item.id"
          class="px-4 py-2 text-sm"
          >{{ item.label }}</TabsTrigger
        ></TabsList
      ></Tabs
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ShaderBackground, type ShaderBackgroundVariant } from "@orvui/vue/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { useReducedMotion } from "@orvui/vue";
const variants: {
  id: string;
  value: ShaderBackgroundVariant;
  label: string;
  props: Record<string, unknown>;
}[] = [
  {
    id: "mesh-gradient",
    value: "mesh-gradient",
    label: "Mesh",
    props: {
      colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"],
      distortion: 0.8,
      swirl: 0.3,
      speed: 0.4,
    },
  },
  {
    id: "grain-gradient",
    value: "grain-gradient",
    label: "Grain",
    props: {
      colors: ["#7300ff", "#eba8ff", "#00bfff", "#2a00ff"],
      colorBack: "#000000",
      softness: 0.6,
      speed: 0.5,
    },
  },
  {
    id: "grain-sunset",
    value: "grain-gradient",
    label: "Grain — Sunset",
    props: {
      colors: ["#ff7a00", "#ff2e93", "#ffce54", "#8a2be2"],
      colorBack: "#1a0500",
      softness: 0.7,
      speed: 0.4,
    },
  },
  {
    id: "grain-pastel",
    value: "grain-gradient",
    label: "Grain — Pastel",
    props: {
      colors: ["#ffd6e8", "#c9e4ff", "#fff3c4", "#d9c9ff"],
      colorBack: "#ffffff",
      softness: 0.85,
      speed: 0.3,
    },
  },
  {
    id: "mesh-aurora",
    value: "mesh-gradient",
    label: "Mesh — Aurora",
    props: {
      colors: ["#00ffb2", "#0072ff", "#a200ff", "#001a2c"],
      distortion: 0.6,
      swirl: 0.5,
      speed: 0.3,
    },
  },
  {
    id: "mesh-citrus",
    value: "mesh-gradient",
    label: "Mesh — Citrus",
    props: {
      colors: ["#fff200", "#ff8a00", "#ff3d00", "#ffe08a"],
      distortion: 0.7,
      swirl: 0.4,
      speed: 0.5,
    },
  },
  {
    id: "warp",
    value: "warp",
    label: "Warp",
    props: {
      colors: ["#121212", "#9470ff", "#121212", "#8838ff"],
      speed: 0.4,
    },
  },
  {
    id: "waves",
    value: "waves",
    label: "Waves",
    props: { colorFront: "#ffbb00", colorBack: "#000000" },
  },
  {
    id: "voronoi",
    value: "voronoi",
    label: "Voronoi",
    props: { colors: ["#ff8247", "#ffe53d"], speed: 0.3 },
  },
  {
    id: "swirl",
    value: "swirl",
    label: "Swirl",
    props: {
      colorBack: "#180018",
      colors: ["#ffd1d1", "#ff8a8a", "#660000"],
      speed: 0.2,
    },
  },
  {
    id: "dot-orbit",
    value: "dot-orbit",
    label: "Orbit",
    props: {
      colors: ["#ffc96b", "#ff6200", "#ff2f00"],
      colorBack: "#000000",
      speed: 0.6,
    },
  },
  {
    id: "dot-grid",
    value: "dot-grid",
    label: "Grid",
    props: {
      colorBack: "#000000",
      colorFill: "#ffffff",
      colorStroke: "#ffaa00",
    },
  },
  {
    id: "smoke-ring",
    value: "smoke-ring",
    label: "Smoke",
    props: { colorBack: "#000000", colors: ["#ffffff"], speed: 0.3 },
  },
  {
    id: "static-radial-gradient",
    value: "static-radial-gradient",
    label: "Radial",
    props: { colorBack: "#000000", colors: ["#00bbff", "#00ffe1", "#ffffff"] },
  },
  {
    id: "neuro-noise",
    value: "neuro-noise",
    label: "Neuro",
    props: {
      colorFront: "#ffffff",
      colorMid: "#47a6ff",
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "water",
    value: "water",
    label: "Water",
    props: { colorBack: "#909090", colorHighlight: "#ffffff", speed: 0.4 },
  },
  {
    id: "metaballs",
    value: "metaballs",
    label: "Metaballs",
    props: {
      colors: ["#ff5cf4", "#4d9eff", "#000000"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "god-rays",
    value: "god-rays",
    label: "Rays",
    props: {
      colors: ["#ffcc66", "#ff6a00"],
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "spiral",
    value: "spiral",
    label: "Spiral",
    props: { colors: ["#7a5cff", "#ff5ca6", "#000000"], speed: 0.4 },
  },
  {
    id: "dithering",
    value: "dithering",
    label: "Dither",
    props: {
      colorBack: "#000000",
      colorFront: "#00ff9d",
      speed: 0.4,
    },
  },
  {
    id: "pulsing-border",
    value: "pulsing-border",
    label: "Pulse",
    props: {
      colors: ["#00e5ff", "#7000ff", "#ff00c8"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "color-panels",
    value: "color-panels",
    label: "Panels",
    props: { colors: ["#ff3d68", "#ffb800", "#3d7aff", "#00ffb2"], speed: 0.3 },
  },
  {
    id: "static-mesh-gradient",
    value: "static-mesh-gradient",
    label: "Static Mesh",
    props: { colors: ["#ff8a3d", "#ff3d9a", "#3d5aff", "#0a0a0a"] },
  },
  {
    id: "static-mesh-dusk",
    value: "static-mesh-gradient",
    label: "Static Mesh — Dusk",
    props: { colors: ["#2b1055", "#7597de", "#f6a1c8", "#0d0221"] },
  },
  {
    id: "radial-ember",
    value: "static-radial-gradient",
    label: "Radial — Ember",
    props: { colorBack: "#0a0000", colors: ["#ff5100", "#ffce00", "#4a0000"] },
  },
  {
    id: "simplex-noise",
    value: "simplex-noise",
    label: "Simplex",
    props: { colors: ["#ff6ec7", "#6ec7ff", "#000000"], speed: 0.4 },
  },
  {
    id: "perlin-noise",
    value: "perlin-noise",
    label: "Perlin",
    props: { colorFront: "#00ffd5", colorBack: "#000000", speed: 0.3 },
  },
];

const active = ref(variants[0]!.id), paused = ref(false);
const current = computed(() => variants.find(scene => scene.id === active.value) ?? variants[0]!);
const reduce = useReducedMotion();
let mounted = false;
let next: ReturnType<typeof setTimeout> | undefined;
function schedule() {
  clearTimeout(next);
  if (!mounted || reduce.value || paused.value) return;
  next = setTimeout(() => {
    const index = variants.findIndex(scene => scene.id === active.value);
    active.value = variants[(index + 1) % variants.length]!.id;
    schedule();
  }, 2400);
}
watch([reduce, paused], schedule);
onMounted(() => { mounted = true; schedule(); });
onBeforeUnmount(() => { mounted = false; clearTimeout(next); });
</script>
<template>
  <div
    class="flex w-full max-w-2xl flex-col gap-5 p-6"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      class="relative h-80 w-full overflow-hidden rounded-2xl border border-border"
    >
      <ShaderBackground
        :key="current.id"
        :variant="current.value"
        v-bind="current.props"
        class="absolute inset-0"
      />
    </div>
    <Tabs v-model="active"
      ><TabsList class="flex-wrap justify-center gap-2 rounded-2xl"
        ><TabsTrigger
          v-for="item in variants"
          :key="item.id"
          :value="item.id"
          class="px-4 py-2 text-sm"
          >{{ item.label }}</TabsTrigger
        ></TabsList
      ></Tabs
    >
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### ShaderBackground

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"mesh-gradient" \| "swirl" \| "grain-gradient" \| "dot-grid" \| "dot-orbit" \| "warp" \| "waves" \| "water" \| "voronoi" \| "smoke-ring" \| "static-radial-gradient" \| "neuro-noise" \| "metaballs" \| "god-rays" \| "spiral" \| "dithering" \| "pulsing-border" \| "color-panels" \| "static-mesh-gradient" \| "simplex-noise" \| "perlin-noise"` | `"mesh-gradient"` | 否 | — |
| `speed` | `number` | — | 否 | — |
| `frame` | `number` | — | 否 | — |
| `fallback` | `string` | `"linear-gradient(135deg,#e0eaff,#9f50d3,#f75092)"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `fallback` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Shader Background

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Shader Background？**

通过 variant、speed、frame、fallback 配置 Shader Background；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过fallback 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Cylinder Carousel](https://orvui.efu.me/components/motion/cylinder-carousel): 将画廊项目排列在凹面或凸面圆柱上，并通过拖动控制。
- [Tilt Card](https://orvui.efu.me/components/motion/tilt-card): 让卡片朝指针方向倾斜，并在表面移动高光。
- [Marquee](https://orvui.efu.me/components/motion/marquee): 连续重复水平或垂直内容带，并可在悬停时暂停。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/shader-background.json
- 文档: https://orvui.efu.me/components/motion/shader-background
- `packages/vue/src/motion/shader-background/src/ShaderBackground.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

附带的 Paper Design Shader 运行时保留独立许可证，见 `packages/vue/src/motion/shader-background/LICENSE.paper-design`。
