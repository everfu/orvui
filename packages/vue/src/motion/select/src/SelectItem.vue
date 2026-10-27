<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
} from "vue";
import { motion } from "motion-v";
import { Check } from "lucide-vue-next";
import { useSelect, registrarKey, ITEM_VARIANTS, MORPH_ITEM } from "./context";
const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
    label?: string;
    className?: string;
  }>(),
  { disabled: false },
);
const state = useSelect();
const hidden = inject(registrarKey, false);
const element = ref<HTMLElement | null>(null);
const token = Symbol("select-option-instance");
let registered: string | undefined;
function synchronize() {
  if (registered !== undefined && registered !== props.value)
    state.unregister(registered, token);
  state.register(
    props.value,
    props.label ?? element.value?.textContent?.trim() ?? props.value,
    props.disabled,
    token,
  );
  registered = props.value;
}
onMounted(synchronize);
onUpdated(synchronize);
onBeforeUnmount(() => {
  if (registered !== undefined) state.unregister(registered, token);
});
const selected = computed(() => state.value.value === props.value);
const variants = computed(() =>
  state.reduce.value ? undefined : state.morph ? MORPH_ITEM : ITEM_VARIANTS,
);
</script>
<template>
  <span v-if="hidden" ref="element" hidden
    ><slot>{{ label ?? value }}</slot></span
  ><motion.div
    v-else
    :role="state.morph ? 'none' : undefined"
    :variants="variants"
    ><button
      ref="element"
      v-bind="$attrs"
      type="button"
      role="option"
      :aria-selected="selected"
      :disabled="disabled"
      :tabindex="state.activeId.value === value ? 0 : -1"
      :data-listbox-id="value"
      @click="state.select(value)"
      :class="[
        'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors',
        selected
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      ]"
    >
      <slot>{{ label ?? value }}</slot
      ><Check v-if="selected" class="h-3.5 w-3.5 shrink-0" :stroke-width="2.5" /></button
  ></motion.div>
</template>
