<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, useId } from "vue";
import { motion, AnimatePresence, animate } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useOtpFields } from "./use-otp-fields";
defineOptions({ inheritAttrs: false });
export type OTPStatus = "idle" | "error" | "success";
const props = withDefaults(
  defineProps<{
    length?: number;
    modelValue?: string;
    value?: string;
    defaultValue?: string;
    label?: string;
    hint?: string;
    successMessage?: string;
    errorMessage?: string;
    status?: OTPStatus;
    mask?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    ariaLabel?: string;
    className?: string;
  }>(),
  {
    length: 6,
    defaultValue: "",
    status: "idle",
    mask: false,
    disabled: false,
    autoFocus: false,
    ariaLabel: "One-time passcode",
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  complete: [value: string];
}>();
const editor = useOtpFields({
  length: () => props.length,
  value: () => props.modelValue ?? props.value,
  initial: props.defaultValue,
  masked: () => props.mask,
  changed(value) {
    emit("update:modelValue", value);
    emit("change", value);
  },
  completed(value) {
    emit("complete", value);
  },
});
const { count, fields, cursor, announcement } = editor;
const id = useId();
const input = ref<HTMLInputElement>();
const strip = ref<HTMLDivElement>();
const focused = ref(false);
const reduce = useReducedMotion();
const message = computed(() =>
  props.status === "success"
    ? props.successMessage
    : props.status === "error"
      ? props.errorMessage
      : props.hint,
);
const messageTone = computed(() =>
  props.status === "success"
    ? "text-emerald-500"
    : props.status === "error"
      ? "text-destructive"
      : "text-muted-foreground",
);
function tone(value: string, index: number) {
  return cn(
    props.status === "success"
      ? "border-emerald-500/60 text-foreground"
      : props.status === "error"
        ? "border-destructive/60 text-foreground"
        : value
          ? "border-border-strong text-foreground"
          : "border-border text-muted-foreground",
    focused.value &&
      cursor.value === index &&
      props.status === "idle" &&
      "border-foreground",
    props.disabled && "opacity-50",
  );
}
function keydown(event: KeyboardEvent) {
  if (props.disabled || event.metaKey || event.altKey || event.ctrlKey) return;
  if (/^[0-9]$/.test(event.key)) {
    event.preventDefault();
    editor.insert(event.key);
    return;
  }
  if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    editor.erase(event.key === "Backspace");
    return;
  }
  if (editor.navigate(event.key)) event.preventDefault();
}
function pointer(event: MouseEvent) {
  if (props.disabled) return;
  event.preventDefault();
  const children = Array.from(strip.value?.children ?? []);
  const position = children.findIndex(
    (element) => event.clientX < element.getBoundingClientRect().right,
  );
  const firstEmpty = fields.value.indexOf("");
  cursor.value = Math.min(
    position < 0 ? count.value - 1 : position,
    firstEmpty < 0 ? count.value - 1 : firstEmpty,
  );
  input.value?.focus();
}
function autofill(event: Event) {
  const field = event.target as HTMLInputElement;
  const value = field.value;
  field.value = "";
  if (!props.disabled) editor.replace(value);
}
function paste(event: ClipboardEvent) {
  if (props.disabled) return;
  event.preventDefault();
  editor.insert(event.clipboardData?.getData("text") ?? "");
}
let feedback: ReturnType<typeof animate> | undefined;
watch(
  () => props.status,
  (status) => {
    if (status !== "error" || reduce.value || !strip.value) return;
    feedback?.stop();
    feedback = animate(
      strip.value,
      { x: [0, -5, 5, -3, 3, -1, 0] },
      { duration: 0.45, ease: EASE_OUT },
    );
  },
);
onMounted(() => {
  if (props.autoFocus) input.value?.focus();
});
onBeforeUnmount(() => feedback?.stop());
</script>

