---
title: "Color Picker"
description: "使用二维颜色区域、通道输入、预设与吸管编辑颜色。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/color-picker"
markdown: "https://orvui.efu.me/components/motion/color-picker.md"
license: "MIT"
productVersion: "0.1.0"
---

# Color Picker

> 使用二维颜色区域、通道输入、预设与吸管编辑颜色。

使用二维颜色区域、通道输入、预设与吸管编辑颜色。

## 适用场景

- 当界面需要以下行为时使用 Color Picker：使用二维颜色区域、通道输入、预设与吸管编辑颜色。

## 安装

### Color Picker — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/color-picker.json
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

```bash
pnpm add motion-v@^1.10.0
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

### Color Picker

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_SWAP } from "@/components/orvui/lib/ease";
import { useReducedMotion } from "@/components/orvui/lib/composables";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerChannels,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHexInput,
  ColorPickerHue,
  ColorPickerPreset,
  ColorPickerPresets,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/orvui/motion/color-picker";
const color = ref("#3478f6");
const modes = ["hex", "rgb", "hsl"] as const;
const modeIndex = ref(0);
const format = computed(() => modes[modeIndex.value]!);
const next = computed(() => modes[(modeIndex.value + 1) % modes.length]!);
const reduced = useReducedMotion();
const presets = [
  ["#3478f6", "Blue"],
  ["#9270e8", "Purple"],
  ["#e66aa4", "Pink"],
  ["#e55656", "Red"],
  ["#ed9141", "Orange"],
  ["#e5b63c", "Amber"],
  ["#65a65a", "Green"],
  ["#169d83", "Teal"],
].map(([value, label]) => ({ value: value!, label: label! }));
function cycle() {
  modeIndex.value = (modeIndex.value + 1) % modes.length;
}
</script>
<template>
  <div class="flex min-h-[460px] w-full justify-center pt-2">
    <ColorPicker v-model="color" aria-label="Brand color"
      ><ColorPickerTrigger /><ColorPickerContent aria-label="Brand color"
        ><ColorPickerArea />
        <div class="flex items-center gap-3">
          <ColorPickerEyeDropper />
          <div class="flex flex-1 flex-col gap-3">
            <ColorPickerHue /><ColorPickerAlpha />
          </div>
        </div>
        <div class="flex items-start gap-1.5">
          <button
            type="button"
            @click="cycle"
            :aria-label="`Format ${format.toUpperCase()}, switch to ${next.toUpperCase()}`"
            class="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <AnimatePresence mode="popLayout" :initial="false"
              ><motion.span
                :key="format"
                :initial="{ opacity: 0, y: reduced ? 0 : 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: reduced ? 0 : -10 }"
                :transition="SPRING_SWAP"
                >{{ format.toUpperCase() }}</motion.span
              ></AnimatePresence
            ></button
          ><ColorPickerHexInput v-if="format === 'hex'" /><ColorPickerChannels
            v-else
            :format="format"
          /><ColorPickerSwatch v-if="format === 'hex'" />
        </div>
        <ColorPickerPresets
          aria-label="Presets"
          class="justify-between px-0.5 pt-1"
          ><ColorPickerPreset
            v-for="preset in presets"
            :key="preset.value"
            v-bind="preset" /></ColorPickerPresets></ColorPickerContent
    ></ColorPicker>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_SWAP } from "@orvui/vue";
import { useReducedMotion } from "@orvui/vue";
import { ColorPicker, ColorPickerAlpha, ColorPickerArea, ColorPickerChannels, ColorPickerContent, ColorPickerEyeDropper, ColorPickerHexInput, ColorPickerHue, ColorPickerPreset, ColorPickerPresets, ColorPickerSwatch, ColorPickerTrigger } from "@orvui/vue/motion/color-picker";
const color = ref("#3478f6");
const modes = ["hex", "rgb", "hsl"] as const;
const modeIndex = ref(0);
const format = computed(() => modes[modeIndex.value]!);
const next = computed(() => modes[(modeIndex.value + 1) % modes.length]!);
const reduced = useReducedMotion();
const presets = [
  ["#3478f6", "Blue"],
  ["#9270e8", "Purple"],
  ["#e66aa4", "Pink"],
  ["#e55656", "Red"],
  ["#ed9141", "Orange"],
  ["#e5b63c", "Amber"],
  ["#65a65a", "Green"],
  ["#169d83", "Teal"],
].map(([value, label]) => ({ value: value!, label: label! }));
function cycle() {
  modeIndex.value = (modeIndex.value + 1) % modes.length;
}
</script>
<template>
  <div class="flex min-h-[460px] w-full justify-center pt-2">
    <ColorPicker v-model="color" aria-label="Brand color"
      ><ColorPickerTrigger /><ColorPickerContent aria-label="Brand color"
        ><ColorPickerArea />
        <div class="flex items-center gap-3">
          <ColorPickerEyeDropper />
          <div class="flex flex-1 flex-col gap-3">
            <ColorPickerHue /><ColorPickerAlpha />
          </div>
        </div>
        <div class="flex items-start gap-1.5">
          <button
            type="button"
            @click="cycle"
            :aria-label="`Format ${format.toUpperCase()}, switch to ${next.toUpperCase()}`"
            class="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <AnimatePresence mode="popLayout" :initial="false"
              ><motion.span
                :key="format"
                :initial="{ opacity: 0, y: reduced ? 0 : 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: reduced ? 0 : -10 }"
                :transition="SPRING_SWAP"
                >{{ format.toUpperCase() }}</motion.span
              ></AnimatePresence
            ></button
          ><ColorPickerHexInput v-if="format === 'hex'" /><ColorPickerChannels
            v-else
            :format="format"
          /><ColorPickerSwatch v-if="format === 'hex'" />
        </div>
        <ColorPickerPresets
          aria-label="Presets"
          class="justify-between px-0.5 pt-1"
          ><ColorPickerPreset
            v-for="preset in presets"
            :key="preset.value"
            v-bind="preset" /></ColorPickerPresets></ColorPickerContent
    ></ColorPicker>
  </div>
</template>
```

## API 参考

### ColorPicker

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `props.value` | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | `"#3478f6"` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `alpha` | `boolean` | `true` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `name` | `string` | — | 否 | — |
| `form` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `hex: hex`, `hsva: displayHsva`, `set-color: setColor` | — |

### ColorPickerAlpha

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Opacity"` | 否 | — |

### ColorPickerArea

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Saturation and brightness"` | 否 | — |

### ColorPickerChannels

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `format` | `"rgb" \| "hsl"` | `"rgb"` | 否 | — |

### ColorPickerContent

### ColorPickerEyeDropper

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ColorPickerHexInput

### ColorPickerHue

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Hue"` | 否 | — |

### ColorPickerPreset

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `label` | `string` | — | 否 | — |

### ColorPickerPresets

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ColorPickerSwatch

### ColorPickerTrigger

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Color Picker

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Color Picker？**

通过 modelValue、value、defaultValue、open、defaultOpen、alpha、disabled、name、form 配置 Color Picker；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、change、valueCommit、update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/color-picker.json
- 文档: https://orvui.efu.me/components/motion/color-picker
- `packages/vue/src/motion/color-picker/src/ColorPicker.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerAlpha.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerArea.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerChannels.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerContent.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerEyeDropper.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerHexInput.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerHue.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerPreset.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerPresets.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerSwatch.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerTrigger.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
