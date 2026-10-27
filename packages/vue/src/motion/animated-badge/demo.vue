<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { AnimatedBadge, type AnimatedBadgeStatus } from "./index";
const sequence = [
  { status: "loading", label: "Syncing" }, { status: "success", label: "Synced" },
  { status: "warning", label: "Review" }, { status: "danger", label: "Failed" },
] as const;
const samples = [["neutral", "Queued"], ["info", "Live"], ["loading", "Indexing"], ["success", "Verified"], ["warning", "Pending"], ["danger", "Blocked"]] as const;
const step = ref(0), current = computed(() => sequence[step.value % sequence.length]!);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { step.value += 1; }, 1600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex h-16 items-center justify-center"><AnimatedBadge :status="current.status" size="md" aria-live="polite">{{ current.label }}</AnimatedBadge></div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3"><AnimatedBadge v-for="[status, label] in samples" :key="status" :status="status" size="sm">{{ label }}</AnimatedBadge></div>
  </div>
</template>
