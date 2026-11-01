---
title: "Image Viewer"
description: "Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/image-viewer"
markdown: "https://orvui.efu.me/en/components/motion/image-viewer.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Image Viewer

> Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.

<a id="when-to-use"></a>

## When to use it

- Use Image Viewer when the interface needs this behavior: open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.

<a id="install"></a>
## Install

### Image Viewer — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/image-viewer.json
```

### Morphing — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-lightbox.json
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
### Image Viewer

**Registry source**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@/components/orvui/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@orvui/vue/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

<a id="morphing"></a>
### Morphing

Keep the selected thumbnail connected to a full gallery view with navigation, zoom and pan.

**Registry source**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@/components/orvui/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "@orvui/vue/motion/image-viewer";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ImageViewer` | `v-model` | `null \| string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ImageViewer

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `images` | `LightboxImage[]` | — | Yes | — |
| `modelValue` | `null \| string` | — | No | — |
| `value` | `null \| string` | — | No | — |
| `defaultValue` | `null \| string` | `null` | No | — |
| `label` | `string` | `"Image gallery"` | No | — |
| `thumbnailClassName` | `string` | — | No | — |
| `className` | `string` | — | No | — |
| `renderCaption` | `(image: LightboxImage) => VNodeChild` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `images: images`, `select: select` | — |

### ImageViewerGallery

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerThumbnail

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `imageId` | `string` | — | Yes | — |
| `imageClassName` | `string` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `image: image` | — |

### ImageViewerContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `header` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerCounter

### ImageViewerClose

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerPrevious

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ImageViewerCaption

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `image: viewer.image.value` | — |

### ImageViewerNext

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `click` | `[event: MouseEvent]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Image Viewer

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Image Viewer?**

Configure Image Viewer through images, modelValue, value, defaultValue, label, thumbnailClassName, className, renderCaption. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Color Selector](https://orvui.efu.me/en/components/motion/color-selector): Choose one named swatch with a moving selection outline and native radio behavior.
- [Combobox](https://orvui.efu.me/en/components/motion/combobox): Filter a grouped option list from an input while keeping keyboard focus in the field.
- [File Tree](https://orvui.efu.me/en/components/motion/file-tree): Explore nested files and folders with expandable branches and keyboard selection.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/image-viewer.json
- Documentation: https://orvui.efu.me/en/components/motion/image-viewer
- `packages/vue/src/motion/image-viewer/src/ImageViewer.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerGallery.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerThumbnail.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerContent.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerCounter.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerClose.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerPrevious.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerCaption.vue`
- `packages/vue/src/motion/image-viewer/src/ImageViewerNext.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
