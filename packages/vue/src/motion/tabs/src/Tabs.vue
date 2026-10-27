<script setup lang="ts">
import { computed, provide, ref, shallowRef, useId } from "vue";
import { motion, useSpring } from "motion-v";
import { useMotionState } from "../../state";
import { TabsContext, TABS_TRANSITION } from "./context";
const props = withDefaults(defineProps<{ modelValue?: string; defaultValue?: string; variant?: "pill" | "underline" | "segment"; icons?: "always" | "selected" }>(), { defaultValue: "", variant: "pill", icons: "always" });
const emit = defineEmits(["update:modelValue", "change"]);
const value = useMotionState(props, emit, "modelValue", props.defaultValue);
const id = useId();
const track = { x: useSpring(0, TABS_TRANSITION), y: useSpring(0, TABS_TRANSITION), width: useSpring(0, TABS_TRANSITION), height: useSpring(0, TABS_TRANSITION) };
const placed = ref(false);
const tabs = shallowRef(new Map<string, boolean>());
const panels = shallowRef(new Set<string>());
function registerTab(value: string, disabled: boolean) { if (tabs.value.has(value) && tabs.value.get(value) === disabled) return; tabs.value = new Map([...tabs.value, [value, disabled]]); }
function unregisterTab(value: string) { const entries = new Map(tabs.value); entries.delete(value); tabs.value = entries; }
function registerPanel(value: string) { if (!panels.value.has(value)) panels.value = new Set([...panels.value, value]); }
function unregisterPanel(value: string) { const entries = new Set(panels.value); entries.delete(value); panels.value = entries; }
const tabStop = computed(() => { if (!tabs.value.size) return null; const enabled = [...tabs.value].filter(([, disabled]) => !disabled).map(([value]) => value); return enabled.includes(value.value) ? value.value : enabled[0] ?? ""; });
function elementId(kind: string, value: string) { return `${id}-${kind}-${value.replace(/[^\w-]/g, "_")}`; }
provide(TabsContext, { value, id, variant: computed(() => props.variant), icons: computed(() => props.icons), track, placed, tabStop, tabs, panels, registerTab, unregisterTab, registerPanel, unregisterPanel, tabId: value => elementId("tab", value), panelId: value => elementId("panel", value) });
</script>
<template><motion.div layout-root><slot /></motion.div></template>
