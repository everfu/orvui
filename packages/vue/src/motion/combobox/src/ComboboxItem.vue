<script setup lang="ts">
import SearchOption from "./SearchOption.vue";
withDefaults(
  defineProps<{
    value: string;
    textValue?: string;
    label?: string;
    keywords?: string[];
    disabled?: boolean;
  }>(),
  { keywords: () => [] },
);
const emit = defineEmits<{ select: [value: string] }>();
</script>
<template>
  <SearchOption
    :multiple="false"
    :value="value"
    :text-value="textValue"
    :label="label"
    :keywords="keywords"
    :disabled="disabled"
    @select="emit('select', $event)"
    ><slot>{ textValue ?? label ?? value }</slot></SearchOption
  >
</template>
