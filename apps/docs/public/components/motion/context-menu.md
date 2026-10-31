---
title: "Animated Context Menu"
description: "在指针位置打开菜单，并可组合复选项、单选项和子菜单。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/context-menu"
markdown: "https://orvui.efu.me/components/motion/context-menu.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Animated Context Menu

> 在指针位置打开菜单，并可组合复选项、单选项和子菜单。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Animated Context Menu：在指针位置打开菜单，并可组合复选项、单选项和子菜单。

<a id="install"></a>
## 安装

### Animated Context Menu — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/context-menu.json
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
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
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
### Animated Context Menu

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Check, Copy, Download, Eye, Pencil, Trash2 } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
} from "@/components/orvui/motion/context-menu";
import { SPRING_SWAP } from "@/components/orvui/lib/ease";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const message = ref<string | null>(null);
const offline = ref(false), reduce = useReducedMotion();
const items = [
  ["Open", Eye, "Folder opened", "↵"],
  ["Rename", Pencil, "Ready to rename", "R"],
  ["Duplicate", Copy, "Folder duplicated", "⌘D"],
  ["Download", Download, "Download started", undefined],
].map(([label, icon, message, shortcut]) => ({ label: label as string, icon, message: message as string, shortcut: shortcut as string | undefined }));
function checked(value: boolean) { offline.value = value; message.value = value ? "Available offline" : "Online only"; }
</script>
<template>
  <div class="flex min-h-[360px] w-full items-center justify-center">
    <ContextMenu
      ><ContextMenuTrigger
        ><button
          type="button"
          class="group flex flex-col items-center outline-none"
        >
          <div
            class="relative h-24 w-32 transition-transform duration-150 group-active:scale-[0.98] group-focus-visible:rounded-2xl group-focus-visible:ring-2 group-focus-visible:ring-foreground/20 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background"
          >
            <div
              class="absolute left-1 top-1 h-7 w-14 rounded-t-[10px] bg-[#d4a84f] dark:bg-[#a77d2f]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-5 rounded-[14px] bg-[#e7bb61] shadow-[0_14px_24px_-16px_rgba(90,58,8,0.75)] dark:bg-[#bd8d36]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-9 rounded-[14px] bg-[#efc86f] dark:bg-[#cb9a41]"
            />
            <div
              class="absolute inset-x-5 bottom-4 h-px bg-black/10 dark:bg-white/10"
            />
          </div>
          <span class="mt-4 text-sm font-medium text-foreground"
            >Right click on me</span
          >
          <div class="mt-1 h-4">
            <AnimatePresence mode="wait" :initial="false"
              ><motion.span
                v-if="message"
                :key="message"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 3, filter: 'blur(2px)' }
                "
                :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, filter: 'blur(2px)' }
                "
                :transition="reduce ? { duration: 0.1 } : SPRING_SWAP"
                class="flex items-center gap-1 text-[10px] text-muted-foreground"
                ><Check aria-hidden="true" class="h-3 w-3 text-success" />{{
                  message
                }}</motion.span
              ><span v-else class="text-[10px] text-muted-foreground"
                >or long-press · Shift + F10</span
              ></AnimatePresence
            >
          </div>
        </button></ContextMenuTrigger
      ><ContextMenuContent ariaLabel="Folder actions" class="w-60"
        ><ContextMenuLabel>Project files</ContextMenuLabel
        ><ContextMenuItem
          v-for="item in items"
          :key="item.label"
          :text-value="item.label"
          @select="message = item.message"
          ><component :is="item.icon" aria-hidden="true" class="h-4 w-4" />{{
            item.label
          }}<ContextMenuShortcut v-if="item.shortcut">{{
            item.shortcut
          }}</ContextMenuShortcut></ContextMenuItem
        ><ContextMenuSeparator /><ContextMenuCheckboxItem
          text-value="Keep offline"
          :model-value="offline"
          :close-on-select="false"
          @update:model-value="checked"
          >Keep offline</ContextMenuCheckboxItem
        ><ContextMenuSeparator /><ContextMenuItem
          tone="destructive"
          text-value="Move to trash"
          @select="message = 'Moved to trash'"
          ><Trash2 aria-hidden="true" class="h-4 w-4" />Move to
          trash<ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem
        ></ContextMenuContent
      ></ContextMenu
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Check, Copy, Download, Eye, Pencil, Trash2 } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuLabel, ContextMenuItem, ContextMenuSeparator, ContextMenuCheckboxItem, ContextMenuShortcut } from "@orvui/vue/motion/context-menu";
import { SPRING_SWAP } from "@orvui/vue";
import { useReducedMotion } from "@orvui/vue";
const message = ref<string | null>(null);
const offline = ref(false), reduce = useReducedMotion();
const items = [
  ["Open", Eye, "Folder opened", "↵"],
  ["Rename", Pencil, "Ready to rename", "R"],
  ["Duplicate", Copy, "Folder duplicated", "⌘D"],
  ["Download", Download, "Download started", undefined],
].map(([label, icon, message, shortcut]) => ({ label: label as string, icon, message: message as string, shortcut: shortcut as string | undefined }));
function checked(value: boolean) { offline.value = value; message.value = value ? "Available offline" : "Online only"; }
</script>
<template>
  <div class="flex min-h-[360px] w-full items-center justify-center">
    <ContextMenu
      ><ContextMenuTrigger
        ><button
          type="button"
          class="group flex flex-col items-center outline-none"
        >
          <div
            class="relative h-24 w-32 transition-transform duration-150 group-active:scale-[0.98] group-focus-visible:rounded-2xl group-focus-visible:ring-2 group-focus-visible:ring-foreground/20 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background"
          >
            <div
              class="absolute left-1 top-1 h-7 w-14 rounded-t-[10px] bg-[#d4a84f] dark:bg-[#a77d2f]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-5 rounded-[14px] bg-[#e7bb61] shadow-[0_14px_24px_-16px_rgba(90,58,8,0.75)] dark:bg-[#bd8d36]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-9 rounded-[14px] bg-[#efc86f] dark:bg-[#cb9a41]"
            />
            <div
              class="absolute inset-x-5 bottom-4 h-px bg-black/10 dark:bg-white/10"
            />
          </div>
          <span class="mt-4 text-sm font-medium text-foreground"
            >Right click on me</span
          >
          <div class="mt-1 h-4">
            <AnimatePresence mode="wait" :initial="false"
              ><motion.span
                v-if="message"
                :key="message"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 3, filter: 'blur(2px)' }
                "
                :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, filter: 'blur(2px)' }
                "
                :transition="reduce ? { duration: 0.1 } : SPRING_SWAP"
                class="flex items-center gap-1 text-[10px] text-muted-foreground"
                ><Check aria-hidden="true" class="h-3 w-3 text-success" />{{
                  message
                }}</motion.span
              ><span v-else class="text-[10px] text-muted-foreground"
                >or long-press · Shift + F10</span
              ></AnimatePresence
            >
          </div>
        </button></ContextMenuTrigger
      ><ContextMenuContent ariaLabel="Folder actions" class="w-60"
        ><ContextMenuLabel>Project files</ContextMenuLabel
        ><ContextMenuItem
          v-for="item in items"
          :key="item.label"
          :text-value="item.label"
          @select="message = item.message"
          ><component :is="item.icon" aria-hidden="true" class="h-4 w-4" />{{
            item.label
          }}<ContextMenuShortcut v-if="item.shortcut">{{
            item.shortcut
          }}</ContextMenuShortcut></ContextMenuItem
        ><ContextMenuSeparator /><ContextMenuCheckboxItem
          text-value="Keep offline"
          :model-value="offline"
          :close-on-select="false"
          @update:model-value="checked"
          >Keep offline</ContextMenuCheckboxItem
        ><ContextMenuSeparator /><ContextMenuItem
          tone="destructive"
          text-value="Move to trash"
          @select="message = 'Moved to trash'"
          ><Trash2 aria-hidden="true" class="h-4 w-4" />Move to
          trash<ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem
        ></ContextMenuContent
      ></ContextMenu
    >
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ContextMenu` | `v-model:open` | `boolean` | `update:open` |
| `ContextMenuCheckboxItem` | `v-model` | `boolean` | `update:modelValue` |
| `ContextMenuCheckboxItem` | `v-model:checked` | `boolean` | `update:checked` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ContextMenu

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuTrigger

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Context menu"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuLabel

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `inset` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |
| `closeOnSelect` | `boolean` | `true` | 否 | — |
| `tone` | `"default" \| "destructive"` | — | 否 | — |
| `inset` | `boolean` | `false` | 否 | — |
| `textValue` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuSeparator

### ContextMenuCheckboxItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | 否 | — |
| `checked` | `boolean` | `undefined` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `closeOnSelect` | `boolean` | `true` | 否 | — |
| `tone` | `"default" \| "destructive"` | — | 否 | — |
| `inset` | `boolean` | `false` | 否 | — |
| `textValue` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:checked` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuShortcut

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

<a id="about"></a>
## 关于 Animated Context Menu

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated Context Menu？**

通过 open、defaultOpen 配置 Animated Context Menu；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Animated Color Selector](https://orvui.efu.me/components/motion/color-selector): 用移动选择轮廓与原生单选行为选择命名色块。
- [File Tree](https://orvui.efu.me/components/motion/file-tree): 通过展开分支和键盘选择浏览嵌套文件与文件夹。
- [Popover](https://orvui.efu.me/components/motion/popover): 将浮动表面连接到触发器，支持常规过渡与连续变形过渡。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/context-menu.json
- 文档: https://orvui.efu.me/components/motion/context-menu
- `packages/vue/src/motion/context-menu/src/ContextMenu.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuTrigger.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuContent.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuLabel.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuItem.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuSeparator.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuCheckboxItem.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuShortcut.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
