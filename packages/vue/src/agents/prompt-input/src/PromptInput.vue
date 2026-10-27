<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ArrowUp, Plus, Square } from "lucide-vue-next";
import { Button } from "../../../motion/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../motion/select";
import {
  MorphPopover,
  MorphPopoverContent,
  MorphPopoverTrigger,
} from "../../../motion/popover";
import { SPRING_SWAP } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import {
  RenderNode,
  useControllable,
  useReduced,
  type Content,
} from "../../shared";
export interface PromptModel {
  value: string;
  label: Content;
  icon?: Content;
  disabled?: boolean;
}
export interface PromptAction {
  value: string;
  label: Content;
  description?: Content;
  icon?: Content;
  disabled?: boolean;
}
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    defaultValue?: string;
    models?: PromptModel[];
    model?: string;
    defaultModel?: string;
    actions?: PromptAction[];
    loading?: boolean;
    minRows?: number;
    maxRows?: number;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  {
    defaultValue: "",
    models: () => [],
    actions: () => [],
    loading: false,
    minRows: 2,
    maxRows: 8,
    placeholder: "Ask the agent to do something…",
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: string];
  valueChange: [value: string];
  "update:model": [value: string];
  modelChange: [value: string];
  action: [action: string];
  submit: [value: string, model?: string];
  stop: [];
}>();
const value = useControllable(
  () => props.modelValue,
  props.defaultValue,
  (next) => {
    emit("update:modelValue", next);
    emit("valueChange", next);
  },
);
const selected = useControllable(
  () => props.model,
  props.defaultModel ?? props.models[0]?.value,
  (next) => {
    if (next !== undefined) {
      emit("update:model", next);
      emit("modelChange", next);
    }
  },
);
const selectedModel = computed(() =>
  props.models.find((item) => item.value === selected.value),
);
const ready = computed(
  () => value.value.trim().length > 0 && !props.disabled && !props.loading,
);
const textarea = ref<HTMLTextAreaElement>();
const measurement = ref<HTMLElement>();
const menu = ref(false);
const reduced = useReduced();
const attrs = useAttrs();
const instance = getCurrentInstance();
const stoppable = () => !!instance?.vnode.props?.onStop;
const inputAttributes = () =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style"),
  );
let observer: ResizeObserver | undefined,
  alive = false;
