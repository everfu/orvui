<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { InfiniteMasonry } from "./index";
const scenes = [
  ["Soft geometry", "Architecture", "1511818966892-d7d671e672a2", 260],
  ["Open horizon", "Landscape", "1500530855697-b586d89ba3ee", 190],
  ["Working rhythm", "Workspace", "1497366754035-f200968a6e72", 230],
  ["Shared table", "Studio", "1524758631624-e2822e304c36", 300],
  ["In session", "People", "1521737711867-e3b97375f902", 210],
  ["After hours", "Office", "1504384308090-c894fdcc538d", 280],
] as const;
function page(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset,
      [title, category, photo, imageHeight] = scenes[index % scenes.length];
    return {
      id: `gallery-${index}`,
      title: `${title} ${Math.floor(index / scenes.length) + 1}`,
      category,
      image: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=720&q=80`,
      imageHeight,
    };
  });
}
const items = ref(page(0, 12)),
  loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function load() {
  if (loading.value || items.value.length >= 42) return;
  loading.value = true;
  timer = setTimeout(() => {
    items.value.push(
      ...page(items.value.length, Math.min(6, 42 - items.value.length)),
    );
    loading.value = false;
  }, 650);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <div class="w-full max-w-5xl">
    <div class="mb-3 flex items-end justify-between gap-4 px-1">
      <div>
        <p class="text-sm font-semibold text-foreground">Visual index</p>
        <p class="mt-0.5 text-xs text-muted-foreground">
          Scroll to load the next page
        </p>
      </div>
      <p class="font-mono text-xs tabular-nums text-muted-foreground">
        {{ items.length }} items
      </p>
    </div>
    <InfiniteMasonry
      :items="items"
      :get-item-key="(item) => item.id"
      :has-more="items.length < 42"
      :loading="loading"
      :estimate-size="(item) => item.imageHeight + 66"
      aria-label="Visual inspiration gallery"
      class="h-[34rem]"
      @load-more="load"
      ><template #default="{ item }"
        ><figure
          class="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div
            class="relative w-full overflow-hidden"
            :style="{ height: item.imageHeight + 'px' }"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="absolute inset-0 size-full object-cover"
            />
          </div>
          <figcaption class="flex items-start justify-between gap-3 p-3">
            <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
            <p
              class="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {{ item.category }}
            </p>
          </figcaption>
        </figure></template
      ></InfiniteMasonry
    >
  </div>
</template>
