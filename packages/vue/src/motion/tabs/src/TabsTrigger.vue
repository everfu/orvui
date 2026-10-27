<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { motion, useTransform } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { TABS_TRANSITION, useTabs } from "./context";
import TriggerContent from "./TriggerContent.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ value: string; disabled?: boolean; icon?: any; indicatorClassName?: string }>();
const state = useTabs();
const reduced = useReducedMotion();
const active = computed(() => state.value.value === props.value);
const radius = computed(() => state.variant.value === "pill" ? "rounded-full" : "rounded-md");
const tracked = computed(() => state.icons.value === "selected" && state.placed.value);
const initialClip = active.value ? "inset(0)" : "inset(0 100% 0 0)";
const width = useTransform(state.track.width, value => `${value}px`);
const height = useTransform(state.track.height, value => `${value}px`);
const tabIndex = computed(() => !props.disabled && (state.tabStop.value === null || state.tabStop.value === props.value) ? 0 : -1);
const border = computed(() => state.variant.value === "pill" ? "9999px" : "8px");
function select(event: MouseEvent) { if (!event.defaultPrevented) state.value.value = props.value; }
onMounted(() => state.registerTab(props.value, !!props.disabled));
watch([() => props.value, () => props.disabled], ([value, disabled], [previous]) => { if (previous !== value) state.unregisterTab(previous); state.registerTab(value, !!disabled); });
onBeforeUnmount(() => state.unregisterTab(props.value));
</script>
<template>
  <button v-if="state.variant.value === 'underline'" :id="state.tabId(value)" :aria-controls="state.panels.value.has(value) ? state.panelId(value) : undefined" :tabindex="tabIndex" v-bind="$attrs" type="button" role="tab" :aria-selected="active" :disabled="disabled" :data-tabs-value="value" @click="select" :class="cn('relative isolate px-3 pb-2.5 pt-1 -mb-px text-sm font-medium transition-colors min-h-[44px] inline-flex items-center whitespace-nowrap shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground', $attrs.class as string)"><TriggerContent :active="active" :icon="icon"><template v-if="$slots.icon" #icon><slot name="icon" /></template><slot /></TriggerContent><motion.span v-if="active" :layout-id="`${state.id}-indicator`" layout :transition="reduced ? { duration: 0 } : TABS_TRANSITION" :class="cn('absolute bottom-0 left-0 right-0 h-px bg-primary', indicatorClassName)" /></button>
  <div v-else :class="cn('shrink-0', !tracked && 'relative')"><motion.span v-if="active && tracked" key="tracked" data-tabs-indicator="" :style="{ ...state.track, width, height, borderRadius: border }" :class="cn('absolute top-0 left-0 bg-primary', radius, indicatorClassName)" /><motion.span v-else-if="active" key="layout" data-tabs-indicator="" :layout-id="`${state.id}-indicator`" layout :transition="reduced ? { duration: 0 } : TABS_TRANSITION" :style="{ borderRadius: border }" :class="cn('absolute inset-0 bg-primary', radius, indicatorClassName)" /><button :id="state.tabId(value)" :aria-controls="state.panels.value.has(value) ? state.panelId(value) : undefined" :tabindex="tabIndex" v-bind="$attrs" type="button" role="tab" :aria-selected="active" :disabled="disabled" :data-tabs-value="value" @click="select" :class="cn('relative z-10 inline-flex items-center justify-center whitespace-nowrap bg-transparent px-3.5 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring text-muted-foreground hover:text-foreground', radius, $attrs.class as string)"><TriggerContent :active="active" :icon="icon"><template v-if="$slots.icon" #icon><slot name="icon" /></template><slot /></TriggerContent><span data-tabs-label="" aria-hidden="true" inert class="pointer-events-none absolute inset-0 inline-flex items-center justify-center text-primary-foreground [gap:inherit] [padding:inherit]" :style="{ clipPath: initialClip }"><TriggerContent :active="active" :icon="icon"><template v-if="$slots.icon" #icon><slot name="icon" /></template><slot /></TriggerContent></span></button></div>
</template>
