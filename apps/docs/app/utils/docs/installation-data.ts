import { packageName, packageVersion } from "../../../../../tools/distribution";
import type {
  SiteBlock,
  SitePageDefinition,
  SiteSection,
} from "./site-page-data";

const bi = (zh: string, en: string) => ({ zh, en });
const p = (zh: string, en: string): SiteBlock => ({
  kind: "paragraph",
  text: bi(zh, en),
});
const code = (
  content: string,
  filename = "terminal",
  lang = "bash",
): SiteBlock => ({ kind: "code", code: content, filename, lang });
const section = (
  id: string,
  zh: string,
  en: string,
  blocks: SiteBlock[],
): SiteSection => ({ id, title: bi(zh, en), blocks });

export const webPackageApp = `<script setup lang="ts">
import { Button } from '@orvui/vue/motion/button'
import '@orvui/vue/style.css'
</script>

<template><Button>Continue</Button></template>`;
export const webSourceApp = webPackageApp
  .replace("'@orvui/vue/motion/button'", "'@/components/orvui/motion/button'")
  .replace("import '@orvui/vue/style.css'\n", "");
// Keep Nitro's import-meta transform away from the displayed example text.
const importMetaUrl = ["import", "meta", "url"].join(".");
export const webViteConfig = `import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', ${importMetaUrl})) } },
})`;

