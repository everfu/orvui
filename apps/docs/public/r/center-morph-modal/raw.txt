<script setup lang="ts">
import { provide, useId } from "vue";
import { useMotionState } from "../../state";
import type { CenterModalContext } from "./context";
const props = withDefaults(defineProps<{ open?: boolean; defaultOpen?: boolean }>(), { open: undefined, defaultOpen: false });
const emit = defineEmits(["update:open"]);
const opened = useMotionState(props, emit, "open", props.defaultOpen), instanceId = useId();
const context: CenterModalContext = { open: opened, triggerId: `${instanceId}-trigger`, contentId: `${instanceId}-content` };
provide("orvui-center-modal", context);
</script>
<template><slot :open="opened" /></template>