<template>
  <div
    :class="cn('inline-flex flex-col gap-2', className, $attrs.class as string)"
    :style="$attrs.style as any"
    :data-status="status"
  >
    <label
      v-if="label"
      :for="id + '-input'"
      class="text-sm font-medium text-foreground"
      >{{ label }}</label
    >
    <fieldset
      class="relative m-0 inline-flex w-max border-0 p-0"
      @mousedown="pointer"
    >
      <input
        ref="input"
        v-bind="{ ...$attrs, class: undefined, style: undefined }"
        :id="id + '-input'"
        inputmode="numeric"
        autocomplete="one-time-code"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-invalid="status === 'error'"
        :aria-describedby="message ? id + '-hint' : undefined"
        value=""
        :maxlength="count"
        @keydown="keydown"
        @input="autofill"
        @paste="paste"
        @focus="focused = true"
        @blur="focused = false"
        class="absolute inset-0 z-20 h-full w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0 outline-none disabled:cursor-not-allowed"
      />
      <div ref="strip" class="flex items-center gap-2">
        <div
          v-for="(digit, index) in fields"
          :key="id + '-' + index"
          :data-active="focused && index === cursor"
          :data-filled="digit !== ''"
          :class="
            cn(
              'relative grid h-14 w-12 place-items-center overflow-hidden rounded-xl border text-xl font-semibold tabular-nums transition-colors duration-200',
              tone(digit, index),
            )
          "
        >
          <motion.span
            v-if="focused && index === cursor && status !== 'success'"
            aria-hidden="true"
            :animate="reduce ? undefined : { opacity: [1, 1, 0, 0] }"
            :transition="
              reduce
                ? undefined
                : { duration: 1, repeat: Infinity, ease: 'linear' }
            "
            :class="
              cn(
                'pointer-events-none absolute top-1/2 h-6 w-px -translate-y-1/2 bg-foreground',
                digit ? 'right-3' : 'left-1/2 -translate-x-1/2',
              )
            "
          />
          <AnimatePresence :initial="false">
            <motion.span
              v-if="digit"
              :key="digit"
              class="absolute inset-0 grid place-items-center leading-none"
              :initial="
                reduce
                  ? { opacity: 0 }
                  : { y: 14, opacity: 0, filter: 'blur(4px)' }
              "
              :animate="
                reduce
                  ? { opacity: 1 }
                  : { y: 0, opacity: 1, filter: 'blur(0px)' }
              "
              :exit="
                reduce
                  ? { opacity: 0 }
                  : { y: -14, opacity: 0, filter: 'blur(4px)' }
              "
              :transition="
                reduce ? { duration: 0 } : { duration: 0.22, ease: EASE_OUT }
              "
              >{{ mask ? "•" : digit }}</motion.span
            >
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        <motion.span
          v-if="status === 'success'"
          aria-hidden="true"
          class="pointer-events-none absolute -right-7 top-1/2 -translate-y-1/2 text-emerald-500"
          :initial="reduce ? { opacity: 0 } : { scale: 0.6, opacity: 0 }"
          :animate="reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }"
          :exit="reduce ? { opacity: 0 } : { scale: 0.6, opacity: 0 }"
          :transition="
            reduce
              ? { duration: 0 }
              : { type: 'spring', stiffness: 500, damping: 28 }
          "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <title>Verified</title>
            <motion.path
              d="M5 13l4 4L19 7"
              :initial="{ pathLength: reduce ? 1 : 0 }"
              :animate="{ pathLength: 1 }"
              :transition="
                reduce
                  ? { duration: 0 }
                  : { duration: 0.35, ease: EASE_OUT, delay: 0.1 }
              "
            />
          </svg>
        </motion.span>
      </AnimatePresence>
    </fieldset>
    <span aria-live="polite" aria-atomic="true" class="sr-only">{{
      announcement
    }}</span>
    <p
      v-if="message"
      :id="id + '-hint'"
      aria-live="polite"
      :class="cn('text-sm', messageTone)"
    >
      {{ message }}
    </p>
  </div>
</template>
