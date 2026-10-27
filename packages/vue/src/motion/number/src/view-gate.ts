import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";

/** A one-shot viewport gate shared by the two number renderers. */
export function useNumberViewGate(element: Ref<HTMLElement | null>, startOnView: () => boolean) {
  const ready = ref(!startOnView());
  let mounted = false, observer: IntersectionObserver | undefined;
  function arm() {
    if (!mounted || ready.value) return;
    observer?.disconnect();
    if (!startOnView() || !element.value || typeof IntersectionObserver === "undefined") { ready.value = true; return; }
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { ready.value = true; observer?.disconnect(); }
    }, { threshold: 0.6 });
    observer.observe(element.value);
  }
  onMounted(() => { mounted = true; arm(); });
  watch(startOnView, arm);
  onBeforeUnmount(() => { mounted = false; observer?.disconnect(); });
  return ready;
}
