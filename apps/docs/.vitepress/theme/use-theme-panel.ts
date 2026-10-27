import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { resolveElement, useFloatingLayer } from "../../../../packages/vue/src/lib/composables";
export function useThemePanel(isOpen: () => boolean, dismiss: (restore: boolean) => void) {
  const trigger = ref<HTMLButtonElement | null>(null), panel = ref<HTMLElement | null>(null);
  const mounted = ref(false), positioned = ref(false);
  const position = ref({ left: "0px", top: "0px", transformOrigin: "top right" });
  const layer = useFloatingLayer(computed(isOpen), panel);
  let resize: ResizeObserver | undefined;
  let generation = 0;
  function place() {
    const surface = resolveElement(panel.value), anchor = trigger.value;
    if (!isOpen() || !surface || !anchor) return;
    const box = anchor.getBoundingClientRect(), view = window.visualViewport;
    const viewport = { x: view?.offsetLeft ?? 0, y: view?.offsetTop ?? 0, width: view?.width ?? innerWidth, height: view?.height ?? innerHeight };
    const left = Math.max(viewport.x + 8, Math.min(box.right - surface.offsetWidth, viewport.x + viewport.width - surface.offsetWidth - 8));
    const above = box.bottom + 8 + surface.offsetHeight > viewport.y + viewport.height - 8 && box.top - viewport.y > viewport.y + viewport.height - box.bottom;
    const top = Math.max(viewport.y + 8, above ? box.top - surface.offsetHeight - 8 : box.bottom + 8);
    const x = Math.max(0, Math.min(surface.offsetWidth, box.left + box.width / 2 - left));
    position.value = { left: `${left}px`, top: `${top}px`, transformOrigin: `${x}px ${above ? "bottom" : "top"}` };
    positioned.value = true;
  }
  async function prepare() {
    const token = ++generation;
    resize?.disconnect();
    const surface = resolveElement(panel.value);
    if (!isOpen()) {
      if (surface) { surface.inert = true; surface.style.pointerEvents = "none"; surface.setAttribute("aria-hidden", "true"); }
      return;
    }
    positioned.value = false;
    await nextTick();
    if (!mounted.value || !isOpen() || token !== generation) return;
    const content = resolveElement(panel.value);
    if (!content) return;
    content.inert = false; content.style.pointerEvents = "auto"; content.removeAttribute("aria-hidden");
    place(); resize?.observe(content); if (trigger.value) resize?.observe(trigger.value);
    await nextTick();
    if (mounted.value && isOpen() && token === generation) content.querySelector<HTMLButtonElement>('[data-theme-option][aria-pressed="true"]')?.focus({ preventScroll: true });
  }
  function outside(event: Event) {
    const target = event.target as Node | null;
    if (isOpen() && layer.isTop() && target && !trigger.value?.contains(target) && !resolveElement(panel.value)?.contains(target) && !layer.containsHigher(target)) dismiss(false);
  }
  const key = (event: KeyboardEvent) => { if (layer.claimEscape(event)) dismiss(true); };
  function events() { return [[document, "pointerdown", outside], [document, "focusin", outside], [document, "keydown", key], [window, "resize", place], [window, "scroll", place, true], [window.visualViewport, "resize", place], [window.visualViewport, "scroll", place]] as const; }
  watch(isOpen, prepare, { flush: "sync" });
  onMounted(() => {
    mounted.value = true;
    if (typeof ResizeObserver !== "undefined") resize = new ResizeObserver(place);
    for (const [node, type, listener, capture] of events()) node?.addEventListener(type, listener as EventListener, capture);
    if (isOpen()) void prepare();
  });
  onBeforeUnmount(() => {
    mounted.value = false; ++generation; resize?.disconnect();
    for (const [node, type, listener, capture] of events()) node?.removeEventListener(type, listener as EventListener, capture);
  });
  return { trigger, panel, mounted, positioned, position };
}
