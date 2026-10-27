<script setup lang="ts">
defineSlots<{ default(): unknown }>();
</script>
<template>
  <div class="flex min-h-[420px] w-full flex-col items-center justify-center gap-8 px-4 text-center"><slot /></div>
</template>
