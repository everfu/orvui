---
title: "Card"
description: "Assemble a card from heading, content, actions and footer parts with optional selection."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/card"
markdown: "https://orvui.efu.me/en/components/motion/card.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Card

> Assemble a card from heading, content, actions and footer parts with optional selection.

<a id="when-to-use"></a>

## When to use it

- Use Card when the interface needs this behavior: assemble a card from heading, content, actions and footer parts with optional selection.

<a id="install"></a>
## Install

### Card — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/card.json https://orvui.efu.me/beta/r/button.json https://orvui.efu.me/beta/r/checkbox.json https://orvui.efu.me/beta/r/switch.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Card

**Registry source**

```vue
<script setup lang="ts">
import { reactive, ref, useId } from "vue";
import { Button } from "@/components/orvui/motion/button";
import { Checkbox } from "@/components/orvui/motion/checkbox";
import { Switch } from "@/components/orvui/motion/switch";
import { CARD_TARGET_CLASS, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/orvui/motion/card";
const instanceId = useId();
const documents = ref([
  { id: "agreement", title: "Signed contract", description: "The final PDF with every signature and the audit trail.", checked: true },
  { id: "billing", title: "Invoice", description: "Itemised billing for the period, ready for accounting.", checked: false },
]);
const preferences = reactive({ notifications: true, digest: false });
const rows = Object.entries({ Plan: "Team, yearly", Seats: "12", "Billing email": "billing@acme.co" });
</script>
<template>
  <div class="grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
    <div class="flex flex-col gap-3">
      <Card v-for="document in documents" :key="document.id" size="compact" interactive :selected="document.checked">
        <CardHeader><CardTitle>{{ document.title }}</CardTitle><CardDescription :id="`${instanceId}-${document.id}`">{{ document.description }}</CardDescription>
          <CardAction><Checkbox v-model="document.checked" :aria-label="document.title" :aria-describedby="`${instanceId}-${document.id}`" :class="CARD_TARGET_CLASS" /></CardAction>
        </CardHeader>
      </Card>
      <Card variant="muted" size="compact">
        <CardHeader><CardTitle as="h3">Notifications</CardTitle><CardDescription>Choose what reaches your inbox.</CardDescription></CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-4"><span>Mentions and replies</span><Switch v-model="preferences.notifications" aria-label="Mentions and replies" /></div>
          <div class="flex items-center justify-between gap-4"><span>Weekly digest</span><Switch v-model="preferences.digest" aria-label="Weekly digest" /></div>
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle as="h3">Review order</CardTitle><CardDescription>Check the details before you confirm.</CardDescription><CardAction><Button variant="ghost" size="sm">Edit</Button></CardAction></CardHeader>
        <CardContent><dl class="divide-y divide-border"><div v-for="[label, value] in rows" :key="label" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"><dt class="text-muted-foreground">{{ label }}</dt><dd class="font-medium text-foreground">{{ value }}</dd></div></dl></CardContent>
        <CardFooter class="justify-end"><Button variant="secondary" size="sm">Back</Button><Button size="sm">Confirm order</Button></CardFooter>
      </Card>
      <Card class="overflow-hidden pt-0">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80" alt="Bright open-plan studio with long desks and plants" :width="720" :height="405" loading="lazy" class="aspect-video w-full object-cover" />
        <CardHeader><CardTitle as="h3">Studio, Lisbon</CardTitle><CardDescription>Desks for 12 people, booked for the March offsite.</CardDescription></CardHeader>
        <CardFooter class="justify-between"><span class="text-sm text-muted-foreground"><span class="font-medium text-foreground">€1,840</span> · 3 days</span><Button variant="secondary" size="sm">View booking</Button></CardFooter>
      </Card>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive, ref, useId } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { Checkbox } from "@orvui/vue/motion/checkbox";
import { Switch } from "@orvui/vue/motion/switch";
import { CARD_TARGET_CLASS, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@orvui/vue/motion/card";
const instanceId = useId();
const documents = ref([
  { id: "agreement", title: "Signed contract", description: "The final PDF with every signature and the audit trail.", checked: true },
  { id: "billing", title: "Invoice", description: "Itemised billing for the period, ready for accounting.", checked: false },
]);
const preferences = reactive({ notifications: true, digest: false });
const rows = Object.entries({ Plan: "Team, yearly", Seats: "12", "Billing email": "billing@acme.co" });
</script>
<template>
  <div class="grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
    <div class="flex flex-col gap-3">
      <Card v-for="document in documents" :key="document.id" size="compact" interactive :selected="document.checked">
        <CardHeader><CardTitle>{{ document.title }}</CardTitle><CardDescription :id="`${instanceId}-${document.id}`">{{ document.description }}</CardDescription>
          <CardAction><Checkbox v-model="document.checked" :aria-label="document.title" :aria-describedby="`${instanceId}-${document.id}`" :class="CARD_TARGET_CLASS" /></CardAction>
        </CardHeader>
      </Card>
      <Card variant="muted" size="compact">
        <CardHeader><CardTitle as="h3">Notifications</CardTitle><CardDescription>Choose what reaches your inbox.</CardDescription></CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-4"><span>Mentions and replies</span><Switch v-model="preferences.notifications" aria-label="Mentions and replies" /></div>
          <div class="flex items-center justify-between gap-4"><span>Weekly digest</span><Switch v-model="preferences.digest" aria-label="Weekly digest" /></div>
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle as="h3">Review order</CardTitle><CardDescription>Check the details before you confirm.</CardDescription><CardAction><Button variant="ghost" size="sm">Edit</Button></CardAction></CardHeader>
        <CardContent><dl class="divide-y divide-border"><div v-for="[label, value] in rows" :key="label" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"><dt class="text-muted-foreground">{{ label }}</dt><dd class="font-medium text-foreground">{{ value }}</dd></div></dl></CardContent>
        <CardFooter class="justify-end"><Button variant="secondary" size="sm">Back</Button><Button size="sm">Confirm order</Button></CardFooter>
      </Card>
      <Card class="overflow-hidden pt-0">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80" alt="Bright open-plan studio with long desks and plants" :width="720" :height="405" loading="lazy" class="aspect-video w-full object-cover" />
        <CardHeader><CardTitle as="h3">Studio, Lisbon</CardTitle><CardDescription>Desks for 12 people, booked for the March offsite.</CardDescription></CardHeader>
        <CardFooter class="justify-between"><span class="text-sm text-muted-foreground"><span class="font-medium text-foreground">€1,840</span> · 3 days</span><Button variant="secondary" size="sm">View booking</Button></CardFooter>
      </Card>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### Card

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"outlined" \| "muted"` | `"outlined"` | No | — |
| `size` | `"default" \| "compact"` | `"default"` | No | — |
| `interactive` | `boolean` | `false` | No | — |
| `selected` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CardAction

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardDescription

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardFooter

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardHeader

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### CardTitle

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `as` | `"div" \| "h2" \| "h3" \| "h4"` | `"div"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Card

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Card?**

Configure Card through variant, size, interactive, selected. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Date Range Picker](https://orvui.efu.me/en/components/motion/date-range-picker): Choose the beginning and end of a date interval in an inline or floating calendar.
- [Animated Color Selector](https://orvui.efu.me/en/components/motion/color-selector): Choose one named swatch with a moving selection outline and native radio behavior.
- [Checkbox](https://orvui.efu.me/en/components/motion/checkbox): Represent checked, unchecked and mixed values with an animated check mark.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/card.json
- Documentation: https://orvui.efu.me/en/components/motion/card
- `packages/vue/src/motion/card/src/Card.vue`
- `packages/vue/src/motion/card/src/CardAction.vue`
- `packages/vue/src/motion/card/src/CardContent.vue`
- `packages/vue/src/motion/card/src/CardDescription.vue`
- `packages/vue/src/motion/card/src/CardFooter.vue`
- `packages/vue/src/motion/card/src/CardHeader.vue`
- `packages/vue/src/motion/card/src/CardTitle.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
