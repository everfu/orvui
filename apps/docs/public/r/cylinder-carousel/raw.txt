<script setup lang="ts">
import { Comment, Fragment, computed, defineComponent, isVNode, onBeforeUnmount, onMounted, onUpdated, ref, useSlots, watch, type VNodeChild } from "vue";
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { cylinderProjection, cylinderSize } from "./projection";
const props = withDefaults(defineProps<{ itemSize?: number; visibleItems?: number; variant?: "concave" | "convex"; minScale?: number; dragSpeed?: number; arc?: number; snap?: boolean; autoRotate?: boolean; autoRotateSpeed?: number; defaultIndex?: number; height?: number }>(), { itemSize: 200, visibleItems: 5, variant: "concave", minScale: .55, dragSpeed: 1.5, snap: true, autoRotate: false, autoRotateSpeed: .4, defaultIndex: 0 });
const emit = defineEmits(["indexChange"]);
const slots = useSlots();
const root = ref<HTMLElement | null>(null);
const width = ref(800);
const reduced = useReducedMotion();
const position = useMotionValue(props.defaultIndex);
const displayedPosition = ref(position.get());
const scroll = displayedPosition;
const hover = ref(false);
const RenderNode = defineComponent({ props: ["node"], setup: props => () => props.node });
function children(nodes: VNodeChild[]): VNodeChild[] { const result: VNodeChild[] = []; for (const node of nodes) { if (!isVNode(node) || node.type === Comment) continue; if (node.type === Fragment) result.push(...children(node.children as VNodeChild[])); else result.push(node); } return result; }
const items = computed(() => children(slots.default?.() ?? []));
const layout = computed(() => ({ width: width.value || 800, itemSize: props.itemSize, visibleItems: props.visibleItems, minScale: props.minScale, variant: props.variant, arc: props.arc }));
const size = computed(() => cylinderSize(layout.value));
const gap = computed(() => layout.value.width / (props.visibleItems + 1));
let selected = props.defaultIndex;
let mounted = false;
let frame = 0;
let observer: ResizeObserver | undefined;
let wheelTimer: ReturnType<typeof setTimeout> | undefined;
let animation: ReturnType<typeof animate> | undefined;
let animationVersion = 0;
let pointer: { id: number; element: HTMLElement; startX: number; startPosition: number; previousX: number; previousTime: number; x: number; time: number } | undefined;
useMotionValueEvent(position, "change", value => { displayedPosition.value = value; const count = items.value.length; if (!count) return; const index = (Math.round(value) % count + count) % count; if (index !== selected) { selected = index; emit("indexChange", index); } });
function stop() { ++animationVersion; animation?.stop(); animation = undefined; }
function travel(target: number, velocity = position.getVelocity()) {
  stop(); if (reduced.value) { position.set(target); return; }
  animation = animate(position, target, { type: "spring", stiffness: 40, damping: 20, mass: 3, velocity, restDelta: .001, restSpeed: .005 });
}
function settle(velocity: number) { const target = displayedPosition.value + Math.max(-6, Math.min(6, velocity * .45)); travel(props.snap ? Math.round(target) : target, velocity); }
function dropCapture() { const current = pointer; pointer = undefined; if (current) try { if (current.element.hasPointerCapture(current.id)) current.element.releasePointerCapture(current.id); } catch {} }
function down(event: PointerEvent) { if (event.button !== 0 || pointer) return; event.preventDefault(); stop(); const time = performance.now(); const element = event.currentTarget as HTMLElement; pointer = { id: event.pointerId, element, startX: event.clientX, startPosition: position.get(), x: event.clientX, previousX: event.clientX, time, previousTime: time }; try { element.setPointerCapture(event.pointerId); } catch {} }
function move(event: PointerEvent) { const active = pointer; if (!active) return; position.set(active.startPosition - (event.clientX - active.startX) * props.dragSpeed / gap.value); active.previousX = active.x; active.previousTime = active.time; active.x = event.clientX; active.time = performance.now(); }
function up(event: PointerEvent) { const active = pointer; if (!active) return; dropCapture(); const elapsed = active.time - active.previousTime; const velocity = elapsed > 0 ? -(active.x - active.previousX) / elapsed * props.dragSpeed * 1000 / gap.value : 0; settle(velocity); }
function wheel(event: WheelEvent) { stop(); const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY; position.set(position.get() + delta / gap.value); clearTimeout(wheelTimer); wheelTimer = setTimeout(() => settle(position.getVelocity()), 140); }
function rotate() { cancelAnimationFrame(frame); frame = 0; if (!mounted || !props.autoRotate || reduced.value || !items.value.length) return; let previous = performance.now(); function tick(time: number) { const elapsed = (time - previous) / 1000; previous = time; if (!pointer && !hover.value && !animation) position.set(position.get() + props.autoRotateSpeed * elapsed); frame = requestAnimationFrame(tick); } frame = requestAnimationFrame(tick); }
watch([() => props.autoRotate, () => props.autoRotateSpeed, reduced], rotate);
let count = 0;
onMounted(() => { if (root.value) { width.value = root.value.clientWidth; if (typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(entries => { width.value = entries[0]?.contentRect.width ?? root.value?.clientWidth ?? 800; }); observer.observe(root.value); } } mounted = true; count = items.value.length; rotate(); });
onUpdated(() => { if (items.value.length !== count) { count = items.value.length; rotate(); } });
onBeforeUnmount(() => { mounted = false; cancelAnimationFrame(frame); observer?.disconnect(); clearTimeout(wheelTimer); stop(); dropCapture(); });
</script>
<template>
  <div ref="root" role="application" aria-roledescription="carousel" aria-label="Cylinder carousel" tabindex="0" class="relative w-full touch-none select-none [-webkit-touch-callout:none] cursor-grab outline-none [clip-path:inset(0)] active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50" :style="{ height: `${height ?? size}px` }" @keydown.right.prevent="travel(Math.round(displayedPosition) + 1)" @keydown.left.prevent="travel(Math.round(displayedPosition) - 1)" @wheel="wheel" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @pointerenter="hover = true" @pointerleave="hover = false">
    <motion.div v-for="(node, index) in items" :key="index" class="absolute left-1/2 top-1/2" :style="{ width: `${size}px`, height: `${size}px`, marginLeft: `${-size / 2}px`, marginTop: `${-size / 2}px` }" :animate="cylinderProjection(index, displayedPosition, items.length, layout, size)" :transition="{ duration: 0 }"><RenderNode :node="node" /></motion.div>
  </div>
</template>
