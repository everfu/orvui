<script setup lang="ts">
import {
  computed,
  h,
  isRef,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  useSlots,
  watch,
  type ComponentPublicInstance,
  type HTMLAttributes,
  type Ref,
} from "vue";
import { PreviewRail, type PreviewRailItem } from "../../../motion/preview-rail";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    followOutput?: boolean;
    followThreshold?: number;
    smooth?: boolean;
    label?: string;
    busy?: boolean;
    navigation?: "rail";
    navigationLabel?: string;
    viewportClassName?: string;
    contentClassName?: string;
    railClassName?: string;
    viewportRef?:
      Ref<HTMLElement | null> | ((element: HTMLElement | null) => void);
    viewportProps?: HTMLAttributes;
    contentProps?: HTMLAttributes;
  }>(),
  {
    followOutput: true,
    followThreshold: 56,
    smooth: true,
    label: "Conversation",
    navigationLabel: "Message navigation",
  },
);
const emit = defineEmits<{ followChange: [following: boolean] }>();
const slots = useSlots();
const reduced = useReducedMotion();
const identity = useId();
const viewport = ref<HTMLElement | null>(null);
const transcript = ref<HTMLElement | null>(null);
const links = ref<PreviewRailItem[]>([]);
const selected = ref("");
const overflowing = ref(false);
const identities = new WeakMap<HTMLElement, string>();
const destinations = new Map<string, HTMLElement>();
let sequence = 0,
  live = props.followOutput,
  programmatic = false,
  mounted = false;
let releaseProgrammatic: ReturnType<typeof setTimeout> | undefined;
let scheduled: number | undefined;
let initialScroll: number | undefined;
let sizeObserver: ResizeObserver | undefined,
  changes: MutationObserver | undefined;
const scrollBehavior = (): ScrollBehavior =>
  reduced.value || !props.smooth ? "auto" : "smooth";
