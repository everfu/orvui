<script setup lang="ts">
import { Checkbox } from "../../../motion/checkbox";
import { RadioGroup, RadioGroupItem } from "../../../motion/radio";
import { Input } from "../../../motion/input";
import { cn } from "../../../lib/utils";
import type { ApprovalCardAnswer, ApprovalCardQuestion } from "./types";
const props = defineProps<{
  question: ApprovalCardQuestion;
  answer: ApprovalCardAnswer;
  disabled: boolean;
}>();
const emit = defineEmits<{
  change: [answer: ApprovalCardAnswer];
  singleSelect: [];
}>();
function multiple(value: string, checked: boolean) {
  const values = new Set(props.answer.selected);
  if (checked) values.add(value);
  else values.delete(value);
  emit("change", { ...props.answer, selected: [...values] });
}
function single(value: string) {
  emit("change", { selected: [value], custom: "" });
  emit("singleSelect");
}
function custom(value: string) {
  emit("change", {
    selected: props.question.multiple ? props.answer.selected : [],
    custom: value,
  });
}
</script>
<template>
  <div class="mt-3">
    <template v-if="question.options?.length">
      <div v-if="question.multiple" class="grid gap-0.5">
        <Checkbox
          v-for="option in question.options"
          :key="option.value"
          :model-value="answer.selected.includes(option.value)"
          :disabled="disabled || option.disabled"
          :label="option.label"
          :description="option.description"
          @update:model-value="multiple(option.value, $event)"
          class="min-h-9 rounded-lg px-1.5 py-1"
        />
      </div>
      <RadioGroup
        v-else
        :model-value="answer.selected[0] ?? ''"
        @update:model-value="single"
        class="gap-0.5"
        ><RadioGroupItem
          v-for="option in question.options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :description="option.description"
          :disabled="disabled || option.disabled"
          class="min-h-9 rounded-lg px-1.5 py-1"
      /></RadioGroup> </template
    ><Input
      v-if="question.allowCustom"
      :model-value="answer.custom ?? ''"
      :disabled="disabled"
      :placeholder="question.customPlaceholder ?? 'Add another response…'"
      aria-label="Custom answer"
      @update:model-value="custom"
      :class="cn('p-0.5', question.options?.length && 'mt-1.5')"
      :class-names="{
        field:
          'h-10 rounded-xl border-0 bg-background/70 focus-within:bg-background',
        input: 'px-3 text-sm',
      }"
    />
  </div>
</template>
