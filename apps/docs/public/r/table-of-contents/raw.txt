<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  useId,
  watch,
} from "vue";
import { motion } from "motion-v";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { SPRING_LAYOUT } from "../../../lib/ease";
import type { TableOfContentsItem, TableOfContentsTarget } from "./types";

const props = withDefaults(
  defineProps<{
    items: TableOfContentsItem[];
    target?: TableOfContentsTarget;
    offset?: number;
    modelValue?: string;
    title?: string;
  }>(),
  { offset: 88, title: "On this page" },
);
const emit = defineEmits<{ "update:modelValue": [id: string] }>();
defineSlots<{
  title(): unknown;
  item(props: { item: TableOfContentsItem; active: boolean }): unknown;
}>();
const id = useId();
const reduce = useReducedMotion();
const local = ref<string>();
const active = computed(
  () => props.modelValue ?? local.value ?? props.items[0]?.id,
);
let mounted = false;
let frame = 0;
let root: HTMLElement | null = null;
let scroller: HTMLElement | Window;
let resize: ResizeObserver | undefined;
let cleanup: (() => void) | undefined;
let anchor: string | undefined;

function resolveRoot() {
  const value =
    typeof props.target === "function" ? props.target() : unref(props.target);
  if (typeof value === "string") {
    try {
      return document.querySelector<HTMLElement>(value);
    } catch {
      return null;
    }
  }
  return (
    resolveElement<HTMLElement>(value) ??
    (props.target === undefined ? document.body : null)
  );
}
function destination(itemId: string) {
  const element = root?.ownerDocument.getElementById(itemId);
  return element instanceof HTMLElement && root?.contains(element)
    ? element
    : null;
}
function select(itemId: string) {
  if (local.value === itemId) return;
  local.value = itemId;
  if (props.modelValue !== itemId) emit("update:modelValue", itemId);
}
function measure() {
  frame = 0;
  if (!mounted || !root) return;
  const targets = props.items.flatMap((item) => {
    const element = destination(item.id);
    return element && element.getClientRects().length
      ? [{ item, element }]
      : [];
  });
  if (!targets.length) return;
  const viewportTop =
    scroller === window
      ? 0
      : (scroller as HTMLElement).getBoundingClientRect().top;
  let current = targets[0].item.id;
  for (const { item, element } of targets) {
    if (element.getBoundingClientRect().top <= viewportTop + props.offset + 1)
      current = item.id;
  }
  const scrollTop =
    scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop;
  const height =
    scroller === window
      ? window.innerHeight
      : (scroller as HTMLElement).clientHeight;
  const total =
    scroller === window
      ? document.documentElement.scrollHeight
      : (scroller as HTMLElement).scrollHeight;
  if (total > height + 1 && scrollTop + height >= total - 2) {
    // A near-end anchor cannot always reach the offset. Retain that explicit
    // destination while it is visible instead of jumping to the final footer.
    const requested = targets.find((target) => target.item.id === anchor);
    const top = requested?.element.getBoundingClientRect().top;
    current =
      requested &&
      top! >= viewportTop + props.offset - 1 &&
      top! < viewportTop + height
        ? requested.item.id
        : targets.at(-1)!.item.id;
  }
  select(current);
}
function schedule() {
  if (mounted && !frame) frame = requestAnimationFrame(measure);
}
function scrollTo(element: HTMLElement, behavior: ScrollBehavior) {
  const viewportTop =
    scroller === window
      ? 0
      : (scroller as HTMLElement).getBoundingClientRect().top;
  const scrollTop =
    scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop;
  scroller.scrollTo({
    top:
      scrollTop +
      element.getBoundingClientRect().top -
      viewportTop -
      props.offset,
    behavior,
  });
}
function followHash() {
  let hash: string;
  try {
    hash = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }
  if (!props.items.some((item) => item.id === hash)) {
    schedule();
    return;
  }
  anchor = hash;
  const element = destination(hash);
  if (element) scrollTo(element, "instant");
  schedule();
}
function navigate(event: MouseEvent, item: TableOfContentsItem) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const element = destination(item.id);
  if (!element) return; // Keep native links usable even before their target mounts.
  event.preventDefault();
  anchor = item.id;
  const hash = "#" + encodeURIComponent(item.id);
  if (window.location.hash !== hash) {
    // Retain router state and the query string; scrolling itself never writes history.
    const oldURL = window.location.href;
    window.history.pushState(window.history.state, "", hash);
    window.dispatchEvent(
      new HashChangeEvent("hashchange", {
        oldURL,
        newURL: window.location.href,
      }),
    );
  }
  scrollTo(element, reduce.value ? "instant" : "smooth");
  select(item.id);
  const previous = element.getAttribute("tabindex");
  element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  if (previous === null) element.removeAttribute("tabindex");
}
function bind() {
  cleanup?.();
  resize?.disconnect();
  cancelAnimationFrame(frame);
  frame = 0;
  root = resolveRoot();
  if (!root) return;
  let parent: HTMLElement | null = root;
  while (
    parent &&
    parent !== document.body &&
    !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)
  )
    parent = parent.parentElement;
  scroller = parent && parent !== document.body ? parent : window;
  scroller.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("popstate", followHash);
  cleanup = () => {
    scroller.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("hashchange", schedule);
    window.removeEventListener("popstate", followHash);
  };
  if (typeof ResizeObserver !== "undefined") {
    resize = new ResizeObserver(schedule);
    resize.observe(root);
    for (const item of props.items) {
      const el = destination(item.id);
      if (el) resize.observe(el);
    }
  }
  schedule();
}
watch(
  () => [props.items, props.target, props.offset],
  async () => {
    if (!mounted) return;
    await nextTick();
    if (mounted) {
      local.value = undefined;
      anchor = undefined;
      bind();
    }
  },
  { deep: true },
);
onMounted(() => {
  mounted = true;
  bind();
  void nextTick(() => {
    if (mounted) followHash();
  });
  if (document.fonts)
    void document.fonts.ready.then(() => {
      if (mounted) schedule();
    });
});
onBeforeUnmount(() => {
  mounted = false;
  cleanup?.();
  resize?.disconnect();
  cancelAnimationFrame(frame);
});
</script>

