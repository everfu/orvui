<script setup lang="ts">
import { Comment, computed, defineComponent, Fragment, h, isVNode, ref, useSlots, type VNode } from "vue";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{
  direction?: "left" | "right" | "up" | "down"; speed?: number; pauseOnHover?: boolean; gap?: string; fade?: boolean;
}>(), { direction: "left", speed: 30, pauseOnHover: true, gap: "1rem", fade: true });
const slots = useSlots(), reduced = useReducedMotion(), hovered = ref(false);
const vertical = computed(() => props.direction === "up" || props.direction === "down");
const reverse = computed(() => props.direction === "right" || props.direction === "down");
const running = computed(() => !reduced.value && !(hovered.value && props.pauseOnHover));
function flatten(nodes: unknown[]): VNode[] {
  return nodes.flatMap(node => {
    if (!isVNode(node) || node.type === Comment) return [];
    return node.type === Fragment && Array.isArray(node.children) ? flatten(node.children) : [node];
  });
}
const Items = defineComponent({
  setup: () => () => flatten(slots.default?.() ?? []).map((node, index) => h("div", { key: node.key ?? index, class: "shrink-0" }, [node])),
});
</script>
<template>
  <div :class="cn('group relative flex overflow-hidden', vertical ? 'flex-col' : 'flex-row', fade && (vertical
      ? '[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]'
      : '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]'))"
    :style="{ '--gap': gap, gap }" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div v-for="copy in 2" :key="copy" :aria-hidden="copy === 2" :inert="copy === 2"
      :style="{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal', animationPlayState: running ? 'running' : 'paused', gap }"
      :class="cn('flex shrink-0 items-center', vertical ? 'flex-col orvui-marquee-vertical' : 'flex-row orvui-marquee')"><Items /></div>
  </div>
</template>
<style scoped>
.orvui-marquee { animation: orvui-marquee var(--duration, 30s) linear infinite; }
.orvui-marquee-vertical { animation: orvui-marquee-vertical var(--duration, 30s) linear infinite; }
@keyframes orvui-marquee { to { transform: translateX(calc(-100% - var(--gap))); } }
@keyframes orvui-marquee-vertical { to { transform: translateY(calc(-100% - var(--gap))); } }
</style>
