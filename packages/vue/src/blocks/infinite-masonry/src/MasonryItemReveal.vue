<script setup lang="ts">
import { onMounted } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_PANEL } from "../../../lib/ease";
const props = defineProps<{
  itemKey: string | number | bigint;
  lane: number;
  revealed: Set<string | number | bigint>;
  animate: boolean;
}>();
const enter = props.animate && !props.revealed.has(props.itemKey),
  delay = Math.min(props.lane, 3) * 0.04;
const transition = {
  y: { ...SPRING_PANEL, delay },
  opacity: { duration: 0.2, ease: EASE_OUT, delay },
};
onMounted(() => props.revealed.add(props.itemKey));
</script>
<template>
  <motion.div
    :initial="enter ? { opacity: 0, y: 12 } : false"
    :animate="{ opacity: 1, y: 0 }"
    :transition="transition"
    ><slot
  /></motion.div>
</template>
