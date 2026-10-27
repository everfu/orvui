<script setup lang="ts">
import ContextMenuItemBase from "./ContextMenuItemBase.vue";
withDefaults(defineProps<{ disabled?: boolean; closeOnSelect?: boolean; tone?: "default" | "destructive"; inset?: boolean; textValue?: string }>(), { closeOnSelect: true });
const emit = defineEmits(["select"]);
defineSlots<{ default(): unknown }>();
</script>
<template>
  <ContextMenuItemBase v-bind="$props" @select="emit('select')"
    ><slot
  /></ContextMenuItemBase>
</template>
