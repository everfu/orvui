<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "../index";
import { AgentCode } from "../../code-block";
const response = JSON.stringify(
  { error: "rate_limit_exceeded", retryAfter: 30, requestId: "req_8f21" },
  null,
  2,
);
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
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
  for (let index = 1; index <= 3; index++)
    later(180 + (index - 1) * 600, () => {
      visible.value = index;
    });
  later(2280, () => {
    status.value = "error";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="http.request"
      :title="
        status === 'running' ? 'Fetching project activity' : 'Request failed'
      "
      kind="request"
      :status="status"
      :meta="status === 'error' ? '429' : 'GET /v1/activity'"
      :copy-text="response"
      @retry="replay"
      :collapse-on-complete="false"
      :max-height="150"
      ><ToolResultOutput
        v-if="visible < 3"
        :code="
          [
            'Preparing request…',
            'GET /v1/activity\nConnecting…',
            'GET /v1/activity\nWaiting for response…',
          ][visible]
        " /><AgentCode v-else :code="response" language="json" /></ToolResult
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
