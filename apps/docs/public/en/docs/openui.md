# Use orvui with OpenUI

[OpenUI](https://www.openui.com) is a generative UI framework: instead of returning Markdown, the model emits an abstract UI tree (OpenUI Lang), and the Vue runtime maps every node to a component you register. This integration turns orvui into a custom OpenUI component library, so each generated response uses real, animated components—and only the components you allow.

> Product version: 0.1.1

<a id="workflow"></a>

## Start with the workflow

1. **Discover existing capabilities** — Read component names, APIs and dependencies from the documentation and registry.

2. **Install and register explicitly** — Use actual registry items and public imports, then integrate with your application's framework.

3. **Run and verify** — Check the generated output, interaction state and any required server capabilities.

> **Tip**: Integration snippets explain composition. Your application provides model calls, permissions and backend behavior.

<a id="install"></a>

## Install

You need OpenUI's Vue runtime and the orvui components to expose. Pull source through the shadcn-vue registry; see the [installation guide](/en/docs/installation) for other install paths.

```bash
# Vue renderer, compatible framework-independent core, and validation
pnpm add @openuidev/vue-lang@^0.4 @openuidev/lang-core@^0.4 zod

# Copy the orvui components to expose
npx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json https://orvui.efu.me/r/animated-badge.json https://orvui.efu.me/r/number.json
```

The Vue bindings use `@openuidev/vue-lang 0.4` with `@openuidev/lang-core ^0.4`, Vue 3.5+ and Zod. See the [official Vue API](https://www.openui.com/docs/api-reference/vue-lang) for component registration, rendering and action handling used in these examples.

<a id="register-components"></a>

## Register components

`defineComponent` maps one OpenUI Lang node to an orvui component. The Zod `props` schema validates streamed output, the `description` teaches the model each component’s intent, and `useTriggerAction` keeps controls interactive. Describe container children as a union of registered `.ref` schemas so nesting is both validated and advertised to the model.

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

## Assemble the library

`createLibrary` collects the definitions, names the `root` node, and organises the prompt into `componentGroups` with notes that steer component selection.

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

## Generate the prompt

The client renders OpenUI Lang, but the model has to produce it. Save `{ ...orvuiLibrary.toSpec(), schema: orvuiLibrary.toJSONSchema() }` as JSON in a build script. Server-only code uses `@openuidev/lang-core` to combine component signatures, descriptions and nesting constraints with the grammar, then streams the response to the browser. The function below connects to the application’s existing transport; this site starts no model service.

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

Regenerate the schema whenever the library changes. The server imports the JSON saved at build time, rather than the client Vue components, so it never bundles the client renderer.

<a id="render-stream"></a>

## Render the stream

Pass the library to `Renderer` on the client. It parses accumulated OpenUI Lang and progressively paints orvui components as tokens arrive. Connect `onAction` to the send-message path so buttons continue the conversation; this callback is an ordinary prop, bound with `:on-action`.

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

## Why orvui fits

orvui components own their files and ship through the registry, so the library above is the integration, with no extra UI runtime to bolt on. Semantic controls and shadcn tokens let generated interfaces inherit the host app’s theme.

<a id="resources"></a>

## Resources

- [OpenUI](https://www.openui.com): The generative UI framework and OpenUI Lang.
- [Defining components](https://www.openui.com/docs/api-reference/vue-lang): Full Vue defineComponent, createLibrary and Renderer reference.
- [Vue chat example](https://github.com/thesysdev/openui/tree/main/examples/app-frameworks/vue): The official Vue example of the component-library pattern.
Other generative UI frameworks that consume shadcn registries can pull orvui the same way—more integration guides to come.

## Next steps

- [For AI agents](/en/docs/ai-agents)
- [Theme setup](/en/docs/theme)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.
