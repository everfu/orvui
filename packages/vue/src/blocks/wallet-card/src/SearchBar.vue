<script setup lang="ts">
import { computed, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { History, Search } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT } from "../../../lib/ease";
import { resolveElement } from "../../../lib/composables";
import { ITEM, LIST } from "./constants";
import { useWalletPanel } from "./use-wallet-panel";
const props = withDefaults(
  defineProps<{ placeholder?: string; recent?: string[] }>(),
  { placeholder: "Search", recent: () => [] },
);
const emit = defineEmits<{
  change: [query: string];
  submit: [query: string];
}>();
const input = ref<unknown>(),
  value = ref("");
const { open, armed, root, reduce, layoutId, morph } = useWalletPanel(
  "-search",
  260,
  () => resolveElement<HTMLInputElement>(input.value)?.focus(),
);
const query = computed(() => value.value.trim().toLowerCase()),
  filtered = computed(() =>
    props.recent.filter(
      (term) => !query.value || term.toLowerCase().includes(query.value),
    ),
  );
const glide = computed(() =>
  reduce.value
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.5, bounce: 0 },
);
function update(next: string) {
  value.value = next;
  emit("change", next);
}
function submit(next: string) {
  emit("submit", next);
  open.value = false;
}
</script>
<template>
  <div ref="root" class="shrink-0">
    <div v-if="open" aria-hidden="true" class="h-8 w-8" />
    <AnimatePresence :initial="false" mode="popLayout" as="div" class="contents"
      ><motion.button
        v-if="!open"
        key="icon"
        :layout-id="layoutId"
        type="button"
        aria-label="Search"
        :transition="morph"
        :style="{ borderRadius: '12px' }"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
        @click="open = true"
        ><Search class="h-4 w-4" /></motion.button></AnimatePresence
    ><AnimatePresence
      :initial="false"
      mode="popLayout"
      as="div"
      class="contents"
      ><motion.div
        v-if="open"
        key="panel"
        :layout-id="layoutId"
        :transition="morph"
        :style="{ borderRadius: '16px' }"
        class="absolute -left-2 -right-2 top-0 z-40 overflow-hidden border border-border/30 bg-background backdrop-blur-md"
        ><div class="flex h-9 items-center gap-2 px-3">
          <motion.span layout="position" :transition="glide" class="shrink-0"
            ><Search class="h-4 w-4 text-muted-foreground" /></motion.span
          ><motion.input
            ref="input"
            layout="position"
            :initial="reduce ? false : { opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{
              opacity: { duration: 0.15, delay: 0.12, ease: EASE_OUT },
              layout: glide,
            }"
            :value="value"
            :placeholder="placeholder"
            aria-label="Search wallet"
            class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            @input="update(($event.target as HTMLInputElement).value)"
            @keydown.enter="value.trim() && submit(value.trim())"
            @keydown.esc="open = false"
          />
        </div>
        <div class="h-px bg-border/40" />
        <motion.ul
          v-if="filtered.length"
          initial="hidden"
          animate="show"
          :variants="reduce ? undefined : LIST"
          :class="
            cn(
              'max-h-56 overflow-y-auto p-1.5',
              !armed && 'pointer-events-none',
            )
          "
          ><motion.li
            v-for="term in filtered"
            :key="term"
            layout="position"
            :variants="reduce ? undefined : ITEM"
            ><button
              type="button"
              :class="
                cn(
                  'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-muted-foreground outline-none transition-colors',
                  armed && 'hover:bg-muted hover:text-foreground',
                )
              "
              @click="
                update(term);
                submit(term);
              "
            >
              <History class="h-4 w-4 shrink-0" /><span
                class="min-w-0 flex-1 truncate"
                >{{ term }}</span
              >
            </button></motion.li
          ></motion.ul
        ><motion.div
          v-else
          layout="position"
          class="flex flex-col items-center gap-1 px-4 py-8 text-center"
          ><Search class="h-5 w-5 text-muted-foreground/60" />
          <p class="text-sm text-muted-foreground">
            {{ query ? "No matches" : "No recent searches" }}
          </p></motion.div
        ></motion.div
      ></AnimatePresence
    >
  </div>
</template>
