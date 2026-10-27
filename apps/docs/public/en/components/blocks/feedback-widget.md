---
title: "Feedback Widget"
description: "Expand a feedback trigger into a form with sending, success and retry states."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/feedback-widget"
markdown: "https://orvui.efu.me/en/components/blocks/feedback-widget.md"
license: "MIT"
productVersion: "0.1.0"
---

# Feedback Widget

> Expand a feedback trigger into a form with sending, success and retry states.

## Install

### Feedback Widget — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/feedback-widget.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

After npm publication, use the package command below. Before publication, install the verified local archive.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Feedback Widget

**Registry source**

```vue
<script setup lang="ts">
import { FeedbackWidget } from "@/components/orvui/blocks/feedback-widget";
let submissions = 0;
async function submit() {
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
  if (++submissions === 1) throw new Error("Preview submission failed");
}
</script>
<template>
  <div
    class="relative h-80 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background"
  >
    <div class="border-b border-border px-5 py-3">
      <div class="h-2.5 w-24 rounded-full bg-muted-foreground/20" />
    </div>
    <div class="flex flex-col gap-3 p-5">
      <div class="h-2.5 w-3/4 rounded-full bg-muted-foreground/15" />
      <div class="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
      <div class="h-24 w-full rounded-xl bg-muted-foreground/[0.06]" />
      <div class="h-2.5 w-2/3 rounded-full bg-muted-foreground/15" />
    </div>
    <FeedbackWidget :on-submit="submit" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { FeedbackWidget } from "@orvui/vue/blocks/feedback-widget";
let submissions = 0;
async function submit() {
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
  if (++submissions === 1) throw new Error("Preview submission failed");
}
</script>
<template>
  <div
    class="relative h-80 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background"
  >
    <div class="border-b border-border px-5 py-3">
      <div class="h-2.5 w-24 rounded-full bg-muted-foreground/20" />
    </div>
    <div class="flex flex-col gap-3 p-5">
      <div class="h-2.5 w-3/4 rounded-full bg-muted-foreground/15" />
      <div class="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
      <div class="h-24 w-full rounded-xl bg-muted-foreground/[0.06]" />
      <div class="h-2.5 w-2/3 rounded-full bg-muted-foreground/15" />
    </div>
    <FeedbackWidget :on-submit="submit" />
  </div>
</template>
```

## API Reference

### FeedbackWidget

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `position` | `"bottom-left" \| "bottom-right"` | `"bottom-right"` | No | — |
| `title` | `string` | `"Help us improve"` | No | — |
| `placeholder` | `string` | `"Share an idea or report a bug"` | No | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | No | — |
| `onSubmit` | `(data: FeedbackData) => void \| Promise<void>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `success` | `[data: FeedbackData]` | — |
| `error` | `[error: unknown]` | — |

## About Feedback Widget

Expand a feedback trigger into a form with sending, success and retry states.

### When to use it

- Use Feedback Widget when the interface needs this behavior: expand a feedback trigger into a form with sending, success and retry states.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Feedback Widget?**

Configure Feedback Widget through position, title, placeholder, icon, onSubmit. The API table describes their types and defaults.

**How does it connect to application state?**

Observe success, error to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/feedback-widget.json
- Documentation: https://orvui.efu.me/en/components/blocks/feedback-widget
- `packages/vue/src/blocks/feedback-widget/src/FeedbackWidget.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
