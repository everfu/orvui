---
title: "Voice Orb"
description: "Display a moving spherical field whose surface responds to activity or audio input."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/voice-orb"
markdown: "https://orvui.efu.me/en/components/agents/voice-orb.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Voice Orb

> Display a moving spherical field whose surface responds to activity or audio input.

<a id="when-to-use"></a>

## When to use it

- Use Voice Orb when the interface needs this behavior: display a moving spherical field whose surface responds to activity or audio input.

<a id="install"></a>
## Install

### Voice Orb — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/voice-orb.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Voice Orb

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VoiceOrb } from "@/components/orvui/agents/voice-orb";
const activity = ref(0);
let animation: number | undefined, preference: MediaQueryList | undefined;
let alive = false;
function paint(time: number) {
  if (!alive) return;
  const seconds = time / 1000;
  const phrase = Math.max(0, Math.sin(seconds * 0.85));
  const syllable = Math.max(
    0,
    Math.sin(seconds * 9.3 + Math.sin(seconds * 2.1)),
  );
  activity.value = preference?.matches
    ? 0
    : phrase * (0.12 + syllable * syllable * 0.72);
  animation = requestAnimationFrame(paint);
}
onMounted(() => {
  alive = true;
  preference = matchMedia("(prefers-reduced-motion: reduce)");
  animation = requestAnimationFrame(paint);
});
onBeforeUnmount(() => {
  alive = false;
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <VoiceOrb
    :activity="activity"
    aria-label="Voice visualization"
    class="w-64 sm:w-72"
  />
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VoiceOrb } from "@orvui/vue/agents/voice-orb";
const activity = ref(0);
let animation: number | undefined, preference: MediaQueryList | undefined;
let alive = false;
function paint(time: number) {
  if (!alive) return;
  const seconds = time / 1000;
  const phrase = Math.max(0, Math.sin(seconds * 0.85));
  const syllable = Math.max(
    0,
    Math.sin(seconds * 9.3 + Math.sin(seconds * 2.1)),
  );
  activity.value = preference?.matches
    ? 0
    : phrase * (0.12 + syllable * syllable * 0.72);
  animation = requestAnimationFrame(paint);
}
onMounted(() => {
  alive = true;
  preference = matchMedia("(prefers-reduced-motion: reduce)");
  animation = requestAnimationFrame(paint);
});
onBeforeUnmount(() => {
  alive = false;
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <VoiceOrb
    :activity="activity"
    aria-label="Voice visualization"
    class="w-64 sm:w-72"
  />
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### VoiceOrb

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `activity` | `number \| MotionValue<number>` | `0` | No | — |
| `analyser` | `null \| AnalyserNode` | `null` | No | — |
| `colors` | `readonly [string, string, string]` | `() => ["#e8754d", "#ffe0ac", "#346b52"] as const` | No | — |
| `active` | `boolean` | `true` | No | — |
| `speed` | `number` | `1` | No | — |
| `label` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `[error: Error]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `fallback` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Voice Orb

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Voice Orb?**

Configure Voice Orb through activity, analyser, colors, active, speed, label. The API table describes their types and defaults.

**How does it connect to application state?**

Observe error to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Approval Card](https://orvui.efu.me/en/components/agents/approval-card): Guide a person through one or more decisions before an assistant proceeds.
- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.
- [Message Bubble](https://orvui.efu.me/en/components/agents/message-bubble): Render a compact conversation bubble with an avatar, metadata and optional controls.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/voice-orb.json
- Documentation: https://orvui.efu.me/en/components/agents/voice-orb
- `packages/vue/src/agents/voice-orb/src/VoiceOrb.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
