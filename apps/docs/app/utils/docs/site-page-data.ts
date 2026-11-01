import {
  documentationOrigin,
  registryBaseForSite,
} from "../../../../../tools/distribution";
import catalog from "../../../../../tools/catalog/components.json";
import { designSystemCss } from "../../../../../packages/vue/src/theme/stylesheet";
import { applyGuideEditorial } from "./guide-editorial";
import { webInstallationPage } from "./installation-data";
import { aiGuidePages } from "./ai-guide-data";

export type SitePageSlug =
  | "introduction"
  | "installation"
  | "theme"
  | "ai-agents"
  | "mcp-server"
  | "agent-skills"
  | "llms-txt"
  | "agents-md"
  | "design-md"
  | "motion-patterns"
  | "openui"
  | "changelog";
export type Localized = { zh: string; en: string };
export const bi = (zh: string, en: string): Localized => ({ zh, en });
export type SiteBlock =
  | { kind: "callout"; tone: "info" | "warning"; text: Localized }
  | { kind: "steps"; items: { title: Localized; text: Localized }[] }
  | { kind: "paragraph"; text: Localized; small?: boolean; space?: 2 | 4 | 6 }
  | {
      kind: "code";
      code: string;
      codeEn?: string;
      lang: string;
      filename: string;
    }
  | {
      kind: "links";
      items: {
        label: Localized;
        url: string;
        description: Localized;
        endpoint?: boolean;
      }[];
    };
export interface SiteSection {
  id: string;
  title: Localized;
  blocks: SiteBlock[];
}
export interface SitePageDefinition {
  slug: SitePageSlug;
  path: string;
  title: Localized;
  eyebrow: Localized;
  description: Localized;
  sections: SiteSection[];
  status?: "preview";
}
export const SITE_VERSION = catalog.product.version;
export const themeCss = designSystemCss();
export const localize = (value: Localized, en = false) =>
  value[en ? "en" : "zh"];
export function siteOrigin(value = documentationOrigin) {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol))
    throw new Error("The documentation origin must use HTTP or HTTPS.");
  return url.origin;
}
const paragraph = (
  zh: string,
  en: string,
  small = false,
  space: 2 | 4 | 6 = 2,
): SiteBlock => ({ kind: "paragraph", text: bi(zh, en), small, space });
const code = (
  content: string,
  lang = "bash",
  filename = "terminal",
): SiteBlock => ({ kind: "code", code: content, lang, filename });
const link = (href: string, label: string) => `<a href="${href}">${label}</a>`;

const fetchExample = `// 1. Discover what exists
const index = await fetch('{{origin}}/r/registry.json').then(r => r.json());

// 2. Fetch a component selected from index.items[].name
const entry = await fetch(\`{{origin}}/r/\${slug}.json\`).then(r => r.json());

// 3. Inspect the source targets and dependencies before installing
console.log(entry.files.map(file => file.target), entry.dependencies);

// 4. Install the complete item with shadcn-vue
await runShell(['pnpm', 'dlx', 'shadcn-vue@2.8.2', 'add',
  \`{{origin}}/r/\${slug}.json\`]);`;

