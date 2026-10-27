<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { motion } from "motion-v";
import { SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
const props = defineProps<{
  id: string;
  label: string;
  choices: { id: string; label: string; disabled: boolean }[];
  selected: string;
  focusOnMount: boolean;
  reduce: boolean;
}>();
const emit = defineEmits<{ select: [id: string]; close: [] }>();
const root = ref<HTMLFieldSetElement | null>(null);
const cursor = ref<string | null>(props.selected);
const active = computed(
  () =>
    [cursor.value, props.selected].find((id) =>
      props.choices.some((choice) => choice.id === id && !choice.disabled),
    ) ?? props.choices.find((choice) => !choice.disabled)?.id,
);
let disposed = false,
  revision = 0;
async function focus() {
  const version = ++revision;
  if (!props.focusOnMount) return;
  await nextTick();
  if (!disposed && version === revision)
    root.value
      ?.querySelector<HTMLElement>('button[tabindex="0"]')
      ?.focus({ preventScroll: true });
}
onMounted(focus);
watch(() => props.focusOnMount, focus);
onBeforeUnmount(() => {
  disposed = true;
  ++revision;
});
function key(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
    return;
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    emit("close");
    return;
  }
  const buttons = [
    ...(root.value?.querySelectorAll<HTMLButtonElement>("button") ?? []),
  ];
  const offset = (
    { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 } as Record<
      string,
      number
    >
  )[event.key];
  let index =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? buttons.length - 1
        : offset === undefined
          ? -1
          : buttons.indexOf(event.currentTarget as HTMLButtonElement) + offset;
  if (offset === undefined && event.key !== "Home" && event.key !== "End")
    return;
  event.preventDefault();
  const direction =
    offset === undefined ? (event.key === "Home" ? 1 : -1) : Math.sign(offset);
  while (index >= 0 && index < buttons.length && buttons[index]!.disabled)
    index += direction;
  buttons[index]?.focus({ preventScroll: true });
}
</script>
<template>
  <fieldset
    ref="root"
    :id="id"
    :aria-label="label"
    class="grid min-h-[15.25rem] grid-cols-3 content-start gap-2 border-0 p-0 pt-1"
  >
    <motion.button
      v-for="choice in choices"
      :key="choice.id"
      type="button"
      :disabled="choice.disabled"
      :aria-pressed="choice.id === selected"
      :tabindex="choice.id === active ? 0 : -1"
      :while-press="reduce ? undefined : { scale: 0.96 }"
      :transition="SPRING_PRESS"
      :class="
        cn(
          'flex h-13 items-center justify-center rounded-xl px-1 text-[13px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-25',
          choice.id === selected
            ? 'bg-foreground font-medium text-background'
            : 'bg-muted/40 hover:bg-muted',
        )
      "
      @focus="cursor = choice.id"
      @keydown="key"
      @click="emit('select', choice.id)"
      >{{ choice.label }}</motion.button
    >
  </fieldset>
</template>
