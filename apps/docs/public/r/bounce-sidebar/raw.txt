<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { sidebarTrajectory } from "./trajectory";
export interface BounceSidebarItem { id: string; label: string; href?: string; icon?: any; disabled?: boolean; target?: string; rel?: string }
const props = withDefaults(defineProps<{
  items: BounceSidebarItem[]; modelValue?: string; defaultValue?: string; ariaLabel?: string;
  listClassName?: string; itemClassName?: string; indicatorClassName?: string;
}>(), { ariaLabel: "Sidebar navigation" });
const emit = defineEmits(["update:modelValue", "change"]);
const requested = useMotionState(props, emit, "modelValue", props.defaultValue ?? props.items[0]?.id ?? "");
const selected = computed(() => props.items.some(item => item.id === requested.value) ? requested.value : props.items[0]?.id ?? "");
const index = computed(() => props.items.findIndex(item => item.id === selected.value));
const list = ref<HTMLUListElement | null>(null), dot = ref({ x: 0, y: 0 }), reduced = useReducedMotion();
const items = new Map<string, HTMLLIElement>();
let observer: ResizeObserver | undefined, animation: ReturnType<typeof animate> | undefined;
let positioned = false, previousIndex = index.value, version = 0, disposed = false;
async function position(animateMovement = true) {
  const revision = ++version;
  await nextTick();
  if (disposed || revision !== version) return;
  const item = items.get(selected.value);
  if (!item) return;
  const y = item.offsetTop + (item.offsetHeight - 6) / 2;
  animation?.stop();
  if (!positioned || reduced.value || !animateMovement || previousIndex === index.value) {
    dot.value = { x: 0, y }; positioned = true;
  } else {
    const path = sidebarTrajectory(dot.value, y);
    animation = animate(0, 1, { ...path.transition, onUpdate(progress) { if (!disposed) dot.value = path.at(progress); } });
  }
  previousIndex = index.value;
}
function choose(event: MouseEvent, item: BounceSidebarItem) {
  if (item.disabled) { event.preventDefault(); return; }
  if (!event.defaultPrevented) requested.value = item.id;
}
function register(id: string, node: any) { if (node) items.set(id, node); else items.delete(id); }
watch(selected, () => void position());
watch(reduced, () => void position(false));
onMounted(() => {
  void position(false);
  if (list.value && typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(() => void position(false)); observer.observe(list.value); }
});
onBeforeUnmount(() => { disposed = true; version += 1; observer?.disconnect(); animation?.stop(); items.clear(); });
</script>
<template><nav :aria-label="ariaLabel" class="relative"><ul ref="list" :class="cn('relative flex list-none flex-col gap-1.5 pl-6', listClassName)">
  <li v-if="index >= 0" aria-hidden="true" role="presentation" class="pointer-events-none absolute inset-0"><span :class="cn('absolute left-3 top-0 h-1.5 w-1.5 rounded-full bg-primary', indicatorClassName)" :style="{ transform: `translate(${dot.x}px,${dot.y}px)` }" /></li>
  <li v-for="item in props.items" :key="item.id" :ref="node => register(item.id, node)" class="relative">
    <component :is="item.href ? 'a' : 'button'" :type="item.href ? undefined : 'button'" :href="item.href" :target="item.target"
      :rel="item.rel ?? (item.target === '_blank' ? 'noreferrer noopener' : undefined)" :aria-current="item.href && selected === item.id ? 'page' : undefined"
      :aria-pressed="!item.href ? selected === item.id : undefined" :aria-disabled="item.disabled || undefined" :disabled="!item.href ? item.disabled : undefined"
      :data-active="selected === item.id || undefined" :tabindex="item.disabled ? -1 : undefined" @click="choose($event, item)"
      :class="cn('flex min-h-9 w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background', selected === item.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground', item.disabled && 'cursor-not-allowed opacity-40', itemClassName)">
      <span v-if="item.icon" aria-hidden="true" class="shrink-0"><component :is="item.icon" class="size-4" /></span>
      <span><slot name="item" :item="item" :active="selected === item.id">{{ item.label }}</slot></span>
    </component>
  </li>
</ul></nav></template>