export const openUiSnippets = {
  install: `# Vue renderer, compatible framework-independent core, and validation
pnpm add @openuidev/vue-lang@^0.4 @openuidev/lang-core@^0.4 zod

# Copy the orvui components to expose
npx shadcn-vue@2.8.2 add {{origin}}/r/button.json {{origin}}/r/animated-badge.json {{origin}}/r/number.json`,
  define: `import { h } from 'vue';
import { defineComponent, useTriggerAction, type ComponentRenderProps } from '@openuidev/vue-lang';
import { z } from 'zod/v4';
import { Button } from '@/components/orvui/motion/button';
import { AnimatedBadge } from '@/components/orvui/motion/animated-badge';
import { AnimatedNumber } from '@/components/orvui/motion/number';

const buttonProps = z.object({
  label: z.string(), action: z.string(),
  variant: z.enum(['primary', 'secondary', 'ghost', 'outline']).default('primary'),
  ripple: z.boolean().default(false),
});

// Declare props and renderNode: partial props arrive while the stream is open.
const OrvuiButton = defineComponent({
  name: 'Button',
  description: 'Spring-pressed action button; action continues the conversation.',
  props: buttonProps,
  component: {
    props: ['props', 'renderNode'],
    setup(input: ComponentRenderProps<z.infer<typeof buttonProps>>) {
      const triggerAction = useTriggerAction();
      return () => h(Button, {
        variant: input.props.variant, ripple: input.props.ripple,
        onClick: () => input.props.action && triggerAction(input.props.action),
      }, () => input.props.label ?? '');
    },
  },
});

const badgeProps = z.object({
  label: z.string(),
  status: z.enum(['neutral', 'info', 'success', 'warning', 'danger', 'loading']).default('neutral'),
  pulse: z.boolean().default(false),
});
const OrvuiBadge = defineComponent({
  name: 'Badge', description: 'Status pill; pulse indicates a live state.',
  props: badgeProps,
  component: {
    props: ['props', 'renderNode'],
    setup: (input: ComponentRenderProps<z.infer<typeof badgeProps>>) =>
      () => h(AnimatedBadge, { status: input.props.status, pulse: input.props.pulse },
        () => input.props.label ?? ''),
  },
});

const statProps = z.object({ label: z.string(), value: z.number() });
const OrvuiStat = defineComponent({
  name: 'Stat', description: 'One numeric metric that springs into view.',
  props: statProps,
  component: {
    props: ['props', 'renderNode'],
    setup: (input: ComponentRenderProps<z.infer<typeof statProps>>) => () =>
      h('div', { class: 'rounded-xl border border-border bg-card p-4' }, [
        h('p', { class: 'text-sm text-muted-foreground' }, input.props.label ?? ''),
        h(AnimatedNumber, { value: input.props.value ?? 0, class: 'text-2xl font-semibold' }),
      ]),
  },
});

const StackChild = z.union([OrvuiButton.ref, OrvuiBadge.ref, OrvuiStat.ref]);
const stackProps = z.object({ children: z.array(StackChild) });
const Stack = defineComponent({
  name: 'Stack', description: 'Vertical container with spaced children.',
  props: stackProps,
  component: {
    props: ['props', 'renderNode'],
    setup: (input: ComponentRenderProps<z.infer<typeof stackProps>>) => () =>
      h('div', { class: 'flex flex-col gap-3' }, [input.renderNode(input.props.children ?? [])]),
  },
});`,
  library: `import { createLibrary } from '@openuidev/vue-lang';

export const orvuiLibrary = createLibrary({
  root: 'Stack',
  components: [Stack, OrvuiButton, OrvuiBadge, OrvuiStat],
  componentGroups: [
    { name: 'Layout', components: ['Stack'],
      notes: ['Every response has one Stack root.'] },
    { name: 'orvui motion', components: ['Button', 'Badge', 'Stat'],
      notes: ['Use a pulsing Badge for streaming status.',
        'Use one primary Button per response.'] },
  ],
});

// Generate a serializable schema at build time, outside the server bundle.
const spec = { ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() };`,
  prompt: `import { generateSystemPrompt, type LibrarySpec } from '@openuidev/lang-core';
import librarySpec from './generated/orvui-library.spec.json';

// Run the Vue library module in a build script, then save
// JSON.stringify({ ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() })
// to the file imported above. A parser schema alone is not a prompt library spec.
const instructions = generateSystemPrompt({ library: librarySpec as LibrarySpec });

// Adapter for your application's existing transport. This guide adds no backend.
export async function generate(
  messages: unknown[],
  streamModel: (input: { messages: unknown[]; instructions: string }) => AsyncIterable<string>,
) {
  const encoder = new TextEncoder();
  return new Response(new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamModel({ messages, instructions })) {
          controller.enqueue(encoder.encode(delta));
        }
        controller.close();
      } catch (error) { controller.error(error); }
    },
  }), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}`,
  render: `<script setup lang="ts">
import { Renderer, type ActionEvent } from '@openuidev/vue-lang';
import { orvuiLibrary } from './orvui-library';

defineProps<{ response: string | null; isStreaming: boolean }>();
const emit = defineEmits<{ send: [message: string] }>();
function handleAction(event: ActionEvent) {
  emit('send', event.humanFriendlyMessage);
}
</script>

<template>
  <Renderer
    :response="response"
    :library="orvuiLibrary"
    :is-streaming="isStreaming"
    :on-action="handleAction"
  />
</template>`,
};

