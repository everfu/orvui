<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { X } from "lucide-vue-next";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useSearchContext } from "../../_combobox/controller";
withDefaults(defineProps<{ placeholder?: string; chipClassName?: string }>(), {
  placeholder: "Select options",
});
const state = useSearchContext(true, "MultiSelectValue");
const resting = {
  opacity: 1,
  clipPath: "inset(0 0 0 0% round 0.5rem)",
  transform: "translateY(0px) scale(1)",
};
const enter = computed(() => ({
  ...resting,
  opacity: 0,
  transform: state.reduce.value
    ? resting.transform
    : "translateY(6px) scale(0.92)",
}));
const leave = computed(() => ({
  ...resting,
  clipPath: state.reduce.value
    ? resting.clipPath
    : "inset(0 0 0 100% round 0.5rem)",
  transition: {
    clipPath: { duration: state.reduce.value ? 0 : 0.16, ease: EASE_OUT },
    transform: { duration: 0 },
  },
}));
const transition = computed(() => ({
  layout: state.reduce.value ? { duration: 0 } : SPRING_LAYOUT,
  opacity: { duration: 0.18, ease: EASE_OUT },
  transform: state.reduce.value ? { duration: 0 } : SPRING_SWAP,
}));
function remove(value: string) {
  if (!state.disabled.value) {
    state.remove(value);
    state.focusInput();
  }
}
</script>
<template>
  <div class="contents">
    <AnimatePresence :initial="false" mode="popLayout"
      ><span
        v-if="!state.values.value.length && !state.open.value"
        key="placeholder"
        class="text-muted-foreground"
        >{{ placeholder }}</span
      ><motion.span
        v-for="value in state.values.value"
        :key="value"
        :layout="state.reduce.value ? false : 'position'"
        :initial="enter"
        :animate="resting"
        :exit="leave"
        :transition="transition"
        :class="
          cn(
            'inline-flex h-7 max-w-full items-center gap-1 rounded-lg bg-muted px-2 text-xs font-medium text-foreground',
            chipClassName,
          )
        "
        ><span class="truncate"
          ><slot :value="value" :label="state.labelFor(value)">{{
            state.labelFor(value)
          }}</slot></span
        ><button
          type="button"
          data-multi-select-remove=""
          :aria-label="'Remove ' + state.labelFor(value)"
          :disabled="state.disabled.value"
          @pointerdown.stop
          @click.stop="remove(value)"
          class="-mr-1 grid size-5 shrink-0 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" class="size-3" :stroke-width="2.5" /></button></motion.span
    ></AnimatePresence>
  </div>
</template>
