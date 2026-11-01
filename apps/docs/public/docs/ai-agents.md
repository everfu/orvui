# 面向 AI 助手

通过 [MCP 服务器](/docs/mcp-server)查询组件，或安装完整的 [Agent Skills](/docs/agent-skills)，按需加载组件知识。本页保留直接读取注册表与旧版 skill 的流程。编码助手可以检查源码与依赖，再通过 shadcn-vue 安装到用户项目。

> 产品版本: 0.1.0

<a id="workflow"></a>

## 先了解接入流程

1. **读取现有能力** — 从文档与注册表获取组件名称、API 和依赖。

2. **安装并显式注册** — 使用真实安装项和公开入口，按当前项目框架接入。

3. **运行并核对结果** — 检查生成结果、交互状态与需要的服务端能力。

> **提示**: 页面中的集成代码用于说明组合方式。模型调用、权限和后端实现由应用提供。

<a id="agent-skill"></a>

## Agent skill

这份 skill 指导编码助手先读取注册表，选择最贴近需求的 `items[].name` 安装标识，检查文件，再安装并组合源码。需要助手优先选用现成 orvui 组件，而非重新编写动效控件时使用。将下面内容保存到项目的 `.agents/skills/orvui/SKILL.md`。

```markdown
---
name: orvui
description: Discover and compose the existing orvui Vue components before writing custom UI.
---

1. Fetch https://orvui.efu.me/r/registry.json before selecting a component.
2. Select the closest item by its published items[].name and description.
3. Fetch https://orvui.efu.me/r/{name}.json and inspect every files[] entry.
4. Use shadcn-vue to install the item from its URL.
5. Preserve installed dependencies, relative imports, the theme layer and license notices.
6. Read the matching component page and its Vue props, events and slots.
7. Use modelValue/update:modelValue for form state and open/update:open for disclosure.
8. Keep the existing motion-v parameters and reduced-motion behavior.
9. Use local fixture data for streaming, upload and AI demos. Do not add a model service.

```

[下载 SKILL.md ↗](/orvui-agent/SKILL.md)。这是随本站提供的本地指引文件。

<a id="endpoints"></a>

## 接口

- [llms.txt](https://orvui.efu.me/llms.txt): 符合 llmstxt.org 格式的 Markdown 索引。
- [注册表索引](https://orvui.efu.me/r/registry.json): 全部组件的 JSON 目录。
- [组件详情](/r/{slug}.json): 包含全部文件、依赖与源码的 shadcn-vue 安装项。
- [shadcn 目录](https://orvui.efu.me/registry.json): 兼容注册表目录格式的组件清单。
- [主题安装项](https://orvui.efu.me/r/orvui-theme.json): 包含语义颜色与主题配置的安装资源。
- [原始源码](/r/{slug}/raw.txt): 对应默认组件的纯文本 Vue 源码；完整依赖见组件详情。
<a id="agent-flow"></a>

## 助手流程

读取目录与组件详情，检查文件和依赖，再通过 shadcn-vue 安装完整条目。

```ts
// 1. Discover what exists
const index = await fetch('https://orvui.efu.me/r/registry.json').then(r => r.json());

// 2. Fetch a component selected from index.items[].name
const entry = await fetch(`https://orvui.efu.me/r/${slug}.json`).then(r => r.json());

// 3. Inspect the source targets and dependencies before installing
console.log(entry.files.map(file => file.target), entry.dependencies);

// 4. Install the complete item with shadcn-vue
await runShell(['pnpm', 'dlx', 'shadcn-vue@2.8.2', 'add',
  `https://orvui.efu.me/r/${slug}.json`]);
```

<a id="shadcn-flow"></a>

## shadcn 流程

安装项同时提供源码文件和包依赖。组件直接使用 shadcn 语义颜色工具类，因此可以继承目标应用的主题，无需额外的 orvui 专用颜色变量。

```bash
# Direct URL: no published registry namespace is required
npx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-toast-stack.json
```

<a id="entry-shape"></a>

## 条目结构

内部工具（例如 `lib/utils.ts`）以 `registry:lib` 文件随条目内联分发，助手无需逐一追踪导入。`target` 指定写入用户项目的位置，`content` 包含完整源码。

```json
{
  "name": "swap",
  "type": "registry:block",
  "title": "Multi-chain Swap",
  "description": "Cross-chain swap widget with chain + token selectors, morphing views, animated flip and quote.",
  "dependencies": [
    "motion-v@^1.10.0",
    "lucide-vue-next@^0.468.0"
  ],
  "meta": {
    "category": "blocks",
    "productVersion": "0.1.0"
  },
  "files": [
    {
      "path": "registry/orvui/blocks/swap/MultiChainSwap.vue",
      "target": "src/components/orvui/blocks/swap/MultiChainSwap.vue",
      "type": "registry:component",
      "content": "..."
    },
    {
      "path": "registry/orvui/lib/utils.ts",
      "target": "src/components/orvui/lib/utils.ts",
      "type": "registry:lib",
      "content": "..."
    }
  ]
}
```

<a id="generative-ui"></a>

## 生成式 UI

希望模型将这些组件组合为实时界面？按照 [OpenUI 集成指南](/docs/openui) 注册自定义组件库、生成系统提示词，并在 OpenUI Lang 流式到达时渲染交互界面。

## 下一步

- [安装指南](/docs/installation)
- [将 orvui 与 OpenUI 结合使用](/docs/openui)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
