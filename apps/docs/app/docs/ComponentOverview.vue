<script setup lang="ts">
import { computed } from "vue";
import { getComponentAbout } from "./details";
const props = defineProps<{
  category: string;
  slug: string;
  en: boolean;
  summary?: string;
}>();
const about = computed(() =>
  getComponentAbout(props.category, props.slug, props.en),
);
</script>
<template>
  <section v-if="about" class="component-overview" id="when-to-use">
    <p v-if="about.overview !== summary">{{ about.overview }}</p>
    <h2>{{ en ? "When to use it" : "适用场景" }}</h2>
    <ul>
      <li v-for="item in about.useWhen" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
