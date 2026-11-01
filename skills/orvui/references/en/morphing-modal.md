# Morphing Modal · orvui 0.1.1

## Selection and composition

Use Tooltip for short non-interactive labels and Popover for content beside its trigger. Use Modal, Drawer or a mobile Bottom Sheet for focused tasks.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Morphing Modal"
description: "Change a dialog's content and height together while preserving the outer surface."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/morphing-modal"
markdown: "https://orvui.efu.me/en/components/motion/morphing-modal.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Morphing Modal

> Change a dialog's content and height together while preserving the outer surface.

<a id="when-to-use"></a>

## When to use it

- Use Morphing Modal when the interface needs this behavior: change a dialog's content and height together while preserving the outer surface.

<a id="install"></a>
## Install

### Morphing Modal — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-modal.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Morphing Modal

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Ban, Lock, ScanFace, ScrollText, ShieldCheck, Trash2 } from "lucide-vue-next";
import { MorphingModal } from "@/components/orvui/motion/morphing-modal";
type View = "options" | "private-key" | "recovery" | null;
const selected = ref<View>(null);
const actions = [{ icon: Lock, label: "View Private Key", value: "private-key" }, { icon: ScrollText, label: "View Recovery Phrase", value: "recovery" }, { icon: Trash2, label: "Remove Wallet", value: null }] as const;
const notes = [{ icon: ShieldCheck, label: "Keep the private key somewhere safe" }, { icon: ScrollText, label: "Only you should have access to it" }, { icon: Ban, label: "A lost key cannot be restored for you" }];
const words = "forest silver canvas garden maple sunrise meadow compass velvet autumn pebble lantern".split(" ");
</script>
<template><div class="flex flex-col items-center gap-3">
  <button type="button" @click="selected = 'options'" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open wallet options</button>
  <p class="text-xs text-muted-foreground">Choose an option. The surface adjusts to its content.</p>
  <MorphingModal :view-id="selected" @close="selected = null">
    <div v-if="selected === 'options'">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-base font-semibold text-foreground">Options</h2><button type="button" @click="selected = null" aria-label="Close" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <div class="flex flex-col gap-2"><button v-for="action in actions" :key="action.label" type="button" @click="selected = action.value"
        :class="['flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors press', action.value === null ? 'bg-destructive/10 text-destructive hover:bg-destructive/15' : 'bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]']"><component :is="action.icon" class="h-4 w-4" />{{ action.label }}</button></div>
    </div>
    <div v-else-if="selected === 'private-key'">
      <div class="mb-3 flex items-start justify-between"><Lock class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Private Key</h2>
      <p class="mt-2 text-sm text-muted-foreground">The private key gives access to your wallet and its backup. Store it securely and keep it to yourself.</p><hr class="my-4 border-border" />
      <ul class="flex flex-col gap-2.5 text-sm text-muted-foreground"><li v-for="note in notes" :key="note.label" class="flex items-center gap-2.5"><component :is="note.icon" class="h-4 w-4" />{{ note.label }}</li></ul>
      <div class="mt-5 flex gap-2"><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-foreground press">Cancel</button><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background press"><ScanFace class="h-4 w-4" />Reveal</button></div>
    </div>
    <div v-else-if="selected === 'recovery'">
      <div class="mb-3 flex items-start justify-between"><ScrollText class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Recovery Phrase</h2><p class="mt-2 text-sm text-muted-foreground">Use these 12 example words to see the recovery layout. Keep your own phrase recorded in a safe place.</p>
      <div class="mt-4 grid grid-cols-3 gap-2"><div v-for="(word, index) in words" :key="word" class="rounded-lg border border-border bg-background/40 px-2 py-1.5 text-xs text-foreground"><span class="mr-1 text-muted-foreground">{{ index + 1 }}.</span>{{ word }}</div></div>
      <button type="button" @click="selected = 'options'" class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background press">Done</button>
    </div>
  </MorphingModal>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Ban, Lock, ScanFace, ScrollText, ShieldCheck, Trash2 } from "lucide-vue-next";
