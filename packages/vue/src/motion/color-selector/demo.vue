<script setup lang="ts">
import { ColorSelector, ColorSelectorItem, ColorSelectorLabel, ColorSelectorList } from "./index";
const swatches = [
  { value: "blue", color: "#3478f6", label: "Blue" }, { value: "purple", color: "#9270e8", label: "Purple" },
  { value: "pink", color: "#e66aa4", label: "Pink" }, { value: "red", color: "#e55656", label: "Red" },
  { value: "orange", color: "#ed9141", label: "Orange" }, { value: "amber", color: "#e5b63c", label: "Amber" },
  { value: "green", color: "#65a65a", label: "Green" }, { value: "teal", color: "#169d83", label: "Teal" },
];
</script>
<template>
  <ColorSelector default-value="blue" name="accent"><ColorSelectorLabel>Accent</ColorSelectorLabel><ColorSelectorList>
    <ColorSelectorItem v-for="swatch in swatches" :key="swatch.value" v-bind="swatch" />
  </ColorSelectorList></ColorSelector>
</template>
