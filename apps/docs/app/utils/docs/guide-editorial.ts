import type { SiteBlock, SitePageDefinition } from "./site-page-data";
const bi = (zh: string, en: string) => ({ zh, en });
const paragraph = (zh: string, en: string): SiteBlock => ({
  kind: "paragraph",
  text: bi(zh, en),
});
const code = (value: string, filename: string, lang: string): SiteBlock => ({
  kind: "code",
  code: value,
  filename,
  lang,
});
const note = (zh: string, en: string, warning = false): SiteBlock => ({
  kind: "callout",
  tone: warning ? "warning" : "info",
  text: bi(zh, en),
});

/** Editorial structure is shared by rendered guides, search and Markdown. */
export function applyGuideEditorial(
  pages: SitePageDefinition[],
  themeCss: string,
) {
  const intro = pages.find((page) => page.slug === "introduction")!;
  intro.title = bi("开始使用 orvui", "Get started with orvui");
  intro.description = bi(
    "为 Vue 3.5 应用添加可组合的交互组件。选择一个组件，安装源码或本地组件包，再按你的产品需求调整外观与行为。",
    "Add composable, interactive components to a Vue 3.5 application. Choose a component, install its source or a local package, and adapt its appearance and behavior to your product.",
  );
  intro.sections = [
    {
      id: "installation",
      title: bi("从一个组件开始", "Start with one component"),
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: bi("准备项目", "Prepare your project"),
              text: bi(
                "使用 Vue 3.5 与 TypeScript。源码安装使用 Tailwind CSS 4；组件包自带编译后的样式。",
                "Use Vue 3.5 and TypeScript. Source installation uses Tailwind CSS 4; the package includes compiled styles.",
              ),
            },
            {
              title: bi("选择安装方式", "Choose an installation path"),
              text: bi(
                "希望在项目内修改实现时选择复制源码；希望使用预构建入口时选择组件包。",
                "Copy the source to edit the implementation in your app, or use the package for prebuilt imports.",
              ),
            },
            {
              title: bi("运行第一个示例", "Run your first example"),
              text: bi(
                "先确认按钮样式和按压反馈正常，再接入业务状态。",
                "Check the button styles and press feedback before connecting application state.",
              ),
            },
          ],
        },
        paragraph(
          '完整步骤见<a href="/docs/installation">安装指南</a>。下面以复制 Button 源码为例。',
          'Follow the <a href="/docs/installation">installation guide</a>. This example installs the Button source.',
        ),
        code(
          "pnpm dlx shadcn-vue@2.8.2 add {{registry}}/button.json",
          "terminal",
          "bash",
        ),
        note(
          "组件包尚未发布到 npm。组件包安装请使用安装指南中的本地归档流程。",
          "The package is not published to npm. Use the local archive workflow in the installation guide for package installation.",
        ),
      ],
    },
    {
      id: "import-components",
      title: bi("添加第一个按钮", "Add your first button"),
      blocks: [
        paragraph(
          '完成<a href="/docs/installation#source-setup">源码配置</a>后，在应用中导入安装的组件。',
          'Complete <a href="/docs/installation#source-setup">source setup</a>, then import the installed component.',
        ),
        code(
          `<script setup lang="ts">\nimport { Button } from '@/components/orvui/motion/button'\n</script>\n\n<template>\n  <Button>Continue</Button>\n</template>`,
          "src/App.vue",
          "vue",
        ),
        paragraph(
          "页面应显示可操作的按钮，键盘聚焦时有清晰的焦点提示，按下时有反馈。",
          "You should see an interactive button with a visible keyboard focus indicator and press feedback.",
        ),
      ],
    },
    {
      id: "copy-source",
      title: bi("让源码属于你的项目", "Make the source your own"),
      blocks: [
        paragraph(
          "源码位于 <code>src/components/orvui/</code>，安装时会包含组件需要的相对依赖、样式和许可。按组件安装；只在对应示例要求时添加额外依赖。",
          "Source lives in <code>src/components/orvui/</code>, including relative helpers, styles and licenses. Install individual components and add extra dependencies only when the selected example needs them.",
        ),
      ],
    },
    {
      id: "state",
      title: bi("连接状态与组合组件", "Connect state and compose components"),
      blocks: [
        paragraph(
          "表单组件使用 <code>v-model</code>，弹层通常使用 <code>v-model:open</code>。复合组件通过子组件、插槽和组合式 API 配合使用；具体名称与默认行为以各页 API 为准。",
          "Form components use <code>v-model</code>; overlays typically use <code>v-model:open</code>. Compose related parts with child components, slots and composables. Each API reference defines exact names and defaults.",
        ),
      ],
    },
    {
      id: "nuxt",
      title: bi("在 Nuxt 与 SSR 中使用", "Use Nuxt and SSR"),
      blocks: [
        paragraph(
          '组件库支持在 Nuxt 项目中使用。按需显式导入组件；使用组件包时，在 <code>nuxt.config.ts</code> 的 <code>css</code> 中添加 <code>"@orvui/vue/style.css"</code>，统一加载样式。当前文档站使用 Nuxt SSR。',
          'Use orvui in Nuxt projects with explicit component imports. When using the package, add <code>"@orvui/vue/style.css"</code> to <code>css</code> in <code>nuxt.config.ts</code> to load styles globally. This documentation runs on Nuxt SSR.',
        ),
      ],
    },
    {
      id: "attribution",
      title: bi("保留许可，继续探索", "Keep notices and continue"),
      blocks: [
        paragraph(
          '复制源码时保留 MIT、NOTICE 及适用的独立 Shader 和字体许可。接下来阅读<a href="/docs/theme">主题设置</a>，或从<a href="/components">组件目录</a>选择下一个组件。',
          'Keep MIT, NOTICE and applicable shader and font licenses with copied source. Continue with <a href="/docs/theme">theme setup</a> or browse the <a href="/components">component catalog</a>.',
        ),
      ],
    },
  ];
  const theme = pages.find((page) => page.slug === "theme")!;
  theme.description = bi(
    "先加载组件样式，再选择配色和明暗模式。使用语义 CSS 变量覆盖你需要的部分，让组件继续共享一致的外观。",
    "Load component styles first, then choose a palette and appearance mode. Override semantic CSS variables to customize the parts you need while keeping components consistent.",
  );
  theme.sections = [
    {
      id: "import-order",
      title: bi("按顺序导入样式", "Import styles in order"),
      blocks: [
        paragraph(
          "源码安装在应用样式中依次导入 Tailwind 和生成的样式，再放置你的覆盖。组件包则在应用入口导入一次组件包样式。",
          "For source installation, import Tailwind and the generated stylesheet before your overrides. For the package, import its stylesheet once in the application entry.",
        ),
        code(
          '@import "tailwindcss";\n@import "./components/orvui/styles.css";\n\n/* Application overrides follow these imports. */',
          "src/style.css",
          "css",
        ),
        code("import '@orvui/vue/style.css'", "src/main.ts", "typescript"),
        note(
          "源码样式和组件包样式选择一种即可，避免重复导入完整主题。",
          "Use either the generated source stylesheet or the package stylesheet to avoid importing the complete theme twice.",
        ),
      ],
    },
    {
      id: "palettes",
      title: bi("选择一套配色", "Choose a palette"),
      blocks: [
        paragraph(
          "文档右上角的主题面板提供 11 套配色。选择后复制 CSS，将生成的变量放到项目样式的末尾。配色不会改变组件的尺寸和交互。",
          "The theme panel offers 11 palettes. Choose one and copy its CSS to the end of your stylesheet. Palettes preserve component dimensions and interactions.",
        ),
        code(
          ":root {\n  --primary: #0285f7;\n  --primary-foreground: #ffffff;\n}",
          "src/style.css",
          "css",
        ),
      ],
    },
    {
      id: "appearance",
      title: bi("切换明暗模式", "Switch light and dark modes"),
      blocks: [
        paragraph(
          "在根元素使用 dark 类启用深色模式；移除该类恢复浅色模式。首次渲染和客户端水合应使用一致的初始选择。",
          "Apply the dark class to the root element for dark mode; remove it for light mode. Keep the initial choice consistent across first render and client hydration.",
        ),
        code(
          '<html class="dark">\n  <!-- Your application -->\n</html>',
          "index.html",
          "html",
        ),
      ],
    },
    {
      id: "semantic-overrides",
      title: bi("覆盖语义变量", "Override semantic variables"),
      blocks: [
        paragraph(
          "优先覆盖 background、foreground、primary、border 等语义变量。将局部覆盖放在容器上，可让其中的组件继承，而不影响页面其他部分。",
          "Prefer semantic variables such as background, foreground, primary and border. Scope overrides to a container so its components inherit them without affecting the rest of the page.",
        ),
        code(
          ".account-panel {\n  --primary: #0285f7;\n  --primary-foreground: #ffffff;\n}\n\n.dark .account-panel {\n  --primary: #5caeff;\n  --primary-foreground: #151515;\n}",
          "src/style.css",
          "css",
        ),
        note(
          "不要通过重置组件内部选择器覆盖状态样式。先使用公开的 class、插槽或语义变量。",
          "Use public classes, slots or semantic variables before overriding internal state selectors.",
        ),
      ],
    },
    {
      id: "shadcn-init",
      title: bi("已有 shadcn-vue 项目", "Existing shadcn-vue projects"),
      blocks: [
        paragraph(
          "已有 shadcn-vue 项目可复用现有令牌。新项目先完成初始化，再按安装指南导入 orvui 生成的完整样式。",
          "Reuse existing tokens in a shadcn-vue project. For a new project, initialize it first, then import the complete generated orvui styles as described in the installation guide.",
        ),
        code("pnpm dlx shadcn-vue@2.8.2 init", "terminal", "bash"),
      ],
    },
    {
      id: "theme-css",
      title: bi("查看完整主题样式", "Inspect the complete stylesheet"),
      blocks: [
        paragraph(
          '需要完整令牌、动效动画和辅助样式时，查看下方内容或下载<a href="/theme.css">theme.css</a>。',
          'Inspect the complete tokens, motion animations and helpers below, or download <a href="/theme.css">theme.css</a>.',
        ),
        code(themeCss, "globals.css", "css"),
      ],
    },
    {
      id: "next-steps",
      title: bi("检查结果与下一步", "Verify and continue"),
      blocks: [
        paragraph(
          '在明暗模式中检查文字、边框、焦点和禁用状态，再验证窄屏布局。继续阅读<a href="/docs/motion-patterns">动效指南</a>，让主题与交互一起保持一致。',
          'Check text, borders, focus and disabled states in both modes, then verify narrow layouts. Continue with the <a href="/docs/motion-patterns">motion guide</a> to keep appearance and interaction consistent.',
        ),
      ],
    },
  ];
  const install = pages.find((page) => page.slug === "installation")!;
  install.sections = install.sections.filter(
    (section) => section.id !== "choose-path",
  );
  install.sections.unshift({
    id: "choose-path",
    title: bi("先选择安装方式", "Choose your installation path"),
    blocks: [
      {
        kind: "steps",
        items: [
          {
            title: bi("复制源码", "Copy the source"),
            text: bi(
              "按组件安装到项目内，直接调整实现；需要 Tailwind CSS 4。",
              "Install individual components into your project and edit them directly. Requires Tailwind CSS 4.",
            ),
          },
          {
            title: bi("使用组件包", "Use the package"),
            text: bi(
              "通过本地归档安装预构建组件，并导入一次组件包样式。",
              "Install prebuilt components from a local archive and import the package stylesheet once.",
            ),
          },
        ],
      },
      note(
        "当前组件包未发布到 npm；先使用下方可验证的本地归档命令。",
        "The package is not published to npm; use the verifiable local archive commands below.",
        true,
      ),
    ],
  });
  for (const slug of ["ai-agents", "openui"] as const) {
    const page = pages.find((page) => page.slug === slug)!;
    page.sections = page.sections.filter(
      (section) => section.id !== "workflow",
    );
    page.sections.unshift({
      id: "workflow",
      title: bi("先了解接入流程", "Start with the workflow"),
      blocks: [
        {
          kind: "steps",
          items: [
            {
              title: bi("读取现有能力", "Discover existing capabilities"),
              text: bi(
                "从文档与注册表获取组件名称、API 和依赖。",
                "Read component names, APIs and dependencies from the documentation and registry.",
              ),
            },
            {
              title: bi("安装并显式注册", "Install and register explicitly"),
              text: bi(
                "使用真实安装项和公开入口，按当前项目框架接入。",
                "Use actual registry items and public imports, then integrate with your application's framework.",
              ),
            },
            {
              title: bi("运行并核对结果", "Run and verify"),
              text: bi(
                "检查生成结果、交互状态与需要的服务端能力。",
                "Check the generated output, interaction state and any required server capabilities.",
              ),
            },
          ],
        },
        note(
          "页面中的集成代码用于说明组合方式。模型调用、权限和后端实现由应用提供。",
          "Integration snippets explain composition. Your application provides model calls, permissions and backend behavior.",
        ),
      ],
    });
  }
}
