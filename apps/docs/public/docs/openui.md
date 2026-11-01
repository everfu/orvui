# 将 orvui 与 OpenUI 结合使用

[OpenUI](https://www.openui.com) 是生成式 UI 框架：模型不再返回 Markdown，而是输出抽象 UI 树（OpenUI Lang），Vue 运行时将每个节点映射到你注册的组件。将 orvui 注册为自定义 OpenUI 组件库后，每次生成的响应都会使用真实的动态组件，而且只使用你允许的组件。

> 产品版本: 0.1.1

<a id="workflow"></a>

## 先了解接入流程

1. **读取现有能力** — 从文档与注册表获取组件名称、API 和依赖。

2. **安装并显式注册** — 使用真实安装项和公开入口，按当前项目框架接入。

3. **运行并核对结果** — 检查生成结果、交互状态与需要的服务端能力。

> **提示**: 页面中的集成代码用于说明组合方式。模型调用、权限和后端实现由应用提供。

<a id="install"></a>

## 安装

需要 OpenUI 的 Vue 运行时和希望开放给模型的 orvui 组件。使用 shadcn-vue 注册表复制源码；其他安装方式见 [安装指南](/docs/installation)。

```bash
# Vue renderer, compatible framework-independent core, and validation
pnpm add @openuidev/vue-lang@^0.4 @openuidev/lang-core@^0.4 zod

# Copy the orvui components to expose
npx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json https://orvui.efu.me/r/animated-badge.json https://orvui.efu.me/r/number.json
```

Vue 绑定使用 `@openuidev/vue-lang 0.4` 与 `@openuidev/lang-core ^0.4`，需要 Vue 3.5+ 和 Zod。示例中的组件注册、渲染与动作处理方式详见 [官方 Vue API](https://www.openui.com/docs/api-reference/vue-lang)。

<a id="register-components"></a>

## 注册组件

`defineComponent` 将一个 OpenUI Lang 节点映射为一个 orvui 组件。Zod `props` schema 在流式输出时校验数据；`description` 进入系统提示词，告诉模型组件的用途；`useTriggerAction` 保持控件可交互。容器的子节点使用已注册组件 `.ref` schema 的联合类型，既能校验嵌套关系，也能向模型说明哪些节点可嵌套。

```ts
import { h } from 'vue';
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
});
```

<a id="assemble-library"></a>

## 组合组件库

`createLibrary` 汇总组件定义、指定 `root` 节点，并通过 `componentGroups` 与说明文字组织提示词，引导模型选择组件。

```ts
import { createLibrary } from '@openuidev/vue-lang';

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
const spec = { ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() };
```

<a id="generate-prompt"></a>

## 生成提示词

客户端负责渲染 OpenUI Lang，模型则需要生成它。在构建脚本中保存 `{ ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() }` 的 JSON 结果。服务端使用 `@openuidev/lang-core`，将组件签名、描述、嵌套限制与语言语法合并为提示词，再将模型响应流式传给浏览器。下面的函数接入应用现有的流式传输；本站不启动模型服务。

```ts
import { generateSystemPrompt, type LibrarySpec } from '@openuidev/lang-core';
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
}
```

组件库变化时重新生成 schema。服务端只导入构建时保存的 JSON，不导入客户端 Vue 组件，避免将客户端运行时打包进服务端。

<a id="render-stream"></a>

## 渲染流式内容

将组件库传给客户端的 `Renderer`。它解析服务端持续累积的 OpenUI Lang，并随着 token 到达逐步绘制 orvui 组件。将 `onAction` 回调连接到发送消息的逻辑，使按钮可以继续对话；这是普通回调 prop，应使用 `:on-action`。

```vue
<script setup lang="ts">
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
</template>
```

<a id="why-orvui"></a>

## 为什么 orvui 适合

orvui 组件自带所需文件并通过注册表分发，因此上面的组件库就是集成本身，无需再接入其他 UI 运行时。组件使用语义化控件与 shadcn 令牌，模型生成的界面能直接继承应用主题。

<a id="resources"></a>

## 参考资料

- [OpenUI](https://www.openui.com): 生成式 UI 框架与 OpenUI Lang。
- [定义组件](https://www.openui.com/docs/api-reference/vue-lang): Vue defineComponent、createLibrary 和 Renderer 的完整参考。
- [Vue 聊天示例](https://github.com/thesysdev/openui/tree/main/examples/app-frameworks/vue): 使用同一组件库模式的官方 Vue 示例。
其他支持 shadcn 注册表的生成式 UI 框架，也可以用同样的方式获取 orvui；更多集成指南将随项目推进提供。

## 下一步

- [面向 AI 助手](/docs/ai-agents)
- [主题设置](/docs/theme)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。