function fit() {
  if (!alive || !textarea.value || !measurement.value) return;
  const height = Math.min(
    props.maxRows * 24,
    Math.max(props.minRows * 24, measurement.value.scrollHeight),
  );
  textarea.value.style.height = `${height}px`;
}
function input(event: Event) {
  const element = event.target as HTMLTextAreaElement;
  value.value = element.value;
  nextTick(() => {
    if (!alive) return;
    if (props.modelValue !== undefined) element.value = props.modelValue;
    fit();
  });
}
function submit() {
  if (!ready.value) return;
  emit("submit", value.value.trim(), selected.value);
  if (props.modelValue === undefined) value.value = "";
  textarea.value?.focus({ preventScroll: true });
}
function keydown(event: KeyboardEvent) {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  submit();
}
function choose(action: PromptAction) {
  if (!action.disabled) {
    emit("action", action.value);
    menu.value = false;
  }
}
watch([value, () => props.minRows, () => props.maxRows], () => nextTick(fit));
onMounted(() => {
  alive = true;
  fit();
  if (textarea.value && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(fit);
    observer.observe(textarea.value);
  }
});
onBeforeUnmount(() => {
  alive = false;
  observer?.disconnect();
});
</script>
<template>
  <form
    :class="
      cn(
        'relative w-full rounded-2xl border border-border/80 bg-background p-2 transition-colors focus-within:border-foreground/40',
        disabled && 'opacity-60',
        $attrs.class,
      )
    "
    :style="$attrs.style as any"
    @submit.prevent="submit"
  >
    <div
      ref="measurement"
      aria-hidden="true"
      class="pointer-events-none invisible absolute inset-x-2 top-0 whitespace-pre-wrap px-2 text-sm leading-6 [overflow-wrap:break-word]"
    >
      {{ value + "​" }}
    </div>
    <textarea
      ref="textarea"
      v-bind="inputAttributes()"
      :value="value"
      :rows="minRows"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-label="($attrs['aria-label'] as string) || 'Prompt'"
      class="scrollbar-hide block w-full resize-none overflow-y-auto bg-transparent px-2 pt-1.5 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/55"
      @input="input"
      @keydown="keydown"
    />
    <div class="mt-1 flex min-h-8 items-center gap-1">
      <MorphPopover v-if="actions.length" v-model:open="menu"
        ><MorphPopoverTrigger
          ><Button
            type="button"
            variant="ghost"
            size="icon"
            :disabled="disabled || loading"
            aria-label="Add to prompt"
            class="size-8 rounded-full"
            ><motion.span
              aria-hidden="true"
              :animate="{ rotate: menu ? 45 : 0 }"
              :transition="reduced ? { duration: 0 } : SPRING_SWAP"
              ><Plus class="size-4" /></motion.span></Button
        ></MorphPopoverTrigger>
        <MorphPopoverContent
          side="top"
          align="start"
          :side-offset="8"
          :radius="12"
          class="w-56 p-1.5"
        >
          <button
            v-for="action in actions"
            :key="action.value"
            type="button"
            :disabled="action.disabled"
            @click="choose(action)"
            class="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            <span
              v-if="action.icon"
              class="mt-0.5 grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4"
              ><RenderNode :node="action.icon" /></span
            ><span class="min-w-0"
              ><span class="block text-sm"
                ><RenderNode :node="action.label" /></span
              ><span
                v-if="action.description"
                class="mt-0.5 block text-xs leading-4 text-muted-foreground"
                ><RenderNode :node="action.description" /></span
            ></span>
          </button>
        </MorphPopoverContent>
      </MorphPopover>
      <slot name="leading-action" />
      <Select
        v-if="models.length"
        :model-value="selected"
        :disabled="disabled || loading"
        class="min-w-0"
        @update:model-value="selected = $event"
        ><SelectTrigger
          aria-label="AI model"
          class="h-8 w-auto max-w-52 rounded-xl border-0 bg-transparent px-2 py-0 text-xs hover:bg-muted focus-visible:ring-2"
          ><span class="flex min-w-0 items-center gap-1.5"
            ><span
              v-if="selectedModel?.icon"
              class="grid size-4 shrink-0 place-items-center text-muted-foreground [&_svg]:size-3.5"
              ><RenderNode :node="selectedModel.icon" /></span
            ><span class="truncate text-muted-foreground"
              ><RenderNode
                :node="selectedModel?.label ?? 'Choose model'" /></span></span
        ></SelectTrigger>
        <SelectContent class="right-auto w-52 shadow-none"
          ><SelectItem
            v-for="option in models"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            class="py-2"
            ><span class="flex min-w-0 items-center gap-2"
              ><span
                v-if="option.icon"
                class="grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4"
                ><RenderNode :node="option.icon" /></span
              ><span class="min-w-0 truncate text-sm"
                ><RenderNode :node="option.label" /></span></span></SelectItem
        ></SelectContent>
      </Select>
      <Button
        :type="loading ? 'button' : 'submit'"
        size="icon"
        :disabled="loading ? !stoppable() : !ready"
        :aria-label="loading ? 'Stop generating' : 'Send prompt'"
        class="ml-auto size-8 rounded-full"
        @click="loading && emit('stop')"
        ><AnimatePresence :initial="false" mode="popLayout"
          ><motion.span
            :key="loading ? 'stop' : 'send'"
            class="grid place-items-center"
            :initial="
              reduced ? { opacity: 1 } : { opacity: 0, y: 3, scale: 0.8 }
            "
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -3, scale: 0.8 }"
            :transition="reduced ? { duration: 0 } : SPRING_SWAP"
            ><Square v-if="loading" class="size-3 fill-current" /><ArrowUp
              v-else
              class="size-4" /></motion.span></AnimatePresence
      ></Button>
    </div>
  </form>
</template>
