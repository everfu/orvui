import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { useFloatingLayer, useMediaQuery } from "../../../lib/composables";
import { useReduced } from "../../shared";
import {
  buildWheel,
  championPath,
  keepTogether,
  type WheelNode,
} from "./wheel-model";
import type { Round } from "./types";
export function useWheel(props: { rounds: Round[]; initialRound: number }) {
  const reduce = useReduced(),
    uid = useId().replaceAll(":", ""),
    stage = ref<HTMLElement>(),
    svg = ref<SVGSVGElement>(),
    inView = ref(false),
    canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const hovered = ref<string | null>(null),
    pinned = ref<string | null>(null),
    focused = ref<string | null>(null);
  const active = computed(() => hovered.value ?? pinned.value ?? focused.value);
  const visible = computed(() =>
    props.rounds.slice(
      Math.min(
        Math.max(props.initialRound, 0),
        Math.max(props.rounds.length - 1, 0),
      ),
    ),
  );
  const model = computed(() => buildWheel(visible.value)),
    winners = computed(() => championPath(visible.value)),
    activeNode = computed(() =>
      model.value.nodes.find((node) => node.id === active.value),
    );
  const lit = computed(() =>
      activeNode.value ? new Set([activeNode.value.id]) : winners.value,
    ),
    captions = computed(
      () =>
        new Map(
          model.value.nodes.map((node) => [
            node.id,
            node.team === null
              ? "TBD"
              : node.round
                ? `${keepTogether(node.round)} · ${node.label}`
                : node.team.name,
          ]),
        ),
    );
  const tabStop = computed(
      () => activeNode.value?.id ?? model.value.nodes[0]?.id,
    ),
    tapped = computed(() => (canHover.value ? undefined : activeNode.value));
  const layer = useFloatingLayer(
    computed(() => pinned.value !== null),
    stage,
  );
  let gesture: { id: string; type: string; pinned: boolean } | undefined,
    observer: IntersectionObserver | undefined;
  function key(event: KeyboardEvent, node: WheelNode) {
    gesture = undefined;
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    let target: WheelNode | undefined;
    if (event.key === "ArrowUp")
      target = model.value.nodes.find((peer) => peer.id === node.parentId);
    else if (event.key === "ArrowDown")
      target = model.value.nodes.find((peer) => peer.parentId === node.id);
    else {
      const ring = model.value.nodes
        .filter((peer) => peer.depth === node.depth)
        .sort((a, b) => a.angle - b.angle);
      target =
        ring[
          (ring.indexOf(node) +
            (event.key === "ArrowRight" ? 1 : -1) +
            ring.length) %
            ring.length
        ];
    }
    if (target) document.getElementById(uid + "-" + target.id)?.focus();
  }
  function down(event: PointerEvent, node: WheelNode) {
    gesture = {
      id: node.id,
      type: event.pointerType,
      pinned: pinned.value === node.id,
    };
  }
  function cancel() {
    gesture = undefined;
  }
  function click(event: MouseEvent, node: WheelNode) {
    const pointer = gesture;
    gesture = undefined;
    if (!pointer || pointer.id !== node.id || pointer.type === "mouse") return;
    pinned.value = pinned.value === node.id ? null : node.id;
    if (pointer.pinned) (event.currentTarget as HTMLElement).blur();
  }
  function unpin() {
    pinned.value = null;
    const current = document.activeElement;
    if (current instanceof HTMLElement && stage.value?.contains(current))
      current.blur();
  }
  function outside(event: PointerEvent) {
    if (!pinned.value || layer.containsHigher(event.target)) return;
    const target = event.target as Element;
    if (stage.value?.contains(target) && target.closest("button")) return;
    event.preventDefault();
    event.stopPropagation();
    unpin();
  }
  function escape(event: KeyboardEvent) {
    if (layer.claimEscape(event)) unpin();
  }
  onMounted(() => {
    if (svg.value && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            inView.value = true;
            observer?.disconnect();
          }
        },
        { rootMargin: "300px" },
      );
      observer.observe(svg.value);
    }
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", escape);
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", escape);
  });
  return {
    reduce,
    uid,
    stage,
    svg,
    inView,
    canHover,
    hovered,
    focused,
    visible,
    model,
    lit,
    captions,
    tabStop,
    tapped,
    key,
    down,
    cancel,
    click,
  };
}
