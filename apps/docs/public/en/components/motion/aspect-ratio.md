---
title: "Aspect Ratio"
description: "Reserve a chosen width-to-height ratio for media and animate changes to that ratio."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/aspect-ratio"
markdown: "https://orvui.efu.me/en/components/motion/aspect-ratio.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Aspect Ratio

> Reserve a chosen width-to-height ratio for media and animate changes to that ratio.

<a id="when-to-use"></a>

## When to use it

- Use Aspect Ratio when the interface needs this behavior: reserve a chosen width-to-height ratio for media and animate changes to that ratio.

<a id="install"></a>
## Install

### Aspect Ratio — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/aspect-ratio.json https://orvui.efu.me/r/tabs.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Aspect Ratio

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { AspectRatio, AspectRatioImage } from "@/components/orvui/motion/aspect-ratio";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
const labels = ["21:9", "16:9", "3:2", "4:3", "1:1", "4:5", "3:4", "2:3", "9:16"];
const selected = ref("16:9"), id = useId();
const ratio = computed(() => { const [width, height] = selected.value.split(":").map(Number); return width! / height!; });
const panelId = `${id}-preview`;
</script>
<template>
  <div class="mx-auto w-full max-w-xl min-w-0 px-4 py-6"><Tabs v-model="selected">
    <TabsList aria-label="Aspect ratio" class="mx-auto bg-muted"><TabsTrigger v-for="label in labels" :key="label" :value="label"
      :id="`${id}-${label}`" :aria-controls="panelId" :tabindex="selected === label ? 0 : -1" indicator-class-name="bg-background"
      class="min-h-9 px-3 text-xs [&_[data-tabs-label]]:text-foreground">{{ label }}</TabsTrigger></TabsList>
    <div :id="panelId" role="tabpanel" :aria-labelledby="`${id}-${selected}`" :tabindex="0"
      class="mt-6 flex h-[25rem] w-full items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <AspectRatio :ratio="ratio" class="bg-muted" :style="{ maxWidth: `${Math.min(440, 360 * ratio)}px`, borderRadius: '16px' }">
        <AspectRatioImage src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80"
          alt="A lakeside cabin beneath mountains, reflected in the water" :width="1000" :height="667" />
      </AspectRatio>
    </div>
  </Tabs></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { AspectRatio, AspectRatioImage } from "@orvui/vue/motion/aspect-ratio";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
const labels = ["21:9", "16:9", "3:2", "4:3", "1:1", "4:5", "3:4", "2:3", "9:16"];
const selected = ref("16:9"), id = useId();
const ratio = computed(() => { const [width, height] = selected.value.split(":").map(Number); return width! / height!; });
const panelId = `${id}-preview`;
</script>
<template>
  <div class="mx-auto w-full max-w-xl min-w-0 px-4 py-6"><Tabs v-model="selected">
    <TabsList aria-label="Aspect ratio" class="mx-auto bg-muted"><TabsTrigger v-for="label in labels" :key="label" :value="label"
      :id="`${id}-${label}`" :aria-controls="panelId" :tabindex="selected === label ? 0 : -1" indicator-class-name="bg-background"
      class="min-h-9 px-3 text-xs [&_[data-tabs-label]]:text-foreground">{{ label }}</TabsTrigger></TabsList>
    <div :id="panelId" role="tabpanel" :aria-labelledby="`${id}-${selected}`" :tabindex="0"
      class="mt-6 flex h-[25rem] w-full items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <AspectRatio :ratio="ratio" class="bg-muted" :style="{ maxWidth: `${Math.min(440, 360 * ratio)}px`, borderRadius: '16px' }">
        <AspectRatioImage src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80"
          alt="A lakeside cabin beneath mountains, reflected in the water" :width="1000" :height="667" />
      </AspectRatio>
    </div>
  </Tabs></div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### AspectRatio

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ratio` | `number` | `1` | No | — |
| `animated` | `boolean` | `true` | No | — |
| `contentClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AspectRatioImage

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `width` | `number` | — | Yes | — |
| `height` | `number` | — | Yes | — |
| `alt` | `string` | — | Yes | — |
| `src` | `string` | — | Yes | — |
| `draggable` | `boolean` | `false` | No | — |

<a id="about"></a>
## About Aspect Ratio

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Aspect Ratio?**

Bind a numeric ratio, for example :ratio="16 / 9", and place media in the default slot.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Alert](https://orvui.efu.me/en/components/motion/alert): Present feedback in a compact message row with optional actions and dismissal.
- [Arc Picker](https://orvui.efu.me/en/components/motion/arc-picker): Move a curved list of labels through a fixed selection point using gestures or keys.
- [Image Viewer](https://orvui.efu.me/en/components/motion/image-viewer): Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/aspect-ratio.json
- Documentation: https://orvui.efu.me/en/components/motion/aspect-ratio
- `packages/vue/src/motion/aspect-ratio/src/AspectRatio.vue`
- `packages/vue/src/motion/aspect-ratio/src/AspectRatioImage.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
