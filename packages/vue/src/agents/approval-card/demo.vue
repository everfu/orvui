<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "./index";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
