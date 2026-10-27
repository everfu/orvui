<script setup lang="ts">
import { provideMenu } from "./menu-state";
const props = withDefaults(defineProps<{ open?: boolean; defaultOpen?: boolean }>(), { open: undefined, defaultOpen: false });
const emit = defineEmits(["update:open"]);
defineSlots<{ default(): unknown }>();
provideMenu(props, emit);
</script>
<template>
  <div class="contents"><slot /></div>
</template>
