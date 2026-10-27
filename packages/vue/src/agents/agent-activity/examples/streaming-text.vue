<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "../index";
const REASONING = [
  "Reading the request and separating the content model from its presentation.",
  "The activity shell can stay consistent while each event supplies its own compact renderer.",
  "Text remains freeform so partial tokens can update without recreating the surrounding timeline.",
  "As each sentence wraps, the measured stream moves upward through a single transform instead of repeatedly jumping the native scroll position.",
  "Older context stays available above the fold while the newest tokens remain crisp at the bottom edge.",
  "Once the run finishes, the viewport switches from automatic following to ordinary user-controlled scrolling.",
  "Opening the completed disclosure returns to the beginning so the reasoning can be read in order.",
  "The capped viewport follows the latest sentence and preserves the full log after completion.",
].join("\n");
const CHARACTERS_PER_SECOND = 90;
const STREAM_SECONDS = REASONING.length / CHARACTERS_PER_SECOND;
const complete = ref(false),
  run = ref(0),
  reduce = ref(false),
  stream = ref("");
const items = computed<AgentActivityItem[]>(() =>
  stream.value
    .split("\n")
    .filter(Boolean)
    .map((content, index) => ({
      id: `reasoning-${index}`,
      type: "text",
      content,
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
let animation: number | undefined;
function stopFrame() {
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
}
onBeforeUnmount(stopFrame);
function replay() {
  cancel();
  stopFrame();
  run.value++;
  complete.value = false;
  stream.value = "";
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce.value) {
    stream.value = REASONING;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    const count = Math.min(
      REASONING.length,
      Math.floor(((now - origin) * CHARACTERS_PER_SECOND) / 1000),
    );
    stream.value = REASONING.substring(0, count);
    if (count < REASONING.length) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(500, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
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
      content-type="text"
      :duration="STREAM_SECONDS"
      :max-height="180"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