function setFollowing(value: boolean) {
  if (live !== value) {
    live = value;
    emit("followChange", value);
  }
}
function attach(node: Element | ComponentPublicInstance | null) {
  viewport.value = node as HTMLElement | null;
  if (typeof props.viewportRef === "function")
    props.viewportRef(viewport.value);
  else if (isRef(props.viewportRef)) props.viewportRef.value = viewport.value;
}
function contents(node: HTMLElement) {
  return (
    (
      node.querySelector(
        '[data-slot="message-bubble-content"], [data-slot="message-content"]',
      ) ?? node
    ).textContent ?? ""
  )
    .replace(/\s+/g, " ")
    .trim();
}
function excerpt(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const space = text.lastIndexOf(" ", limit);
  return text.slice(0, space > limit * 0.65 ? space : limit).trimEnd() + "…";
}
function refreshSelection() {
  const element = viewport.value;
  const entries = [...destinations];
  if (props.navigation !== "rail" || !element || !entries.length) return;
  if (element.scrollTop <= props.followThreshold) {
    selected.value = entries[0][0];
    return;
  }
  if (
    element.scrollHeight - element.clientHeight - element.scrollTop <=
    props.followThreshold
  ) {
    selected.value = entries[entries.length - 1][0];
    return;
  }
  const boundary = element.getBoundingClientRect();
  const middle = boundary.top + boundary.height / 2;
  let closest = entries[0][0],
    distance = Infinity;
  entries.forEach(([id, node]) => {
    const rect = node.getBoundingClientRect(),
      nextDistance = Math.abs(rect.top + rect.height / 2 - middle);
    if (nextDistance < distance) {
      distance = nextDistance;
      closest = id;
    }
  });
  selected.value = closest;
}
function rebuildRail() {
  destinations.clear();
  if (props.navigation !== "rail" || !transcript.value || !viewport.value) {
    links.value = [];
    overflowing.value = false;
    return;
  }
  const messages = Array.from(
    transcript.value.querySelectorAll<HTMLElement>('[data-slot="message"]'),
  );
  const next = messages.map((message, index) => {
    let id = identities.get(message);
    if (!id) {
      id = `${identity}-message-${++sequence}`;
      identities.set(message, id);
    }
    destinations.set(id, message);
    const text = contents(message);
    const sender = message.dataset.from ?? "conversation";
    const reply =
      sender === "user"
        ? messages
            .slice(index + 1)
            .find((candidate) => candidate.dataset.from === "assistant")
        : undefined;
    const label = excerpt(text, 56) || "Message";
    const tailStart = label.endsWith("…") ? label.length - 1 : text.length;
    const description =
      excerpt(reply ? contents(reply) : text.slice(tailStart).trim(), 88) ||
      undefined;
    return {
      id,
      label,
      description,
      ariaLabel: `Go to ${sender} message ${index + 1} of ${messages.length}`,
    };
  });
  if (JSON.stringify(next) !== JSON.stringify(links.value)) links.value = next;
  overflowing.value =
    messages.length > 1 &&
    viewport.value.scrollHeight > viewport.value.clientHeight + 1;
  refreshSelection();
}
function queueRail() {
  if (!mounted || props.navigation !== "rail") return;
  if (scheduled !== undefined) cancelAnimationFrame(scheduled);
  scheduled = requestAnimationFrame(() => {
    scheduled = undefined;
    if (mounted) rebuildRail();
  });
}
function scroll(top: number, behavior: ScrollBehavior) {
  if (!viewport.value) return;
  programmatic = true;
  if (typeof viewport.value.scrollTo === "function")
    viewport.value.scrollTo({ top, behavior });
  else viewport.value.scrollTop = top;
  if (releaseProgrammatic !== undefined) clearTimeout(releaseProgrammatic);
  releaseProgrammatic = setTimeout(
    () => {
      programmatic = false;
      refreshSelection();
    },
    behavior === "smooth" ? 320 : 0,
  );
}
function scrollToEnd(behavior: ScrollBehavior = scrollBehavior()) {
  if (viewport.value) scroll(viewport.value.scrollHeight, behavior);
}
function userScroll() {
  const element = viewport.value;
  if (!element || programmatic) return;
  setFollowing(
    element.scrollHeight - element.clientHeight - element.scrollTop <=
      props.followThreshold,
  );
  refreshSelection();
}
function interruptScroll() {
  programmatic = false;
}
function select(item: PreviewRailItem) {
  const node = destinations.get(item.id),
    element = viewport.value;
  if (!node || !element) return;
  selected.value = item.id;
  if (links.value[links.value.length - 1]?.id === item.id) {
    setFollowing(true);
    scrollToEnd();
    return;
  }
  setFollowing(false);
  const box = node.getBoundingClientRect(),
    boundary = element.getBoundingClientRect();
  scroll(
    element.scrollTop +
      box.top -
      boundary.top -
      (element.clientHeight - box.height) / 2,
    scrollBehavior(),
  );
}
function observe() {
  sizeObserver?.disconnect();
  changes?.disconnect();
  if (!mounted) return;
  if (typeof ResizeObserver !== "undefined") {
    sizeObserver = new ResizeObserver((entries) => {
      queueRail();
      if (
        entries.some((entry) => entry.target === transcript.value) &&
        props.followOutput &&
        live
      )
        scrollToEnd();
    });
    if (transcript.value) sizeObserver.observe(transcript.value);
    if (viewport.value) sizeObserver.observe(viewport.value);
  }
  if (
    props.navigation === "rail" &&
    transcript.value &&
    typeof MutationObserver !== "undefined"
  ) {
    changes = new MutationObserver(queueRail);
    changes.observe(transcript.value, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  if (props.navigation === "rail") queueRail();
  else rebuildRail();
}
watch(() => props.navigation, observe, { flush: "post" });
watch(
  () => props.followOutput,
  (value) => {
    live = value;
    if (mounted && value) {
      if (initialScroll !== undefined) cancelAnimationFrame(initialScroll);
      initialScroll = requestAnimationFrame(() => scrollToEnd("auto"));
    }
  },
);
onMounted(() => {
  mounted = true;
  if (props.followOutput)
    initialScroll = requestAnimationFrame(() => scrollToEnd("auto"));
  observe();
});
onBeforeUnmount(() => {
  mounted = false;
  sizeObserver?.disconnect();
  changes?.disconnect();
  if (releaseProgrammatic !== undefined) clearTimeout(releaseProgrammatic);
  if (scheduled !== undefined) cancelAnimationFrame(scheduled);
  if (initialScroll !== undefined) cancelAnimationFrame(initialScroll);
  attach(null);
});
const viewportClasses = computed(() =>
  cn(
    "h-full overflow-y-auto overscroll-contain outline-none [overflow-anchor:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    props.navigation === "rail"
      ? "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      : "[scrollbar-gutter:stable]",
    props.viewportClassName,
    props.navigation === "rail" && overflowing.value && "pr-10",
  ),
);
function Viewport() {
  const { onScroll, onWheel, onTouchstart, onKeydown, ...attributes } =
    props.viewportProps ?? {};
  return h(
    "section",
    {
      ...attributes,
      ref: attach,
      "aria-label": props.label,
      class: viewportClasses.value,
      onScroll: [userScroll, onScroll],
      onWheel: [interruptScroll, onWheel],
      onTouchstart: [interruptScroll, onTouchstart],
      onKeydown: [
        (event: KeyboardEvent) => {
          if (["ArrowUp", "PageUp", "Home"].includes(event.key))
            interruptScroll();
        },
        onKeydown,
      ],
    },
    h(
      "div",
      {
        role: "log",
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-busy": props.busy,
        class: props.contentClassName,
        ...props.contentProps,
        ref: transcript,
      },
      slots.default?.(),
    ),
  );
}
defineExpose({ scrollToEnd, viewport });
</script>
<template>
  <div
    data-slot="message-scroller"
    v-bind="$attrs"
    :class="cn('min-h-0', $attrs.class)"
  >
    <PreviewRail
      v-if="navigation === 'rail'"
      :items="overflowing ? links : []"
      :label="navigationLabel"
      :active-id="selected"
      @item-select="select"
      preview-side="before"
      highlight-active
      :item-size="14"
      class="h-full min-h-0 overflow-hidden"
      preview-container-class-name="right-8 left-3"
      preview-class-name="mr-1 w-64 max-w-full [&_[data-slot=preview-rail-card]]:h-20 [&_[data-slot=preview-rail-card]]:overflow-hidden [&_[data-slot=preview-rail-card]]:p-3 [&_[data-slot=preview-rail-title]]:line-clamp-1 [&_[data-slot=preview-rail-title]]:text-xs [&_[data-slot=preview-rail-title]]:leading-4 [&_[data-slot=preview-rail-description]]:line-clamp-2 [&_[data-slot=preview-rail-description]]:text-xs [&_[data-slot=preview-rail-description]]:leading-4"
      :rail-class-name="
        cn(
          'absolute inset-y-3 right-1 w-7 content-center py-1 [&_[data-slot=preview-rail-item]]:w-7 [&_[data-slot=preview-rail-item]]:justify-end [&_[data-slot=preview-rail-tick]]:h-px [&_[data-slot=preview-rail-tick]]:w-4 [&_[data-slot=preview-rail-tick]]:origin-right',
          overflowing
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
          railClassName,
        )
      "
      ><Viewport /></PreviewRail
    ><Viewport v-else />
  </div>
</template>
