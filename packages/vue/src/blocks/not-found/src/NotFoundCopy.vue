<script setup lang="ts">
defineProps<{ title: string; description: string }>();
</script>
<template>
  <div class="flex flex-col items-center gap-2">
    <p class="text-lg font-semibold text-foreground">{{ title }}</p>
    <p class="max-w-sm text-sm text-muted-foreground">{{ description }}</p>
  </div>
</template>
