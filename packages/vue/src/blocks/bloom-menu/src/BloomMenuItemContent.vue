<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { animate, motion, useMotionValue } from "motion-v";
const props = defineProps<{ reduce: boolean; delay: number }>();
defineSlots<{ default(): unknown }>();
const opacity = useMotionValue(0);
const scale = useMotionValue(props.reduce ? 1 : 0.85);
const filter = useMotionValue(props.reduce ? "blur(0px)" : "blur(6px)");
let animations: ReturnType<typeof animate>[] = [];
onMounted(() => {
  const transition = {
    delay: props.reduce ? 0 : props.delay,
    type: "spring" as const,
    stiffness: 440,
    damping: 34,
  };
  // Keep the final values in the rendered style through animation cleanup.
  animations = [
    animate(opacity, 1, transition),
    animate(scale, 1, transition),
    animate(filter, "blur(0px)", transition),
  ];
});
onBeforeUnmount(() => animations.forEach((animation) => animation.stop()));
</script>
<template>
  <motion.span
    :style="{ opacity, scale, filter }"
    class="flex flex-col items-center gap-2"
    ><slot
  /></motion.span>
</template>
