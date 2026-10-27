<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FileText, RotateCcw } from "lucide-vue-next";
import { Citation, Citations, type CitationItem } from "./index";
const citations: CitationItem[] = [
  {
    id: "motion",
    title: "Motion documentation",
    domain: "motion.dev",
    url: "https://motion.dev/docs/vue",
  },
  {
    id: "wai",
    title: "WAI accessibility patterns",
    domain: "w3.org",
    url: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    id: "guidelines",
    title: "Motion guidelines",
    domain: "Design handbook · PDF",
    icon: FileText,
  },
];
const visible = ref(0),
  run = ref(0);
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  run.value++;
  visible.value = 0;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visible.value = citations.length;
    return;
  }
  citations.forEach((_, index) =>
    later(500 + index * 700, () => {
      visible.value = index + 1;
    }),
  );
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[410px] w-full max-w-lg">
    <div :key="run" class="space-y-4">
      <p class="text-sm leading-6 text-foreground/90">
        Use layout-aware motion for newly appended results
        <Citation citation-id="motion" :index="1" id-prefix="preview-source" />
        and preserve accessible disclosure behavior
        <Citation citation-id="wai" :index="2" id-prefix="preview-source" /> as
        the list grows, keeping exits shorter than entrances
        <Citation
          citation-id="guidelines"
          :index="3"
          id-prefix="preview-source"
          label="Citation 3: Motion guidelines"
        />.
      </p>
      <Citations
        id-prefix="preview-source"
        :citations="citations.slice(0, visible)"
        default-open
      />
    </div>
    <button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
