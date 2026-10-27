<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { FileDiff, type FileDiffLine } from "./index";
const lines: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 18,
    newLine: 18,
    content: "export async function runTask() {",
  },
  { id: "2", type: "removed", oldLine: 19, content: "  return execute(task);" },
  {
    id: "3",
    type: "added",
    newLine: 19,
    content: "  const result = await execute(task);",
  },
  {
    id: "4",
    type: "added",
    newLine: 20,
    content: "  return normalize(result);",
  },
  { id: "5", oldLine: 20, newLine: 21, content: "}" },
];
const visible = ref(0),
  complete = ref(false),
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
  complete.value = false;
  lines.forEach((_, index) =>
    later(180 + 360 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(lines.length * 360 + 480, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-lg">
    <FileDiff
      :key="run"
      file="src/runner.ts"
      :lines="lines.slice(0, visible)"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="lines.map((line) => line.content).join('\n')"
      :max-height="150"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
