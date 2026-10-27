<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { HoldActionButton } from "../index";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <HoldActionButton @hold-complete="feedback">Hold for vertical fill</HoldActionButton><HoldActionButton type="horizontal" @hold-complete="feedback">Hold for horizontal fill</HoldActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action confirmed" : "Release early to cancel" }}</p>
  </div>
</template>
