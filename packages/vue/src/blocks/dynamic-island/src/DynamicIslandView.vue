<script setup lang="ts">
import { computed, inject } from "vue";
import { AnimatePresence } from "motion-v";
import { islandKey } from "./context";
import IslandSlot from "./IslandSlot.vue";
const props = defineProps<{ id: string }>();
defineOptions({ inheritAttrs: false });
const current = inject(islandKey);
if (!current)
  throw new Error("DynamicIslandView must be used inside <DynamicIsland>");
const visible = computed(() => current.value === props.id);
</script>
<template>
  <AnimatePresence :initial="false" mode="popLayout" as="div" class="contents"
    ><IslandSlot v-if="visible" :key="id" v-bind="$attrs" class="px-6 py-4"
      ><slot /></IslandSlot
  ></AnimatePresence>
</template>
