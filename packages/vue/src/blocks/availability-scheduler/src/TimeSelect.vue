<script setup lang="ts">
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../motion/select";
import type { TimeOption } from "./types";
defineProps<{
  value: string;
  open: boolean;
  options: TimeOption[];
  disabled?: boolean;
  label?: string;
}>();
const emit = defineEmits<{
  change: [value: string];
  "update:open": [open: boolean];
}>();
</script>
<template>
  <Select
    :model-value="value"
    :open="open"
    :disabled="disabled"
    class="w-full"
    @update:model-value="emit('change', $event)"
    @update:open="emit('update:open', $event)"
    ><SelectTrigger :aria-label="label" class="tabular-nums"
      ><SelectValue class="whitespace-nowrap" /></SelectTrigger
    ><SelectContent
      ><div class="max-h-56 overflow-y-auto overscroll-contain">
        <SelectItem
          v-for="{ value: option, label: caption } in options"
          :key="option"
          :value="option"
          class="tabular-nums"
          >{{ caption }}</SelectItem
        >
      </div></SelectContent
    ></Select
  >
</template>
