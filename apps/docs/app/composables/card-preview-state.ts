import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  type Ref,
} from "vue";
export function createCardPreview(
  card: Ref<HTMLElement | null>,
  viewport: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
) {
  const visible = ref(false),
    hovered = ref(false),
    measured = ref(false),
    fit = ref(0.22);
  const scale = computed(
    () => Math.min(0.82, fit.value) * (hovered.value ? 1.05 : 1),
  );
  let observer: ResizeObserver | undefined;
  let intersection: IntersectionObserver | undefined;
  let mutation: MutationObserver | undefined;
  let frame: number | undefined;
  let disposed = false;
  function measure() {
    const outer = viewport.value,
      stage = content.value;
    if (disposed || !outer || !stage) return;
    const sizes = [stage, ...stage.children].map((node) => {
      const box = node as HTMLElement;
      return [
        Math.max(box.offsetWidth, box.scrollWidth),
        Math.max(box.offsetHeight, box.scrollHeight),
      ] as const;
    });
    const width = Math.max(...sizes.map((size) => size[0])),
      height = Math.max(...sizes.map((size) => size[1]));
    if (!outer.clientWidth || !outer.clientHeight || !width || !height) return;
    fit.value = Math.max(
      0.22,
      Math.min(
        (outer.clientWidth * 0.94) / width,
        (outer.clientHeight * 0.94) / height,
      ),
    );
    measured.value = true;
  }
  function schedule() {
    if (frame !== undefined || disposed) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      measure();
    });
  }
  onMounted(() => {
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(schedule);
      for (const node of [viewport.value, content.value])
        if (node) observer.observe(node);
    }
    if (typeof MutationObserver !== "undefined" && content.value) {
      mutation = new MutationObserver(schedule);
      mutation.observe(content.value, { childList: true, subtree: true });
    }
    if (typeof IntersectionObserver !== "undefined" && card.value) {
      intersection = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visible.value = true;
          intersection?.disconnect();
          void nextTick(schedule);
        }
      });
      intersection.observe(card.value);
    } else visible.value = true;
    window.addEventListener("resize", schedule);
    void nextTick(schedule);
  });
  onBeforeUnmount(() => {
    disposed = true;
    observer?.disconnect();
    intersection?.disconnect();
    mutation?.disconnect();
    window.removeEventListener("resize", schedule);
    if (frame !== undefined) cancelAnimationFrame(frame);
  });
  return { visible, hovered, measured, scale };
}
