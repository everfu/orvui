import { computed, reactive } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import {
  activeSelection,
  context,
  formatNumber,
  formatCompact,
} from "../../shared";
export type Candle = {
  id: string;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
export interface CandlestickChartProps {
  candles: readonly Candle[];
  lastPrice?: number;
  activeId?: string | null;
  defaultActiveId?: string | null;
  formatPrice?: (value: number) => string;
  formatVolume?: (value: number) => string;
  label?: string;
  className?: string;
}
export function createCandlestickModel(
  props: CandlestickChartProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const activeId = activeSelection(
    () => props.activeId,
    props.defaultActiveId ?? null,
    computed(() => props.candles.map((candle) => candle.id)),
    (id) => {
      emit("update:activeId", id);
      emit("activeIdChange", id);
    },
  );
  const scale = computed(() => {
    let min = Infinity,
      max = -Infinity,
      volumeMax = 1;
    for (const candle of props.candles) {
      min = Math.min(min, candle.low);
      max = Math.max(max, candle.high);
      volumeMax = Math.max(volumeMax, candle.volume);
    }
    if (props.lastPrice !== undefined) {
      min = Math.min(min, props.lastPrice);
      max = Math.max(max, props.lastPrice);
    }
    if (!props.candles.length && props.lastPrice === undefined) {
      min = 0;
      max = 1;
    }
    const pad = Math.max((max - min) * 0.08, max * 0.0005, 0.0001);
    return { min: min - pad, max: max + pad, volumeMax };
  });
  const active = computed(() => {
    const index = props.candles.findIndex(
      (candle) => candle.id === activeId.value,
    );
    return index < 0 ? null : index;
  });
  return reactive({
    candles: computed(() => props.candles),
    lastPrice: computed(() => props.lastPrice),
    active,
    scale,
    setActive(index: number | null) {
      activeId.value =
        index === null ? null : (props.candles[index]?.id ?? null);
    },
    formatPrice: computed(() => props.formatPrice ?? formatNumber),
    formatVolume: computed(() => props.formatVolume ?? formatCompact),
    label: computed(() => props.label ?? "Candlestick chart"),
    reduce: useReducedMotion(),
  });
}
export const candlestickContext =
  context<ReturnType<typeof createCandlestickModel>>("CandlestickChart");
export const useCandlestickChart = candlestickContext.use;
