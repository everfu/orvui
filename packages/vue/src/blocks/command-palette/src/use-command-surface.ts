import { nextTick, onBeforeUnmount, ref, watch, type Ref } from "vue";
import { animate, useMotionValue } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";

const COMMAND_PANEL_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 40,
  mass: 0.5,
} as const;

export function useCommandSurface(open: Ref<boolean>, reduce: Ref<boolean>) {
  const present = ref(open.value);
  const opacity = useMotionValue(open.value ? 1 : 0);
  const backdropOpacity = useMotionValue(open.value ? 1 : 0);
  const y = useMotionValue(0),
    scale = useMotionValue(1);
  let animations: ReturnType<typeof animate>[] = [];
  let revision = 0;
  function stop() {
    animations.forEach((animation) => animation.stop());
    animations = [];
  }
  watch(
    open,
    async (opened) => {
      const token = ++revision;
      stop();
      if (opened) {
        opacity.jump(0);
        backdropOpacity.jump(0);
        y.jump(reduce.value ? 0 : -8);
        scale.jump(reduce.value ? 1 : 0.97);
        present.value = true;
        await nextTick();
        if (token !== revision) return;
      }
      // Drive opacity directly so native animation cleanup cannot restore zero
      // for a frame when the opening spring finishes.
      const transition = opened
        ? reduce.value
          ? { duration: 0.1 }
          : COMMAND_PANEL_SPRING
        : { duration: 0.12, ease: EASE_OUT };
      animations = [
        animate(opacity, opened ? 1 : 0, {
          ...transition,
          onComplete: () => {
            if (!opened && token === revision && !open.value)
              present.value = false;
          },
        }),
        animate(backdropOpacity, opened ? 1 : 0, {
          duration: opened ? 0.18 : 0.12,
          ease: EASE_OUT,
        }),
        animate(y, opened || reduce.value ? 0 : -8, transition),
        animate(scale, opened || reduce.value ? 1 : 0.97, transition),
      ];
    },
    { flush: "sync" },
  );
  onBeforeUnmount(() => {
    ++revision;
    stop();
  });
  return { present, opacity, backdropOpacity, y, scale };
}
