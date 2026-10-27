<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, FileText, ImagePlus, Puzzle } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { PromptInput } from "./index";
const ModelLogo = defineComponent({
  props: { url: { type: String, required: true } },
  setup(props) {
    const image = ref<HTMLImageElement>(),
      failed = ref(false);
    let alive = true;
    onMounted(async () => {
      try {
        await image.value?.decode?.();
      } catch {
        if (alive) failed.value = true;
      }
    });
    onBeforeUnmount(() => {
      alive = false;
    });
    return () =>
      failed.value
        ? h(Bot)
        : h("img", {
            ref: image,
            src: new URL("/favicon.ico", props.url).href,
            alt: "",
            width: 16,
            height: 16,
            referrerpolicy: "no-referrer",
            class: "size-4 rounded-sm object-contain",
            onError: () => {
              failed.value = true;
            },
          });
  },
});
const modelData = [
  ["gpt-5.2", "GPT-5.2", "https://openai.com"],
  ["claude-sonnet-4", "Claude Sonnet 4", "https://www.anthropic.com"],
  ["gemini-3.6-flash", "Gemini 3.6 Flash", "https://deepmind.google"],
  ["grok-4.5", "Grok 4.5", "https://x.ai"],
  ["mistral-large-3", "Mistral Large 3", "https://mistral.ai"],
];
const models = modelData.map(([value, label, url]) => ({
  value,
  label,
  icon: () => h(ModelLogo, { url }),
}));
const actions = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: ImagePlus,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: Puzzle,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: FileText,
  },
];
const loading = ref(false),
  sent = ref<string>(),
  notice = ref<string>(),
  reduce = ref(false);
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
function submit(prompt: string) {
  cancel();
  sent.value = undefined;
  notice.value = undefined;
  loading.value = true;
  later(900, () => {
    loading.value = false;
    sent.value = prompt;
  });
}
function stop() {
  cancel();
  loading.value = false;
}
function action(value: string) {
  const item = actions.find((candidate) => candidate.value === value);
  notice.value = item ? `${item.label} selected.` : undefined;
}
onMounted(() => {
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
</script>
<template>
  <div class="flex h-[360px] w-full max-w-xl flex-col justify-center">
    <PromptInput
      :models="models"
      :actions="actions"
      default-model="gpt-5.2"
      default-value="Review the current implementation and suggest the next improvement."
      :loading="loading"
      @submit="submit"
      @stop="stop"
      @action="action"
    />
    <div class="h-8 px-2 pt-2 text-xs text-muted-foreground">
      <AnimatePresence mode="wait"
        ><motion.p
          v-if="sent || notice"
          :key="sent ?? notice"
          :initial="reduce ? { opacity: 1 } : { opacity: 0, y: 3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }"
          >{{ sent ? "Prompt sent to the selected model." : notice }}</motion.p
        ></AnimatePresence
      >
    </div>
  </div>
</template>
