<script setup lang="ts">
const dots = Array.from({ length: 5 }, (_, index) => ({ x: 16 - Math.abs(index - 2) * 6, y: 4 + index * 5 }));
</script>
<template>
  <svg viewBox="0 0 20 28" fill="none" aria-hidden="true"><circle v-for="dot in dots" :key="dot.y" :cx="dot.x" :cy="dot.y" r="2" fill="currentColor" /></svg>
</template>
