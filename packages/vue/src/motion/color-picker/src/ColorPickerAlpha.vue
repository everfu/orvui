<script setup lang="ts">
import { computed } from "vue";
import { usePicker, CHECKERBOARD } from "./context";
import ChannelSlider from "./ChannelSlider.vue";
withDefaults(defineProps<{ label?: string }>(), { label: "Opacity" });
const state = usePicker();
const rgb = computed(
  () => `${state.rgba.value.r} ${state.rgba.value.g} ${state.rgba.value.b}`,
);
function change(percent: number) {
  state.update({ a: Math.round(percent) / 100 });
}
</script>
<template>
  <ChannelSlider
    v-if="state.alpha.value"
    :value="state.hsva.value.a * 100"
    :max="100"
    :label="label"
    :value-text="`${Math.round(state.hsva.value.a * 100)}%`"
    :background="`linear-gradient(to right, rgb(${rgb} / 0), rgb(${rgb})), ${CHECKERBOARD}`"
    :thumb-color="`rgb(${rgb} / ${state.hsva.value.a})`"
    @value="change"
  />
</template>
