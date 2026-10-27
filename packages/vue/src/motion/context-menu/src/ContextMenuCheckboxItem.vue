<script setup lang="ts">
import { Check } from "lucide-vue-next";
import { useMotionState } from "../../state";
import ContextMenuItemBase from "./ContextMenuItemBase.vue";
const props = withDefaults(defineProps<{
  modelValue?: boolean; checked?: boolean; disabled?: boolean; closeOnSelect?: boolean;
  tone?: "default" | "destructive"; inset?: boolean; textValue?: string;
}>(), { modelValue: undefined, checked: undefined, closeOnSelect: true });
const emit = defineEmits(["update:modelValue", "update:checked", "change"]);
defineSlots<{ default(): unknown }>();
const checked = useMotionState(props, emit, "modelValue", props.checked ?? false);
function select() { const next = !checked.value; checked.value = next; emit("update:checked", checked.value); }
</script>
<template>
  <ContextMenuItemBase
    v-bind="{ disabled, closeOnSelect, tone, inset, textValue }"
    role="menuitemcheckbox"
    :aria-checked="checked"
    @select="select"
    ><span class="flex h-4 w-4 shrink-0 items-center justify-center"
      ><Check v-if="checked" class="size-3.5" /></span
    ><slot
  /></ContextMenuItemBase>
</template>
