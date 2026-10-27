import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from "vue";
export function useIslandSize(view: Ref<string | null>) {
  const sizer = ref<HTMLDivElement>(),
    size = ref<{ width: number; height: number } | null>(null);
  let observer: ResizeObserver | undefined,
    disposed = false;
  const measure = () => {
    const element = sizer.value;
    if (!element || disposed) return;
    const width = element.offsetWidth,
      height = element.offsetHeight;
    if (width !== size.value?.width || height !== size.value?.height)
      size.value = { width, height };
  };
  const target = computed(() => ({
    width: `${size.value?.width ?? 126}px`,
    height: `${size.value?.height ?? 37}px`,
  }));
  watch(view, () => void nextTick(measure));
  onMounted(() => {
    measure();
    if (sizer.value && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(sizer.value);
    }
  });
  onBeforeUnmount(() => {
    disposed = true;
    observer?.disconnect();
  });
  return { sizer, target };
}
