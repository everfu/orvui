<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ href?: string; as?: any }>();
const tag = computed(() => props.as ?? "a");
</script>
<template>
  <component :is="tag" :href="href" class="inline-flex min-h-8 min-w-0 items-center gap-1.5 rounded-md px-2 font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>svg]:size-3.5 [&>svg]:shrink-0"><slot /></component>
</template>
