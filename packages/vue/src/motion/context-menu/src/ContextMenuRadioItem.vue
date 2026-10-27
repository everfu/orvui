<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import { Circle } from "lucide-vue-next";
import ContextMenuItemBase from "./ContextMenuItemBase.vue";
const props = withDefaults(defineProps<{ value: string; disabled?: boolean; closeOnSelect?: boolean; tone?: "default" | "destructive"; inset?: boolean; textValue?: string }>(), { closeOnSelect: true });
defineSlots<{ default(): unknown }>();
const group = inject<Ref<string>>("orvui-context-radio");
if (!group) throw new Error("A context radio item requires ContextMenuRadioGroup");
const selected = computed(() => group.value === props.value);
const select = () => { group.value = props.value; };
</script>
<template>
  <ContextMenuItemBase
    v-bind="{ disabled, closeOnSelect, tone, inset, textValue }"
    role="menuitemradio"
    :aria-checked="selected"
    @select="select"
    ><span class="flex h-4 w-4 shrink-0 items-center justify-center"
      ><Circle v-if="selected" class="size-1.5 fill-current" /></span
    ><slot
  /></ContextMenuItemBase>
</template>
