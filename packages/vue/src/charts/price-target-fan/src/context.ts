import { computed, ref, useId, watch } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { context, selection, unwrapModel } from "../../shared";
import type { PriceTargetFanProps, PriceTargetFanActive } from "./types";
import { fmtScrubDate, H, W } from "./utils";
import { buildPriceTargetGeometry, nearestProjection } from "./geometry";
export function createPriceTargetModel(
  props: PriceTargetFanProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const reduce = useReducedMotion(),
    canHover = useMediaQuery("(hover: hover)");
  const requested = selection(
    () => props.active,
    props.defaultActive ?? null,
    (value) => {
      emit("update:active", value);
      emit("activeChange", value);
    },
  );
  const clipId = useId().replace(/[^\w-]/g, ""),
    fadeId = clipId + "-fade",
    tooltipId = useId(),
    svgRef = ref<SVGSVGElement | null>(null);
  const geometry = computed(() => buildPriceTargetGeometry(props));
  function setActive(value: PriceTargetFanActive | null) {
    requested.value = value;
  }
  function setHotT(index: number | null) {
    setActive(
      index === null ? null : { type: "target", key: props.targets[index].key },
    );
  }
  function setScrub(index: number | null) {
    setActive(
      index === null
        ? null
        : { type: "history", date: geometry.value.history[index].date },
    );
  }
  function onMove(event: PointerEvent) {
    if (!canHover.value || event.pointerType === "touch" || !svgRef.value)
      return;
    const rect = svgRef.value.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const data = geometry.value,
      x = ((event.clientX - rect.left) / rect.width) * W;
    if (x > data.geo.nowX + 6) {
      setHotT(
        nearestProjection(
          data,
          x,
          ((event.clientY - rect.top) / rect.height) * H,
        ),
      );
      return;
    }
    if (!data.hist.length || x > data.geo.nowX - 6) {
      setActive(null);
      return;
    }
    let nearest = 0;
    for (let index = 1; index < data.hist.length; index++)
      if (Math.abs(data.geo.hx(index) - x) < Math.abs(data.geo.hx(nearest) - x))
        nearest = index;
    setScrub(nearest);
  }
  const model = computed(() => {
    const data = geometry.value,
      raw = requested.value;
    const targetIndex =
      raw?.type === "target"
        ? data.targets.findIndex((target) => target.key === raw.key)
        : -1;
    const historyIndex =
      raw?.type === "history"
        ? data.history.findIndex((point) => point.date === raw.date)
        : -1;
    const active = targetIndex >= 0 || historyIndex >= 0 ? raw : null;
    const hotT = targetIndex < 0 ? null : targetIndex,
      scrub = historyIndex < 0 ? null : historyIndex;
    let overlay: {
      px: number;
      py: number;
      title: string;
      metrics: { label: string; value: string }[];
      accent: { label: string; value: string; color: string } | null;
    } | null = null;
    if (hotT !== null) {
      const target = data.geo.proj[hotT];
      overlay = {
        px: data.geo.endX,
        py: target.ty,
        title: `${target.key} target${data.dates.horizon ? " · " + data.dates.horizon : ""}`,
        metrics: [
          { label: "Price", value: data.fmt(target.price) },
          { label: "Analysts", value: String(target.analysts) },
        ],
        accent: {
          label: "vs now",
          value: `${target.price >= data.current ? "+" : "−"}${Math.abs(data.pct(target.price)).toFixed(1)}%`,
          color: target.color,
        },
      };
    } else if (scrub !== null)
      overlay = {
        px: data.geo.hx(scrub),
        py: data.y(data.hist[scrub]),
        title: fmtScrubDate.format(new Date(data.history[scrub].date)),
        metrics: [{ label: "Price", value: data.fmt(data.hist[scrub]) }],
        accent: null,
      };
    const mean = data.targets[1],
      head =
        hotT === null
          ? { key: mean.key, price: mean.price, color: undefined }
          : data.geo.proj[hotT];
    return {
      ...data,
      reduce: reduce.value,
      clipId,
      fadeId,
      svgRef,
      tooltipId,
      active,
      setActive,
      scrub,
      hotT,
      setHotT,
      setScrub,
      label: props.label ?? "Price target · 12 months",
      overlay,
      mean,
      head,
      headPct: data.pct(head.price),
      onMove,
    };
  });
  watch(
    () => model.value.active,
    (value) => {
      if (!value && requested.value && props.active === undefined)
        requested.value = null;
    },
  );
  return unwrapModel(model);
}
export const priceTargetContext =
  context<ReturnType<typeof createPriceTargetModel>>("PriceTargetFan");
export const usePriceTargetFan = priceTargetContext.use;
