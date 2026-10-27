import { isRef, nextTick, onBeforeUnmount, type Ref } from "vue";
import { resolveElement } from "../../../lib/composables";
type Options = {
  initialFocus?: HTMLElement | Ref<HTMLElement | null> | null;
  onOpenAutoFocus?: (content: HTMLDivElement) => void;
};
export function createMorphFocus(
  options: Options,
  allowed: () => boolean,
  takeIntent: () => boolean,
) {
  let epoch = 0;
  let used = false;
  let detach: (() => void) | undefined;
  let disposed = false;
  function reset() {
    ++epoch;
    used = false;
    detach?.();
    detach = undefined;
  }
  async function focus(panel: HTMLElement | null) {
    if (used || !panel || !allowed()) return;
    used = true;
    if (options.onOpenAutoFocus) {
      options.onOpenAutoFocus(panel as HTMLDivElement);
      takeIntent();
      return;
    }
    if (!takeIntent()) return;
    const version = epoch;
    await nextTick();
    if (disposed || version !== epoch || !allowed()) return;
    const document = panel.ownerDocument;
    const previous = document.activeElement;
    const untouched = () =>
      document.activeElement === previous || document.activeElement === panel;
    const first = () => {
      const initial = resolveElement<HTMLElement>(
        isRef(options.initialFocus)
          ? options.initialFocus.value
          : options.initialFocus,
      );
      const candidates = [
        initial,
        ...panel.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      ];
      for (const candidate of candidates) {
        candidate?.focus({ preventScroll: true });
        if (!untouched()) {
          candidate?.scrollIntoView?.({ block: "nearest" });
          return true;
        }
      }
      panel.focus({ preventScroll: true });
      return false;
    };
    if (first()) return;
    const wrapper = panel.parentElement;
    const cancel = () => {
      detach?.();
      detach = undefined;
    };
    const retry = (event: TransitionEvent) => {
      if (event.propertyName === "visibility" && (!untouched() || first()))
        cancel();
    };
    wrapper?.addEventListener("transitionend", retry);
    document.addEventListener("keydown", cancel, true);
    document.addEventListener("pointerdown", cancel, true);
    detach = () => {
      wrapper?.removeEventListener("transitionend", retry);
      document.removeEventListener("keydown", cancel, true);
      document.removeEventListener("pointerdown", cancel, true);
    };
  }
  onBeforeUnmount(() => {
    disposed = true;
    reset();
  });
  return { focus, reset };
}