export const sitePages: SitePageDefinition[] = [
  {
    slug: "introduction",
    path: "/guide",
    eyebrow: bi("Web · 开始使用", "Web · Getting started"),
    title: bi("Vue Web 简介", "Introduction to Vue Web"),
    description: bi(
      "使用 Vue 3.5 Composition API 构建带有原始几何与交互动效的 Web 界面。通过组件包或完整源码，将现成组件接入你的 Vue 项目。",
      "Build Web interfaces with Vue 3.5 Composition API, original component geometry and interactive motion. Use the npm package or complete source to add existing components to your Vue application.",
    ),
    sections: [
      {
        id: "installation",
        title: bi("开始安装", "Start installation"),
        blocks: [
          paragraph(
            '按照<a href="/docs/installation">Web 安装指南</a>选择 npm 组件包或 shadcn-vue，按项目需要使用预构建组件或复制源码。',
            'Follow the <a href="/docs/installation">Web installation guide</a> for the npm package or shadcn-vue, choosing prebuilt components or copied source for your project.',
          ),
        ],
      },
      {
        id: "import-components",
        title: bi("导入组件", "Import components"),
        blocks: [
          paragraph(
            '组件页的“组件包”用法从 @orvui/vue 按需入口导入；“复制源码”用法从应用内的 @/components/orvui/ 路径导入。参见<a href="/docs/installation#package">组件包安装</a>与<a href="/docs/installation#source-setup">源码配置</a>。',
            'Package Usage imports per-component @orvui/vue entries. Registry source Usage imports local @/components/orvui/ paths. See <a href="/docs/installation#package">Package installation</a> and <a href="/docs/installation#source-setup">Source setup</a>.',
          ),
        ],
      },
      {
        id: "copy-source",
        title: bi("拥有组件源码", "Own the source"),
        blocks: [
          paragraph(
            '源码安装项包含组件、相对依赖、主题与许可。使用<a href="/docs/installation#shadcn-vue">shadcn-vue</a>将完整实现安装到项目内，再按需编辑。',
            'Source installation includes the component, relative helpers, theme and licenses. Use <a href="/docs/installation#shadcn-vue">shadcn-vue</a> to install the complete implementation for local editing.',
          ),
        ],
      },
      {
        id: "state",
        title: bi("状态与组合", "State and composition"),
        blocks: [
          paragraph(
            '表单使用 v-model，弹层使用 v-model:open。组件的默认状态、插槽与组合式子组件以每页 API 为准；从<a href="/components">组件目录</a>选择所需控件。',
            'Use v-model for forms and v-model:open for overlays. Each component page documents default state, slots and composable parts. Explore the <a href="/components">component catalog</a>.',
          ),
        ],
      },
      {
        id: "nuxt",
        title: bi("SSR 与 Nuxt", "SSR and Nuxt"),
        blocks: [
          paragraph(
            '组件库支持在 Nuxt 项目中使用。按需显式导入组件；使用组件包时，在 <code>nuxt.config.ts</code> 的 <code>css</code> 中添加 <code>"@orvui/vue/style.css"</code>，统一加载样式。当前文档站使用 Nuxt SSR。',
            'Use orvui in Nuxt projects with explicit component imports. When using the package, add <code>"@orvui/vue/style.css"</code> to <code>css</code> in <code>nuxt.config.ts</code> to load styles globally. This documentation runs on Nuxt SSR.',
          ),
        ],
      },
      {
        id: "attribution",
        title: bi("来源与许可", "Attribution and licenses"),
        blocks: [
          paragraph(
            '复制组件时保留 MIT 与 NOTICE；Shader 等内容保留其独立许可。阅读<a href="/licenses/orvui-NOTICE.txt">NOTICE</a>和<a href="/licenses/paper-design-PolyForm-Shield.txt">Paper Design 许可</a>。',
            'Keep MIT and NOTICE with copied source; features such as shaders retain their separate licenses. Read <a href="/licenses/orvui-NOTICE.txt">NOTICE</a> and the <a href="/licenses/paper-design-PolyForm-Shield.txt">Paper Design license</a>.',
          ),
        ],
      },
    ],
  },
  webInstallationPage,
  {
    slug: "theme",
    path: "/docs/theme",
    eyebrow: bi("设置", "Setup"),
    title: bi("主题设置", "Theme setup"),
    description: bi(
      "orvui 组件使用 shadcn 语义令牌设置样式（<code>bg-primary</code>、<code>text-muted-foreground</code>、border、ring）。设置一次令牌，全部组件即可使用。有两种方式：",
      "orvui components style themselves with shadcn semantic tokens (<code>bg-primary</code>, <code>text-muted-foreground</code>, border, ring). Set those tokens up once and every component works. Two ways:",
    ),
    sections: [
      {
        id: "shadcn-init",
        title: bi(
          "方式一 — shadcn 初始化（推荐）",
          "Option 1 — shadcn init (recommended)",
        ),
        blocks: [
          paragraph(
            "项目已使用 shadcn-vue 时，这些令牌已经就绪。否则运行一次初始化，它会将令牌层写入 CSS。",
            "If your project uses shadcn-vue, you already have these tokens. Otherwise run init once; it writes the token layer into your CSS.",
          ),
          code("npx shadcn-vue@2.8.2 init"),
        ],
      },
      {
        id: "theme-css",
        title: bi("方式二 — 粘贴主题 CSS", "Option 2 — paste the theme CSS"),
        blocks: [
          paragraph(
            '没有使用 shadcn-vue？将下面的代码粘贴到 <code>globals.css</code> 中，紧接在 <code>@import "tailwindcss";</code> 下方。它定义了组件使用的令牌、动效动画和表面工具类。需要 Tailwind CSS v4。',
            'Not using shadcn-vue? Paste this into your <code>globals.css</code> directly below <code>@import "tailwindcss";</code>. It defines the tokens, motion animations and surface utilities the components use. Requires Tailwind CSS v4.',
          ),
          paragraph(
            `也可在 ${link("/theme.css", "/theme.css ↗")} 获取。`,
            `Also available at ${link("/theme.css", "/theme.css ↗")}.`,
            true,
          ),
          code(themeCss, "css", "globals.css"),
        ],
      },
    ],
  },
  {
    slug: "ai-agents",
    path: "/docs/ai-agents",
    eyebrow: bi("助手指南", "Agent guide"),
    title: bi("面向 AI 助手", "For AI agents"),
    description: bi(
      '通过 <a href="/docs/mcp-server">MCP 服务器</a>查询组件，或安装完整的 <a href="/docs/agent-skills">Agent Skills</a>，按需加载组件知识。本页保留直接读取注册表的流程。编码助手可以检查源码与依赖，再通过 shadcn-vue 安装到用户项目。',
      'Query components with the <a href="/docs/mcp-server">MCP Server</a> or install the complete <a href="/docs/agent-skills">Agent Skills</a> to load component knowledge on demand. This page retains the direct registry workflow. Coding agents can inspect source and dependencies before installing into your project with shadcn-vue.',
    ),
    sections: [
      {
        id: "agent-skill",
        title: bi("Agent skill", "Agent skill"),
        blocks: [
          paragraph(
            '安装完整技能请前往 <a href="/docs/agent-skills">Agent Skills</a>。它包含双语组件参考，并支持 npx skills 安装。需要项目级约定时，合并 <a href="/docs/agents-md">AGENTS.md</a> 中的相关段落。',
            'Install the complete skill from <a href="/docs/agent-skills">Agent Skills</a>, including bilingual references and npx skills installation. For project-wide guidance, merge the relevant sections from <a href="/docs/agents-md">AGENTS.md</a>.',
          ),
        ],
      },
      {
        id: "endpoints",
        title: bi("接口", "Endpoints"),
        blocks: [
          {
            kind: "links",
            items: [
              {
                label: bi("llms.txt", "llms.txt"),
                url: "/llms.txt",
                description: bi(
                  "符合 llmstxt.org 格式的 Markdown 索引。",
                  "Markdown index in llmstxt.org format.",
                ),
                endpoint: true,
              },
              {
                label: bi("注册表索引", "Registry index"),
                url: "/r/registry.json",
                description: bi(
                  "全部组件的 JSON 目录。",
                  "JSON catalogue of every component.",
                ),
                endpoint: true,
              },
              {
                label: bi("组件详情", "Component detail"),
                url: "/r/{slug}.json",
                description: bi(
                  "包含全部文件、依赖与源码的 shadcn-vue 安装项。",
                  "shadcn-vue install item with every file, dependency and source.",
                ),
                endpoint: true,
              },
              {
                label: bi("shadcn 目录", "shadcn catalog"),
                url: "/registry.json",
                description: bi(
                  "兼容注册表目录格式的组件清单。",
                  "Directory-compatible registry catalog.",
                ),
                endpoint: true,
              },
              {
                label: bi("主题安装项", "Theme item"),
                url: "/r/orvui-theme.json",
                description: bi(
                  "包含语义颜色与主题配置的安装资源。",
                  "Install item with semantic color classes and theme configuration.",
                ),
                endpoint: true,
              },
              {
                label: bi("原始源码", "Raw source"),
                url: "/r/{slug}/raw.txt",
                description: bi(
                  "对应默认组件的纯文本 Vue 源码；完整依赖见组件详情。",
                  "Plain-text Vue source of the default component; use component detail for every dependency.",
                ),
                endpoint: true,
              },
            ],
          },
        ],
      },
      {
        id: "agent-flow",
        title: bi("助手流程", "Agent flow"),
        blocks: [
          paragraph(
            "读取目录与组件详情，检查文件和依赖，再通过 shadcn-vue 安装完整条目。",
            "Read the catalog and component detail, inspect files and dependencies, then install the complete item with shadcn-vue.",
          ),
          code(fetchExample, "ts", "agent.ts"),
        ],
      },
      {
        id: "shadcn-flow",
        title: bi("shadcn 流程", "shadcn flow"),
        blocks: [
          paragraph(
            "安装项同时提供源码文件和包依赖。组件直接使用 shadcn 语义颜色工具类，因此可以继承目标应用的主题，无需额外的 orvui 专用颜色变量。",
            "The install item includes source files and package dependencies. Components use shadcn semantic color utilities directly, so they inherit the target app's theme without orvui-specific color variables.",
          ),
          code(
            "# Direct URL: no published registry namespace is required\nnpx shadcn-vue@2.8.2 add {{origin}}/r/animated-toast-stack.json",
          ),
        ],
      },
      {
        id: "entry-shape",
        title: bi("条目结构", "Entry shape"),
        blocks: [
          paragraph(
            "内部工具（例如 <code>lib/utils.ts</code>）以 <code>registry:lib</code> 文件随条目内联分发，助手无需逐一追踪导入。<code>target</code> 指定写入用户项目的位置，<code>content</code> 包含完整源码。",
            "Internal helpers (for example <code>lib/utils.ts</code>) ship inline as <code>registry:lib</code> files so the agent does not have to chase imports. <code>target</code> specifies the consumer path, and <code>content</code> contains the full source.",
          ),
          code(
            JSON.stringify(
              {
                name: "swap",
                type: "registry:block",
                title: "Multi-chain Swap",
                description:
                  "Cross-chain swap widget with chain + token selectors, morphing views, animated flip and quote.",
                dependencies: ["motion-v@^1.10.0", "lucide-vue-next@^0.468.0"],
                meta: { category: "blocks", productVersion: SITE_VERSION },
                files: [
                  {
                    path: "registry/orvui/blocks/swap/MultiChainSwap.vue",
                    target:
                      "src/components/orvui/blocks/swap/MultiChainSwap.vue",
                    type: "registry:component",
                    content: "...",
                  },
                  {
                    path: "registry/orvui/lib/utils.ts",
                    target: "src/components/orvui/lib/utils.ts",
                    type: "registry:lib",
                    content: "...",
                  },
                ],
              },
              null,
              2,
            ),
            "json",
            "r/swap.json",
          ),
        ],
      },
      {
        id: "generative-ui",
        title: bi("生成式 UI", "Generative UI"),
        blocks: [
          paragraph(
            `希望模型将这些组件组合为实时界面？按照 ${link("/docs/openui", "OpenUI 集成指南")} 注册自定义组件库、生成系统提示词，并在 OpenUI Lang 流式到达时渲染交互界面。`,
            `Want the model to compose these components into a live interface? Follow the ${link("/docs/openui", "OpenUI integration guide")} to register a custom component library, generate its system prompt, and render interactive OpenUI Lang as it streams.`,
          ),
        ],
      },
    ],
  },
  {
    slug: "openui",
    path: "/docs/openui",
    eyebrow: bi("集成指南", "Integration guide"),
    title: bi("将 orvui 与 OpenUI 结合使用", "Use orvui with OpenUI"),
    description: bi(
      `${link("https://www.openui.com", "OpenUI")} 是生成式 UI 框架：模型不再返回 Markdown，而是输出抽象 UI 树（OpenUI Lang），Vue 运行时将每个节点映射到你注册的组件。将 orvui 注册为自定义 OpenUI 组件库后，每次生成的响应都会使用真实的动态组件，而且只使用你允许的组件。`,
      `${link("https://www.openui.com", "OpenUI")} is a generative UI framework: instead of returning Markdown, the model emits an abstract UI tree (OpenUI Lang), and the Vue runtime maps every node to a component you register. This integration turns orvui into a custom OpenUI component library, so each generated response uses real, animated components—and only the components you allow.`,
    ),
    sections: [
      {
        id: "install",
        title: bi("安装", "Install"),
        blocks: [
          paragraph(
            `需要 OpenUI 的 Vue 运行时和希望开放给模型的 orvui 组件。使用 shadcn-vue 注册表复制源码；其他安装方式见 ${link("/docs/installation", "安装指南")}。`,
            `You need OpenUI's Vue runtime and the orvui components to expose. Pull source through the shadcn-vue registry; see the ${link("/docs/installation", "installation guide")} for other install paths.`,
          ),
          code(openUiSnippets.install),
          paragraph(
            `Vue 绑定使用 <code>@openuidev/vue-lang 0.4</code> 与 <code>@openuidev/lang-core ^0.4</code>，需要 Vue 3.5+ 和 Zod。示例中的组件注册、渲染与动作处理方式详见 ${link("https://www.openui.com/docs/api-reference/vue-lang", "官方 Vue API")}。`,
            `The Vue bindings use <code>@openuidev/vue-lang 0.4</code> with <code>@openuidev/lang-core ^0.4</code>, Vue 3.5+ and Zod. See the ${link("https://www.openui.com/docs/api-reference/vue-lang", "official Vue API")} for component registration, rendering and action handling used in these examples.`,
            true,
            4,
          ),
        ],
      },
      {
        id: "register-components",
        title: bi("注册组件", "Register components"),
        blocks: [
          paragraph(
            "<code>defineComponent</code> 将一个 OpenUI Lang 节点映射为一个 orvui 组件。Zod <code>props</code> schema 在流式输出时校验数据；<code>description</code> 进入系统提示词，告诉模型组件的用途；<code>useTriggerAction</code> 保持控件可交互。容器的子节点使用已注册组件 <code>.ref</code> schema 的联合类型，既能校验嵌套关系，也能向模型说明哪些节点可嵌套。",
            "<code>defineComponent</code> maps one OpenUI Lang node to an orvui component. The Zod <code>props</code> schema validates streamed output, the <code>description</code> teaches the model each component’s intent, and <code>useTriggerAction</code> keeps controls interactive. Describe container children as a union of registered <code>.ref</code> schemas so nesting is both validated and advertised to the model.",
          ),
          code(openUiSnippets.define, "ts", "lib/orvui-library.ts"),
        ],
      },
      {
        id: "assemble-library",
        title: bi("组合组件库", "Assemble the library"),
        blocks: [
          paragraph(
            "<code>createLibrary</code> 汇总组件定义、指定 <code>root</code> 节点，并通过 <code>componentGroups</code> 与说明文字组织提示词，引导模型选择组件。",
            "<code>createLibrary</code> collects the definitions, names the <code>root</code> node, and organises the prompt into <code>componentGroups</code> with notes that steer component selection.",
          ),
          code(openUiSnippets.library, "ts", "lib/orvui-library.ts"),
        ],
      },
      {
        id: "generate-prompt",
        title: bi("生成提示词", "Generate the prompt"),
        blocks: [
          paragraph(
            "客户端负责渲染 OpenUI Lang，模型则需要生成它。在构建脚本中保存 <code>{ ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() }</code> 的 JSON 结果。服务端使用 <code>@openuidev/lang-core</code>，将组件签名、描述、嵌套限制与语言语法合并为提示词，再将模型响应流式传给浏览器。下面的函数接入应用现有的流式传输；本站不启动模型服务。",
            "The client renders OpenUI Lang, but the model has to produce it. Save <code>{ ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() }</code> as JSON in a build script. Server-only code uses <code>@openuidev/lang-core</code> to combine component signatures, descriptions and nesting constraints with the grammar, then streams the response to the browser. The function below connects to the application’s existing transport; this site starts no model service.",
          ),
          code(openUiSnippets.prompt, "ts", "server/generate.ts"),
          paragraph(
            "组件库变化时重新生成 schema。服务端只导入构建时保存的 JSON，不导入客户端 Vue 组件，避免将客户端运行时打包进服务端。",
            "Regenerate the schema whenever the library changes. The server imports the JSON saved at build time, rather than the client Vue components, so it never bundles the client renderer.",
            true,
            4,
          ),
        ],
      },
      {
        id: "render-stream",
        title: bi("渲染流式内容", "Render the stream"),
        blocks: [
          paragraph(
            "将组件库传给客户端的 <code>Renderer</code>。它解析服务端持续累积的 OpenUI Lang，并随着 token 到达逐步绘制 orvui 组件。将 <code>onAction</code> 回调连接到发送消息的逻辑，使按钮可以继续对话；这是普通回调 prop，应使用 <code>:on-action</code>。",
            "Pass the library to <code>Renderer</code> on the client. It parses accumulated OpenUI Lang and progressively paints orvui components as tokens arrive. Connect <code>onAction</code> to the send-message path so buttons continue the conversation; this callback is an ordinary prop, bound with <code>:on-action</code>.",
          ),
          code(openUiSnippets.render, "vue", "GenerativeResponse.vue"),
        ],
      },
      {
        id: "why-orvui",
        title: bi("为什么 orvui 适合", "Why orvui fits"),
        blocks: [
          paragraph(
            "orvui 组件自带所需文件并通过注册表分发，因此上面的组件库就是集成本身，无需再接入其他 UI 运行时。组件使用语义化控件与 shadcn 令牌，模型生成的界面能直接继承应用主题。",
            "orvui components own their files and ship through the registry, so the library above is the integration, with no extra UI runtime to bolt on. Semantic controls and shadcn tokens let generated interfaces inherit the host app’s theme.",
          ),
        ],
      },
      {
        id: "resources",
        title: bi("参考资料", "Resources"),
        blocks: [
          {
            kind: "links",
            items: [
              {
                label: bi("OpenUI", "OpenUI"),
                url: "https://www.openui.com",
                description: bi(
                  "生成式 UI 框架与 OpenUI Lang。",
                  "The generative UI framework and OpenUI Lang.",
                ),
              },
              {
                label: bi("定义组件", "Defining components"),
                url: "https://www.openui.com/docs/api-reference/vue-lang",
                description: bi(
                  "Vue defineComponent、createLibrary 和 Renderer 的完整参考。",
                  "Full Vue defineComponent, createLibrary and Renderer reference.",
                ),
              },
              {
                label: bi("Vue 聊天示例", "Vue chat example"),
                url: "https://github.com/thesysdev/openui/tree/main/examples/app-frameworks/vue",
                description: bi(
                  "使用同一组件库模式的官方 Vue 示例。",
                  "The official Vue example of the component-library pattern.",
                ),
              },
            ],
          },
          paragraph(
            "其他支持 shadcn 注册表的生成式 UI 框架，也可以用同样的方式获取 orvui；更多集成指南将随项目推进提供。",
            "Other generative UI frameworks that consume shadcn registries can pull orvui the same way—more integration guides to come.",
            true,
            6,
          ),
        ],
      },
    ],
  },
  {
    slug: "motion-patterns",
    path: "/docs/motion-patterns",
    eyebrow: bi("动效指南", "Motion guide"),
    title: bi("用动效解释，而非干扰", "Motion that explains, not distracts"),
    description: bi(
      "这是一份实用指南，帮助判断何时应当产生位移、选择合适的令牌，并交付快速、一致且可访问的动效。",
      "A practical guide to deciding when something should move, choosing the right token, and shipping motion that stays fast, coherent, and accessible.",
    ),
    sections: [],
  },
  {
    slug: "changelog",
    path: "/changelog",
    eyebrow: bi("更新日志", "Changelog"),
    title: bi("orvui 更新记录", "orvui updates"),
    description: bi(
      "这里记录 orvui 的版本更新与兼容性变化。组件包已发布到 npm，安装方式见安装指南。",
      "orvui release notes and compatibility changes. The component package is available on npm; see the installation guide to get started.",
    ),
    sections: [],
  },
];

