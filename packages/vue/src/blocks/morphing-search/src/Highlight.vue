<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ text: string; query: string }>();
const parts = computed(() => {
  const start = props.query
    ? props.text.toLowerCase().indexOf(props.query.toLowerCase())
    : -1;
  return start < 0
    ? { before: props.text, match: "", after: "" }
    : {
        before: props.text.slice(0, start),
        match: props.text.slice(start, start + props.query.length),
        after: props.text.slice(start + props.query.length),
      };
});
</script>
<template>
  {{ parts.before
  }}<span v-if="parts.match" class="font-semibold">{{ parts.match }}</span
  >{{ parts.after }}
</template>
