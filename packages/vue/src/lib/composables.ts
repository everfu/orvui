import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { layerManager, type Layer } from "./layers";

export function useControllable<T>(props: Record<string, any>, key: string, emit: (...args: any[]) => void, fallback: T) {
  const local = ref<T>(fallback) as Ref<T>;
  const read = () => props[key] as T | undefined;
  return computed<T>({
    get() { const supplied = read(); return supplied === undefined ? local.value : supplied; },
    set(value) { if (read() === undefined) local.value = value; emit(`update:${key}`, value); },
  });
}

export function useMediaQuery(query: string) {
  const matches = ref(false);
  let disconnect: (() => void) | undefined;
  onMounted(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(query);
    const update = () => { matches.value = media.matches; };
    update();
    media.addEventListener?.("change", update);
    disconnect = () => media.removeEventListener?.("change", update);
  });
  onBeforeUnmount(() => disconnect?.());
  return matches;
}
export function useReducedMotion() { return useMediaQuery("(prefers-reduced-motion: reduce)"); }

const lockedProperties = ["overflow", "position", "top", "left", "right", "width"] as const;
let scrollOwners = 0;
let unlockPage: (() => void) | undefined;
function acquirePage() {
  if (scrollOwners++ === 0) {
    const body = document.body.style;
    const saved = lockedProperties.map(name => ({ name, value: body.getPropertyValue(name), priority: body.getPropertyPriority(name) }));
    const x = window.scrollX, y = window.scrollY;
    body.setProperty("overflow", "hidden");
    body.setProperty("position", "fixed");
    body.setProperty("left", `${-x}px`);
    body.setProperty("top", `${-y}px`);
    body.setProperty("right", "0px");
    body.setProperty("width", "100%");
    unlockPage = () => {
      for (const entry of saved) {
        if (entry.value) body.setProperty(entry.name, entry.value, entry.priority);
        else body.removeProperty(entry.name);
      }
      const root = document.documentElement.style;
      const behavior = root.getPropertyValue("scroll-behavior");
      const priority = root.getPropertyPriority("scroll-behavior");
      root.setProperty("scroll-behavior", "auto");
      window.scrollTo(x, y);
      if (behavior) root.setProperty("scroll-behavior", behavior, priority);
      else root.removeProperty("scroll-behavior");
    };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--scrollOwners === 0) { unlockPage?.(); unlockPage = undefined; }
  };
}
export function useScrollLock(locked: Ref<boolean>) {
  let mounted = false;
  let release: (() => void) | undefined;
  const update = (value: boolean) => {
    if (!mounted) return;
    if (value && !release) release = acquirePage();
    if (!value && release) { release(); release = undefined; }
  };
  onMounted(() => { mounted = true; update(locked.value); });
  watch(locked, update);
  onBeforeUnmount(() => { release?.(); release = undefined; mounted = false; });
}

export function resolveElement<T extends Element = HTMLElement>(value: unknown): T | null {
  if (!value) return null;
  const unwrapped = (value as { $el?: unknown }).$el ?? value;
  return typeof (unwrapped as Element).nodeType === "number" && (unwrapped as Element).nodeType === 1 ? unwrapped as T : null;
}
const focusable = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function createLayer(modal: boolean, panel?: { readonly value: unknown }): Layer {
  return { key: Symbol("orvui-layer"), modal, owner: getCurrentInstance(), surface: () => resolveElement(panel?.value), returnTo: null };
}
export function useOverlay(open: Ref<boolean>, panel: Ref<HTMLElement | null>, close: () => void, initialFocus?: () => HTMLElement | undefined) {
  const layer = createLayer(true, panel);
  let mounted = false;
  let revision = 0;
  const sync = async (value: boolean) => {
    const current = ++revision;
    if (!mounted) return;
    if (!value) { layerManager.detach(layer, true); return; }
    if (!layerManager.attach(layer)) return;
    await nextTick();
    if (!mounted || current !== revision || !open.value || !layerManager.top(layer)) return;
    (initialFocus?.() ?? layer.surface()?.querySelector<HTMLElement>(focusable) ?? layer.surface())?.focus({ preventScroll: true });
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !open.value) return;
    if (event.key === "Escape" && layerManager.top(layer)) {
      event.preventDefault(); event.stopPropagation(); close(); return;
    }
    if (event.key !== "Tab" || !layerManager.modal(layer)) return;
    const candidates = new Set<HTMLElement>();
    for (const surface of layerManager.scopes(layer)) {
      for (const node of surface.querySelectorAll<HTMLElement>(focusable)) {
        if (node.getClientRects().length > 0 && !node.closest("[inert]")) candidates.add(node);
      }
    }
    event.preventDefault();
    const nodes = [...candidates];
    if (!nodes.length) { layer.surface()?.focus(); return; }
    const position = nodes.indexOf(document.activeElement as HTMLElement);
    const next = position < 0 ? (event.shiftKey ? nodes.length - 1 : 0) : (position + (event.shiftKey ? -1 : 1) + nodes.length) % nodes.length;
    nodes[next].focus();
  };
  useScrollLock(open);
  onMounted(() => { mounted = true; document.addEventListener("keydown", onKey); void sync(open.value); });
  watch(open, value => void sync(value));
  onBeforeUnmount(() => { mounted = false; revision++; document.removeEventListener("keydown", onKey); layerManager.detach(layer, true); });
  return {
    isTop: () => open.value && layerManager.top(layer),
    containsHigher: (target: EventTarget | null) => layerManager.higher(layer, target),
    containsOwnedPortal: (target: HTMLElement) => layerManager.containsPortal(layer.owner, target),
  };
}
export function useFloatingLayer(open: Ref<boolean>, panel?: { readonly value: unknown }) {
  const layer = createLayer(false, panel);
  let mounted = false;
  let unregister: (() => void) | undefined;
  const sync = (value: boolean) => {
    if (!mounted) return;
    if (value) layerManager.attach(layer); else layerManager.detach(layer, false);
  };
  onMounted(() => { mounted = true; unregister = layerManager.portal(layer.owner, layer.surface); sync(open.value); });
  watch(open, sync, { flush: "sync" });
  onBeforeUnmount(() => { mounted = false; unregister?.(); layerManager.detach(layer, false); });
  const isTop = () => open.value && layerManager.top(layer);
  return {
    isTop,
    claimEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented || !isTop()) return false;
      event.preventDefault(); event.stopImmediatePropagation(); return true;
    },
    containsHigher: (target: EventTarget | null) => layerManager.higher(layer, target),
  };
}
export function useEventListener(target: () => EventTarget | null | undefined, event: string, handler: EventListener, options?: AddEventListenerOptions) {
  let remove: (() => void) | undefined;
  onMounted(() => { const element = target(); element?.addEventListener(event, handler, options); remove = () => element?.removeEventListener(event, handler, options); });
  onBeforeUnmount(() => remove?.());
}
