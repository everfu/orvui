<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Check, LoaderCircle, Sparkles, X } from "lucide-vue-next";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
  type ToastInput,
  type ToastPosition,
} from "./index";
const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const examples: (ToastInput & { label: string })[] = [
  { label: "Title only", status: "success", title: "Saved", duration: 0 },
  {
    label: "Promise",
    status: "loading",
    title: "Publishing component",
    description: "Bundling source, preview, and registry metadata.",
    duration: 0,
  },
  {
    label: "Success",
    status: "success",
    title: "Component published",
    description: "Registry endpoint and raw source are available.",
  },
  {
    label: "Error",
    status: "error",
    title: "Snapshot failed",
    description: "Retry after the browser target settles.",
  },
];
const position = ref<ToastPosition>("bottom-right"),
  { toasts, showToast, updateToast, dismissToast, clearToasts } =
    useAnimatedToastStack({ defaultDuration: 3600, limit: 5 }),
  timers = new Set<ReturnType<typeof setTimeout>>();
function openToast(input: ToastInput) {
  const id = showToast(input);
  if (input.status !== "loading") return;
  const timer = setTimeout(() => {
    timers.delete(timer);
    updateToast(id, {
      status: "success",
      title: "Publish complete",
      description: "Toast updated in-place from loading to success.",
      duration: 3200,
    });
  }, 1800);
  timers.add(timer);
}
function moveStack(value: ToastPosition) {
  position.value = value;
  showToast({
    status: "info",
    title: "Position changed",
    description: `New toasts open from ${value}.`,
  });
}
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
});
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <AnimatedToastStack
      :toasts="toasts"
      :position="position"
      placement="fixed"
      :max-visible="4"
      :class-names="{ surface: 'bg-card/95' }"
      :icons="{ neutral: Sparkles }"
      @dismiss="dismissToast"
    />
    <div class="flex flex-col items-center gap-2 text-center">
      <p class="text-sm font-medium text-foreground">Open a real toast</p>
      <p class="max-w-sm text-xs leading-5 text-muted-foreground">
        Toasts render fixed on the screen. Change position to open a toast from
        that edge.
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="example in examples"
        :key="example.label"
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors press hover:border-(--color-border-strong)"
        @click="openToast(example)"
      >
        <component
          :is="
            example.status === 'loading'
              ? LoaderCircle
              : example.status === 'success'
                ? Check
                : X
          "
          class="h-3.5 w-3.5"
        />{{ example.label }}</button
      ><button
        type="button"
        class="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-muted-foreground press hover:bg-foreground/[0.06] hover:text-foreground"
        @click="clearToasts"
      >
        Clear
      </button>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-1.5">
      <button
        v-for="option in positions"
        :key="option"
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors press',
          position === option
            ? 'bg-foreground text-background'
            : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground',
        ]"
        @click="moveStack(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
