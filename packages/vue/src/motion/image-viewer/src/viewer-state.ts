import { computed, ref, watch, type VNodeChild } from "vue";
import type { LightboxImage } from "./types";
export function useViewerSelection(props: { images: LightboxImage[]; modelValue?: string | null; value?: string | null; defaultValue: string | null; renderCaption?: (image: LightboxImage) => VNodeChild }, emit: (...args: any[]) => void) {
  const local = ref(props.defaultValue);
  const controlled = computed(() => props.modelValue !== undefined || props.value !== undefined);
  const value = computed({ get: () => props.modelValue !== undefined ? props.modelValue : props.value !== undefined ? props.value : local.value, set: (next: string | null) => { if (!controlled.value) local.value = next; emit("update:modelValue", next); emit("valueChange", next); emit("change", next); } });
  const index = computed(() => props.images.findIndex(image => image.id === value.value));
  const image = computed(() => props.images[index.value]);
  const direction = ref(1);
  watch(() => props.images, images => { if (new Set(images.map(image => image.id)).size !== images.length) throw Error("ImageViewer requires unique image ids."); if (images.some(image => !Number.isFinite(image.width) || !Number.isFinite(image.height) || image.width <= 0 || image.height <= 0)) throw Error("ImageViewer requires positive image dimensions."); if (!controlled.value && value.value !== null && index.value < 0) local.value = null; }, { immediate: true, deep: true });
  function select(next: string | null) { const nextIndex = props.images.findIndex(image => image.id === next); if (nextIndex >= 0 && index.value >= 0) direction.value = nextIndex < index.value ? -1 : 1; value.value = next; }
  function move(delta: number) { const next = props.images[index.value + delta]; if (!image.value || !next) return; direction.value = delta < 0 ? -1 : 1; select(next.id); }
  return { value, index, image, direction, select, move };
}
