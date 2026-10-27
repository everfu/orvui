<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  watch,
  type VNodeChild,
} from "vue";
import { AnimatePresence, motion } from "motion-v";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  LoaderCircle,
  MessageSquareText,
  X,
} from "lucide-vue-next";
import { Button } from "../../../motion/button";
import { ActionSwapRollText } from "../../../motion/action-swap";
import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import AgentDisclosure from "../../AgentDisclosure.vue";
import QuestionOptions from "./QuestionOptions.vue";
import type {
  ApprovalCardAnswer,
  ApprovalCardAnswers,
  ApprovalCardQuestion,
  ApprovalCardStatus,
} from "./types";
defineSlots<{ default?: () => VNodeChild }>();
const props = withDefaults(
  defineProps<{
    title?: Content;
    description?: Content;
    questions?: ApprovalCardQuestion[];
    status?: ApprovalCardStatus;
    answers?: ApprovalCardAnswers;
    defaultAnswers?: ApprovalCardAnswers;
    step?: number;
    defaultStep?: number;
    approveLabel?: Content;
    submitLabel?: Content;
    result?: Content;
  }>(),
  {
    title: "Approval required",
    questions: () => [],
    status: "pending",
    defaultAnswers: () => ({}),
    defaultStep: 0,
    approveLabel: "Approve",
    submitLabel: "Submit response",
    result: undefined,
  },
);
const emit = defineEmits<{
  "update:answers": [answers: ApprovalCardAnswers];
  answersChange: [answers: ApprovalCardAnswers];
  "update:step": [step: number];
  stepChange: [step: number];
  submit: [answers: ApprovalCardAnswers];
  approve: [];
  reject: [];
  requestChanges: [];
  dismiss: [];
}>();
const responses = useControllable(
  () => props.answers,
  props.defaultAnswers,
  (value) => {
    emit("update:answers", value);
    emit("answersChange", value);
  },
);
const position = useControllable(
  () => props.step,
  props.defaultStep,
  (value) => {
    emit("update:step", value);
    emit("stepChange", value);
  },
);
const cursor = computed(() =>
  Math.max(0, Math.min(position.value, props.questions.length - 1)),
);
const currentQuestion = computed(() => props.questions[cursor.value]);
const currentAnswer = computed<ApprovalCardAnswer>(() =>
  currentQuestion.value
    ? (responses.value[currentQuestion.value.id] ?? {
        selected: [],
        custom: "",
      })
    : { selected: [], custom: "" },
);
const busy = computed(() => props.status === "submitting");
const interactive = computed(() =>
  ["pending", "submitting"].includes(props.status),
);
const valid = computed(
  () =>
    currentAnswer.value.selected.length > 0 ||
    !!currentAnswer.value.custom?.trim(),
);
const reduced = useReducedMotion();
const instance = getCurrentInstance();
const has = (event: string) => !!instance?.vnode.props?.[event];
const label = computed(
  () =>
    ({
      pending: "Input required",
      submitting: "Submitting",
      approved: "Approved",
      rejected: "Rejected",
      "changes-requested": "Changes requested",
      answered: "Response submitted",
    })[props.status],
);
const successful = computed(() =>
  ["approved", "answered"].includes(props.status),
);
const tone = computed(() =>
  successful.value
    ? "emerald"
    : props.status === "rejected"
      ? "rose"
      : props.status === "changes-requested"
        ? "amber"
        : "muted",
);
const tones = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  rose: "text-rose-600 dark:text-rose-400",
  amber: "text-amber-600 dark:text-amber-400",
  muted: "text-muted-foreground",
};
const badges = {
  amber:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  emerald:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
const badge = computed(
  () =>
    badges[
      props.status === "pending" || props.status === "changes-requested"
        ? "amber"
        : busy.value
          ? "blue"
          : successful.value
            ? "emerald"
            : "rose"
    ],
);
let pending: ReturnType<typeof setTimeout> | undefined;
function cancelAdvance() {
  if (pending !== undefined) clearTimeout(pending);
  pending = undefined;
}
function go(value: number) {
  cancelAdvance();
  position.value = value;
}
function answer(value: ApprovalCardAnswer) {
  if (currentQuestion.value)
    responses.value = { ...responses.value, [currentQuestion.value.id]: value };
}
function advance() {
  if (!valid.value || busy.value) return;
  if (cursor.value + 1 < props.questions.length) go(cursor.value + 1);
  else emit("submit", responses.value);
}
function automatic() {
  cancelAdvance();
  const question = currentQuestion.value,
    starting = cursor.value;
  if (
    !question ||
    question.multiple ||
    question.autoAdvance === false ||
    starting + 1 >= props.questions.length ||
    busy.value
  )
    return;
  pending = setTimeout(() => {
    pending = undefined;
    if (
      props.status === "pending" &&
      cursor.value === starting &&
      currentQuestion.value?.id === question.id
    )
      go(starting + 1);
  }, 240);
}
watch(
  () => props.status,
  () => {
    if (props.status !== "pending") cancelAdvance();
  },
);
onBeforeUnmount(cancelAdvance);
</script>
<template>
  <div
    :data-state="status"
    :aria-busy="busy"
    class="w-full overflow-hidden rounded-2xl bg-muted p-4 text-sm"
  >
    <div class="flex items-start gap-3">
      <span
        aria-hidden="true"
        :class="
          cn(
            'grid size-5 shrink-0 place-items-center text-muted-foreground',
            tones[tone],
          )
        "
        ><LoaderCircle
          v-if="busy"
          :class="cn('size-4', !reduced && 'animate-spin')" /><CircleHelp
          v-else-if="interactive && questions.length"
          class="size-4" /><MessageSquareText
          v-else-if="interactive"
          class="size-4" /><X
          v-else-if="status === 'rejected'"
          class="size-4" /><Check v-else class="size-4"
      /></span>
      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 items-start gap-3">
          <h3
            class="min-w-0 flex-1 text-base font-medium leading-5 text-foreground"
          >
            <ActionSwapRollText :value="currentQuestion?.id ?? String(status)"
              ><RenderNode :node="currentQuestion?.title ?? title"
            /></ActionSwapRollText>
          </h3>
          <template v-if="questions.length && interactive"
            ><span
              v-if="questions.length > 1"
              class="shrink-0 text-xs tabular-nums text-muted-foreground/65"
              >{{ cursor + 1 }}/{{ questions.length }}</span
            ></template
          ><span
            v-else
            :class="
              cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors',
                badge,
              )
            "
            >{{ label }}</span
          >
          <button
            v-if="has('onDismiss')"
            type="button"
            aria-label="Dismiss"
            @click="emit('dismiss')"
            class="grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X class="size-4" />
          </button>
        </div>
        <AgentDisclosure :open="interactive"
          ><AnimatePresence v-if="currentQuestion" :initial="false" mode="wait"
            ><motion.div
              :key="currentQuestion.id"
              :initial="reduced ? { opacity: 1 } : { opacity: 0, x: 8 }"
              :animate="{ opacity: 1, x: 0 }"
              :exit="reduced ? { opacity: 0 } : { opacity: 0, x: -6 }"
              :transition="{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }"
            >
              <p
                v-if="currentQuestion.description"
                class="mt-1 leading-5 text-muted-foreground"
              >
                <RenderNode :node="currentQuestion.description" />
              </p>
              <QuestionOptions
                :question="currentQuestion"
                :answer="currentAnswer"
                :disabled="busy"
                @change="answer"
                @single-select="automatic"
              /> </motion.div
          ></AnimatePresence>
          <div v-else>
            <p v-if="description" class="mt-1 leading-5 text-muted-foreground">
              <RenderNode :node="description" />
            </p>
            <div v-if="$slots.default" class="mt-3"><slot /></div>
          </div>
          <div v-if="questions.length" class="mt-4 flex items-center gap-3">
            <template v-if="questions.length > 1"
              ><Button
                variant="ghost"
                size="icon"
                aria-label="Previous question"
                :disabled="busy || cursor === 0"
                @click="go(cursor - 1)"
                class="rounded-full"
                ><ArrowLeft class="size-4" /></Button
              ><span class="flex gap-1.5"
                ><span class="sr-only"
                  >Question {{ cursor + 1 }} of {{ questions.length }}</span
                ><motion.span
                  v-for="(item, index) in questions"
                  :key="item.id"
                  aria-hidden="true"
                  :initial="{
                    scale: index === cursor ? 1 : 0.75,
                    opacity: index <= cursor ? 1 : 0.35,
                  }"
                  :animate="{
                    scale: index === cursor ? 1 : 0.75,
                    opacity: index <= cursor ? 1 : 0.35,
                  }"
                  :transition="reduced ? { duration: 0 } : SPRING_SWAP"
                  class="size-1.5 rounded-full bg-foreground" /></span
            ></template>
            <Button
              :size="cursor === questions.length - 1 ? 'sm' : 'icon'"
              :aria-label="
                cursor === questions.length - 1
                  ? 'Submit response'
                  : 'Next question'
              "
              :disabled="busy || !valid"
              @click="advance"
              class="ml-auto rounded-full"
              ><LoaderCircle
                v-if="busy"
                :class="cn('size-4', !reduced && 'animate-spin')" /><template
                v-else-if="cursor === questions.length - 1"
                ><RenderNode :node="submitLabel" /><ArrowRight
                  class="size-3.5" /></template
              ><ArrowRight v-else class="size-4"
            /></Button>
          </div>
          <div v-else class="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              :disabled="busy"
              @click="emit('approve')"
              class="rounded-full"
              ><RenderNode :node="approveLabel" /></Button
            ><Button
              v-if="has('onRequestChanges')"
              variant="secondary"
              size="sm"
              :disabled="busy"
              @click="emit('requestChanges')"
              class="rounded-full"
              >Request changes</Button
            ><Button
              v-if="has('onReject')"
              variant="ghost"
              size="sm"
              :disabled="busy"
              @click="emit('reject')"
              class="rounded-full text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
              >Reject</Button
            >
          </div>
        </AgentDisclosure>
        <p v-if="!interactive" class="mt-1 text-sm text-muted-foreground">
          <RenderNode :node="result ?? label" />
        </p>
      </div>
    </div>
  </div>
</template>
