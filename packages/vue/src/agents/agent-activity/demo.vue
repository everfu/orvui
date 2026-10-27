<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "./index";
const ACTIVE_BRIEF = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
};
const COMPLETE_BRIEF = {
  ...ACTIVE_BRIEF,
  status: "complete",
};
const PENDING_SEARCH = {
  id: "search",
  type: "search",
  query: "independent coffee roasters in Portland",
  results: [],
};
const COMPLETE_SEARCH = {
  ...PENDING_SEARCH,
  results: [
    { id: "heart", title: "Heart Coffee", domain: "heartroasters.com" },
    {
      id: "coava",
      title: "Coava Coffee",
      domain: "coavacoffee.com",
    },
    {
      id: "upper-left",
      title: "Upper Left Roasters",
      domain: "upperleftroasters.com",
    },
  ],
  moreCount: 5,
};
const READ_TOOL = {
  id: "read",
  type: "tool",
  action: "read",
  target: "campaign-notes.md",
};
const ACTIVITY_FRAMES = [
  [ACTIVE_BRIEF],
  [COMPLETE_BRIEF, PENDING_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH],
  [COMPLETE_BRIEF, COMPLETE_SEARCH, READ_TOOL],
  [
    COMPLETE_BRIEF,
    COMPLETE_SEARCH,
    READ_TOOL,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "launch-plan.ts",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "bun test launch" },
    {
      id: "verify",
      type: "step",
      label: "Checking the final campaign plan",
      status: "complete",
    },
  ],
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const frame = ref(0);
const items = computed(
  () => ACTIVITY_FRAMES[frame.value] as AgentActivityItem[],
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
  frame.value = 0;
  if (reduce.value) {
    frame.value = ACTIVITY_FRAMES.length - 1;
    complete.value = true;
    return;
  }
  for (let index = 1; index < ACTIVITY_FRAMES.length; index++)
    later(850 + (index - 1) * 1050, () => {
      frame.value = index;
    });
  later(4900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-xl">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      :duration="5.1"
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
