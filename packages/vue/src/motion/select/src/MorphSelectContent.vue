<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { MORPH, ROW, useSelect } from "./context";
import SelectRegistrar from "./SelectRegistrar.vue";
defineProps<{ className?: string }>();
const state = useSelect();
const list = state.list;
const label = computed(() => state.labelFor(state.value.value));
const variants = computed(() =>
  state.reduce.value
    ? undefined
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
      },
);
function key(event: KeyboardEvent) {
  if (event.key === "Tab") {
    event.preventDefault();
    state.close();
  } else state.keydown(event);
}
</script>
<template>
  <SelectRegistrar><slot /></SelectRegistrar
  ><AnimatePresence :initial="false" mode="popLayout"
    ><motion.div
      v-if="state.open.value"
      key="panel"
      v-bind="$attrs"
      :layout-id="state.layoutId"
      :transition="state.reduce.value ? { duration: 0 } : MORPH"
      :style="{ borderRadius: '12px' }"
      :class="[
        'absolute inset-x-0 top-0 z-30 overflow-hidden border border-border bg-background shadow-lg',
        className,
      ]"
      ><motion.button
        type="button"
        :id="state.headerId"
        layout="position"
        aria-haspopup="listbox"
        aria-expanded="true"
        :aria-controls="state.listId"
        @click="state.close"
        :class="[ROW, 'outline-none']"
        ><span
          class="min-w-0 truncate"
          :class="label ? 'text-foreground' : 'text-muted-foreground'"
          >{{ label ?? state.placeholder.value }}</span
        ><motion.span
          aria-hidden="true"
          :animate="{ rotate: 180 }"
          :transition="state.reduce.value ? { duration: 0 } : MORPH"
          class="text-muted-foreground"
          ><ChevronDown class="h-4 w-4" /></motion.span
      ></motion.button>
      <div class="h-px bg-border" />
      <motion.ul
        ref="list"
        :id="state.listId"
        role="listbox"
        :aria-labelledby="state.headerId"
        initial="hidden"
        animate="show"
        :variants="variants"
        @keydown="key"
        class="p-1"
        ><slot /></motion.ul></motion.div
  ></AnimatePresence>
</template>
