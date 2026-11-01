import { introductionEditorial } from "./getting-started-data";
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
  Object.assign(intro, structuredClone(introductionEditorial));
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
    title: bi("选择安装方式", "Choose an installation path"),
    blocks: [
      {
        kind: "links",
        layout: "cards",
        items: [
          {
            label: bi("组件包", "Component package"),
            url: "#package",
            description: bi(
              "预构建组件和完整样式，无需额外配置 Tailwind。",
              "Prebuilt components and complete styles, with no additional Tailwind setup.",
            ),
          },
          {
            label: bi("复制源码", "Copy source"),
            url: "#source-setup",
            description: bi(
              "通过 shadcn-vue 按需安装，自由调整实现。需要 Tailwind CSS 4。",
              "Install individual components with shadcn-vue and edit their implementation. Requires Tailwind CSS 4.",
            ),
          },
        ],
      },
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