export const webInstallationPage: SitePageDefinition = {
  slug: "installation",
  path: "/docs/installation",
  eyebrow: bi("Web · 安装", "Web · Installation"),
  title: bi("快速开始", "Quick Start"),
  description: bi(
    "安装第一个组件，加载样式，然后连接你的应用状态。",
    "Install your first component, load its styles and connect your application state.",
  ),
  sections: [
    section("requirements", "准备项目", "Prepare your project", [
      p(
        "需要 Node.js 22.12+、pnpm 10 和 Vue 3.5+ TypeScript 项目。组件包使用预编译样式；源码安装需要 Tailwind CSS 4。",
        "Use Node.js 22.12+, pnpm 10, and a Vue 3.5+ TypeScript application. The package includes compiled styles; source installation requires Tailwind CSS 4.",
      ),
      p(
        "没有 Vue 项目时，先创建项目并按提示选择 TypeScript；已有项目可直接继续。以下消费端命令均在你的应用目录执行。",
        "If you do not have a Vue application, create one and select TypeScript. Otherwise continue in your existing project. Run consumer commands below from your application directory.",
      ),
      code(
        "pnpm create vite@7 orvui-web-app --template vue-ts\ncd orvui-web-app\npnpm install",
      ),
    ]),
    section("package", "方式一：组件包", "Option 1: component package", [
      p(
        "组件包已发布到 npm，在你的 Vue 或 Nuxt 应用目录直接安装。它包含预构建组件和完整样式，无需额外配置 Tailwind。",
        "The package is available on npm. Install it directly in your Vue or Nuxt application. It includes prebuilt components and complete styles, with no additional Tailwind setup.",
      ),
      code(`pnpm add ${packageName}`),
      p(
        `固定安装 ${packageVersion}，或将已有项目从旧版升级到 ${packageVersion}，使用以下命令。升级后保留现有导入与主题覆盖，并运行项目的类型检查和构建。`,
        `To pin version ${packageVersion}, or upgrade an existing application from an earlier release to ${packageVersion}, use the command below. Keep your imports and theme overrides, then run your application's type check and build.`,
      ),
      code(`pnpm add ${packageName}@${packageVersion}`),
      code(webPackageApp, "src/App.vue", "vue"),
      p(
        "在应用入口或根组件导入一次 <code>@orvui/vue/style.css</code>。它已包含组件所需样式与 Tailwind 基础层；使用组件包无需另配 Tailwind。明暗模式由文档根节点上的 <code>.dark</code> 类控制。组件页选择“组件包”用法，使用 <code>@orvui/vue/…</code> 按需导入。",
        "Import <code>@orvui/vue/style.css</code> once in your application entry or root component. It includes component styles and the Tailwind base layer; the package path needs no separate Tailwind setup. A <code>.dark</code> class on the document root enables dark mode. Select Package Usage on a component page for <code>@orvui/vue/…</code> imports.",
      ),
      p(
        "Nuxt 项目在 <code>nuxt.config.ts</code> 的 <code>css</code> 中加载样式，组件仍在页面或组件中显式导入，无需全局注册。",
        "In Nuxt, load the stylesheet through <code>css</code> in <code>nuxt.config.ts</code>. Import components explicitly in your pages or components; global registration is not required.",
      ),
      code(
        "export default defineNuxtConfig({\n  css: ['@orvui/vue/style.css'],\n})",
        "nuxt.config.ts",
        "typescript",
      ),
    ]),
    section(
      "source-setup",
      "源码方式：配置 Tailwind 与路径",
      "Source setup: Tailwind and aliases",
      [
        p(
          "使用 shadcn-vue 安装前完成这一配置。源码使用 Tailwind CSS 4 和 <code>@/components/orvui/…</code> 路径。保留已有配置，将下列插件、别名与 TypeScript 路径合并进项目。",
          "Complete this setup before installing with shadcn-vue. Source uses Tailwind CSS 4 and <code>@/components/orvui/…</code> imports. Merge the plugins, alias and TypeScript paths below into your existing configuration.",
        ),
        code("pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4"),
        code(webViteConfig, "vite.config.ts", "typescript"),
        code(
          '{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": { "@/*": ["src/*"] }\n  }\n}',
          "tsconfig.app.json",
          "json",
        ),
        p(
          "首次使用时，在项目根目录准备 components.json。下面是只使用 orvui 注册表的新项目最小配置；orvui 已提供完整主题令牌，因此基础配色留空。已有 shadcn-vue 项目保留自己的配置即可。",
          "For a new project using the orvui registry, create components.json at the project root with the minimal configuration below. Leave baseColor empty because orvui supplies complete theme tokens. Existing shadcn-vue projects can retain their configuration.",
        ),
        code(
          JSON.stringify(
            {
              $schema: "https://shadcn-vue.com/schema.json",
              style: "new-york",
              typescript: true,
              tailwind: {
                css: "src/style.css",
                baseColor: "",
                cssVariables: true,
              },
              aliases: {
                components: "@/components",
                utils: "@/lib/utils",
                ui: "@/components/ui",
                lib: "@/lib",
                composables: "@/composables",
              },
            },
            null,
            2,
          ),
          "components.json",
          "json",
        ),
        p(
          "将路径配置合并到检查 <code>src/</code> 的 TypeScript 配置（Vite 模板通常为 <code>tsconfig.app.json</code>）。通过 shadcn-vue 安装后，导入生成的样式文件；它已包含完整主题令牌和辅助样式，无需同时导入组件包样式。",
          "Merge paths into the TypeScript configuration that checks <code>src/</code> (usually <code>tsconfig.app.json</code> in the Vite template). After installing with shadcn-vue, import the generated stylesheet. It includes complete theme tokens and helpers; use it as the source stylesheet.",
        ),
        code(
          '@import "tailwindcss";\n@import "./components/orvui/styles.css";',
          "src/style.css",
          "css",
        ),
        code("import './style.css'", "src/main.ts", "typescript"),
      ],
    ),
    section(
      "shadcn-vue",
      "方式二：shadcn-vue 安装源码",
      "Option 2: shadcn-vue source",
      [
        p(
          "源码注册表由 <code>orvui.efu.me</code> 提供。首次使用时先完成上面的源码配置，再运行组件页提供的完整命令；本地开发可以使用当前文档服务的 /r/ 地址。",
          "The source registry is served at <code>orvui.efu.me</code>. Complete the source setup above, then run the complete command from the component page. Local development can use the documentation server’s /r/ endpoint.",
        ),
        code("pnpm dlx shadcn-vue@2.8.2 add {{origin}}/r/button.json"),
        p(
          "安装项包含组件、相对依赖、主题样式和包依赖，文件默认位于 <code>src/components/orvui/</code>。某些变体需要同一条命令中的多个安装项；使用组件页所选示例给出的命令和“此示例还需要”依赖。",
          "An item includes component source, relative helpers, theme styles and package dependencies, under <code>src/components/orvui/</code>. Some variants need multiple items in one command. Use the command and “This example also needs” dependencies shown for the selected example.",
        ),
        code(webSourceApp, "src/App.vue", "vue"),
      ],
    ),
    section("verify", "启动与检查", "Run and verify", [
      code(
        "pnpm exec vue-tsc --noEmit -p tsconfig.app.json\npnpm build\npnpm dev",
      ),
      p(
        '类型检查命令使用 Vite 模板的应用配置 tsconfig.app.json；已有项目请替换为实际检查 src/ 的配置文件。先确认按钮有正确样式和按压反馈，再检查业务组件的状态与事件。示例直接导入的额外依赖需在应用中安装；保留安装源码中的 MIT、NOTICE 和独立 Shader 许可。主题覆盖参见<a href="/docs/theme">主题设置</a>，之后可从<a href="/components">组件目录</a>选择组件。',
        'The type-check command targets the Vite template’s tsconfig.app.json. For an existing project, select the configuration that checks src/. Check the button’s styles and press feedback, then verify state and events for your chosen components. Install dependencies imported directly by an example. Keep MIT, NOTICE and separate shader licenses with the installed source. See <a href="/docs/theme">Theme setup</a> for overrides, then explore the <a href="/components">component catalog</a>.',
      ),
    ]),
  ],
};
