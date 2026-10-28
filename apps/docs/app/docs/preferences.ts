import {
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type InjectionKey,
} from "vue";
import type { ColorTheme } from "./themes";
export type IconSet = "lucide";
function createSitePreferences() {
  const colorTheme = ref<ColorTheme>("default"),
    iconSet = ref<IconSet>("lucide");
  let mounted = false;
  const render = () => {
    if (!mounted) return;
    const node = document.documentElement;
    colorTheme.value === "default"
      ? node.removeAttribute("data-theme")
      : node.setAttribute("data-theme", colorTheme.value);
  };
  watch(colorTheme, render, { flush: "sync" });
  onMounted(() => {
    mounted = true;
    render();
  });
  onBeforeUnmount(() => {
    if (mounted) document.documentElement.removeAttribute("data-theme");
    mounted = false;
  });
  return {
    colorTheme,
    iconSet,
    setColorTheme(value: ColorTheme) {
      colorTheme.value = value;
    },
    setIconSet(value: IconSet) {
      iconSet.value = value;
    },
  };
}
const preferencesKey: InjectionKey<ReturnType<typeof createSitePreferences>> =
  Symbol("orvui-site-preferences");
export function provideSitePreferences() {
  const preferences = createSitePreferences();
  provide(preferencesKey, preferences);
  return preferences;
}
export function useSitePreferences() {
  return inject(preferencesKey, null) ?? createSitePreferences();
}