sitePages.push(...aiGuidePages);
applyGuideEditorial(sitePages, themeCss);

export function getSitePage(slug: SitePageSlug) {
  const page = sitePages.find((page) => page.slug === slug);
  if (!page) throw new Error(`No documentation page for ${slug}`);
  return page;
}
export function resolveSiteCode(value: string, origin?: string) {
  return value
    .replaceAll("{{registry}}", registryBaseForSite(origin))
    .replaceAll("{{origin}}", siteOrigin(origin));
}
export function localSiteHtml(value: string, en = false) {
  const resources = [
    "/r/",
    "/registry.json",
    "/theme.css",
    "/llms.txt",
    "/orvui-agent/",
    "/licenses/",
  ];
  return value.replace(/<a\b([^>]*)>/g, (opening, attributes: string) => {
    const match = /href="([^"]*)"/.exec(attributes);
    if (!match) return opening;
    const original = match[1]!;
    let href = original;
    const local = href.startsWith("/") && !href.startsWith("//");
    if (
      en &&
      local &&
      !href.startsWith("/en/") &&
      !resources.some((prefix) => href.startsWith(prefix))
    )
      href = "/en" + href;
    let next = attributes.replace(match[0], `href="${href}"`);
    const newTab =
      /^https?:\/\//.test(href) ||
      ["/theme.css", "/orvui-agent/SKILL.md"].includes(href);
    if (newTab && !/\btarget=/.test(next))
      next += ' target="_blank" rel="noreferrer noopener"';
    return `<a${next}>`;
  });
}
const motionToc = [
  ["decision-framework", "判断框架", "Decision framework"],
  ["motion-tokens", "动效令牌", "Motion tokens"],
  ["timing", "时长", "Timing"],
  ["recipes", "配方", "Recipes"],
  ["accessibility", "可访问性", "Accessibility"],
];
export function sitePageToc(slug: SitePageSlug) {
  const pairs =
    slug === "motion-patterns"
      ? motionToc.map(([id, zh, en]) => ({ id: id!, label: bi(zh!, en!) }))
      : [];
  if (pairs.length) return pairs;
  return Array.from(getSitePage(slug).sections, (section) => ({
    id: section.id,
    label: section.title,
  }));
}

/** Reading continuations use the same definitions as the rendered guides. */
export function guideNextPages(slug: SitePageSlug) {
  const next: Partial<Record<SitePageSlug, SitePageSlug[]>> = {
    installation: ["theme", "motion-patterns"],
    "ai-agents": ["installation", "openui"],
    "llms-txt": ["mcp-server", "agent-skills"],
    "mcp-server": ["agent-skills", "llms-txt"],
    "agent-skills": ["agents-md", "mcp-server"],
    "agents-md": ["design-md", "agent-skills"],
    "design-md": ["theme", "motion-patterns"],
    openui: ["ai-agents", "theme"],
    "motion-patterns": ["theme", "installation"],
  };
  return (next[slug] ?? []).map(getSitePage);
}
