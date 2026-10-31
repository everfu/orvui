---
title: "Button"
description: "Use a pressable action surface with magnetic, stateful and metallic alternatives."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/button"
markdown: "https://orvui.efu.me/en/components/motion/button.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Button

> Use a pressable action surface with magnetic, stateful and metallic alternatives.

<a id="when-to-use"></a>

## When to use it

- Use for form submission, confirmation and other explicit actions. Choose a link when the destination is another page.

<a id="install"></a>
## Install

### Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json
```

### Metallic Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-metallic.json
```

### Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-base.json
```

### Stateful Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-stateful.json
```

### Magnetic Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button-magnetic.json
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

```bash
pnpm add lucide-vue-next@^0.468.0
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
### Button

**Registry source**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

<a id="metallic"></a>
### Metallic Button

Move a straight highlight around a chrome-like rim on a neutral action surface.

**Registry source**

```vue
<script setup lang="ts">
import { ArrowUpRight, Sparkles } from "lucide-vue-next";
import { MetallicButton } from "@/components/orvui/motion/button";
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3 px-6 py-10">
  <MetallicButton>Continue<ArrowUpRight class="size-4" /></MetallicButton>
  <MetallicButton size="sm"><Sparkles class="size-3.5" />Generate</MetallicButton>
  <MetallicButton size="icon" aria-label="Magic tools"><Sparkles class="size-4" /></MetallicButton>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowUpRight, Sparkles } from "lucide-vue-next";
import { MetallicButton } from "@orvui/vue/motion/button";
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3 px-6 py-10">
  <MetallicButton>Continue<ArrowUpRight class="size-4" /></MetallicButton>
  <MetallicButton size="sm"><Sparkles class="size-3.5" />Generate</MetallicButton>
  <MetallicButton size="icon" aria-label="Magic tools"><Sparkles class="size-4" /></MetallicButton>
</div></template>
```

<a id="base"></a>
### Button

Compare button sizes and visual variants, including hover lift and press scale.

**Registry source**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
```

<a id="stateful"></a>
### Stateful Button

Switch between idle, loading, success and failure while width follows the current content.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, reactive } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { StatefulButton, type ButtonState } from "@/components/orvui/motion/button";
const states = reactive<{ ok: ButtonState; err: ButtonState }>({ ok: "idle", err: "idle" });
const scheduled = new Set<ReturnType<typeof setTimeout>>();
function after(delay: number, callback: () => void) {
  const timer = setTimeout(() => { scheduled.delete(timer); callback(); }, delay);
  scheduled.add(timer);
}
function run(key: "ok" | "err") {
  if (states[key] === "loading") return;
  states[key] = "loading";
  after(1400, () => { states[key] = key === "ok" ? "success" : "error"; after(1800, () => { states[key] = "idle"; }); });
}
onBeforeUnmount(() => { scheduled.forEach(timer => clearTimeout(timer)); scheduled.clear(); });
</script>
<template><div class="flex flex-col items-center justify-center gap-3">
  <StatefulButton :state="states.ok" loading-text="Saving" success-text="Saved" :icon="ArrowRight" @click="run('ok')">Save changes</StatefulButton>
  <StatefulButton :state="states.err" variant="secondary" loading-text="Submitting" error-text="Failed" @click="run('err')">Submit</StatefulButton>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, reactive } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { StatefulButton, type ButtonState } from "@orvui/vue/motion/button";
const states = reactive<{ ok: ButtonState; err: ButtonState }>({ ok: "idle", err: "idle" });
const scheduled = new Set<ReturnType<typeof setTimeout>>();
function after(delay: number, callback: () => void) {
  const timer = setTimeout(() => { scheduled.delete(timer); callback(); }, delay);
  scheduled.add(timer);
}
function run(key: "ok" | "err") {
  if (states[key] === "loading") return;
  states[key] = "loading";
  after(1400, () => { states[key] = key === "ok" ? "success" : "error"; after(1800, () => { states[key] = "idle"; }); });
}
onBeforeUnmount(() => { scheduled.forEach(timer => clearTimeout(timer)); scheduled.clear(); });
</script>
<template><div class="flex flex-col items-center justify-center gap-3">
  <StatefulButton :state="states.ok" loading-text="Saving" success-text="Saved" :icon="ArrowRight" @click="run('ok')">Save changes</StatefulButton>
  <StatefulButton :state="states.err" variant="secondary" loading-text="Submitting" error-text="Failed" @click="run('err')">Submit</StatefulButton>
</div></template>
```

<a id="magnetic"></a>
### Magnetic Button

Wrap the action in Magnetic so its surface follows nearby pointer movement.

**Registry source**

```vue
<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { MagneticButton } from "@/components/orvui/motion/button";
const alternatives = [{ variant: "secondary", strength: 0.25, label: "Subtle pull" }, { variant: "outline", strength: 0.5, label: "Strong pull" }] as const;
</script>
<template><div class="flex flex-wrap items-center justify-center gap-4">
  <MagneticButton :strength="0.35">Hover me<ArrowRight class="h-4 w-4" /></MagneticButton>
  <MagneticButton v-for="sample in alternatives" :key="sample.variant" :variant="sample.variant" :strength="sample.strength">{{ sample.label }}</MagneticButton>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { MagneticButton } from "@orvui/vue/motion/button";
const alternatives = [{ variant: "secondary", strength: 0.25, label: "Subtle pull" }, { variant: "outline", strength: 0.5, label: "Strong pull" }] as const;
</script>
<template><div class="flex flex-wrap items-center justify-center gap-4">
  <MagneticButton :strength="0.35">Hover me<ArrowRight class="h-4 w-4" /></MagneticButton>
  <MagneticButton v-for="sample in alternatives" :key="sample.variant" :variant="sample.variant" :strength="sample.strength">{{ sample.label }}</MagneticButton>
</div></template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### Button

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `"primary"` | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | No | — |
| `pressScale` | `number` | `0.93` | No | — |
| `ripple` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MetallicButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | No | — |
| `paused` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### StatefulButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `state` | `"success" \| "idle" \| "loading" \| "error"` | `"idle"` | No | — |
| `loadingText` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Loading"` | No | — |
| `successText` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Done"` | No | — |
| `errorText` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Try again"` | No | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | No | — |
| `pressScale` | `number` | — | No | — |
| `ripple` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `type` | `"button" \| "submit" \| "reset"` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |

### MagneticButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `strength` | `number` | `0.25` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `magneticClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Button

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Button?**

Configure Button through variant, size, pressScale, ripple, disabled, type. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.
- [Switch](https://orvui.efu.me/en/components/motion/switch): Toggle a binary setting with a moving thumb and optional descriptive label.
- [Checkbox](https://orvui.efu.me/en/components/motion/checkbox): Represent checked, unchecked and mixed values with an animated check mark.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/button.json
- Documentation: https://orvui.efu.me/en/components/motion/button
- `packages/vue/src/motion/button/src/Button.vue`
- `packages/vue/src/motion/button/src/MetallicButton.vue`
- `packages/vue/src/motion/button/src/StatefulButton.vue`
- `packages/vue/src/motion/button/src/MagneticButton.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
