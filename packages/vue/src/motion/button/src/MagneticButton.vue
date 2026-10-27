<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref } from "vue";
import { resolveElement } from "../../../lib/composables";
import Button from "./Button.vue";
import Magnetic from "./Magnetic.vue";
withDefaults(defineProps<{ strength?: number; disabled?: boolean; magneticClassName?: string }>(), { strength: 0.25 });
const button = ref<unknown>();
function focus() { resolveElement<HTMLButtonElement>(button.value)?.focus(); }
defineExpose({ focus });
</script>
<template><Magnetic :strength="strength" :class="magneticClassName"><Button ref="button" v-bind="$attrs" :disabled="disabled"><slot /></Button></Magnetic></template>
