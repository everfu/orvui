<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "./index";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
