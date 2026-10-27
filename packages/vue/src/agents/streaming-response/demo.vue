<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { StreamingResponse } from "./index";
const pieces = [
  "This answer adds content a little at a time. Read ",
  "the Vue introduction",
  " while the next paragraph is prepared.",
  "Each update keeps the existing document in place:",
  "Open links without pausing the arriving text",
  "Follow the same list as new items appear",
  "Copy the code after the final line arrives",
  "Set ",
  "aria-busy",
  " until the pending update has finished.",
  'const status = complete ? "ready" : "streaming";',
];
const sources = [
    {
      id: "vue-introduction",
      title: "Vue introduction",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/introduction.html",
    },
    {
      id: "aria-busy",
      title: "ARIA live regions",
      domain: "developer.mozilla.org",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",
    },
    {
      id: "vue-rendering",
      title: "Rendering elements",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/essentials/conditional.html",
    },
  ],
  markdown = `This answer adds content a little at a time. Read [the Vue introduction](https://vuejs.org/guide/introduction.html) while the next paragraph is prepared.\n\nEach update keeps the existing document in place:\n\n- Open links without pausing the arriving text\n- Follow the same list as new items appear\n- Copy the code after the final line arrives\n\nSet \`aria-busy\` until the pending update has finished.\n\n\`\`\`ts\nconst status = complete ? "ready" : "streaming";\n\`\`\``;
let total = 0;
const starts = pieces.map((piece) => {
  const offset = total;
  total += piece.length;
  return offset;
});
const cursor = ref(0),
  complete = ref(false),
  run = ref(0);
const reveal = (index: number) =>
  pieces[index].substring(0, Math.max(0, cursor.value - starts[index]));
const started = (index: number) => cursor.value > starts[index];
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
function replay() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  cursor.value = 0;
  complete.value = false;
  run.value++;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.value = total;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    cursor.value = Math.min(total, Math.floor((now - origin) * 0.11));
    if (cursor.value < total) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(450, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
onBeforeUnmount(() => {
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <div class="relative h-[500px] w-full max-w-xl">
    <StreamingResponse
      :key="run"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="markdown"
      @retry="replay"
      :sources="sources"
      ><p>
        {{ reveal(0)
        }}<a
          v-if="started(1)"
          href="https://vuejs.org/guide/introduction.html"
          target="_blank"
          rel="noreferrer noopener"
          >{{ reveal(1) }}</a
        >{{ reveal(2) }}
      </p>
      <p v-if="started(3)">{{ reveal(3) }}</p>
      <ul v-if="started(4)">
        <li v-for="index in [4, 5, 6].filter(started)" :key="index">
          {{ reveal(index) }}
        </li>
      </ul>
      <p v-if="started(7)">
        {{ reveal(7) }}<code v-if="started(8)">{{ reveal(8) }}</code
        >{{ reveal(9) }}
      </p>
      <pre
        v-if="started(10)"
      ><code>{{ reveal(10) }}</code></pre></StreamingResponse
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