<template>
  <nav data-slot="table-of-contents" :aria-label="title" class="orvui-toc">
    <p class="orvui-toc-title">
      <slot name="title">{{ title }}</slot>
    </p>
    <ol class="orvui-toc-list">
      <li v-for="item in items" :key="item.id">
        <a
          :href="'#' + encodeURIComponent(item.id)"
          :aria-current="active === item.id ? 'location' : undefined"
          :data-level="item.level ?? 2"
          class="orvui-toc-link"
          @click="navigate($event, item)"
        >
          <motion.span
            v-if="active === item.id"
            :layout-id="`${id}-indicator`"
            :initial="false"
            :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
            class="orvui-toc-indicator"
            aria-hidden="true"
          />
          <slot name="item" :item="item" :active="active === item.id">{{
            item.label
          }}</slot>
        </a>
      </li>
    </ol>
  </nav>
</template>

<style>
.orvui-toc {
  min-width: 0;
  color: var(--foreground);
}
.orvui-toc-title {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
.orvui-toc-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-inline-start: 1px solid var(--border);
}
.orvui-toc-link {
  position: relative;
  display: block;
  padding: 7px 12px 7px 16px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 20px;
  color: var(--muted-foreground);
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: color 150ms;
}
.orvui-toc-link[data-level="3"] {
  padding-inline-start: 28px;
}
.orvui-toc-link:hover,
.orvui-toc-link[aria-current] {
  color: var(--foreground);
}
.orvui-toc-link[aria-current] {
  font-weight: 500;
}
.orvui-toc-link:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: -2px;
}
.orvui-toc-indicator {
  position: absolute;
  inset-block: 7px;
  inset-inline-start: -1px;
  width: 2px;
  border-radius: 2px;
  background: var(--primary);
}
@media (prefers-reduced-motion: reduce) {
  .orvui-toc-link {
    transition: none;
  }
}
</style>
