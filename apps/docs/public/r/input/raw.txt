<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId } from "vue";
import { AnimatePresence, animate, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import RenderContent from "../../../lib/RenderContent";
import { useMotionState } from "../../state";
import { watch } from "vue";
export interface InputProps {
  modelValue?: string; defaultValue?: string; label?: string; error?: string | boolean; reserveErrorLine?: boolean;
  success?: boolean; disabled?: boolean; type?: string; id?: string; leftIcon?: any; rightIcon?: any; classNames?: Record<string, string>;
}
const props = withDefaults(defineProps<InputProps>(), { defaultValue: "", type: "text" });
const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);
const value = useMotionState(props, emit, "modelValue", props.defaultValue);
const generatedId = useId(), attrs = useAttrs(), reduced = useReducedMotion();
const controlId = computed(() => props.id ?? generatedId);
const focused = ref(false), field = ref<HTMLElement | null>(null), input = ref<HTMLInputElement | null>(null);
const state = computed(() => props.error ? "error" : props.success ? "success" : focused.value ? "focused" : "idle");
const descriptionIds = computed(() => [attrs["aria-describedby"], typeof props.error === "string" ? `${controlId.value}-error` : undefined].filter(Boolean).join(" ") || undefined);
let feedback: ReturnType<typeof animate> | undefined, disposed = false;
function errorFeedback() {
  feedback?.stop();
  if (props.error && field.value && !reduced.value) feedback = animate(field.value, { x: [0, -6, 6, -4, 4, -2, 0] }, { duration: 0.45 });
}
function edit(event: Event) {
  if (event.defaultPrevented || props.disabled) return;
  value.value = (event.target as HTMLInputElement).value;
  void nextTick(() => { if (!disposed && input.value && input.value.value !== value.value) input.value.value = value.value; });
}
function focus(event: FocusEvent) { focused.value = true; emit("focus", event); }
function blur(event: FocusEvent) { focused.value = false; emit("blur", event); }
watch([() => !!props.error, reduced], errorFeedback);
onMounted(errorFeedback);
onBeforeUnmount(() => { disposed = true; feedback?.stop(); });
defineExpose({ focus: () => input.value?.focus(), input });
</script>
<template>
  <div :class="cn('flex flex-col gap-1.5', $attrs.class, classNames?.root)">
    <label v-if="label" :for="controlId" :class="cn('px-1 text-sm font-medium text-foreground', classNames?.label)">{{ label }}</label>
    <div ref="field" :data-state="state" :class="cn('relative h-11 overflow-hidden rounded-full border transition-colors duration-200 border-border', focused && !error && 'border-foreground/40 ring-2 ring-ring/40', error && 'border-destructive ring-2 ring-destructive/25', disabled && 'opacity-60', classNames?.field)">
      <span v-if="$slots.leftIcon || leftIcon" :class="cn('pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4', classNames?.leftIcon)"><slot name="leftIcon"><RenderContent :node="leftIcon" /></slot></span>
      <input ref="input" v-bind="{ ...$attrs, class: undefined }" :id="controlId" :type="type" :value="value" :disabled="disabled" :aria-invalid="!!error || undefined" :aria-describedby="descriptionIds"
        @input="edit" @focus="focus" @blur="blur" :class="cn('peer h-full w-full bg-transparent text-base leading-6 text-foreground caret-foreground outline-none placeholder:text-muted-foreground/75', $slots.leftIcon || leftIcon ? 'pl-10' : 'pl-3.5', $slots.rightIcon || rightIcon || success ? 'pr-10' : 'pr-3.5', disabled && 'cursor-not-allowed', classNames?.input)" />
      <motion.svg v-if="success" viewBox="0 0 24 24" fill="none" :class="cn('absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-(--color-success)', classNames?.successIcon)">
        <motion.path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" :stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          :initial="{ pathLength: reduced ? 1 : 0 }" :animate="{ pathLength: 1 }" :transition="{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }" />
      </motion.svg>
      <span v-else-if="$slots.rightIcon || rightIcon" :class="cn('absolute right-0 top-0 flex h-full items-center text-muted-foreground [&_button]:grid [&_button]:size-11 [&_button]:place-items-center [&_svg]:h-4 [&_svg]:w-4', classNames?.rightIcon)"><slot name="rightIcon"><RenderContent :node="rightIcon" /></slot></span>
    </div>
    <div :class="reserveErrorLine ? 'min-h-4' : 'contents'"><AnimatePresence :initial="false">
      <motion.p v-if="typeof error === 'string' && error" :id="`${controlId}-error`" role="alert"
        :initial="reduced ? { opacity: 0 } : { opacity: 0, y: -4, filter: 'blur(4px)' }" :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -4, filter: 'blur(4px)' }" :transition="{ duration: 0.2 }" :class="cn('px-1 text-xs text-destructive', classNames?.errorMessage)">{{ error }}</motion.p>
    </AnimatePresence></div>
  </div>
</template>
