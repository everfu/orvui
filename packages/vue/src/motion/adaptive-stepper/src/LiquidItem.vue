<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { LiquidContext } from "./liquid-context";
const props = withDefaults(defineProps<{ x: number; y?: number; width: number; height?: number; radius?: number }>(), { y: 0, height: 48, radius: 24 });
const context = inject(LiquidContext);
if (!context) throw new Error("LiquidItem must be inside Liquid");
const wrapper = ref<HTMLElement | null>(null), reduced = useReducedMotion();
type Box = { x: number; y: number; width: number; height: number; radius: number };
let blob: SVGRectElement | undefined, current: Box | undefined, animation: ReturnType<typeof animate> | undefined;
let disposed = false;
const initialStyle = { transform: `translate(${props.x}px, ${props.y}px)`, width: `${props.width}px`, height: `${props.height}px`, willChange: "transform, width, height" };
function write(box: Box) {
  if (disposed || !wrapper.value || !blob) return;
  const transform = `translate(${box.x}px, ${box.y}px)`;
  wrapper.value.style.transform = transform; wrapper.value.style.width = `${box.width}px`; wrapper.value.style.height = `${box.height}px`;
  blob.style.transform = transform; blob.setAttribute("width", String(box.width)); blob.setAttribute("height", String(box.height)); blob.setAttribute("rx", String(box.radius));
}
function update() {
  animation?.stop();
  if (!blob || disposed) return;
  const target: Box = { x: props.x, y: props.y, width: props.width, height: props.height, radius: props.radius };
  const previous = current;
  if (!previous || reduced.value) { current = target; write(target); return; }
  animation = animate(0, 1, { duration: 0.6, ease: [0.22, 1.3, 0.71, 1], onUpdate(progress) {
    const interpolate = (key: keyof Box) => previous[key] + progress * (target[key] - previous[key]);
    current = { x: interpolate("x"), y: interpolate("y"), width: interpolate("width"), height: interpolate("height"), radius: interpolate("radius") };
    write(current);
  } });
}
watch([() => props.x, () => props.y, () => props.width, () => props.height, () => props.radius, reduced], update, { flush: "post" });
onMounted(() => {
  if (!context.portal.value) return;
  blob = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  blob.setAttribute("x", "0"); blob.setAttribute("y", "0");
  Object.assign(blob.style, { transformBox: "fill-box", transformOrigin: "center", willChange: "transform" });
  context.portal.value.append(blob);
  update();
});
onBeforeUnmount(() => { disposed = true; animation?.stop(); blob?.remove(); });
</script>
<template><div ref="wrapper" class="absolute left-0 top-0 z-10" :style="initialStyle"><slot /></div></template>
