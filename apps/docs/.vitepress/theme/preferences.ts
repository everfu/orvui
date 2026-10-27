import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ColorTheme } from "./themes";
export type IconSet = "lucide";
export function useSitePreferences() {
  const colorTheme = ref<ColorTheme>("default"), iconSet = ref<IconSet>("lucide");
  let mounted = false;
  const render = () => {
    if (!mounted) return;
    const node = document.documentElement;
    colorTheme.value === "default" ? node.removeAttribute("data-theme") : node.setAttribute("data-theme", colorTheme.value);
  };
  watch(colorTheme, render, { flush: "sync" });
  onMounted(() => { mounted = true; render(); });
  onBeforeUnmount(() => { if (mounted) document.documentElement.removeAttribute("data-theme"); mounted = false; });
  return { colorTheme, iconSet, setColorTheme(value: ColorTheme) { colorTheme.value = value; }, setIconSet(value: IconSet) { iconSet.value = value; } };
}
