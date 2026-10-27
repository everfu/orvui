<script setup lang="ts">
import { computed, provide, ref, useId, watch } from "vue";
import {
  parseHex,
  formatHex,
  rgbaToHsva,
  hsvaToRgba,
  type Hsva,
} from "./color";
import type { ColorContext } from "./context";
import ColorPickerArea from "./ColorPickerArea.vue";
import ColorPickerHue from "./ColorPickerHue.vue";
import ColorPickerAlpha from "./ColorPickerAlpha.vue";
import ColorPickerHexInput from "./ColorPickerHexInput.vue";
import ColorPickerSwatch from "./ColorPickerSwatch.vue";
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    value?: string;
    defaultValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    alpha?: boolean;
    disabled?: boolean;
    name?: string;
    form?: string;
  }>(),
  { open: undefined, defaultValue: "#3478f6", defaultOpen: false, alpha: true },
);
const emit = defineEmits([
  "update:modelValue",
  "valueChange",
  "change",
  "valueCommit",
  "update:open",
  "openChange",
]);
const id = useId();
const supplied = computed(() => props.modelValue ?? props.value);
const draftCode = ref(supplied.value ?? props.defaultValue);
const editing = ref(
  rgbaToHsva(parseHex(draftCode.value) ?? { r: 0, g: 0, b: 0, a: 1 }),
);
const expanded = ref(props.defaultOpen);
const anchor = ref<HTMLElement | null>(null);
const open = computed({
  get: () => props.open ?? expanded.value,
  set: (next: boolean) => {
    if (next === open.value) return;
    if (props.open === undefined) expanded.value = next;
    emit("update:open", next);
    emit("openChange", next);
  },
});
function reconcile() {
  const incoming = supplied.value;
  if (incoming === undefined || incoming === draftCode.value) return;
  const parsed = parseHex(incoming);
  if (parsed) editing.value = rgbaToHsva(parsed, editing.value);
  draftCode.value = incoming;
}
watch(supplied, reconcile, { flush: "sync" });
watch(draftCode, reconcile, { flush: "post" });
const displayHsva = computed(() =>
  !props.alpha && editing.value.a !== 1
    ? { ...editing.value, a: 1 }
    : editing.value,
);
const rgba = computed(() => hsvaToRgba(displayHsva.value));
const hex = computed(() => formatHex(rgba.value));
function update(patch: Partial<Hsva>) {
  if (props.disabled) return;
  const limits: Record<keyof Hsva, number> = { h: 360, s: 100, v: 100, a: 1 };
  const next = Object.fromEntries(
    (Object.keys(limits) as (keyof Hsva)[]).map((key) => [
      key,
      Math.min(
        limits[key],
        Math.max(
          0,
          Number.isFinite(patch[key]) ? patch[key]! : editing.value[key],
        ),
      ),
    ]),
  ) as Hsva;
  if (!props.alpha) next.a = 1;
  const code = formatHex(hsvaToRgba(next));
  const changed = code !== hex.value;
  editing.value = next;
  draftCode.value = code;
  if (changed) {
    emit("update:modelValue", code);
    emit("valueChange", code);
    emit("change", code);
  }
}
function commit() {
  if (!props.disabled) emit("valueCommit", hex.value);
}
function setColor(code: string) {
  const parsed = parseHex(code);
  if (parsed) {
    update(rgbaToHsva(parsed, editing.value));
    commit();
  }
}
provide<ColorContext>("orvui-color-picker", {
  id,
  hsva: displayHsva,
  rgba,
  hex,
  open,
  anchor,
  alpha: computed(() => props.alpha),
  disabled: computed(() => props.disabled),
  update,
  setColor,
  commit,
});
</script>
<template>
  <fieldset
    :disabled="disabled"
    :form="form"
    :class="[
      'relative flex w-full min-w-0 max-w-72 flex-col gap-3 border-0 p-0 has-[>[data-color-picker-trigger]]:w-fit has-[>[data-color-picker-trigger]]:self-start',
      disabled && 'opacity-50',
    ]"
  >
    <slot :hex="hex" :hsva="displayHsva" :set-color="setColor"
      ><ColorPickerArea /><ColorPickerHue /><ColorPickerAlpha />
      <div class="flex gap-2">
        <ColorPickerSwatch /><ColorPickerHexInput /></div></slot
    ><input v-if="name" type="hidden" :name="name" :value="hex" :form="form" />
  </fieldset>
</template>
