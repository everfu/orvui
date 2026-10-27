<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, useId } from "vue";
import { LiquidContext } from "./liquid-context";
import { liquidFilter } from "./filter";
const root = ref<HTMLElement | null>(null), portal = ref<SVGGElement | null>(null);
const bounds = ref({ width: 216, height: 48 });
const filterId = `liquid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
provide(LiquidContext, { root, portal });
const Filter = () => liquidFilter(filterId, bounds.value.width, bounds.value.height);
let observer: ResizeObserver | undefined;
function measure() { if (root.value) bounds.value = { width: root.value.offsetWidth, height: root.value.offsetHeight }; }
onMounted(() => { measure(); if (root.value && typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(measure); observer.observe(root.value); } });
onBeforeUnmount(() => observer?.disconnect());
</script>
<template><div ref="root" class="relative isolate size-full">
  <svg aria-hidden="true" focusable="false" class="pointer-events-none absolute inset-0 z-0 size-full overflow-visible"><defs><Filter /></defs><g ref="portal" fill="var(--background)" :filter="`url(#${filterId})`" /></svg><slot />
</div></template>
