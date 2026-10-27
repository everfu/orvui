import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { resolveElement, useFloatingLayer } from "../lib/composables";

type HitTest = (target: Element) => boolean;
const openScopes = new Set<HitTest>();

export function useBlockDismiss(
  open: Ref<boolean>,
  root: Ref<unknown>,
  close: () => void,
  consume = false,
) {
  const layer = useFloatingLayer(open, root);
  const pendingClicks = new Set<() => void>();
  let stopWatching: (() => void) | undefined;
  function interceptActivation(source: Event) {
    const release = () => {
      window.removeEventListener("click", click, true);
      window.removeEventListener("pointerdown", replacement, true);
      window.removeEventListener("pointercancel", replacement, true);
      window.removeEventListener("keydown", release, true);
      pendingClicks.delete(release);
    };
    function click(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      release();
    }
    function replacement(event: Event) {
      if (event !== source) release();
    }
    pendingClicks.add(release);
    window.addEventListener("click", click, true);
    window.addEventListener("pointerdown", replacement, true);
    window.addEventListener("pointercancel", replacement, true);
    window.addEventListener("keydown", release, true);
  }
  onMounted(() => {
    stopWatching = watch(
      open,
      (visible, _, cleanup) => {
        if (!visible) return;
        const contains: HitTest = (target) =>
          resolveElement<HTMLElement>(root.value)?.contains(target) ?? false;
        const keydown = (event: KeyboardEvent) => {
          if (layer.claimEscape(event)) close();
        };
        const pointerdown = (event: PointerEvent) => {
          const target = event.target;
          if (
            !(target instanceof Element) ||
            contains(target) ||
            layer.containsHigher(target)
          )
            return;
          let anotherScope = false;
          if (consume)
            for (const hit of openScopes)
              if (hit !== contains && hit(target)) {
                anotherScope = true;
                break;
              }
          if (consume && !anotherScope) interceptActivation(event);
          close();
        };
        openScopes.add(contains);
        window.addEventListener("keydown", keydown);
        window.addEventListener("pointerdown", pointerdown, true);
        cleanup(() => {
          openScopes.delete(contains);
          window.removeEventListener("keydown", keydown);
          window.removeEventListener("pointerdown", pointerdown, true);
        });
      },
      { immediate: true },
    );
  });
  onUnmounted(() => {
    stopWatching?.();
    for (const release of pendingClicks) release();
  });
  return layer;
}
