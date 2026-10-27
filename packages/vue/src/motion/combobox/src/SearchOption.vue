<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useId,
} from "vue";
import { motion } from "motion-v";
import { Check } from "lucide-vue-next";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import {
  ComboboxGroupContext,
  MultiSelectGroupContext,
  useSearchContext,
} from "../../_combobox/controller";
const props = withDefaults(
  defineProps<{
    multiple: boolean;
    value: string;
    textValue?: string;
    label?: string;
    keywords?: string[];
    disabled?: boolean;
  }>(),
  { keywords: () => [] },
);
const emit = defineEmits<{ select: [value: string] }>();
const state = useSearchContext(
  props.multiple,
  props.multiple ? "MultiSelectItem" : "ComboboxItem",
);
const groupId = inject(
  props.multiple ? MultiSelectGroupContext : ComboboxGroupContext,
  undefined,
);
const element = ref<HTMLButtonElement | null>(null);
const id = useId();
let registered: string | undefined;
const selected = computed(() =>
  props.multiple
    ? state.values.value.includes(props.value)
    : state.value.value === props.value,
);
const disabled = computed(() => !!props.disabled || state.disabled.value);
function synchronize() {
  if (registered !== undefined && registered !== props.value)
    state.unregisterItem(registered);
  state.registerItem({
    value: props.value,
    label:
      props.textValue ??
      props.label ??
      element.value?.textContent?.trim() ??
      props.value,
    keywords: [...props.keywords],
    disabled: disabled.value,
    groupId,
    id,
    element: element.value,
  });
  registered = props.value;
}
onMounted(synchronize);
onUpdated(synchronize);
onBeforeUnmount(() => {
  if (registered !== undefined) state.unregisterItem(registered);
});
function choose() {
  if (!disabled.value) {
    emit("select", props.value);
    state.select(props.value);
  }
}
const active = computed(() => state.activeValue.value === props.value);
const feedback = computed(() => ({
  opacity: selected.value ? 1 : 0,
  scale: selected.value ? 1 : 0.82,
}));
</script>
<template>
  <button
    v-show="state.isVisible(value)"
    ref="element"
    :id="id"
    type="button"
    role="option"
    :aria-selected="selected"
    :disabled="disabled"
    :tabindex="-1"
    :data-combobox-item="multiple ? undefined : ''"
    :data-multi-select-item="multiple ? '' : undefined"
    :data-active="active || undefined"
    :data-selected="selected || undefined"
    @pointermove="!disabled && state.setActiveValue(value)"
    @pointerdown.prevent
    @click="choose"
    :class="
      cn(
        'relative flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors duration-150',
        active ? 'text-foreground' : 'text-muted-foreground',
        'disabled:pointer-events-none disabled:opacity-45',
      )
    "
  >
    <motion.span
      v-if="active"
      aria-hidden="true"
      :layout-id="state.activeLayoutId"
      class="absolute inset-0 -z-10 rounded-lg bg-muted"
      :transition="state.reduce.value ? { duration: 0 } : SPRING_LAYOUT"
    />
    <span class="min-w-0 flex-1"
      ><slot>{{ textValue ?? label ?? value }}</slot></span
    >
    <motion.span
      aria-hidden="true"
      :initial="false"
      :animate="feedback"
      :transition="
        state.reduce.value
          ? { duration: 0 }
          : { duration: 0.14, ease: EASE_OUT }
      "
      class="grid size-5 shrink-0 place-items-center text-foreground"
      ><Check class="size-4"
    /></motion.span>
  </button>
</template>
