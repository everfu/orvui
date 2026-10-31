---
title: "Theme Toggle"
description: "Reveal a new page theme with a circle, rectangle or blinds transition."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/theme-toggle"
markdown: "https://orvui.efu.me/en/components/motion/theme-toggle.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Theme Toggle

> Reveal a new page theme with a circle, rectangle or blinds transition.

<a id="when-to-use"></a>

## When to use it

- Use Theme Toggle when the interface needs this behavior: reveal a new page theme with a circle, rectangle or blinds transition.

<a id="install"></a>
## Install

### Theme Toggle — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/theme-toggle.json
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

<a id="examples"></a>
## Usage

<a id="default"></a>
### Theme Toggle

**Registry source**

```vue
<script setup lang="ts">
import { ThemeToggle, type ThemeVariant } from "@/components/orvui/motion/theme-toggle";
const variants: [ThemeVariant, string][] = [["rectangle", "Rectangle"], ["circle", "Circle"], ["circle-blur", "Circle blur"], ["blinds", "Blinds"]];
</script>
<template>
  <div class="flex h-full w-full items-center justify-center gap-5">
    <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-2">
      <ThemeToggle :variant="variant" start="bottom-up" class="rounded-xl border border-border bg-background p-2.5" icon-class-name="h-5 w-5" />
      <span class="text-[11px] text-muted-foreground">{{ label }}</span>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ThemeToggle, type ThemeVariant } from "@orvui/vue/motion/theme-toggle";
const variants: [ThemeVariant, string][] = [["rectangle", "Rectangle"], ["circle", "Circle"], ["circle-blur", "Circle blur"], ["blinds", "Blinds"]];
</script>
<template>
  <div class="flex h-full w-full items-center justify-center gap-5">
    <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-2">
      <ThemeToggle :variant="variant" start="bottom-up" class="rounded-xl border border-border bg-background p-2.5" icon-class-name="h-5 w-5" />
      <span class="text-[11px] text-muted-foreground">{{ label }}</span>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ThemeToggle` | `v-model` | `"light" \| "dark"` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ThemeToggle

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `"light" \| "dark"` | `(theme.isDark.value ? "dark" : "light")` | No | — |
| `variant` | `"rectangle" \| "circle" \| "circle-blur" \| "blinds"` | `"rectangle"` | No | — |
| `start` | `"center" \| "top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "bottom-up"` | `"bottom-up"` | No | — |
| `iconClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## About Theme Toggle

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Theme Toggle?**

Use the useThemeToggle composable when the trigger needs custom markup; retain the same theme target and transition options.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Shader Background](https://orvui.efu.me/en/components/motion/shader-background): Render an animated background through a Vue adapter for the Paper Design shader runtime.
- [Cylinder Carousel](https://orvui.efu.me/en/components/motion/cylinder-carousel): Arrange gallery items on a concave or convex cylinder controlled by dragging.
- [Tilt Card](https://orvui.efu.me/en/components/motion/tilt-card): Tilt a card toward the pointer and move a highlight over its surface.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/theme-toggle.json
- Documentation: https://orvui.efu.me/en/components/motion/theme-toggle
- `packages/vue/src/motion/theme-toggle/src/ThemeToggle.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
