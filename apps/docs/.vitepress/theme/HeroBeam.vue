<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { useReducedMotion } from "../../../../packages/vue/src/lib/composables";
import { borderBeamCss } from "./vendor/border-beam-core.js";
const root = ref<HTMLElement>();
const id = `hero-${useId().replace(/[^a-zA-Z0-9_-]/g, "-")}`;
const reduce = useReducedMotion(), dark = ref(true), visible = ref(true), radius = ref(16);
let release = () => {};
onMounted(() => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => { dark.value = preference.matches; };
  sync();
  preference.addEventListener("change", sync);
  const child = root.value?.firstElementChild;
  const measured = child ? Number.parseFloat(getComputedStyle(child).borderTopLeftRadius) : 0;
  if (measured > 0) radius.value = measured;
  const intersection = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(records => {
    for (const record of records) visible.value = record.isIntersecting;
  }, { rootMargin: "256px" });
  if (root.value) intersection?.observe(root.value);
  release = () => { preference.removeEventListener("change", sync); intersection?.disconnect(); };
});
onBeforeUnmount(() => release());
const css = computed(() => {
  const light = !dark.value;
  return borderBeamCss({
    id, borderRadius: radius.value, borderWidth: 1, duration: 3,
    strokeOpacity: light ? .12 : .26, innerOpacity: light ? .26 : .42,
    bloomOpacity: light ? .34 : .24, innerShadow: light ? "rgba(0, 0, 0, 0.14)" : "rgba(255, 255, 255, 0.27)",
    colorVariant: "colorful", staticColors: true, brightness: 1.3, saturation: 1.5,
    hueRange: 30, theme: light ? "light" : "dark", glowSize: 1,
  });
});
const BeamStyle = () => h("style", { innerHTML: css.value });
</script>
<template>
  <BeamStyle />
  <div
    ref="root"
    :data-beam="id"
    :data-active="!reduce ? '' : undefined"
    :data-paused="!visible ? '' : undefined"
    class="hero-beam"
    style="--beam-strength: 1"
  >
    <slot />
    <div data-beam-bloom="true" aria-hidden="true" />
  </div>
</template>
<style scoped>
.hero-beam {
  display: inline-block;
  max-width: 100%;
  border-radius: 9999px;
}
</style>
