import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  arrow as pointArrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
  type Placement,
  type VirtualElement,
} from "@floating-ui/dom";
import type {
  TooltipContext,
  TooltipContentProps,
  TooltipSide,
} from "./context";
export function createTooltipPosition(
  context: TooltipContext,
  props: Readonly<TooltipContentProps>,
  hasContent: () => boolean,
) {
  const mounted = ref(false);
  const ready = ref(false);
  const positioner = ref<HTMLElement | null>(null);
  const arrow = ref<SVGSVGElement | null>(null);
  const side = ref<TooltipSide>(props.side ?? "top");
  let stopTracking: (() => void) | undefined;
  let frame: number | undefined;
  let revision = 0;
  let binding = 0;
  let disposed = false;
  let cursorPlacement: Placement | undefined;
  const origins: Record<TooltipSide, string> = {
    top: "center bottom",
    bottom: "center top",
    left: "right center",
    right: "left center",
  };
  async function place() {
    const anchor = context.anchor.value;
    const target = positioner.value;
    if (!context.open.value || !anchor || !target || disposed) return;
    const version = ++revision;
    const point = context.props.followCursor ? context.cursor.value : null;
    const virtual = !!point || !!props.anchorPoint;
    const reference: Element | VirtualElement = virtual
      ? {
          contextElement: anchor,
          getBoundingClientRect: () => {
            const box = anchor.getBoundingClientRect();
            const x =
              point?.x ?? box.left + box.width * (props.anchorPoint?.x ?? 0.5);
            const y =
              point?.y ?? box.top + box.height * (props.anchorPoint?.y ?? 0.5);
            return {
              x,
              y,
              left: x,
              right: x,
              top: y,
              bottom: y,
              width: 0,
              height: 0,
            };
          },
        }
      : anchor;
    const preferred = (
      props.align === "center" || !props.align
        ? (props.side ?? "top")
        : `${props.side ?? "top"}-${props.align}`
    ) as Placement;
    const result = await computePosition(reference, target, {
      strategy: "fixed",
      placement: point ? (cursorPlacement ?? preferred) : preferred,
      middleware: [
        offset(props.sideOffset ?? (point ? 12 : 8)),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        ...(arrow.value
          ? [pointArrow({ element: arrow.value, padding: 10 })]
          : []),
        ...(virtual ? [] : [hide({ strategy: "referenceHidden" })]),
      ],
    });
    if (
      disposed ||
      version !== revision ||
      !context.open.value ||
      positioner.value !== target ||
      !target.isConnected
    )
      return;
    cursorPlacement = point ? result.placement : undefined;
    side.value = result.placement.split("-")[0] as TooltipSide;
    const pixelRatio = window.devicePixelRatio || 1;
    const snap = (value: number) => Math.round(value * pixelRatio) / pixelRatio;
    target.style.transform = `translate3d(${snap(result.x)}px,${snap(result.y)}px,0)`;
    target.style.setProperty("--tooltip-origin", origins[side.value]);
    target.dataset.placement = result.placement;
    const box = anchor.getBoundingClientRect();
    target.style.visibility =
      result.middlewareData.hide?.referenceHidden && (box.width || box.height)
        ? "hidden"
        : "visible";
    const triangle = arrow.value;
    const surface = triangle?.parentElement;
    if (triangle && surface) {
      const coordinate = result.middlewareData.arrow;
      if (coordinate?.x !== undefined)
        triangle.style.left = `${coordinate.x - surface.clientLeft}px`;
      if (coordinate?.y !== undefined)
        triangle.style.top = `${coordinate.y - surface.clientTop}px`;
      const style = getComputedStyle(surface);
      triangle.style.setProperty("--tooltip-arrow-fill", style.backgroundColor);
      triangle.style.setProperty(
        "--tooltip-arrow-stroke",
        style.borderTopColor,
      );
    }
    ready.value = true;
  }
  function schedule() {
    ++revision;
    if (frame !== undefined || disposed || !context.open.value) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      void place();
    });
  }
  async function bind() {
    const version = ++binding;
    ++revision;
    stopTracking?.();
    stopTracking = undefined;
    if (!mounted.value || !context.open.value) {
      ready.value = false;
      cursorPlacement = undefined;
      return;
    }
    await nextTick();
    if (disposed || version !== binding || !context.open.value) return;
    context.floating.value = positioner.value;
    if (context.anchor.value && positioner.value)
      stopTracking = autoUpdate(
        context.anchor.value,
        positioner.value,
        schedule,
      );
    schedule();
  }
  watch(
    () => [
      context.open.value,
      context.anchor.value,
      props.side,
      props.align,
      props.sideOffset,
      props.arrow,
      props.anchorPoint,
    ],
    bind,
    { flush: "post" },
  );
  watch(context.cursor, schedule);
  onMounted(() => {
    mounted.value = true;
    context.setEmpty(!hasContent());
    void bind();
  });
  onBeforeUnmount(() => {
    disposed = true;
    ++binding;
    ++revision;
    stopTracking?.();
    if (frame !== undefined) cancelAnimationFrame(frame);
    context.floating.value = null;
  });
  const arrowPath = computed(
    () =>
      ({
        top: "M0 6L6 12L12 6",
        bottom: "M0 6L6 0L12 6",
        left: "M6 0L12 6L6 12",
        right: "M6 0L0 6L6 12",
      })[side.value],
  );
  const arrowStyle = computed(
    () =>
      ({
        top: { top: "calc(100% - 6px)" },
        bottom: { bottom: "calc(100% - 6px)" },
        left: { left: "calc(100% - 6px)" },
        right: { right: "calc(100% - 6px)" },
      })[side.value],
  );
  return { mounted, ready, positioner, arrow, arrowPath, arrowStyle };
}
