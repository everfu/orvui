<script setup lang="ts">
import { ref, useId } from "vue";
import { TableOfContents } from "./index";
const target = ref<HTMLElement | null>(null);
const instance = useId();
const items = ["Overview", "Installation", "Usage", "Accessibility"].map(
  (label, i) => ({ id: `${instance}-section-${i}`, label }),
);
</script>
<template>
  <div class="grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_9rem] gap-5 p-4">
    <div
      ref="target"
      class="h-72 overflow-y-auto rounded-xl border border-border bg-background px-5"
      tabindex="0"
      aria-label="Example article"
    >
      <section
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="min-h-52 py-6"
      >
        <h3 class="text-base font-medium">{{ item.label }}</h3>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">
          Follow this article using the links alongside it. The active section
          updates as you scroll.
        </p>
      </section>
    </div>
    <TableOfContents
      :items="items"
      :target="target ?? undefined"
      :offset="16"
    />
  </div>
</template>
