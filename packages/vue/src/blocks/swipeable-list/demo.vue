<script setup lang="ts">
import { h, shallowRef } from "vue";
import {
  Check,
  Clock3,
  FileText,
  Flag,
  Mail,
  Pin,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-vue-next";
import {
  SwipeableList,
  type SwipeAction,
  type SwipeableListItem,
} from "./index";
const leftActions: SwipeAction[] = [
  { id: "done", label: "Done", icon: Check, tone: "success" },
  { id: "pin", label: "Pin", icon: Pin, tone: "primary" },
];
const rightActions: SwipeAction[] = [
  { id: "later", label: "Later", icon: Clock3, tone: "warning" },
  { id: "trash", label: "Trash", icon: Trash2, tone: "danger" },
];
const descriptions = [
  {
    id: "brief",
    title: "Launch brief",
    description: "Finalize the announcement copy",
    meta: "9:41",
    icon: FileText,
  },
  {
    id: "feedback",
    title: "Client feedback",
    description: "Three comments need a response",
    meta: "11:08",
    icon: Mail,
  },
  {
    id: "review",
    title: "Design review",
    description: "Check spacing before handoff",
    meta: "13:20",
    icon: UserRound,
  },
  {
    id: "incident",
    title: "Flagged run",
    description: "Retry queue has one failed job",
    meta: "Now",
    icon: Flag,
  },
];
const initial: SwipeableListItem[] = descriptions.map(({ icon, ...item }) => ({
  ...item,
  leftActions,
  rightActions,
  leading: () =>
    h(
      "div",
      {
        class:
          "grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground",
      },
      [h(icon, { class: "h-4 w-4" })],
    ),
}));
const items = shallowRef(initial),
  lastAction = shallowRef("Ready");
function action({
  item,
  action,
}: {
  item: SwipeableListItem;
  action: SwipeAction;
}) {
  lastAction.value = `${action.label} · ${item.title}`;
  if (action.id === "trash")
    items.value = items.value.filter((row) => row.id !== item.id);
}
function reset() {
  items.value = initial;
  lastAction.value = "Queue restored";
}
</script>
<template>
  <div class="flex min-h-96 w-full items-center justify-center">
    <div
      class="w-full max-w-sm rounded-[2rem] border border-border bg-background p-3 shadow-2xl"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <div>
          <p class="text-sm font-semibold text-foreground">Priority queue</p>
          <p class="text-xs text-muted-foreground">{{ lastAction }}</p>
        </div>
        <button
          type="button"
          @click="reset"
          class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw class="h-3.5 w-3.5" />Reset
        </button>
      </div>
      <SwipeableList :items="items" @action="action" />
      <div
        class="mt-3 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground"
      >
        <span>{{ items.length }} open</span><span>Today</span>
      </div>
    </div>
  </div>
</template>
