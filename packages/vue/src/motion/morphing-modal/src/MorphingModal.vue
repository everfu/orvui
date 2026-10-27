<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, nextTick, onMounted, onUpdated, ref, useAttrs, useId, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_PANEL } from "../../../lib/ease";
import { resolveElement, useOverlay, useReducedMotion } from "../../../lib/composables";
import { useExitInteractivity } from "../../_overlay/interactivity";
const props = withDefaults(defineProps<{ viewId: string | null; placement?: "bottom" | "center"; ariaLabel?: string }>(), { placement: "bottom" });
const emit = defineEmits<{ close: [] }>();
const attrs = useAttrs(), id = useId(), reduced = useReducedMotion();
const active = computed(() => props.viewId !== null), mounted = ref(false);
const panel = ref<HTMLElement | null>(null), backdrop = ref<HTMLElement | null>(null), layer = ref<HTMLElement | null>(null);
const headingId = ref<string>();
const label = computed(() => props.ariaLabel ?? attrs["aria-label"] as string | undefined);
const focusable = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function view(key: string | null = props.viewId) { return [...(panel.value?.querySelectorAll<HTMLElement>("[data-view]") ?? [])].find(element => element.dataset.view === key); }
function nameDialog() {
  if (props.viewId === null || label.value) return;
  const heading = view()?.querySelector<HTMLElement>("h1,h2,h3,h4,h5,h6");
  if (heading && !heading.id) heading.id = `${id}-${props.viewId}-title`;
  headingId.value = heading?.id;
}
watch(() => props.viewId, async (next, before, cleanup) => {
  let cancelled = false;
  cleanup(() => { cancelled = true; });
  if (next === null) return;
  const previous = view(before);
  if (previous) { previous.inert = true; previous.setAttribute("aria-hidden", "true"); }
  await nextTick();
  if (cancelled) return;
  const current = view();
  if (current) { current.inert = false; current.removeAttribute("aria-hidden"); }
  nameDialog();
  if (before !== null && next !== before && panel.value) {
    const focused = panel.value.ownerDocument.activeElement;
    if (!focused || focused === document.body || panel.value.contains(focused)) (current?.querySelector<HTMLElement>(focusable) ?? panel.value).focus({ preventScroll: true });
  }
}, { flush: "pre" });
useOverlay(active, panel, () => emit("close"));
useExitInteractivity(active, [panel, backdrop], [layer]);
onMounted(() => { mounted.value = true; void nextTick(nameDialog); });
onUpdated(nameDialog);
</script>
<template><Teleport v-if="mounted" to="body"><AnimatePresence :initial="false">
  <motion.button v-if="active" :ref="node => backdrop = resolveElement<HTMLElement>(node)" key="backdrop" type="button" aria-label="Close modal" :tabindex="-1"
    :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :transition="{ duration: 0.2, ease: EASE_OUT }" @click="emit('close')"
    class="pointer-events-auto fixed inset-0 z-[80] bg-background/5 [backdrop-filter:blur(14px)_saturate(140%)] [-webkit-backdrop-filter:blur(14px)_saturate(140%)]" />
  <div v-if="active" key="panel-layer" ref="layer" :class="cn('pointer-events-none fixed inset-4 z-[80] flex justify-center', placement === 'bottom' ? 'items-end pb-4' : 'items-center')">
    <motion.div :ref="node => panel = resolveElement<HTMLElement>(node)" role="dialog" aria-modal="true" :aria-label="label" :aria-labelledby="label ? undefined : headingId" :tabindex="-1" layout
      :initial="{ opacity: 0, y: reduced ? 0 : placement === 'bottom' ? 40 : 20, scale: reduced ? 1 : 0.97 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
      :exit="{ opacity: 0, y: reduced ? 0 : placement === 'bottom' ? 40 : 20, scale: reduced ? 1 : 0.98, transition: { duration: 0.18, ease: EASE_OUT } }" :transition="SPRING_PANEL" v-bind="$attrs"
      :class="cn('pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background shadow-xl outline-none will-change-transform', $attrs.class as string)">
      <motion.div layout="position" class="p-5"><AnimatePresence mode="popLayout" :initial="false"><motion.div :key="viewId!" :data-view="viewId"
        :initial="reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' }"
        :animate="reduced ? { opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } } : { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.24, ease: EASE_OUT } }"
        :exit="reduced ? { opacity: 0, transition: { duration: 0.14, ease: EASE_OUT } } : { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.16, ease: EASE_OUT } }"><slot :view-id="viewId" /></motion.div></AnimatePresence></motion.div>
    </motion.div>
  </div>
</AnimatePresence></Teleport></template>
