<script setup lang="ts">
import { computed, onMounted, onUnmounted, watchEffect } from "vue";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_GLIDE } from "../../../lib/ease";
import LiquidSurface from "./LiquidSurface.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  id: string;
  targetLeft: number;
  dragging: boolean;
  dragLeft: MotionValue<number>;
  surfaceLeft: MotionValue<number>;
  reduce: boolean;
  active: boolean;
  anyDragging: boolean;
  surfaceHost: HTMLElement | null;
  surfaceWidth: number;
  tabWidth: number;
  surfaceClassName?: string;
  zIndex: number;
}>();
const emit = defineEmits<{
  register: [id: string, position: MotionValue<number> | null];
}>();
const target = useMotionValue(props.targetLeft),
  position = useSpring(target, SPRING_GLIDE);
const translate = (value: number) => `translate3d(${value}px,0,0)`;
const settled = useTransform(position, translate),
  instant = useTransform(target, translate),
  dragged = useTransform(props.dragLeft, translate);
watchEffect(() => {
  target.set(props.targetLeft);
  if (props.reduce) position.jump(props.targetLeft);
});
const transform = computed(() =>
  props.dragging ? dragged : props.reduce ? instant : settled,
);
const driver = computed(() =>
  !props.anyDragging
    ? props.surfaceLeft
    : props.dragging
      ? props.dragLeft
      : position,
);
onMounted(() => emit("register", props.id, position));
onUnmounted(() => emit("register", props.id, null));
</script>
<template>
  <Teleport v-if="active && surfaceHost && surfaceWidth > 32" :to="surfaceHost"
    ><svg
      aria-hidden="true"
      focusable="false"
      :viewBox="`0 0 ${surfaceWidth} 108`"
      preserveAspectRatio="none"
      :class="
        cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[108px] w-full text-[#fafaf8]',
          dragging ? 'z-20' : 'z-0',
          surfaceClassName,
        )
      "
    >
      <LiquidSurface
        :key="anyDragging ? (dragging ? 'dragged' : 'displaced') : 'idle'"
        :left="driver"
        :surface-width="surfaceWidth"
        :tab-width="tabWidth"
      /></svg
  ></Teleport>
  <motion.div
    v-bind="$attrs"
    :style="{ zIndex, transform }"
    :class="
      cn(
        'group absolute left-0 top-0 flex touch-pan-y select-none items-stretch [-webkit-touch-callout:none]',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
      )
    "
    ><slot
  /></motion.div>
</template>
