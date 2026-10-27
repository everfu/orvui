<script setup lang="ts">
import { computed } from "vue";
import CitationFavicon from "./CitationFavicon.vue";
import type { CitationItem } from "./types";
const props = withDefaults(
  defineProps<{ citations: CitationItem[]; limit?: number }>(),
  { limit: 3 },
);
const visible = computed(() => props.citations.slice(0, props.limit));
</script>
<template>
  <span aria-hidden="true" class="flex -space-x-1.5"
    ><CitationFavicon
      v-for="item in visible"
      :key="item.id"
      :url="item.url"
      :icon="item.icon"
      class="size-6 rounded-full bg-background ring-2 ring-background"
  /></span>
</template>
