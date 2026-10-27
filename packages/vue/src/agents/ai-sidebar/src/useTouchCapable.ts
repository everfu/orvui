import { onBeforeUnmount, onMounted, ref } from "vue";
export function useTouchCapable() {
  const capable = ref(false);
  let media: MediaQueryList | undefined;
  const refresh = () => {
    capable.value = !!media?.matches || navigator.maxTouchPoints > 0;
  };
  onMounted(() => {
    media = window.matchMedia?.("(any-pointer: coarse)");
    refresh();
    media?.addEventListener?.("change", refresh);
  });
  onBeforeUnmount(() => media?.removeEventListener?.("change", refresh));
  return capable;
}
