<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { useViewer } from "./context";
import { cn } from "../../../lib/utils";
defineOptions({ inheritAttrs: false });
defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ click: [event: MouseEvent] }>();
const viewer = useViewer();
function activate(event: MouseEvent) { emit("click", event); if (!event.defaultPrevented) viewer.move(1); }
</script>
<template><button v-bind="$attrs" type="button" :aria-label="String($attrs['aria-label'] ?? 'Next image')" :disabled="disabled || viewer.index.value < 0 || viewer.index.value >= viewer.images.value.length - 1" @click="activate" :class="cn('inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-30', $attrs.class as string)"><slot><ChevronRight :size="18" aria-hidden="true" /></slot></button></template>
