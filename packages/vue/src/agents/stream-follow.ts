import {
  onBeforeUnmount,
  onMounted,
  watch,
  type Ref,
  type WatchSource,
} from "vue";

/** Follow a caller-owned stream only after mount; one queued scroll owns each frame. */
export function useStreamFollow(
  element: Ref<HTMLElement | undefined>,
  enabled: () => boolean,
  reduced: Ref<boolean>,
  changes: WatchSource[],
) {
  let mounted = false;
  let pending: number | undefined;
  const clear = () => {
    if (pending !== undefined) cancelAnimationFrame(pending);
    pending = undefined;
  };
  function schedule() {
    clear();
    if (!mounted || !enabled()) return;
    pending = requestAnimationFrame(() => {
      pending = undefined;
      const viewport = element.value;
      if (
        !mounted ||
        !enabled() ||
        !viewport ||
        viewport.scrollHeight <= viewport.clientHeight
      )
        return;
      if (typeof viewport.scrollTo === "function")
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: reduced.value ? "auto" : "smooth",
        });
      else viewport.scrollTop = viewport.scrollHeight;
    });
  }
  watch(changes, schedule, { deep: true, flush: "post" });
  onMounted(() => {
    mounted = true;
    schedule();
  });
  onBeforeUnmount(() => {
    mounted = false;
    clear();
  });
  return schedule;
}
