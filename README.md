<h1 align="center">orvui</h1>

<p align="center">为 Vue 打造的动效组件库。可组合、可定制，源码由你掌控。</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5%2B-42b883?logo=vuedotjs&amp;logoColor=white" alt="Vue 3.5+" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&amp;logoColor=white" alt="TypeScript" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-18181b" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="https://orvui.efu.me/">文档</a> ·
  <a href="https://orvui.efu.me/components">组件</a> ·
  <a href="https://orvui.efu.me/templates">模板</a> ·
  <a href="https://orvui.efu.me/docs/installation">快速开始</a>
</p>

<p align="center">简体中文 · <a href="./README.en.md">English</a></p>

<a href="https://orvui.efu.me/">
  <img src="./apps/docs/public/social/orvui-v2.png" alt="orvui — Animated components for Vue. Motion, Blocks, AI Agents, Charts." width="1200" />
</a>

## 特性

- **丰富的组件** — 动效交互、组合模块、AI 代理界面与数据图表，提供交互演示、用法和 API。
- **可定制主题** — 11 套配色、明暗模式与语义 CSS 变量，适配产品风格。
- **自然的动效** — 共享弹簧与过渡参数，支持减少动态效果偏好。
- **为 Vue 编写** — Vue 3.5、Composition API 与 TypeScript，支持 Vue 和 Nuxt 显式导入，可安装组件包或按需复制源码。

## 快速开始

需要 Vue 3.5+ 与 TypeScript 项目。完整环境要求与配置见[安装指南](https://orvui.efu.me/docs/installation)。

### 安装组件源码

先按[源码配置](https://orvui.efu.me/docs/installation#source-setup)设置 Tailwind CSS 4、`@` 路径别名和 `components.json`，然后添加组件：

```sh
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

在应用的样式入口（如 `src/style.css`）导入 Tailwind 和组件主题，并确保 `src/main.ts` 已导入该样式文件：

```css
@import "tailwindcss";
@import "./components/orvui/styles.css";
```

在页面中使用：

```vue
<script setup lang="ts">
import { Button } from "@/components/orvui/motion/button";
</script>

<template>
  <Button>开始使用</Button>
</template>
```

其他组件及变体的安装命令见各自[文档页面](https://orvui.efu.me/components)。

### 使用组件包

组件包自带预编译样式，无需额外配置 Tailwind。直接从 npm 安装，完整步骤见[组件包指南](https://orvui.efu.me/docs/installation#package)。

```sh
pnpm add @orvui/vue
```

固定安装 0.1.1，或从 0.1.0 升级：

```sh
pnpm add @orvui/vue@0.1.1
```

```vue
<script setup lang="ts">
import { Button } from "@orvui/vue/motion/button";
import "@orvui/vue/style.css";
</script>

<template>
  <Button>开始使用</Button>
</template>
```

在应用入口导入一次组件包样式。Nuxt 项目通过 `nuxt.config.ts` 的 `css` 加载该样式，组件仍显式导入。

## 文档

[安装指南](https://orvui.efu.me/docs/installation) · [主题配置](https://orvui.efu.me/docs/theme) · [动效指南](https://orvui.efu.me/docs/motion-patterns) · [AI 代理界面](https://orvui.efu.me/docs/ai-agents)

浏览 [Motion](https://orvui.efu.me/components/motion)、[Blocks](https://orvui.efu.me/components/blocks)、[AI Agents](https://orvui.efu.me/components/agents) 和 [Charts](https://orvui.efu.me/charts)，或体验[应用模板](https://orvui.efu.me/templates)。

## 本地开发

使用 `package.json` 指定的 pnpm 版本，在仓库根目录运行：

```sh
pnpm install
pnpm docs:dev
```

打开 Nuxt 输出的开发地址。构建与检查命令见[文档站说明](./apps/docs/README.md)。

## 贡献

欢迎贡献组件、示例和文档。请先阅读[贡献指南](./CONTRIBUTING.md)与[设计约定](./design.md)。

## 许可

Copyright (c) 2026 **everfu**。orvui 项目代码采用 [MIT](./LICENSE) 许可。

第三方代码和资源保留各自的版权及许可。Paper Design Shader 使用独立的 PolyForm Shield 许可，字体使用 SIL OFL；图标和演示素材的来源与条款见 [NOTICE](./NOTICE)。

## Vue 3.6 Beta

本地开发版 `0.2.0-beta.1` 使用 Vue `3.6.0-rc.14`，沿用常规渲染模式与现有 API。文档顶部可切换稳定版和 `/beta/` 开发版。

运行 `pnpm beta:pack`，生成 `artifacts/packages/0.2.0-beta.1/orvui-vue-0.2.0-beta.1.tgz`；将归档复制到消费项目后用 `pnpm add ./orvui-vue-0.2.0-beta.1.tgz` 安装。Beta 尚未发布到 npm；未启用 Vapor。
