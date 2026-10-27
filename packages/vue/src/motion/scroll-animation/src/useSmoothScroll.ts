import { inject, onBeforeUnmount, onMounted, shallowRef, watch, type InjectionKey, type Ref } from "vue";
import Lenis from "lenis";
import { useMotionValue, type MotionValue } from "motion-v";
import { resolveElement, useReducedMotion } from "../../../lib/composables";

export type ScrollTarget = number | string | HTMLElement;
export type ScrollToOptions = { offset?: number; immediate?: boolean; duration?: number };
export interface SmoothScrollApi {
  readonly lenis: Lenis | null;
  scrollY: MotionValue<number>;
  progress: MotionValue<number>;
  velocity: MotionValue<number>;
  scrollTo(target: ScrollTarget, options?: ScrollToOptions): void;
}
export interface SmoothScrollOptions {
  root?: boolean; lerp?: number; duration?: number; orientation?: "vertical" | "horizontal";
  wheelMultiplier?: number; touch?: boolean; enabled?: boolean;
}
export const SmoothScrollKey: InjectionKey<SmoothScrollApi> = Symbol("orvui-smooth-scroll");

export function createScrollApi(props: SmoothScrollOptions, container?: Ref<HTMLElement | null>, content?: Ref<HTMLElement | null>): SmoothScrollApi {
  const reduced = useReducedMotion();
  const engine = shallowRef<Lenis | null>(null);
  const scrollY = useMotionValue(0), progress = useMotionValue(0), velocity = useMotionValue(0);
  let mounted = false;
  let removeListener: (() => void) | undefined;
  const horizontal = () => props.orientation === "horizontal";
  function wrapper(): Window | HTMLElement {
    return props.root === false ? resolveElement<HTMLElement>(container?.value) ?? window : window;
  }
  function nativePosition(surface: Window | HTMLElement) {
    return surface === window
      ? horizontal() ? window.scrollX : window.scrollY
      : horizontal() ? (surface as HTMLElement).scrollLeft : (surface as HTMLElement).scrollTop;
  }
  function syncNative(surface: Window | HTMLElement) {
    let last = nativePosition(surface), lastTime = performance.now();
    const sync = () => {
      const now = performance.now(), position = nativePosition(surface);
      const element = surface === window ? document.documentElement : surface as HTMLElement;
      const extent = horizontal() ? element.scrollWidth : element.scrollHeight;
      const visible = surface === window ? horizontal() ? window.innerWidth : window.innerHeight
        : horizontal() ? element.clientWidth : element.clientHeight;
      scrollY.set(position);
      progress.set(extent > visible ? position / (extent - visible) : 0);
      velocity.set((position - last) * 16 / (now - lastTime || 16));
      last = position;
      lastTime = now;
    };
    sync();
    surface.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => { surface.removeEventListener("scroll", sync); window.removeEventListener("resize", sync); };
  }
  function clear() {
    removeListener?.();
    removeListener = undefined;
    engine.value?.destroy();
    engine.value = null;
  }
  function configure() {
    if (!mounted) return;
    clear();
    if (reduced.value || props.enabled === false) {
      removeListener = syncNative(wrapper());
      return;
    }
    const instance = new Lenis({
      wrapper: props.root === false ? resolveElement<HTMLElement>(container?.value) ?? undefined : undefined,
      content: props.root === false ? resolveElement<HTMLElement>(content?.value) ?? undefined : undefined,
      lerp: props.lerp ?? 0.1, duration: props.duration ?? 1.2,
      orientation: props.orientation ?? "vertical", wheelMultiplier: props.wheelMultiplier ?? 1,
      smoothWheel: true, syncTouch: props.touch ?? false, autoRaf: true,
      easing: time => Math.min(1, 1.001 - 2 ** (-10 * time)),
    });
    engine.value = instance;
    const receive = (position: Lenis) => {
      scrollY.set(position.scroll);
      progress.set(position.progress);
      velocity.set(position.velocity);
    };
    instance.on("scroll", receive);
    removeListener = () => instance.off("scroll", receive);
  }
  function nativeTarget(target: ScrollTarget, offset: number) {
    const surface = wrapper();
    if (typeof target === "number") return target + offset;
    const scope = surface === window ? document : surface as HTMLElement;
    let element: HTMLElement | null;
    try { element = typeof target === "string" ? scope.querySelector<HTMLElement>(target) : target; }
    catch { return nativePosition(surface); }
    if (!element) return nativePosition(surface);
    const bounds = element.getBoundingClientRect();
    const coordinate = horizontal() ? bounds.left : bounds.top;
    if (surface === window) return coordinate + nativePosition(surface) + offset;
    const parentBounds = (surface as HTMLElement).getBoundingClientRect();
    return coordinate - (horizontal() ? parentBounds.left : parentBounds.top) + nativePosition(surface) + offset;
  }
  onMounted(() => { mounted = true; configure(); });
  watch([
    reduced, () => props.root, () => props.enabled, () => props.lerp, () => props.duration,
    () => props.orientation, () => props.wheelMultiplier, () => props.touch,
    () => container?.value, () => content?.value,
  ], configure, { flush: "post" });
  onBeforeUnmount(() => {
    mounted = false;
    clear();
    scrollY.destroy(); progress.destroy(); velocity.destroy();
  });
  return {
    get lenis() { return engine.value; }, scrollY, progress, velocity,
    scrollTo(target, options) {
      if (typeof window === "undefined") return;
      if (engine.value && !reduced.value) { engine.value.scrollTo(target, options); return; }
      const coordinate = nativeTarget(target, options?.offset ?? 0);
      wrapper().scrollTo({
        [horizontal() ? "left" : "top"]: coordinate,
        behavior: reduced.value || options?.immediate ? "instant" : "smooth",
      });
    },
  };
}
export function useSmoothScroll(): SmoothScrollApi {
  return inject(SmoothScrollKey, null) ?? createScrollApi({ root: true, enabled: false });
}
