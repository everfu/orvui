<script setup lang="ts">
import { ref } from "vue";
import { CalendarClock, Eye, GitBranch, Pin } from "lucide-vue-next";
import { OverflowActions } from "./index";
const expanded = ref(false);
const primary = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "pin", label: "Pin", icon: Pin },
];
const extra = [
  { id: "branch", label: "Branch", icon: GitBranch },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
];
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <OverflowActions
      :primary-actions="primary"
      :overflow-actions="extra"
      v-model:expanded="expanded"
      open-label="Open action rail"
      close-label="Collapse action rail"
    />
  </div>
</template>
