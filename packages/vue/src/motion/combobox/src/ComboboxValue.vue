<script setup lang="ts">
import { computed } from "vue";
import { useSearchContext } from "../../_combobox/controller";
withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: "Select an option",
});
defineSlots<{
  default?: (props: {
    value: string | string[] | undefined;
    label: string | undefined;
  }) => any;
}>();
const state = useSearchContext(false, "ComboboxValue");
const value = computed(() => state.value.value as string | undefined);
const label = computed(() => state.labelFor(value.value));
</script>
<template>
  <span
    :class="[
      'block truncate',
      value === undefined ? 'text-muted-foreground' : 'text-foreground',
    ]"
    ><slot :value="value" :label="label">{{ label ?? placeholder }}</slot></span
  >
</template>
