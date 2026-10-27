---
title: "Theme Toggle"
description: "通过圆形、矩形或百叶窗过渡揭示新的页面主题。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/theme-toggle"
markdown: "https://orvui.efu.me/components/motion/theme-toggle.md"
license: "MIT"
productVersion: "0.1.0"
---

# Theme Toggle

> 通过圆形、矩形或百叶窗过渡揭示新的页面主题。

## 安装

### Theme Toggle — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/theme-toggle.json
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

### Theme Toggle

**复制源码**

```vue
<script setup lang="ts">
import { ThemeToggle, type ThemeVariant } from "@/components/orvui/motion/theme-toggle";
const variants: [ThemeVariant, string][] = [["rectangle", "Rectangle"], ["circle", "Circle"], ["circle-blur", "Circle blur"], ["blinds", "Blinds"]];
</script>
<template>
  <div class="flex h-full w-full items-center justify-center gap-5">
    <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-2">
      <ThemeToggle :variant="variant" start="bottom-up" class="rounded-xl border border-border bg-background p-2.5" icon-class-name="h-5 w-5" />
      <span class="text-[11px] text-muted-foreground">{{ label }}</span>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ThemeToggle, type ThemeVariant } from "@orvui/vue/motion/theme-toggle";
const variants: [ThemeVariant, string][] = [["rectangle", "Rectangle"], ["circle", "Circle"], ["circle-blur", "Circle blur"], ["blinds", "Blinds"]];
</script>
<template>
  <div class="flex h-full w-full items-center justify-center gap-5">
    <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-2">
      <ThemeToggle :variant="variant" start="bottom-up" class="rounded-xl border border-border bg-background p-2.5" icon-class-name="h-5 w-5" />
      <span class="text-[11px] text-muted-foreground">{{ label }}</span>
    </div>
  </div>
</template>
```

## API 参考

### ThemeToggle

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `"light" \| "dark"` | `(theme.isDark.value ? "dark" : "light")` | 否 | — |
| `variant` | `"rectangle" \| "circle" \| "circle-blur" \| "blinds"` | `"rectangle"` | 否 | — |
| `start` | `"center" \| "top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "bottom-up"` | `"bottom-up"` | 否 | — |
| `iconClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

## 关于 Theme Toggle

通过圆形、矩形或百叶窗过渡揭示新的页面主题。

### 适用场景

- 当界面需要以下行为时使用 Theme Toggle：通过圆形、矩形或百叶窗过渡揭示新的页面主题。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Theme Toggle？**

需要自定义触发器时使用 useThemeToggle composable，并保留相同的主题目标和过渡选项。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/theme-toggle.json
- 文档: https://orvui.efu.me/components/motion/theme-toggle
- `packages/vue/src/motion/theme-toggle/src/ThemeToggle.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
