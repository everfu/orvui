---
title: "Card Folder"
description: "Reveal a group of cards from a folded pocket with a coordinated opening movement."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/card-folder"
markdown: "https://orvui.efu.me/en/components/blocks/card-folder.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Card Folder

> Reveal a group of cards from a folded pocket with a coordinated opening movement.

<a id="when-to-use"></a>

## When to use it

- Use Card Folder when the interface needs this behavior: reveal a group of cards from a folded pocket with a coordinated opening movement.

<a id="install"></a>
## Install

### Card Folder — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/card-folder.json
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
### Card Folder

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CardFolder } from "@/components/orvui/blocks/card-folder";
import { DigitSwap } from "@/components/orvui/motion/number";
const details = ref(false),
  number = "3745 6987 4096 0806",
  masked = "•••• •••• •••• 0806";
const rings = Array.from({ length: 18 }, (_, index) => ({
  radius: 72 + index * 24,
  opacity: 0.32 - index * 0.009,
}));
</script>
<template>
  <div class="flex min-h-72 w-full items-center justify-center px-6 py-9">
    <CardFolder
      v-model:details-visible="details"
      title="orvui Demo Member"
      :card-number="number"
      expiry="08/29"
      cvv="123"
      ><template #card
        ><span
          class="relative block h-full w-full overflow-hidden bg-[linear-gradient(135deg,#383a38_0%,#202120_48%,#111211_100%)] text-white"
          ><svg
            aria-hidden="true"
            viewBox="0 0 640 404"
            class="absolute inset-0 h-full w-full"
          >
            <circle
              v-for="ring in rings"
              :key="ring.radius"
              cx="-20"
              cy="-28"
              :r="ring.radius"
              fill="none"
              stroke="currentColor"
              :stroke-opacity="ring.opacity"
              stroke-width="1.5"
            /></svg
          ><span
            class="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgb(255_255_255/0.11),transparent_32%)]" /><span
            class="absolute left-[6%] top-[8%] flex flex-col gap-2"
            ><span
              class="text-[10px] font-medium uppercase tracking-[.22em] text-white/55"
              >orvui Demo Member</span
            ><DigitSwap
              :value="details ? number : masked"
              :animation-key="details ? 'revealed' : 'masked'"
              :direction="details ? 'up' : 'down'"
              :suffix-length="4"
              :glyph-class-name="details ? 'text-white/90' : 'text-white/65'"
              suffix-class-name="text-white/90"
              class="font-mono text-xs tracking-[.13em]" /></span
          ><span
            class="absolute right-[7%] top-[8%] h-[20%] w-[13%] overflow-hidden rounded-[18%] border border-black/30 bg-[linear-gradient(135deg,#f2f0ea_0%,#b9b7b1_45%,#e4e1d9_100%)]"
            ><span
              class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/30" /><span
              class="absolute inset-x-0 top-1/3 h-px bg-black/30" /><span
              class="absolute inset-x-0 bottom-1/3 h-px bg-black/30" /><span
              class="absolute left-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-r-[35%] border border-l-0 border-black/30" /><span
              class="absolute right-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-l-[35%] border border-r-0 border-black/30" /></span
          ><span
            class="absolute bottom-[9%] left-[6%] flex items-center gap-2 text-lg font-semibold tracking-[-.04em]"
            >orvui<span
              class="block size-2.5 rotate-45 rounded-[2px] bg-white/85" /></span
          ><span class="absolute bottom-[10%] right-[7%] flex items-end gap-5"
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >Expiry</span
              ><span class="text-xs font-medium tabular-nums text-white/90"
                >08/29</span
              ></span
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >CVV</span
              ><DigitSwap
                :value="details ? '123' : '•••'"
                :animation-key="details ? 'revealed' : 'masked'"
                :direction="details ? 'up' : 'down'"
                class="font-mono text-xs font-medium text-white/90" /></span></span></span></template
    ></CardFolder>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CardFolder } from "@orvui/vue/blocks/card-folder";
import { DigitSwap } from "@orvui/vue/motion/number";
const details = ref(false),
  number = "3745 6987 4096 0806",
  masked = "•••• •••• •••• 0806";
