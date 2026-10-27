<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import type { ColorSelectorContext } from "./context";
const props = defineProps<{ value: string; color: string; label: string; disabled?: boolean }>();
const group = inject<ColorSelectorContext>("orvui-color-selector");
if (!group) throw new Error("ColorSelectorItem must be inside ColorSelector");
const surface = ref<HTMLElement | null>(null), reduced = useReducedMotion();
const selected = computed(() => group.value.value === props.value);
const disabled = computed(() => props.disabled || group.disabled.value);
let disposed = false;
function register() { if (!disposed && surface.value) group!.register(props.value, { element: surface.value, color: props.color }); }
function choose(event: Event) { if (!disabled.value && !event.defaultPrevented) group!.select(props.value); }
onMounted(register);
watch(() => [props.value, props.color] as const, (_, previous) => { group.unregister(previous[0]); void nextTick(register); });
onBeforeUnmount(() => { disposed = true; group.unregister(props.value); });
</script>
<template>
  <motion.label :tabindex="-1" :while-press="reduced || disabled ? undefined : { scale: 0.94 }" :transition="SPRING_PRESS"
    :class="cn('relative inline-flex shrink-0 rounded-full', disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer')">
    <input v-bind="$attrs" type="radio" :name="group.name.value" :value="value" :checked="selected" :disabled="disabled"
      :required="group.required.value" :form="group.form.value" :aria-label="label" @change="choose" class="peer sr-only" />
    <span ref="surface" aria-hidden="true" :style="$attrs.style as any"
      :class="cn('relative flex size-11 items-center justify-center rounded-full border border-foreground/10 bg-muted/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-foreground', $attrs.class as string)">
      <span v-if="selected && !group.placed.value" class="pointer-events-none absolute -inset-1 rounded-full border-2" :style="{ borderColor: `color-mix(in srgb, ${color} 85%, transparent)` }" />
      <span class="size-5 rounded-full border border-black/5" :style="{ backgroundColor: color }" />
    </span>
  </motion.label>
</template>
