import { computed, reactive, ref, useId } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { activeSelection, context, formatNumber } from "../../shared";
import { buildVolumeProfile, type VolumeProfileBin } from "./model";
export interface VolumeProfileProps {
  data: readonly VolumeProfileBin[];
  label?: string;
  unit?: string;
  formatPrice?: (value: number) => string;
  formatVolume?: (value: number) => string;
  valueArea?: number | false;
  color?: string;
  pocColor?: string;
  activeId?: string | null;
  defaultActiveId?: string | null;
  className?: string;
}
export function createVolumeModel(
  props: VolumeProfileProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const model = computed(() =>
    buildVolumeProfile(props.data, props.valueArea ?? 0.7),
  );
  const activeId = activeSelection(
    () => props.activeId,
    props.defaultActiveId ?? null,
    computed(() => model.value.rows.map((row) => row.id)),
    (id) => {
      emit("update:activeId", id);
      emit("activeChange", id);
    },
  );
  const activeIndex = computed(() =>
    model.value.rows.findIndex((row) => row.id === activeId.value),
  );
  return reactive({
    model,
    rows: computed(() => model.value.rows),
    poc: computed(() => model.value.poc),
    valueArea: computed(() => model.value.valueArea),
    totalVolume: computed(() => model.value.totalVolume),
    maxVolume: computed(() => model.value.maxVolume),
    priceLow: computed(() => model.value.priceLow),
    priceHigh: computed(() => model.value.priceHigh),
    activeIndex,
    active: computed(() => model.value.rows[activeIndex.value] ?? null),
    setActive(id: string | null) {
      activeId.value = id;
    },
    plotRef: ref<HTMLElement | null>(null),
    tooltipOpen: ref(false),
    tooltipId: useId(),
    label: computed(() => props.label ?? "Volume profile"),
    unit: computed(() => props.unit ?? "units"),
    formatPrice: computed(() => props.formatPrice ?? formatNumber),
    formatVolume: computed(() => props.formatVolume ?? formatNumber),
    color: computed(() => props.color ?? "#6366f1"),
    pocColor: computed(() => props.pocColor ?? "#f59e0b"),
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const volumeContext =
  context<ReturnType<typeof createVolumeModel>>("VolumeProfile");
export const useVolumeProfile = volumeContext.use;
