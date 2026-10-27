<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { focusList, useMotionState } from "../../state";
import BouncyAccordionRow from "./BouncyAccordionRow.vue";
const props = withDefaults(defineProps<{
  items: { id: string; title: any; description?: any; icon?: any; disabled?: boolean }[];
  modelValue?: string | null; defaultValue?: string | null; collapsible?: boolean; classNames?: Record<string, string>;
}>(), { defaultValue: null, collapsible: true });
const emit = defineEmits(["update:modelValue", "change"]);
const current = useMotionState<string | null>(props, emit, "modelValue", props.defaultValue);
const selectedIndex = computed(() => props.items.findIndex(item => item.id === current.value));
const reduced = useReducedMotion(), id = useId();
const timing = ref({ type: "spring" as const, duration: 0.46, bounce: 0 });
watch(current, (next, before) => { timing.value = next !== null && before === null ? { type: "spring", duration: 0.58, bounce: 0.32 } : { type: "spring", duration: 0.46, bounce: 0 }; }, { flush: "sync" });
function toggle(item: typeof props.items[number]) {
  if (item.disabled) return;
  if (current.value !== item.id) current.value = item.id;
  else if (props.collapsible) current.value = null;
}
</script>
<template><div :class="cn('w-full', classNames?.root)" @keydown="focusList($event, 'button:not(:disabled)')">
  <BouncyAccordionRow v-for="(item, index) in items" :key="item.id" :item="item" :open="current === item.id"
    :starts-group="current === item.id || index === 0 || selectedIndex === index - 1" :ends-group="current === item.id || index === items.length - 1 || selectedIndex === index + 1"
    :separated-from-previous="index > 0 && (current === item.id || selectedIndex === index - 1)" :content-id="`${id}-${item.id}-content`" :trigger-id="`${id}-${item.id}-trigger`"
    :reduce="reduced" :layout-transition="reduced ? { duration: 0 } : timing" :layout-dependency="current" :class-names="classNames" @toggle="toggle(item)">
    <template v-if="$slots.title" #title="scope"><slot name="title" v-bind="scope" /></template><template v-if="$slots.content" #content="scope"><slot name="content" v-bind="scope" /></template>
  </BouncyAccordionRow>
</div></template>
