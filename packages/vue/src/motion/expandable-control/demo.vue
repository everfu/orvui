<script setup lang="ts">
import { Bell, X } from "lucide-vue-next";
import { ExpandableButton, ExpandableChip } from "./index";
const notificationLabel = "Notifications";
</script>
<template><div class="flex flex-col items-center gap-6">
  <div class="flex items-center gap-2"><ExpandableButton :label="notificationLabel"><template #icon><Bell class="size-4" /></template></ExpandableButton></div>
  <div class="flex items-center gap-2"><ExpandableChip label="Vue" action-label="Remove Vue"><template #actionIcon><X class="size-3.5" /></template></ExpandableChip></div>
</div></template>
