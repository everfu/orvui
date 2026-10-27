<script setup lang="ts">
import { ref } from "vue";
import { BottomSheet } from "./index";
const open = ref(false);
const actions = ["Share", "Duplicate", "Move to folder", "Rename", "Archive", "Delete"];
</script>
<template><div>
  <button type="button" @click="open = true" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open bottom sheet</button>
  <BottomSheet v-model:open="open" :snap-points="[0.4, 0.85]" title="Quick actions" description="Move the handle or flick downward to close."><ul class="divide-y divide-border"><li v-for="action in actions" :key="action" class="py-3 text-sm text-foreground">{{ action }}</li></ul><div class="py-12 text-center text-xs text-muted-foreground">Flick up for more room, or down to close.</div></BottomSheet>
</div></template>
