import { onBeforeUnmount, onMounted, ref } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import "../styles/theme.css";
export type ThemeVariant = "rectangle" | "circle" | "circle-blur" | "blinds";
export type RectStart = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "bottom-up";

const origins: Record<RectStart, [number, number]> = {
  "top-left": [0, 0], "top-right": [100, 0], "bottom-left": [0, 100],
  "bottom-right": [100, 100], center: [50, 50], "bottom-up": [50, 100],
};
let currentTransition = 0;
export function useThemeToggle(options: { variant?: ThemeVariant; start?: RectStart } = {}) {
  const isDark = ref(false), mounted = ref(false), reduced = useReducedMotion();
  let observer: MutationObserver | undefined;
  onMounted(() => {
    mounted.value = true;
    const sync = () => { isDark.value = document.documentElement.classList.contains("dark"); };
    sync();
    observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  });
  onBeforeUnmount(() => { mounted.value = false; observer?.disconnect(); });
  function applyTheme(next: "light" | "dark", animated = true) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const request = ++currentTransition;
    const dark = next === "dark";
    const clearMarker = () => { if (request === currentTransition) delete root.dataset.orvuiVt; };
    if (root.classList.contains("dark") === dark) {
      isDark.value = dark;
      clearMarker();
      return;
    }
    const commit = () => {
      if (request !== currentTransition) return;
      root.classList.toggle("dark", dark);
      isDark.value = dark;
      try {
        window.localStorage.setItem("orvui-theme", next);
      } catch { /* A restricted storage area does not prevent changing appearance. */ }
      try {
        window.localStorage.setItem("vitepress-theme-appearance", next);
      } catch { /* Save each consumer's preference independently when possible. */ }
      window.dispatchEvent(new CustomEvent("orvui-theme-change", { detail: next }));
    };
    const nativeTransition = document.startViewTransition;
    if (!animated || reduced.value || typeof nativeTransition !== "function") {
      clearMarker();
      commit();
      return;
    }
    const variant = options.variant ?? "rectangle", start = options.start ?? "bottom-up";
    if (variant === "rectangle") {
      const [x, y] = origins[start];
      const inset = start === "bottom-up" ? "100% 0 0 0" : `${y}% ${100 - x}% ${100 - y}% ${x}%`;
      root.style.setProperty("--orvui-vt-from", `inset(${inset})`);
      root.dataset.orvuiVt = "rect";
    } else {
      root.dataset.orvuiVt = variant;
      if (variant !== "blinds") {
        const [x, y] = origins[start];
        root.style.setProperty("--orvui-vt-origin", `${x}% ${y}%`);
      }
    }
    try {
      const transition = nativeTransition.call(document, commit);
      void transition.finished.then(clearMarker, clearMarker);
    } catch {
      clearMarker();
      commit();
    }
  }
  function toggle() { applyTheme(isDark.value ? "light" : "dark"); }
  return { isDark, mounted, toggle, applyTheme };
}
