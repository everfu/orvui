<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "../index";
const TOOLS = [
  {
    id: "read",
    type: "tool",
    action: "read",
    target: "campaign-notes.md",
  },
  {
    id: "edit",
    type: "tool",
    action: "edit",
    target: "launch-plan.ts",
    additions: 42,
    deletions: 8,
  },
  {
    id: "run",
    type: "tool",
    action: "run",
    target: "bun test launch",
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed(
  () => TOOLS.slice(0, visible.value) as AgentActivityItem[],
);
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
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = TOOLS.length;
    complete.value = true;
    return;
  }
  TOOLS.forEach((_, index) =>
    later(550 + 850 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(3600, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="tool"
      :max-height="220"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
