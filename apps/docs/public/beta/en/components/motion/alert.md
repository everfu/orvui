---
title: "Animated Alert"
description: "Present feedback in a compact message row with optional actions and dismissal."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/alert"
markdown: "https://orvui.efu.me/en/components/motion/alert.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Animated Alert

> Present feedback in a compact message row with optional actions and dismissal.

<a id="when-to-use"></a>

## When to use it

- Use Animated Alert when the interface needs this behavior: present feedback in a compact message row with optional actions and dismissal.

<a id="install"></a>
## Install

### Animated Alert — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/alert.json https://orvui.efu.me/beta/r/button.json https://orvui.efu.me/beta/r/tabs.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Animated Alert

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Alert, AlertAction, AlertClose, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/orvui/motion/alert";
import { Button } from "@/components/orvui/motion/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import { resolveElement } from "@/components/orvui/lib/composables";
const messages = {
  info: { label: "Info", title: "A quick update", description: "Edits are stored in the background while you work." },
  success: { label: "Success", title: "Ready to go", description: "Your latest edits are now stored." },
  warning: { label: "Warning", title: "Storage is nearly full", description: "There is only a little storage left. Remove a few unused files to make room for your next upload." },
  destructive: { label: "Error", title: "Please try once more", description: "The latest edits could not be stored. Try saving again." },
};
type Variant = keyof typeof messages;
const selected = ref<Variant>("info"), opened = ref(true), showButton = ref<HTMLElement | null>(null);
const message = computed(() => messages[selected.value]);
function choose(value: string) { selected.value = value as Variant; opened.value = true; }
</script>
<template>
  <div class="flex w-full max-w-md flex-col items-center gap-6">
    <Tabs :model-value="selected" @update:model-value="choose" class="w-full"><TabsList aria-label="Alert variant" class="bg-muted">
      <TabsTrigger v-for="(item, variant) in messages" :key="variant" :value="variant" class="px-3 py-1.5 text-xs">{{ item.label }}</TabsTrigger>
    </TabsList></Tabs>
    <Alert v-model:open="opened" :variant="selected" :return-focus-ref="showButton ?? undefined"><AlertIcon /><AlertContent>
      <AlertTitle>{{ message.title }}</AlertTitle><AlertDescription>{{ message.description }}</AlertDescription>
      <AlertAction v-if="selected === 'destructive'"><Button size="sm" variant="outline" @click="selected = 'success'">Try again</Button></AlertAction>
    </AlertContent><AlertClose /></Alert>
    <Button :ref="node => showButton = resolveElement<HTMLElement>(node)" variant="ghost" size="sm" @click="opened = true" :disabled="opened">Show alert</Button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Alert, AlertAction, AlertClose, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@orvui/vue/motion/alert";
import { Button } from "@orvui/vue/motion/button";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { resolveElement } from "@orvui/vue";
const messages = {
  info: { label: "Info", title: "A quick update", description: "Edits are stored in the background while you work." },
  success: { label: "Success", title: "Ready to go", description: "Your latest edits are now stored." },
  warning: { label: "Warning", title: "Storage is nearly full", description: "There is only a little storage left. Remove a few unused files to make room for your next upload." },
  destructive: { label: "Error", title: "Please try once more", description: "The latest edits could not be stored. Try saving again." },
};
type Variant = keyof typeof messages;
const selected = ref<Variant>("info"), opened = ref(true), showButton = ref<HTMLElement | null>(null);
const message = computed(() => messages[selected.value]);
function choose(value: string) { selected.value = value as Variant; opened.value = true; }
</script>
<template>
  <div class="flex w-full max-w-md flex-col items-center gap-6">
    <Tabs :model-value="selected" @update:model-value="choose" class="w-full"><TabsList aria-label="Alert variant" class="bg-muted">
      <TabsTrigger v-for="(item, variant) in messages" :key="variant" :value="variant" class="px-3 py-1.5 text-xs">{{ item.label }}</TabsTrigger>
    </TabsList></Tabs>
    <Alert v-model:open="opened" :variant="selected" :return-focus-ref="showButton ?? undefined"><AlertIcon /><AlertContent>
      <AlertTitle>{{ message.title }}</AlertTitle><AlertDescription>{{ message.description }}</AlertDescription>
      <AlertAction v-if="selected === 'destructive'"><Button size="sm" variant="outline" @click="selected = 'success'">Try again</Button></AlertAction>
    </AlertContent><AlertClose /></Alert>
    <Button :ref="node => showButton = resolveElement<HTMLElement>(node)" variant="ghost" size="sm" @click="opened = true" :disabled="opened">Show alert</Button>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Alert` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Alert

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"default" \| "info" \| "success" \| "warning" \| "destructive"` | `"default"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `true` | No | — |
| `contentClassName` | `string` | — | No | — |
| `role` | `"alert" \| "status"` | — | No | — |
| `returnFocusRef` | `HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `dismiss: dismiss` | — |

### AlertAction

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### AlertClose

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AlertContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### AlertDescription

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### AlertIcon

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AlertTitle

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

<a id="about"></a>
## About Animated Alert

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Animated Alert?**

Configure Animated Alert through variant, open, defaultOpen, contentClassName, role, returnFocusRef. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Aspect Ratio](https://orvui.efu.me/en/components/motion/aspect-ratio): Reserve a chosen width-to-height ratio for media and animate changes to that ratio.
- [Date Range Picker](https://orvui.efu.me/en/components/motion/date-range-picker): Choose the beginning and end of a date interval in an inline or floating calendar.
- [Card](https://orvui.efu.me/en/components/motion/card): Assemble a card from heading, content, actions and footer parts with optional selection.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/alert.json
- Documentation: https://orvui.efu.me/en/components/motion/alert
- `packages/vue/src/motion/alert/src/Alert.vue`
- `packages/vue/src/motion/alert/src/AlertAction.vue`
- `packages/vue/src/motion/alert/src/AlertClose.vue`
- `packages/vue/src/motion/alert/src/AlertContent.vue`
- `packages/vue/src/motion/alert/src/AlertDescription.vue`
- `packages/vue/src/motion/alert/src/AlertIcon.vue`
- `packages/vue/src/motion/alert/src/AlertTitle.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
