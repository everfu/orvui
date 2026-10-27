import { onBeforeUnmount, watch, type Ref } from "vue";
/** Exit animations retain DOM; their controls stop receiving input immediately. */
export function useExitInteractivity(open: Ref<boolean>, surfaces: Ref<HTMLElement | null>[], inert: Ref<HTMLElement | null>[] = []) {
  const saved = new Map<HTMLElement, { pointer: string; inert: boolean }>();
  watch([open, ...surfaces, ...inert], () => {
    if (open.value) {
      saved.forEach((previous, element) => { element.style.pointerEvents = previous.pointer; element.inert = previous.inert; });
      saved.clear();
      return;
    }
    [...surfaces, ...inert].forEach(reference => {
      const element = reference.value;
      if (!element) return;
      if (!saved.has(element)) saved.set(element, { pointer: element.style.pointerEvents, inert: element.inert });
      if (surfaces.includes(reference)) element.style.pointerEvents = "none";
      if (inert.includes(reference)) element.inert = true;
    });
  }, { flush: "sync" });
  onBeforeUnmount(() => saved.clear());
}
