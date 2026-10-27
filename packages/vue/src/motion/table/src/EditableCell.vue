<script setup lang="ts">
defineProps<{ value: string; label: string }>();
const emit = defineEmits<{ change: [value: string] }>();
const update = (event: Event) =>
  emit("change", (event.target as HTMLInputElement).value);
</script>
<template>
  <input
    :value="value"
    :aria-label="label"
    :size="1"
    placeholder="Empty"
    class="-mx-2 w-full min-w-0 appearance-none rounded-md border-0 bg-transparent px-2 py-1 text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:bg-muted focus:ring-1 focus:ring-ring"
    @input="update"
  />
</template>
