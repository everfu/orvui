<script setup lang="ts">
import { cn } from "../../../lib/utils";
import { useControllable, type Content } from "../../shared";
import type { SwipeableListClassNames } from "./source-types";
import SwipeableRow from "./SwipeableRow.vue";
export type SwipeSide = "left" | "right";
export interface SwipeableListValue {
  id: string;
  side: SwipeSide;
}
export type SwipeActionTone =
  "neutral" | "primary" | "success" | "warning" | "danger";
export interface SwipeAction {
  id: string;
  label: Content;
  icon: Content;
  tone?: SwipeActionTone;
  disabled?: boolean;
  onClick?: (item: SwipeableListItem) => void;
}
export interface SwipeableListItem {
  id: string;
  title?: Content;
  description?: Content;
  meta?: Content;
  leading?: Content;
  content?: Content;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  disabled?: boolean;
}
const props = withDefaults(
  defineProps<{
    items: SwipeableListItem[];
    modelValue?: SwipeableListValue | null;
    defaultValue?: SwipeableListValue | null;
    actionWidth?: number;
    revealThreshold?: number;
    closeOnAction?: boolean;
    classNames?: SwipeableListClassNames;
  }>(),
  {
    defaultValue: null,
    actionWidth: 56,
    revealThreshold: 34,
    closeOnAction: true,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: SwipeableListValue | null];
  valueChange: [value: SwipeableListValue | null];
  action: [
    payload: { item: SwipeableListItem; action: SwipeAction; side: SwipeSide },
  ];
}>();
const value = useControllable(
  () => props.modelValue,
  props.defaultValue,
  (next) => {
    emit("update:modelValue", next);
    emit("valueChange", next);
  },
);
</script>
<template>
  <div :class="cn('flex w-full flex-col gap-2', classNames?.root)">
    <SwipeableRow
      v-for="item in items"
      :key="item.id"
      :item="item"
      :action-width="actionWidth"
      :reveal-threshold="revealThreshold"
      :open-value="value"
      :close-on-action="closeOnAction"
      :class-names="classNames"
      @change="value = $event"
      @action="emit('action', $event)"
      ><template v-if="$slots.item" #default="scope"
        ><slot name="item" v-bind="scope" /></template
    ></SwipeableRow>
  </div>
</template>
