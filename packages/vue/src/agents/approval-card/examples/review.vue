<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardStatus } from "../index";
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
const details = [
  { label: "Release", text: "approval-card", mono: true },
  { label: "Checks", text: "4 passed", mono: false },
  { label: "Visibility", text: "Public registry", mono: false },
];
const results = {
  approved: "Publishing was approved.",
  "changes-requested": "The agent will wait for revision notes.",
  rejected: "Publishing was declined.",
};
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
function finish(value: ApprovalCardStatus) {
  cancel();
  status.value = "submitting";
  later(700, () => {
    status.value = value;
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      title="Publish the component update?"
      description="The agent has prepared the release and is waiting for your decision."
      :status="status"
      @approve="finish('approved')"
      @request-changes="finish('changes-requested')"
      @reject="finish('rejected')"
      :result="results[status as keyof typeof results] ?? results.rejected"
      ><dl class="grid gap-1 text-xs">
        <div
          v-for="item in details"
          :key="item.label"
          class="flex items-center justify-between gap-4 py-1"
        >
          <dt class="text-muted-foreground">{{ item.label }}</dt>
          <dd :class="[item.mono && 'font-mono', 'text-foreground/80']">
            {{ item.text }}
          </dd>
        </div>
      </dl></ApprovalCard
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