const rings = Array.from({ length: 18 }, (_, index) => ({
  radius: 72 + index * 24,
  opacity: 0.32 - index * 0.009,
}));
</script>
<template>
  <div class="flex min-h-72 w-full items-center justify-center px-6 py-9">
    <CardFolder
      v-model:details-visible="details"
      title="orvui Demo Member"
      :card-number="number"
      expiry="08/29"
      cvv="123"
      ><template #card
        ><span
          class="relative block h-full w-full overflow-hidden bg-[linear-gradient(135deg,#383a38_0%,#202120_48%,#111211_100%)] text-white"
          ><svg
            aria-hidden="true"
            viewBox="0 0 640 404"
            class="absolute inset-0 h-full w-full"
          >
            <circle
              v-for="ring in rings"
              :key="ring.radius"
              cx="-20"
              cy="-28"
              :r="ring.radius"
              fill="none"
              stroke="currentColor"
              :stroke-opacity="ring.opacity"
              stroke-width="1.5"
            /></svg
          ><span
            class="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgb(255_255_255/0.11),transparent_32%)]" /><span
            class="absolute left-[6%] top-[8%] flex flex-col gap-2"
            ><span
              class="text-[10px] font-medium uppercase tracking-[.22em] text-white/55"
              >orvui Demo Member</span
            ><DigitSwap
              :value="details ? number : masked"
              :animation-key="details ? 'revealed' : 'masked'"
              :direction="details ? 'up' : 'down'"
              :suffix-length="4"
              :glyph-class-name="details ? 'text-white/90' : 'text-white/65'"
              suffix-class-name="text-white/90"
              class="font-mono text-xs tracking-[.13em]" /></span
          ><span
            class="absolute right-[7%] top-[8%] h-[20%] w-[13%] overflow-hidden rounded-[18%] border border-black/30 bg-[linear-gradient(135deg,#f2f0ea_0%,#b9b7b1_45%,#e4e1d9_100%)]"
            ><span
              class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/30" /><span
              class="absolute inset-x-0 top-1/3 h-px bg-black/30" /><span
              class="absolute inset-x-0 bottom-1/3 h-px bg-black/30" /><span
              class="absolute left-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-r-[35%] border border-l-0 border-black/30" /><span
              class="absolute right-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-l-[35%] border border-r-0 border-black/30" /></span
          ><span
            class="absolute bottom-[9%] left-[6%] flex items-center gap-2 text-lg font-semibold tracking-[-.04em]"
            >orvui<span
              class="block size-2.5 rotate-45 rounded-[2px] bg-white/85" /></span
          ><span class="absolute bottom-[10%] right-[7%] flex items-end gap-5"
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >Expiry</span
              ><span class="text-xs font-medium tabular-nums text-white/90"
                >08/29</span
              ></span
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >CVV</span
              ><DigitSwap
                :value="details ? '123' : '•••'"
                :animation-key="details ? 'revealed' : 'masked'"
                :direction="details ? 'up' : 'down'"
                class="font-mono text-xs font-medium text-white/90" /></span></span></span></template
    ></CardFolder>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `CardFolder` | `v-model:open` | `boolean` | `update:open` |
| `CardFolder` | `v-model:detailsVisible` | `boolean` | `update:detailsVisible` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### CardFolder

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | Yes | — |
| `cardNumber` | `string` | — | Yes | — |
| `expiry` | `string` | — | Yes | — |
| `cvv` | `string` | — | Yes | — |
| `card` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `detailsVisible` | `boolean` | `undefined` | No | — |
| `defaultDetailsVisible` | `boolean` | `false` | No | — |
| `actionLabel` | `string` | — | No | — |
| `ariaLabel` | `string` | `` `${open.value ? "Close" : "Open"} ${props.title}, card ending in ${lastFour.value}, expires ${props.expiry}` `` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `cardClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `update:detailsVisible` | `[visible: boolean]` | — |
| `detailsVisibleChange` | `[visible: boolean]` | — |
| `click` | `[]` | — |
| `action` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `card` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Card Folder

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Card Folder?**

Configure Card Folder through title, cardNumber, expiry, cvv, card, open, defaultOpen, detailsVisible, defaultDetailsVisible, actionLabel, ariaLabel, disabled, cardClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange, update:detailsVisible, detailsVisibleChange, click, action to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Project Folder](https://orvui.efu.me/en/components/blocks/project-folder): Fan out document previews and expand a selected folder into a focused surface.
- [Wallet Card](https://orvui.efu.me/en/components/blocks/wallet-card): Inspect an account balance, change accounts and hide sensitive amounts in a compact card.
- [Expandable Action Bar](https://orvui.efu.me/en/components/blocks/expandable-action-bar): Reveal labels around the active action in a compact row of icon controls.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/card-folder.json
- Documentation: https://orvui.efu.me/en/components/blocks/card-folder
- `packages/vue/src/blocks/card-folder/src/CardFolder.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
