<script setup lang="ts">
import { computed, defineAsyncComponent, onErrorCaptured, ref, watch, type Component } from "vue";
const props = defineProps<{ category: string; slug: string; variant?: string }>();
const loaders = {
  ...import.meta.glob<{ default: Component }>("../../../../packages/vue/src/**/demo.vue"),
  ...import.meta.glob<{ default: Component }>("../../../../packages/vue/src/**/examples/*.vue"),
};
const error = ref("");
const base = computed(() => `../../../../packages/vue/src/${props.category}/${props.slug}/`);
const selected = computed(() => {
  const variant = props.variant ? loaders[`${base.value}examples/${props.variant}.vue`] : undefined;
  return variant ?? loaders[`${base.value}demo.vue`];
});
const component = computed(() => {
  const load = selected.value;
  if (!load) return null;
  return defineAsyncComponent({ loader: async () => (await load()).default });
});
watch([() => props.category, () => props.slug, () => props.variant], () => { error.value = ""; });
onErrorCaptured(cause => { error.value = cause instanceof Error ? cause.message : String(cause); return false; });
</script>
<template>
  <div class="demo-content">
    <p v-if="error" role="alert" class="demo-error">{{ error }}</p>
    <component v-else-if="component" :is="component" />
    <p v-else class="demo-error">This example is unavailable.</p>
  </div>
</template>
