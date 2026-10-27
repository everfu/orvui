<script setup lang="ts">
import { computed, provide, shallowRef, useId } from "vue";
import { cn } from "../../../lib/utils";
import { useMotionState } from "../../state";
import type { RadioContext } from "./context";

const props = withDefaults(defineProps<{
  modelValue?: string; defaultValue?: string; orientation?: "vertical" | "horizontal"; name?: string;
}>(), { defaultValue: "", orientation: "vertical" });
const emit = defineEmits(["update:modelValue", "change"]);
const selected = useMotionState(props, emit, "modelValue", props.defaultValue);
const instanceId = useId();
const registry = shallowRef(new Map<string, boolean>());
const tabStop = computed(() => {
  const enabled = [...registry.value].filter(([, disabled]) => !disabled).map(([key]) => key);
  if (!registry.value.size) return null;
  return enabled.includes(selected.value) ? selected.value : enabled[0] ?? "";
});
const context: RadioContext = {
  value: selected, id: instanceId, name: computed(() => props.name ?? instanceId), tabStop,
  register(key, disabled) {
    if (registry.value.has(key) && registry.value.get(key) === disabled) return;
    registry.value = new Map([...registry.value, [key, disabled]]);
  },
  unregister(key) {
    const remaining = new Map(registry.value);
    remaining.delete(key);
    registry.value = remaining;
  },
  setValue(next) { selected.value = next; },
};
provide("orvui-radio", context);
function navigate(event: KeyboardEvent) {
  if (event.defaultPrevented) return;
  const root = event.currentTarget as HTMLElement;
  const controls = [...root.querySelectorAll<HTMLButtonElement>('[role="radio"]')]
    .filter(control => !control.disabled && control.closest('[role="radiogroup"]') === root);
  const active = event.target === root ? root.ownerDocument.activeElement : event.target;
  const index = controls.indexOf(active as HTMLButtonElement);
  if (index < 0 || !controls.length) return;
  let destination: number;
  switch (event.key) {
    case "Home": destination = 0; break;
    case "End": destination = controls.length - 1; break;
    case "ArrowRight": case "ArrowDown": destination = (index + 1) % controls.length; break;
    case "ArrowLeft": case "ArrowUp": destination = (index + controls.length - 1) % controls.length; break;
    default: return;
  }
  event.preventDefault();
  controls[destination]!.focus();
  controls[destination]!.click();
}
</script>

<template>
  <div role="radiogroup" :aria-orientation="orientation" @keydown="navigate"
    :class="cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap', $attrs.class)">
    <slot />
  </div>
</template>
