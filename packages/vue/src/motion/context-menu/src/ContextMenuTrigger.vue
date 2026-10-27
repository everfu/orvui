<script setup lang="ts">
import { cloneVNode, defineComponent, h, mergeProps, useAttrs, useSlots } from "vue";
import { resolveElement } from "../../../lib/composables";
import { useMenu } from "./menu-state";
import { useMenuGesture } from "./menu-trigger";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ disabled?: boolean }>();
defineSlots<{ default(): unknown }>();
const ctx = useMenu(), slots = useSlots(), attrs = useAttrs();
const gesture = useMenuGesture(ctx, () => props.disabled);
const Trigger = defineComponent({ setup() { return () => {
  const children = slots.default?.() ?? [];
  const child = children.find(node => typeof node.type !== "symbol");
  const bindings = mergeProps(attrs, gesture, {
    ref: (value: unknown) => { ctx.trigger.value = resolveElement<HTMLElement>(value); },
    "aria-controls": ctx.open.value ? ctx.id : undefined,
    "aria-expanded": ctx.open.value, "aria-haspopup": "menu", class: "[-webkit-touch-callout:none]",
  });
  return child ? cloneVNode(child, bindings, true) : h("div", { ...bindings, tabindex: 0 }, children);
} } });
</script>
<template><Trigger /></template>
