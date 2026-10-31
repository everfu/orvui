import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from "vue";
import { animate, useMotionValue } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";

const folded = "inset(48% 48% 48% 48% round 30px)";
const unfolded = "inset(0% 0% 0% 0% round 30px)";
const morph = { duration: 0.43, ease: [0.2, 0, 0.2, 1] as const };

export function useCenterSurface(open: Ref<boolean>, reduced: Ref<boolean>) {
  const present = ref(open.value);
  const clipPath = useMotionValue(reduced.value ? unfolded : folded);
  const opacity = useMotionValue(reduced.value ? 0 : 1);
  const backdropOpacity = useMotionValue(0);
  const closeOpacity = useMotionValue(0);
  const closeScale = useMotionValue(reduced.value ? 1 : 0.8);
  let animations: ReturnType<typeof animate>[] = [];
  let mounted = false,
    initialized = false,
    revision = 0;
  function stop() {
    animations.forEach((animation) => animation.stop());
    animations = [];
  }
  async function run(opened: boolean) {
    const token = ++revision;
    stop();
    if (!mounted) return;
    if (opened) {
      if (!present.value || !initialized) {
        clipPath.jump(reduced.value ? unfolded : folded);
        opacity.jump(reduced.value ? 0 : 1);
        backdropOpacity.jump(0);
        closeOpacity.jump(0);
        closeScale.jump(reduced.value ? 1 : 0.8);
      }
      initialized = true;
      present.value = true;
      await nextTick();
      if (!mounted || token !== revision) return;
    } else if (!present.value) return;
    if (reduced.value) {
      clipPath.jump(unfolded);
      closeScale.jump(1);
    }
    // Keep the final clip in the rendered style when the opening animation ends.
    const done = () => {
      if (mounted && token === revision && !opened && !open.value)
        present.value = false;
    };
    animations = [
      animate(clipPath, opened || reduced.value ? unfolded : folded, {
        ...(reduced.value ? { duration: 0 } : morph),
        onComplete: reduced.value ? undefined : done,
      }),
      animate(opacity, reduced.value && !opened ? 0 : 1, {
        duration: reduced.value ? 0.14 : 0,
        ease: EASE_OUT,
        onComplete: reduced.value ? done : undefined,
      }),
      animate(backdropOpacity, opened ? 1 : 0, {
        duration: reduced.value ? 0.1 : 0.28,
        ease: EASE_OUT,
      }),
      animate(closeOpacity, opened ? 1 : 0, {
        delay: opened && !reduced.value ? 0.16 : 0,
        duration: opened ? (reduced.value ? 0.12 : 0.2) : 0.1,
        ease: EASE_OUT,
      }),
      animate(closeScale, opened || reduced.value ? 1 : 0.88, {
        delay: opened && !reduced.value ? 0.16 : 0,
        duration: opened ? (reduced.value ? 0.12 : 0.2) : 0.1,
        ease: EASE_OUT,
      }),
    ];
  }
  watch(
    [open, reduced],
    ([opened]) => {
      void run(opened);
    },
    { flush: "sync" },
  );
  onMounted(() => {
    mounted = true;
    if (open.value) void run(true);
  });
  onBeforeUnmount(() => {
    mounted = false;
    ++revision;
    stop();
  });
  return {
    present,
    clipPath,
    opacity,
    backdropOpacity,
    closeOpacity,
    closeScale,
  };
}
