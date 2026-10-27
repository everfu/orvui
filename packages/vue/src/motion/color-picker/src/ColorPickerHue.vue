<script setup lang="ts">
import { usePicker } from "./context";
import ChannelSlider from "./ChannelSlider.vue";
withDefaults(defineProps<{ label?: string }>(), { label: "Hue" });
const state = usePicker();
function change(hue: number) {
  state.update({ h: hue });
}
</script>
<template>
  <ChannelSlider
    :value="state.hsva.value.h"
    :max="360"
    :label="label"
    :value-text="`${Math.round(state.hsva.value.h)} degrees`"
    background="linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
    :thumb-color="`hsl(${state.hsva.value.h} 100% 50%)`"
    @value="change"
  />
</template>
