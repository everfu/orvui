<script setup lang="ts">
import { provide } from "vue";
import { useMotionState } from "../../state";
const props = withDefaults(defineProps<{ modelValue?: string; defaultValue?: string }>(), { defaultValue: "" });
const emit = defineEmits(["update:modelValue", "change"]);
defineSlots<{ default(): unknown }>();
const value = useMotionState(props, emit, "modelValue", props.defaultValue);
provide("orvui-context-radio", value);
</script>
<template>
  <div role="group"><slot /></div>
</template>
