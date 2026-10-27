<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "../index";
const STEPS = [
  { id: "brief", label: "Reading the product brief" },
  { id: "patterns", label: "Mapping the interaction patterns" },
  {
    id: "states",
    label: "Connecting the loading and completion states",
    meta: "3 states",
  },
  { id: "verify", label: "Verifying the final behavior" },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(1),
  settled = ref(false);
const items = computed<AgentActivityItem[]>(() =>
  STEPS.slice(0, visible.value).map((item, index) => ({
    ...item,
    type: "step",
    status: settled.value || index + 1 < visible.value ? "complete" : "active",
  })),
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
  visible.value = 1;
  settled.value = false;
  if (reduce.value) {
    visible.value = STEPS.length;
    settled.value = true;
    complete.value = true;
    return;
  }
  for (let index = 2; index <= STEPS.length; index++)
    later(850 + (index - 2) * 800, () => {
      visible.value = index;
    });
  later(3300, () => {
    settled.value = true;
  });
  later(4200, () => {
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
      content-type="step"
      :duration="4.2"
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
