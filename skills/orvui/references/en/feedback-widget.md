# Feedback Widget · orvui 0.1.1

## Selection and composition

Use Alert for persistent inline information, Toast Stack for transient action feedback and Loader while an operation is pending. Drive progress and completion from application state.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Feedback Widget"
description: "Expand a feedback trigger into a form with sending, success and retry states."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/feedback-widget"
markdown: "https://orvui.efu.me/en/components/blocks/feedback-widget.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Feedback Widget

> Expand a feedback trigger into a form with sending, success and retry states.

<a id="when-to-use"></a>

## When to use it

- Use Feedback Widget when the interface needs this behavior: expand a feedback trigger into a form with sending, success and retry states.

<a id="install"></a>
## Install

### Feedback Widget — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/feedback-widget.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
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

<a id="examples"></a>
## Usage

<a id="default"></a>
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

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Feedback Widget

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Feedback Widget?**

Configure Feedback Widget through position, title, placeholder, icon, onSubmit. The API table describes their types and defaults.

**How does it connect to application state?**

Observe success, error to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [OTP Input](https://orvui.efu.me/en/components/blocks/otp-input): Enter or paste a fixed-length code through grouped fields with completion feedback.
- [File Upload](https://orvui.efu.me/en/components/blocks/file-upload): Manage files, previews, progress and retry actions in a queue or attachment workspace.
- [Availability Scheduler](https://orvui.efu.me/en/components/blocks/availability-scheduler): Edit weekly availability as time ranges and copy a schedule to selected days.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/feedback-widget.json
- Documentation: https://orvui.efu.me/en/components/blocks/feedback-widget
- `packages/vue/src/blocks/feedback-widget/src/FeedbackWidget.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

