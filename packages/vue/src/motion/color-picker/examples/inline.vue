<script setup lang="ts">
import { ColorPicker } from "../index";
const initialColor = "#3478f6";
</script>
<template>
  <ColorPicker aria-label="Brand color" :default-value="initialColor" />
</template>
