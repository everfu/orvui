<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, inject, watchEffect, type Ref } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT } from "../../../lib/ease";

const props = defineProps<{ width: number; height: number; alt: string; src: string; draggable?: boolean }>();
const aspect = inject<Ref<{ ratio: number; animated: boolean }>>("orvui-aspect");
if (!aspect) throw new Error("AspectRatioImage must be inside AspectRatio");
watchEffect(() => {
  const valid = [props.width, props.height].every(dimension => Number.isFinite(dimension) && dimension > 0);
  if (!valid) throw new RangeError("AspectRatioImage: width and height must be finite, positive numbers.");
});
const coverWidth = computed(() => aspect.value.ratio >= props.width / props.height);
const imageSize = computed(() => ({ width: coverWidth.value ? "100%" : "auto", height: coverWidth.value ? "auto" : "100%" }));
</script>

<template>
  <div class="absolute inset-0 grid grid-cols-1 grid-rows-1 place-items-center">
    <motion.img v-bind="$attrs" :src="src" :alt="alt" :width="width" :height="height"
      :draggable="draggable ?? false" :layout="aspect.animated" :transition="{ layout: SPRING_LAYOUT }"
      :class="cn('col-start-1 row-start-1 block max-w-none', $attrs.class as string)" :style="imageSize" />
  </div>
</template>
