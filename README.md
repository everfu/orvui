<p align="center">
  <a href="https://orvui.efu.me">
    <img src="./assets/readme-logo.svg" width="112" height="112" alt="orvui" />
  </a>
</p>

<h1 align="center">orvui</h1>

<p align="center">一个 Vue 3.5 动效组件库</p>
<p align="center"><b>组合式 API · 主题可调 · TypeScript · 组件级源码安装</b></p>
<p align="center">让界面更生动，让开发更轻松。</p>

<p align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5%2B-42b883?logo=vuedotjs&amp;logoColor=white" alt="Vue 3.5+" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&amp;logoColor=white" alt="TypeScript" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-18181b" alt="MIT License" /></a>
</p>

<p align="center">简体中文 · <a href="./README.en.md">English</a></p>
<p align="center">
  <a href="https://orvui.efu.me">在线文档</a> ·
  <a href="https://orvui.efu.me/docs/installation">开始使用</a> ·
  <a href="./CONTRIBUTING.md">参与贡献</a>
</p>

## 文档

[orvui.efu.me](https://orvui.efu.me) · [English documentation](https://orvui.efu.me/en/)

从[安装指南](https://orvui.efu.me/docs/installation)开始，或了解[主题配置](https://orvui.efu.me/docs/theme)、[动效](https://orvui.efu.me/docs/motion-patterns)和 [AI 代理界面](https://orvui.efu.me/docs/ai-agents)。每个组件页面提供交互演示、使用代码、API 和可复制源码。

## 特性

### 从交互控件到完整界面

109 个组件、72 个注册示例，覆盖四类常见界面需求。

| 分类                                                | 内容                                 | 组件数 |
| --------------------------------------------------- | ------------------------------------ | -----: |
| [Motion](https://orvui.efu.me/components/motion)    | 按钮、选择器、浮层与动效交互         |     54 |
| [Blocks](https://orvui.efu.me/components/blocks)    | 表单、文件上传、命令面板与组合模块   |     23 |
| [AI Agents](https://orvui.efu.me/components/agents) | 消息、提示输入、工具调用与代理工作区 |     18 |
| [Charts](https://orvui.efu.me/charts)               | 交互图表与数据可视化                 |     14 |

### 主题可调，动效有回应

内置 11 套配色，支持明暗主题和语义 CSS 变量覆盖。组件使用共享弹簧与过渡参数，并支持减少动态效果偏好。

### 为 Vue 编写

基于 Vue 3.5、Composition API 和 TypeScript，使用 `v-model`、slots 与组合函数组织交互。可以从包根入口、分类入口或组件入口导入；项目分别验证类型声明、SSR 和 hydration。

### 按组件安装源码

通过 shadcn-vue CLI 安装所需组件及其实际依赖，直接在项目中修改。组件包与源码注册表使用同一份 Vue 实现，保留适用的版权和许可证。

## 安装

### 组件源码

在已配置 Tailwind CSS 4 和 `components.json` 的 Vue 项目中运行：

```sh
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

从安装后的公共入口导入组件，并在应用入口导入一次主题样式：

```vue
<script setup lang="ts">
import { Button } from "@/components/orvui/motion/button";
import "@/components/orvui/styles.css";
</script>

<template>
  <Button>开始使用</Button>
</template>
```

其他组件的安装命令见各自文档页面，完整初始化步骤见[安装指南](https://orvui.efu.me/docs/installation)。

### 本地组件包

`@orvui/vue` 当前尚未发布到 npm。可以先在 orvui 仓库根目录打包：

```sh
pnpm install
pnpm --filter @orvui/vue pack --pack-destination "$PWD/artifacts/packages/0.1.0"
```

然后在你的 Vue 项目中安装生成的归档，将路径替换为实际位置：

```sh
pnpm add /path/to/orvui-vue-0.1.0.tgz
```

使用组件包时导入一次预编译样式，无需在消费项目中配置 Tailwind：

```vue
<script setup lang="ts">
import { Button } from "@orvui/vue/motion/button";
import "@orvui/vue/style.css";
</script>

<template>
  <Button>开始使用</Button>
</template>
```

目前面向 Web，Nuxt 模块支持仍在后续计划中。

## 本地开发

使用 `package.json` 指定的 pnpm 版本：

```sh
pnpm install
pnpm dev
```

文档站使用 Nuxt SSR，开发地址以 Nuxt 启动时的输出为准，通常为 `http://localhost:3000`。运行 `pnpm build` 构建生产产物，使用 `pnpm preview` 预览，或 `pnpm start` 启动独立 Node 服务。

开发、测试与构建配置见 [文档站说明](./apps/docs/README.md)。

## 贡献

欢迎改进组件、示例和文档。请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)，了解目录约定、兼容要求、构建检查与分发验证；外观和行为约定见 [design.md](./design.md)。

## 许可

Copyright (c) 2026 **everfu**。orvui 项目代码采用 [MIT](./LICENSE) 许可。

第三方代码和资源保留各自的版权及许可。Paper Design Shader 使用独立的 PolyForm Shield 许可，字体使用 SIL OFL；图标和演示素材的来源与条款见 [NOTICE](./NOTICE)。
