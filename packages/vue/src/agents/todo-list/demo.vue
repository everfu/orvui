<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { TodoList, type TodoItem } from "./index";
const tasks = [
  "Inspect the current data flow",
  "Update the response schema",
  "Add coverage for edge cases",
  "Run checks and prepare the result",
];
const step = ref(0),
  run = ref(0);
const items = computed<TodoItem[]>(() =>
  tasks.map((title, index) => {
    const progress = step.value - index * 4;
    const active = progress >= 0 && progress < 4;
    return {
      id: `task-${index}`,
      title,
      status: progress >= 4 ? "completed" : active ? "in-progress" : "pending",
      progress: active ? (progress + 1) * 25 : undefined,
      detail: active ? `${(progress + 1) * 25}%` : undefined,
    };
  }),
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
  step.value = 0;
  for (let tick = 1; tick <= tasks.length * 4; tick++)
    later(tick * 280, () => {
      step.value = tick;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <TodoList :key="run" :items="items" title="Implementation plan" /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
