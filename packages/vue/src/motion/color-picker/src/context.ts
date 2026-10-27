import { computed, inject, onBeforeUnmount, ref, watch, type Ref } from "vue";
import { motionValue, useSpring, useTransform } from "motion-v";
import { useReducedMotion, resolveElement } from "../../../lib/composables";
import { SPRING_GLIDE } from "../../../lib/ease";
import type { Hsva, Rgba } from "./color";
export const CHECKERBOARD =
  "repeating-conic-gradient(#d4d4d8 0% 25%, #fafafa 0% 50%) 0 0 / 8px 8px";
export const COLOR_MORPH = {
  type: "spring",
  duration: 0.5,
  bounce: 0.2,
} as const;
export interface ColorContext {
  id: string;
  hsva: Ref<Hsva>;
  rgba: Ref<Rgba>;
  hex: Ref<string>;
  open: Ref<boolean>;
  anchor: Ref<HTMLElement | null>;
  alpha: Ref<boolean>;
  disabled: Ref<boolean>;
  update: (next: Partial<Hsva>) => void;
  setColor: (value: string) => void;
  commit: () => void;
}
export function usePicker() {
  const state = inject<ColorContext>("orvui-color-picker");
  if (!state) throw Error("Color picker parts must be inside ColorPicker");
  return state;
}
export function useGlide(target: Ref<number>) {
  const reduced = useReducedMotion();
  const source = motionValue(target.value);
  const spring = useSpring(source, SPRING_GLIDE);
  const offset = useTransform(spring, (value) => `${value}%`);
  watch(
    [target, reduced],
    ([value, reduced]) => {
      if (reduced) {
        source.jump(value);
        spring.jump(value);
      } else source.set(value);
    },
    { immediate: true },
  );
  onBeforeUnmount(() => {
    offset.destroy();
    spring.destroy();
    source.destroy();
  });
  return { spring, offset };
}
export function useColorDrag(
  onPoint: (x: number, y: number) => void,
  onEnd: () => void,
  disabled: Ref<boolean>,
) {
  const rail = ref<unknown>(null);
  const thumb = ref<HTMLElement | null>(null);
  const dragging = ref(false);
  let contact: { id: number; element: HTMLElement } | undefined;
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  function sample(event: PointerEvent) {
    const box = resolveElement<HTMLElement>(
      rail.value,
    )?.getBoundingClientRect();
    if (box?.width && box.height)
      onPoint(
        clamp((event.clientX - box.left) / box.width),
        clamp((event.clientY - box.top) / box.height),
      );
  }
  function release() {
    const previous = contact;
    contact = undefined;
    dragging.value = false;
    if (previous)
      try {
        previous.element.releasePointerCapture(previous.id);
      } catch {
        /* Capture may already be lost. */
      }
  }
  function down(event: PointerEvent) {
    if (disabled.value || event.button !== 0 || contact) return;
    const element = event.currentTarget as HTMLElement;
    contact = { id: event.pointerId, element };
    dragging.value = true;
    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      /* Synthetic pointer event. */
    }
    thumb.value?.focus({ preventScroll: true });
    sample(event);
  }
  function move(event: PointerEvent) {
    if (!disabled.value && contact?.id === event.pointerId) sample(event);
  }
  function end(event: PointerEvent) {
    if (contact?.id !== event.pointerId) return;
    release();
    if (!disabled.value) onEnd();
  }
  watch(disabled, (blocked) => {
    if (blocked) release();
  });
  onBeforeUnmount(release);
  return { rail, thumb, dragging, down, move, end };
}
export function keyStep(
  event: KeyboardEvent,
  big = 10,
): { axis: "x" | "y"; delta: number } | "min" | "max" | null {
  if (event.key === "Home") return "min";
  if (event.key === "End") return "max";
  const move = (
    {
      ArrowRight: ["x", 1],
      ArrowLeft: ["x", -1],
      ArrowUp: ["y", 1],
      ArrowDown: ["y", -1],
      PageUp: ["y", 1],
      PageDown: ["y", -1],
    } as const
  )[event.key as "ArrowRight"];
  return move
    ? {
        axis: move[0],
        delta:
          move[1] * (event.shiftKey || event.key.startsWith("Page") ? big : 1),
      }
    : null;
}
