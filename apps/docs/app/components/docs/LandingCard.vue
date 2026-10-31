<script setup lang="ts">
import { ref } from "vue";
import { ArrowUpRight } from "lucide-vue-next";
import DemoPreview from "./DemoPreview.vue";
import NewBadge from "./NewBadge.vue";
import { createCardPreview } from "../../composables/card-preview-state";
defineProps<{
  category: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  variant?: string;
  fresh?: boolean;
  launchedAt?: string;
}>();
const card = ref<HTMLElement | null>(null),
  outer = ref<HTMLElement | null>(null),
  stage = ref<HTMLElement | null>(null);
const { visible, hovered, measured, scale } = createCardPreview(
  card,
  outer,
  stage,
);
</script>
<template>
  <article
    ref="card"
    class="landing-card"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
    @focusin="hovered = true"
    @focusout="hovered = false"
  >
    <a :href="href" :aria-label="'View ' + name" class="landing-card-link" />
    <div class="landing-card-surface">
      <div ref="outer" class="landing-card-preview">
        <div
          ref="stage"
          class="landing-card-stage"
          :class="{ measured }"
          :style="{ width: '460px', transform: `scale(${scale})` }"
        >
          <DemoPreview
            v-if="visible"
            :category="category"
            :slug="slug"
            :variant="variant"
          />
        </div>
      </div>
      <div class="landing-card-caption">
        <div>
          <h3>{{ name }}<NewBadge v-if="fresh" :launched-at="launchedAt" /></h3>
          <p>{{ description }}</p>
        </div>
        <ArrowUpRight :size="16" />
      </div>
    </div>
  </article>
</template>
