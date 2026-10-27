<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SlideActionButton } from "../index";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <SlideActionButton complete-label="Ready" @complete="feedback">Slide to continue</SlideActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action completed" : "Drag the arrow to the end" }}</p>
  </div>
</template>