import { MorphingModal } from "@orvui/vue/motion/morphing-modal";
type View = "options" | "private-key" | "recovery" | null;
const selected = ref<View>(null);
const actions = [{ icon: Lock, label: "View Private Key", value: "private-key" }, { icon: ScrollText, label: "View Recovery Phrase", value: "recovery" }, { icon: Trash2, label: "Remove Wallet", value: null }] as const;
const notes = [{ icon: ShieldCheck, label: "Keep the private key somewhere safe" }, { icon: ScrollText, label: "Only you should have access to it" }, { icon: Ban, label: "A lost key cannot be restored for you" }];
const words = "forest silver canvas garden maple sunrise meadow compass velvet autumn pebble lantern".split(" ");
</script>
<template><div class="flex flex-col items-center gap-3">
  <button type="button" @click="selected = 'options'" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open wallet options</button>
  <p class="text-xs text-muted-foreground">Choose an option. The surface adjusts to its content.</p>
  <MorphingModal :view-id="selected" @close="selected = null">
    <div v-if="selected === 'options'">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-base font-semibold text-foreground">Options</h2><button type="button" @click="selected = null" aria-label="Close" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <div class="flex flex-col gap-2"><button v-for="action in actions" :key="action.label" type="button" @click="selected = action.value"
        :class="['flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors press', action.value === null ? 'bg-destructive/10 text-destructive hover:bg-destructive/15' : 'bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]']"><component :is="action.icon" class="h-4 w-4" />{{ action.label }}</button></div>
    </div>
    <div v-else-if="selected === 'private-key'">
      <div class="mb-3 flex items-start justify-between"><Lock class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Private Key</h2>
      <p class="mt-2 text-sm text-muted-foreground">The private key gives access to your wallet and its backup. Store it securely and keep it to yourself.</p><hr class="my-4 border-border" />
      <ul class="flex flex-col gap-2.5 text-sm text-muted-foreground"><li v-for="note in notes" :key="note.label" class="flex items-center gap-2.5"><component :is="note.icon" class="h-4 w-4" />{{ note.label }}</li></ul>
      <div class="mt-5 flex gap-2"><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-foreground press">Cancel</button><button type="button" @click="selected = 'options'" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background press"><ScanFace class="h-4 w-4" />Reveal</button></div>
    </div>
    <div v-else-if="selected === 'recovery'">
      <div class="mb-3 flex items-start justify-between"><ScrollText class="h-5 w-5 text-foreground" /><button type="button" @click="selected = 'options'" aria-label="Back" class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/[0.06]">✕</button></div>
      <h2 class="text-xl font-semibold tracking-tight text-foreground">Recovery Phrase</h2><p class="mt-2 text-sm text-muted-foreground">Use these 12 example words to see the recovery layout. Keep your own phrase recorded in a safe place.</p>
      <div class="mt-4 grid grid-cols-3 gap-2"><div v-for="(word, index) in words" :key="word" class="rounded-lg border border-border bg-background/40 px-2 py-1.5 text-xs text-foreground"><span class="mr-1 text-muted-foreground">{{ index + 1 }}.</span>{{ word }}</div></div>
      <button type="button" @click="selected = 'options'" class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background press">Done</button>
    </div>
  </MorphingModal>
</div></template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### MorphingModal

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `viewId` | `string \| null` | — | Yes | — |
| `placement` | `"bottom" \| "center"` | `"bottom"` | No | — |
| `ariaLabel` | `string` | `attrs["aria-label"] as string \| undefined` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `view-id: viewId` | — |

<a id="about"></a>
## About Morphing Modal

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Morphing Modal?**

Configure Morphing Modal through viewId, placement, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe close to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Popover](https://orvui.efu.me/en/components/motion/popover): Attach a floating surface to a trigger with conventional or continuous morphing transitions.
- [Drawer](https://orvui.efu.me/en/components/motion/drawer): Present a dialog from either side of the viewport with focus and scroll management.
- [Tooltip](https://orvui.efu.me/en/components/motion/tooltip): Reveal a short contextual label on hover or focus without displacing nearby content.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/morphing-modal.json
- Documentation: https://orvui.efu.me/en/components/motion/morphing-modal
- `packages/vue/src/motion/morphing-modal/src/MorphingModal.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

