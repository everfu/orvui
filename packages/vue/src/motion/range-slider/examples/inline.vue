<script setup lang="ts">
import { InlineSlider } from "../index";
const spokenPixels = (value: number) => `${value} pixels`;
</script>
<template><div class="w-full max-w-sm"><InlineSlider :default-value="48" :min="8" :max="128" :step="8" label="Icon size" aria-label="Icon size" :format-value-text="spokenPixels" /></div></template>
