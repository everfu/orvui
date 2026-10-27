<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "../index";
const TRACE_ITEMS = [
  {
    id: "plan",
    type: "trace",
    kind: "thinking",
    label: "Thinking",
    detail: "Mapping the interaction flow…",
  },
  {
    id: "decision",
    type: "trace",
    kind: "message",
    label: "Decision",
    detail: "Use one compact disclosure",
  },
  {
    id: "write",
    type: "trace",
    kind: "write",
    label: "Draft component",
    detail: "components/agents/RunLog.vue",
  },
  {
    id: "verify",
    type: "trace",
    kind: "run",
    label: "Validate types",
    detail: "pnpm typecheck",
  },
  {
    id: "inspect",
    type: "trace",
    kind: "read",
    label: "Inspect preview",
    detail: "activity-preview.png",
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed(
  () => TRACE_ITEMS.slice(0, visible.value) as AgentActivityItem[],
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
    visible.value = TRACE_ITEMS.length;
    complete.value = true;
    return;
  }
  TRACE_ITEMS.forEach((_, index) =>
    later(250 + 650 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(250 + TRACE_ITEMS.length * 650, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="trace"
      active-label="Running the agent trace…"
      :max-height="190"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
