<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { onBeforeUnmount, ref } from "vue";
import { animate } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { parseHex, rgbaToHsva } from "./color";
import { usePicker } from "./context";
const state = usePicker();
const draft = ref<string | null>(null);
const root = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();
let feedback: ReturnType<typeof animate> | undefined;
function settle() {
  if (draft.value === null) return;
  const parsed = parseHex(draft.value);
  if (parsed) {
    state.update(rgbaToHsva(parsed, state.hsva.value));
    state.commit();
  } else if (!reduced.value && root.value) {
    feedback?.stop();
    feedback = animate(
      root.value,
      { x: [0, -5, 5, -3, 3, 0] },
      { duration: 0.3 },
    );
  }
  draft.value = null;
}
function input(event: Event) {
  const text = (event.target as HTMLInputElement).value.replace(/^#/, "");
  draft.value = text;
  if (text.length !== 6 && text.length !== 8) return;
  const parsed = parseHex(text);
  if (parsed) state.update(rgbaToHsva(parsed, state.hsva.value));
}
onBeforeUnmount(() => feedback?.stop());
</script>
<template>
  <div ref="root" :class="['relative min-w-0 flex-1', $attrs.class]">
    <span
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
      >#</span
    ><input
      v-bind="$attrs"
      type="text"
      inputmode="text"
      autocomplete="off"
      :spellcheck="false"
      :maxlength="9"
      :disabled="state.disabled.value"
      :aria-label="String($attrs['aria-label'] ?? 'Hex color')"
      :value="draft ?? state.hex.value.slice(1).toUpperCase()"
      @input="input"
      @blur="settle"
      @keydown.enter="settle"
      @keydown.esc.prevent="draft = null"
      class="h-9 w-full min-w-0 rounded-lg border border-border bg-background pr-3 pl-6 font-mono text-sm uppercase tabular-nums text-foreground outline-none transition-colors focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed"
    />
  </div>
</template>
