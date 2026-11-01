# 开始使用 orvui

为 Vue 3.5 应用添加可组合的交互组件。选择一个组件，安装源码或本地组件包，再按你的产品需求调整外观与行为。


<a id="installation"></a>

## 从一个组件开始

1. **准备项目** — 使用 Vue 3.5 与 TypeScript。源码安装使用 Tailwind CSS 4；组件包自带编译后的样式。

2. **选择安装方式** — 希望在项目内修改实现时选择复制源码；希望使用预构建入口时选择组件包。

3. **运行第一个示例** — 先确认按钮样式和按压反馈正常，再接入业务状态。

完整步骤见[安装指南](/docs/installation)。下面以复制 Button 源码为例。

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

> **提示**: 组件包尚未发布到 npm。组件包安装请使用安装指南中的本地归档流程。

<a id="import-components"></a>

## 添加第一个按钮

完成[源码配置](/docs/installation#source-setup)后，在应用中导入安装的组件。

```vue
<script setup lang="ts">
import { Button } from '@/components/orvui/motion/button'
</script>

<template>
  <Button>Continue</Button>
</template>
```

页面应显示可操作的按钮，键盘聚焦时有清晰的焦点提示，按下时有反馈。

<a id="copy-source"></a>

## 让源码属于你的项目

源码位于 `src/components/orvui/`，安装时会包含组件需要的相对依赖、样式和许可。按组件安装；只在对应示例要求时添加额外依赖。

<a id="state"></a>

## 连接状态与组合组件

表单组件使用 `v-model`，弹层通常使用 `v-model:open`。复合组件通过子组件、插槽和组合式 API 配合使用；具体名称与默认行为以各页 API 为准。

<a id="nuxt"></a>

## 在 Nuxt 与 SSR 中使用

组件库支持在 Nuxt 项目中使用。按需显式导入组件；使用组件包时，在 `nuxt.config.ts` 的 `css` 中添加 `"@orvui/vue/style.css"`，统一加载样式。当前文档站使用 Nuxt SSR。

<a id="attribution"></a>

## 保留许可，继续探索

复制源码时保留 MIT、NOTICE 及适用的独立 Shader 和字体许可。接下来阅读[主题设置](/docs/theme)，或从[组件目录](/components)选择下一个组件。


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
