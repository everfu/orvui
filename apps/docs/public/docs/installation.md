# 安装指南

为 Vue Web 项目选择组件包或 shadcn-vue 安装。各组件页的用法切换与这里的安装方式对应。


<a id="choose-path"></a>

## 先选择安装方式

1. **复制源码** — 按组件安装到项目内，直接调整实现；需要 Tailwind CSS 4。

2. **使用组件包** — 通过本地归档安装预构建组件，并导入一次组件包样式。

> **注意事项**: 当前组件包未发布到 npm；先使用下方可验证的本地归档命令。

<a id="requirements"></a>

## 准备项目

需要 Node.js 22.12+、pnpm 10 和 Vue 3.5+ TypeScript 项目。组件包使用预编译样式；源码安装需要 Tailwind CSS 4。

没有 Vue 项目时，先创建项目并按提示选择 TypeScript；已有项目可直接继续。以下消费端命令均在你的应用目录执行。

```bash
pnpm create vite@7 orvui-web-app --template vue-ts
cd orvui-web-app
pnpm install
```

<a id="package"></a>

## 方式一：组件包

npm 发布后可直接安装组件包。发布前使用下方已验证的本地归档，或使用 shadcn-vue 安装源码。

```bash
pnpm add @orvui/vue
```

适合直接使用已构建组件。在 orvui 仓库根目录安装依赖、构建 Web 库，并将归档输出到你选择的目录。将下面的绝对路径替换为实际位置。

```bash
pnpm install
pnpm build:lib
pnpm --filter @orvui/vue pack --pack-destination /absolute/path/to/output
```

切回使用组件的 Vue 项目，安装本地归档。当前版本为 0.1.0；以打包命令的实际输出为准。

```bash
pnpm add /absolute/path/to/output/orvui-vue-0.1.0.tgz
```

```vue
<script setup lang="ts">
import { Button } from '@orvui/vue/motion/button'
import '@orvui/vue/style.css'
</script>

<template><Button>Continue</Button></template>
```

在应用入口或根组件导入一次 `@orvui/vue/style.css`。它已包含组件所需样式与 Tailwind 基础层；使用组件包无需另配 Tailwind。明暗模式由文档根节点上的 `.dark` 类控制。组件页选择“组件包”用法，使用 `@orvui/vue/…` 按需导入。

<a id="source-setup"></a>

## 源码方式：配置 Tailwind 与路径

使用 shadcn-vue 安装前完成这一配置。源码使用 Tailwind CSS 4 和 `@/components/orvui/…` 路径。保留已有配置，将下列插件、别名与 TypeScript 路径合并进项目。

```bash
pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4
```

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

首次使用时，在项目根目录准备 components.json。下面是只使用 orvui 注册表的新项目最小配置；orvui 已提供完整主题令牌，因此基础配色留空。已有 shadcn-vue 项目保留自己的配置即可。

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "new-york",
  "typescript": true,
  "tailwind": {
    "css": "src/style.css",
    "baseColor": "",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "composables": "@/composables"
  }
}
```

将路径配置合并到检查 `src/` 的 TypeScript 配置（Vite 模板通常为 `tsconfig.app.json`）。通过 shadcn-vue 安装后，导入生成的样式文件；它已包含完整主题令牌和辅助样式，无需同时导入组件包样式。

```css
@import "tailwindcss";
@import "./components/orvui/styles.css";
```

```typescript
import './style.css'
```

<a id="shadcn-vue"></a>

## 方式二：shadcn-vue 安装源码

源码注册表由 `orvui.efu.me` 提供。首次使用时先完成上面的源码配置，再运行组件页提供的完整命令；本地开发可以使用当前文档服务的 /r/ 地址。

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

安装项包含组件、相对依赖、主题样式和包依赖，文件默认位于 `src/components/orvui/`。某些变体需要同一条命令中的多个安装项；使用组件页所选示例给出的命令和“此示例还需要”依赖。

```vue
<script setup lang="ts">
import { Button } from '@/components/orvui/motion/button'
</script>

<template><Button>Continue</Button></template>
```

<a id="verify"></a>

## 启动与检查

```bash
pnpm exec vue-tsc --noEmit -p tsconfig.app.json
pnpm build
pnpm dev
```

类型检查命令使用 Vite 模板的应用配置 tsconfig.app.json；已有项目请替换为实际检查 src/ 的配置文件。先确认按钮有正确样式和按压反馈，再检查业务组件的状态与事件。示例直接导入的额外依赖需在应用中安装；保留安装源码中的 MIT、NOTICE 和独立 Shader 许可。主题覆盖参见[主题设置](/docs/theme)，之后可从[组件目录](/components/motion)选择组件。

## 下一步

- [主题设置](/docs/theme)
- [用动效解释，而非干扰](/docs/motion-patterns)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
