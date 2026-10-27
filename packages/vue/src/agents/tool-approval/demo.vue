<script setup lang="ts">
import { onBeforeUnmount, ref, h } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "./index";
const status = ref<ToolApprovalStatus>("pending"),
  details = ref(true);
const parameters = [
  {
    id: "command",
    label: "Command",
    value: () =>
      h(ToolApprovalCode, {
        code: "pnpm exec vitest run tests/a11y.test.ts",
        language: "bash",
      }),
  },
  { id: "directory", label: "Directory", value: "ui-components" },
];
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
function approve() {
  cancel();
  status.value = "approving";
  (
    [
      ["approved", 600],
      ["running", 1150],
      ["complete", 2200],
    ] as const
  ).forEach(([next, delay]) =>
    later(delay, () => {
      status.value = next;
    }),
  );
}
function deny() {
  cancel();
  status.value = "denied";
}
function replay() {
  cancel();
  status.value = "pending";
  details.value = true;
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ToolApproval
      tool="terminal.run"
      :title="
        status === 'pending' ? 'Allow this tool to run?' : 'Terminal access'
      "
      description="The agent wants to run the project test suite in the current workspace."
      :status="status"
      v-model:open="details"
      :parameters="parameters"
      @approve="approve"
      @always-allow="approve"
      @deny="deny"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
