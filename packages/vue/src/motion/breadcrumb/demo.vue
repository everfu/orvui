<script setup lang="ts">
import { nextTick, ref } from "vue";
import { ArrowUpRight, Folder, Home } from "lucide-vue-next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./index";
const segments = "Workspace/Projects/Website/Design system/Components/Navigation/Breadcrumb".split("/");
const current = ref(5), root = ref<HTMLElement | null>(null);
async function navigate(index: number, event?: MouseEvent) {
  if (event && (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;
  event?.preventDefault(); current.value = index;
  await nextTick(); root.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
}
</script>
<template>
  <div ref="root" class="w-full max-w-lg space-y-8 px-4">
    <Breadcrumb class="min-h-[4.25rem] sm:min-h-8"><BreadcrumbList :max-items="3">
      <BreadcrumbItem v-for="(segment, index) in segments.slice(0, current + 1)" :key="segment">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbPage v-if="index === current" :tabindex="-1"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbPage>
        <BreadcrumbLink v-else :href="`#${segment.toLowerCase()}`" @click="navigate(index, $event)"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>
    <div class="min-h-20 border-t border-border/60 pt-5">
      <button v-if="current < segments.length - 1" type="button" @click="navigate(Math.min(current + 1, segments.length - 1))"
        class="flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-start text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Folder aria-hidden="true" class="size-4 text-muted-foreground" /><span class="flex-1">{{ segments[current + 1] }}</span><ArrowUpRight aria-hidden="true" class="size-3.5 text-muted-foreground" />
      </button>
      <p v-else class="py-3 text-center text-sm text-muted-foreground">Choose a parent path to go back.</p>
    </div>
  </div>
</template>
