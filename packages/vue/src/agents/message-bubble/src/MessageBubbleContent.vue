<script setup lang="ts">
import { computed, inject, provide, ref, type Component } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { bubbleKey, bubbleLayoutKey } from "./context";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ as?: string | Component }>(), {
  as: "div",
});
const context = inject(
  bubbleKey,
  computed(() => ({
    align: "start" as const,
    variant: "soft" as const,
    animateIn: false,
  })),
);
const reduced = useReducedMotion();
const revision = ref(0);
provide(bubbleLayoutKey, () => {
  revision.value++;
});
const variants = {
  solid: "bg-foreground",
  soft: "bg-muted",
  tint: "bg-muted",
  outline: "border border-border/70 bg-background",
  ghost: "",
  danger: "bg-destructive/10",
};
const classes = computed(() =>
  cn(
    context.value.variant === "solid" && "text-background",
    context.value.variant === "danger" && "text-destructive",
    context.value.variant === "ghost" &&
      "w-full max-w-none rounded-none px-0 py-0",
    ["button", "a"].includes(props.as as string) &&
      "cursor-pointer text-left outline-none transition-[background-color,color,transform] duration-150 hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]",
  ),
);
</script>
<template>
  <component
    :is="as"
    data-slot="message-bubble-content"
    v-bind="$attrs"
    :class="
      cn(
        'relative z-0 min-w-9 max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 text-foreground [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-background/60 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-background/60 [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
        classes,
        $attrs.class,
      )
    "
  >
    <motion.span
      v-if="context.variant !== 'ghost'"
      aria-hidden="true"
      :layout="reduced ? false : 'size'"
      :layout-dependency="revision"
      :initial="
        context.animateIn && !reduced ? { opacity: 0, scale: 0.92 } : false
      "
      :animate="{ opacity: 1, scale: 1 }"
      :transition="
        reduced
          ? { duration: 0 }
          : {
              opacity: { duration: 0.12, ease: EASE_OUT },
              scale: {
                type: 'spring',
                stiffness: 520,
                damping: 27,
                mass: 0.52,
              },
              layout: SPRING_LAYOUT,
            }
      "
      :class="
        cn(
          'pointer-events-none absolute inset-0 -z-10 rounded-[inherit]',
          context.align === 'end'
            ? 'origin-bottom-right'
            : 'origin-bottom-left',
          variants[context.variant],
        )
      "
    />
    <motion.div
      class="relative"
      :initial="context.animateIn ? { opacity: 0 } : false"
      :animate="{ opacity: 1 }"
      :transition="{
        duration: 0.12,
        ease: EASE_OUT,
        delay: reduced ? 0 : 0.04,
      }"
      ><slot
    /></motion.div>
  </component>
</template>
