import catalog from "../catalog/components.json";
import { documentationOrigin, shadcnVersion } from "../distribution";
import { THEMES } from "../../packages/vue/src/theme/palettes";

export type ConsumerDocument = "AGENTS.md" | "DESIGN.md";

/** Consumer guidance, deliberately separate from this repository's maintainer rules. */
export function consumerDocument(
  filename: ConsumerDocument,
  en = false,
  origin = documentationOrigin,
): string {
  const tr = (zh: string, english: string) => (en ? english : zh);
  const docs = `${origin}${en ? "/en" : ""}/docs`;
  const out = [
    `# orvui ${filename}`,
    "",
    `${tr("产品版本", "Product version")}: ${catalog.product.version}`,
    "",
  ];
  if (filename === "AGENTS.md") {
    out.push(
      tr(
        "将需要的段落合并到项目已有的 AGENTS.md 或助手规则中，保留项目本身的约束。",
        "Merge the relevant sections into your existing AGENTS.md or agent rules, preserving your project's instructions.",
      ),
      "",
      `## ${tr("选用组件", "Choose components")}`,
      "",
      tr(
        `先读取 [文档索引](${origin}/llms.txt)，再查阅所需组件的 API、示例和版本。优先组合现有组件。`,
        `Read the [documentation index](${origin}/llms.txt), then the selected components' APIs, examples and versions. Compose existing components first.`,
      ),
      "",
      "```bash",
      "npx skills add everfu/orvui --skill orvui",
      "```",
      "",
      tr(
        `技能包的 references/index.md 指向完整双语参考。也可通过 [MCP](${docs}/mcp-server) 查询当前部署版本的文档和完整源码。核对其版本与项目版本。`,
        `The skill's references/index.md links to complete bilingual references. Use [MCP](${docs}/mcp-server) for deployed documentation and complete source. Compare its version with your project's version.`,
      ),
      "",
      `## ${tr("安装与导入", "Installation and imports")}`,
      "",
      tr(
        `根据项目选择一种 [安装方式](${docs}/installation)，避免无意混用组件包和复制源码。Vue 与 Nuxt 均使用显式公开导入。`,
        `Choose an [installation mode](${docs}/installation) for the project. Avoid unintentionally mixing package components and copied source. Use explicit public imports in both Vue and Nuxt.`,
      ),
      "",
      "- " +
        tr(
          "组件包：安装 @orvui/vue，全局加载一次 @orvui/vue/style.css；Nuxt 在 nuxt.config.ts 的 css 中配置样式。",
          "Package: install @orvui/vue and load @orvui/vue/style.css once globally; configure the stylesheet in nuxt.config.ts's css array for Nuxt.",
        ),
      "- " +
        tr(
          `复制源码：使用注册表中的真实安装 slug，检查完整文件与依赖。示例：npx shadcn-vue@${shadcnVersion} add ${origin}/r/button.json。源码方式需要 Tailwind CSS 4。`,
          `Copied source: select an actual registry install slug and inspect all files and dependencies. Example: npx shadcn-vue@${shadcnVersion} add ${origin}/r/button.json. Source installation requires Tailwind CSS 4.`,
        ),
      "",
      `## ${tr("使用真实 API", "Use actual APIs")}`,
      "",
      "- " +
        tr(
          "仅在组件暴露对应配对时使用 modelValue/update:modelValue 或 open/update:open；不要为仅通过插槽组合的组件发明状态绑定。",
          "Use modelValue/update:modelValue or open/update:open only when the component exposes the pair. Do not invent state models for slot-only compositions.",
        ),
      "- " +
        tr(
          "可选受控 Boolean 属性保持 undefined 默认值。根据文档使用插槽与 provide/inject，不访问组件内部实现。",
          "Keep optional controlled Boolean defaults undefined. Use documented slots and provide/inject rather than internal implementation details.",
        ),
      "- " +
        tr(
          "应用提供真实的数据、服务、权限和持久化；示例交互不代表已完成后端接入。",
          "The application supplies real data, services, authorization and persistence. Demo interactions do not establish backend integration.",
        ),
      "",
      `## ${tr("视觉与验证", "Appearance and verification")}`,
      "",
      tr(
        "遵循 [DESIGN.md](./DESIGN.md) 中的视觉与交互约定。保留组件几何、语义主题覆盖和动效。",
        "Follow [DESIGN.md](./DESIGN.md) for visual and interaction decisions. Preserve component geometry, semantic theme overrides and motion.",
      ),
      "",
      tr(
        "运行消费项目自身的类型检查与相关测试；分别验证键盘与焦点、减少动态效果、移动布局，以及 Nuxt 的 SSR/hydration。报告实际通过的检查。",
        "Run the consuming project's type checks and relevant tests. Verify keyboard and focus, reduced motion, mobile layout and Nuxt SSR/hydration separately. Report checks that actually passed.",
      ),
    );
  } else {
    const roles = [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "primary",
      "primary-foreground",
      "muted",
      "muted-foreground",
      "border",
      "ring",
    ];
    out.push(
      tr(
        "让生成的界面沿用 orvui 的视觉语言。请从 AGENTS.md、编辑器规则或提示词引用本文件；不要假定助手会自动发现 DESIGN.md。",
        "Keep generated interfaces consistent with orvui. Reference this file from AGENTS.md, editor rules or your prompt; do not assume agents automatically discover DESIGN.md.",
      ),
      "",
      `## ${tr("语义主题", "Semantic theme")}`,
      "",
      tr(
        `使用 bg-background、text-foreground、bg-card、border-border 与 ring-ring 等语义工具类及对应 CSS 变量。明暗模式和配色由主题控制，不为每个页面硬编码颜色。参阅 [主题配置](${docs}/theme)。`,
        `Use semantic utilities such as bg-background, text-foreground, bg-card, border-border and ring-ring with their CSS variables. Let themes control appearance and palette rather than hardcoding page colors. See [Theming](${docs}/theme).`,
      ),
      "",
      `${tr("配色", "Palettes")}: ${Object.keys(THEMES)
        .map((name) => `\`${name}\``)
        .join(", ")}.`,
      "",
      tr(
        "以下默认主题值直接来自组件库，用于交接与核对。实现时引用语义变量；项目定制主题后，应同步本文件。",
        "These default values come directly from the library for handoff and verification. Reference semantic variables in implementations. Update this file when customizing your project's theme.",
      ),
      "",
      `| ${tr("变量", "Variable")} | ${tr("浅色", "Light")} | ${tr("深色", "Dark")} |`,
      "| --- | --- | --- |",
      ...roles.map(
        (role) =>
          `| \`--${role}\` | \`${THEMES.default.light[`--${role}`]}\` | \`${THEMES.default.dark[`--${role}`]}\` |`,
      ),
      "",
      `## ${tr("布局与层次", "Layout and hierarchy")}`,
      "",
      "- " +
        tr(
          "保留所选组件的字体、间距、圆角、边框和阴影，通过公开属性和插槽组合布局，不统一重设所有组件尺寸。",
          "Preserve the chosen components' typography, spacing, corners, borders and shadows. Compose layouts through public props and slots rather than resetting every component's dimensions.",
        ),
      "- " +
        tr(
          "默认主题字体映射为 Geist 与 Geist Mono；沿用应用字体配置，保持文字层次和代码可读性。",
          "The default theme maps fonts to Geist and Geist Mono. Respect the application's font setup and retain readable text and code hierarchy.",
        ),
      "- " +
        tr(
          "用内容顺序、留白和表面层级区分信息，将主色留给主要操作、选中和焦点状态。窄屏重新排布内容，避免整体缩小界面。",
          "Use content order, whitespace and surface hierarchy to organize information. Reserve the primary color for primary actions, selection and focus. Reflow narrow layouts rather than shrinking the entire interface.",
        ),
      "",
      `## ${tr("组合与动效", "Composition and motion")}`,
      "",
      "- " +
        tr(
          "优先使用 orvui 的公开组件及其组合部件，遵循各组件真实状态绑定。保持现有几何、弹簧和过渡，避免重复包装导致双重动画。",
          "Use orvui's public components and composition parts with their actual state bindings. Preserve geometry, springs and transitions; avoid wrappers that duplicate animation.",
        ),
      "- " +
        tr(
          `自定义交互沿用共享弹簧与 whilePress；处理 prefers-reduced-motion，减少位移和过冲，保留可理解的状态反馈。参阅 [动效指南](${docs}/motion-patterns)。`,
          `Custom interactions use shared springs and whilePress. Honor prefers-reduced-motion by reducing displacement and overshoot while retaining understandable state feedback. See [Animation](${docs}/motion-patterns).`,
        ),
      "",
      `## ${tr("可访问性与服务端渲染", "Accessibility and server rendering")}`,
      "",
      "- " +
        tr(
          "保留键盘操作、可见焦点、可访问名称、禁用与验证反馈，以及弹层的焦点管理和关闭方式。",
          "Preserve keyboard operation, visible focus, accessible names, disabled and validation feedback, and overlay focus management and dismissal.",
        ),
      "- " +
        tr(
          "明暗主题均检查文本、边框和焦点对比度。交互目标适合触摸；内容和代码不应撑破移动视口。",
          "Check text, border and focus contrast in both appearances. Keep targets usable by touch and contain content and code within mobile viewports.",
        ),
      "- " +
        tr(
          "Vue/Nuxt 使用确定的初始状态和实例级 ID；浏览器资源在挂载后创建，并在卸载时释放，避免 hydration 不一致。",
          "Use deterministic initial state and per-instance IDs in Vue/Nuxt. Create browser resources after mounting and release them on unmount to avoid hydration mismatches.",
        ),
    );
  }
  out.push(
    "",
    `## ${tr("来源与许可", "Source and licenses")}`,
    "",
    tr(
      `保留使用的代码和资产的真实来源、版权及适用许可，包括 Paper Design shader 与字体 OFL。参阅 [LICENSE](${origin}/licenses/MIT.txt) 与 [NOTICE](${origin}/licenses/orvui-NOTICE.txt)。`,
      `Preserve actual provenance, copyright and applicable licenses for code and assets, including the Paper Design shader license and font OFL. See [LICENSE](${origin}/licenses/MIT.txt) and [NOTICE](${origin}/licenses/orvui-NOTICE.txt).`,
    ),
    "",
  );
  return out.join("\n");
}
