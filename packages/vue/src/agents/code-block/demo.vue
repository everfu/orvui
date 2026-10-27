<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { CodeBlock } from "./index";
const lines = [
  'import { generateText } from "ai";',
  "",
  "export async function summarize(input: string) {",
  "  const { text } = await generateText({",
  '    model: "openai/gpt-5",',
  "    prompt: `Summarize this clearly: ${input}`,",
  "  });",
  "",
  "  return {",
  "    text,",
  "    generatedAt: new Date().toISOString(),",
  "  };",
  "}",
];
const visible = ref(1),
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
function replay() {
  cancel();
  run.value++;
  visible.value = 1;
  for (let index = 2; index <= lines.length; index++)
    later((index - 1) * 260, () => {
      visible.value = index;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[340px] w-full max-w-xl">
    <CodeBlock
      :key="run"
      filename="summarize.ts"
      language="typescript"
      :code="lines.slice(0, visible).join('\n')"
      :status="visible === lines.length ? 'complete' : 'streaming'"
      :highlight-lines="[4, 5, 6, 7]"
      :max-height="224"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
