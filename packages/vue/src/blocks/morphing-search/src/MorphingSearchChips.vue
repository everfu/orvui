<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Search, X, Clock, LoaderCircle } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "../../../lib/ease";
import { RenderNode, type Content } from "../../shared";
import Highlight from "./Highlight.vue";
import { useSearchChips } from "./use-search-chips";
const props = withDefaults(
  defineProps<{
    chips?: string[];
    defaultChips?: string[];
    query?: string;
    defaultQuery?: string;
    recents?: string[];
    defaultRecents?: string[];
    storageKey?: string;
    maxRecents?: number;
    suggestions?: string[];
    filter?: ((term: string, query: string) => boolean) | false;
    maxSuggestions?: number;
    loading?: boolean;
    maxChips?: number;
    normalize?: (term: string) => string | null;
    emptyState?: Content;
    side?: "top" | "bottom" | "auto";
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    label?: string;
    actions?: Content;
  }>(),
  {
    emptyState: undefined,
    actions: undefined,
    filter: undefined,
    open: undefined,
    defaultChips: () => [],
    defaultQuery: "",
    defaultRecents: () => [],
    maxRecents: 5,
    suggestions: () => [],
    maxSuggestions: 6,
    side: "top",
    defaultOpen: false,
    placeholder: "Search",
    label: "Search",
  },
);
const emit = defineEmits<{
  "update:chips": [chips: string[]];
  chipsChange: [chips: string[]];
  "update:query": [query: string];
  queryChange: [query: string];
  "update:recents": [recents: string[]];
  recentsChange: [recents: string[]];
  "update:open": [open: boolean];
  openChange: [open: boolean];
}>();
const {
  chips,
  query,
  recents,
  openState,
  open,
  marked,
  rtl,
  announcement,
  root,
  field,
  chipsRow,
  panel,
  rowContainer,
  panelSize,
  panelFloor,
  id,
  trimmed,
  reduce,
  rows,
  cursor,
  panelOpen,
  below,
  input,
  announce,
  setRecents,
  add,
  remove,
  removeRecent,
  key,
  focus,
  blur,
} = useSearchChips(props, {
  chips(value) {
    emit("update:chips", value);
    emit("chipsChange", value);
  },
  query(value) {
    emit("update:query", value);
    emit("queryChange", value);
  },
  recents(value) {
    emit("update:recents", value);
    emit("recentsChange", value);
  },
  open(value) {
    emit("update:open", value);
    emit("openChange", value);
  },
});
const layout = computed(() => (reduce.value ? { duration: 0 } : SPRING_LAYOUT));
const glass =
  "border border-foreground/[0.08] bg-background/55 backdrop-blur-[20px] backdrop-saturate-[1.6] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06),0_24px_60px_-24px_rgb(0_0_0/0.45)]";
const seed = computed(() => ({
  width: "112px",
  height: "40px",
  y: below.value ? -28 : 28,
}));
const morphEnter = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.8,
  opacity: { duration: 0.1 },
};
const morphExit = {
  type: "spring" as const,
  stiffness: 520,
  damping: 40,
  mass: 0.6,
  opacity: { duration: 0.12, delay: 0.1 },
};
const chipHidden = { opacity: 0, scale: 0.6, filter: "blur(4px)" },
  chipShown = { opacity: 1, scale: 1, filter: "blur(0px)" };
</script>
<template>
  <div
    ref="root"
    :class="
      cn(
        'relative flex h-14 w-full max-w-xl justify-center',
        disabled && 'opacity-60',
      )
    "
    @focusout="blur"
  >
    <AnimatePresence as="div" class="contents"
      ><motion.div
        v-if="panelOpen"
        key="panel"
        :class="
          cn(
            'absolute inset-x-0 z-10',
            below ? 'top-full mt-2' : 'bottom-full mb-2',
          )
        "
        :exit="{ opacity: 1 }"
      >
        <motion.div
          aria-hidden="true"
          :initial="reduce ? { opacity: 0 } : { ...seed, opacity: 0 }"
          :animate="{
            width: (panelSize.width || 112) + 'px',
            height: (panelSize.height || 40) + 'px',
            y: 0,
            opacity: 1,
          }"
          :exit="
            reduce
              ? { opacity: 0, transition: { duration: 0.12 } }
              : { ...seed, opacity: 0, transition: morphExit }
          "
          :transition="reduce ? { duration: 0 } : morphEnter"
          :style="{ borderRadius: '28px', x: '-50%' }"
          :class="cn('absolute left-1/2', below ? 'top-0' : 'bottom-0', glass)"
        />
        <motion.div
          ref="panel"
          :initial="{ opacity: 0, y: reduce ? 0 : below ? -6 : 6 }"
          :animate="{
            opacity: 1,
            y: 0,
            transition: reduce
              ? { duration: 0.15 }
              : { duration: 0.18, ease: EASE_OUT, delay: 0.12 },
          }"
          :exit="{ opacity: 0, transition: { duration: 0.08, ease: EASE_OUT } }"
          :style="{ minHeight: panelFloor ? panelFloor + 'px' : undefined }"
          class="relative p-2"
          ><div ref="rowContainer">
            <div class="flex h-9 items-center justify-between px-3">
              <span class="text-xs font-medium text-muted-foreground">{{
                trimmed ? "Suggestions" : "Recent"
              }}</span
              ><button
                v-if="!trimmed && recents.length"
                type="button"
                class="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                @click="
                  setRecents([]);
                  announce('Cleared recent searches');
                  input()?.focus();
                "
              >
                Clear
              </button>
            </div>
            <div
              v-if="rows.length"
              :id="id + '-list'"
              role="listbox"
              :aria-label="trimmed ? 'Suggestions' : 'Recent searches'"
              :aria-busy="loading || undefined"
              class="max-h-[min(20rem,45vh)] overflow-y-auto overscroll-contain [scrollbar-width:thin]"
            >
              <motion.div
                v-for="(row, index) in rows"
                :id="id + '-option-' + index"
                :key="row.id"
                role="option"
                :aria-selected="index === cursor.active.value"
                class="relative flex h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm text-foreground"
                @pointerdown.prevent
                @pointermove="cursor.moveTo(row.id)"
                @click="add(row.label)"
              >
                <motion.span
                  v-if="index === cursor.active.value"
                  :layout-id="id + '-active'"
                  :transition="layout"
                  class="absolute inset-0 rounded-2xl bg-foreground/[0.06]"
                /><component
                  :is="row.kind === 'recent' ? Clock : Search"
                  aria-hidden="true"
                  class="relative size-4 shrink-0 text-muted-foreground"
                /><span class="relative min-w-0 flex-1 truncate"
                  ><template v-if="row.kind === 'query'">{{
                    row.label
                  }}</template
                  ><Highlight v-else :text="row.label" :query="trimmed" /></span
                ><span
                  v-if="row.kind === 'recent'"
                  aria-hidden="true"
                  class="relative grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  @click.stop="removeRecent(row.label)"
                  ><X class="size-3.5"
                /></span>
              </motion.div>
            </div>
            <div
              v-else-if="!trimmed && emptyState != null"
              class="px-3 pb-2 pt-1 text-sm text-muted-foreground"
            >
              <slot name="empty"><RenderNode :node="emptyState" /></slot>
            </div>
            <div
              v-if="loading"
              class="flex h-11 items-center gap-3 px-3 text-sm text-muted-foreground"
            >
              <LoaderCircle
                aria-hidden="true"
                class="size-4 motion-safe:animate-spin"
              />Searching…
            </div>
          </div></motion.div
        >
      </motion.div></AnimatePresence
    >
    <motion.div
      layout
      :transition="layout"
      :style="{ borderRadius: '28px' }"
      :class="
        cn(
          'relative z-20 flex h-14 min-w-0 items-center gap-2 ps-4',
          glass,
          disabled ? 'cursor-not-allowed' : 'cursor-text',
          actions || $slots.actions ? 'pe-2' : 'pe-4',
          open ? 'w-full' : 'w-fit max-w-full',
        )
      "
      @pointerdown="focus"
    >
      <Search
        aria-hidden="true"
        class="size-5 shrink-0 text-muted-foreground"
      />
      <div
        ref="chipsRow"
        :class="
          cn(
            'relative flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none]',
            chips.length > 0 &&
              '-mx-1.5 px-3 [mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-12px),transparent)]',
          )
        "
      >
        <AnimatePresence
          :initial="false"
          mode="popLayout"
          as="div"
          class="contents"
        >
          <motion.span
            v-for="chip in chips"
            :key="chip"
            :layout="reduce ? false : 'position'"
            :initial="reduce ? { opacity: 0 } : chipHidden"
            :animate="reduce ? { opacity: 1 } : chipShown"
            :exit="
              reduce
                ? { opacity: 0, transition: { duration: 0.1 } }
                : {
                    ...chipHidden,
                    transition: { duration: 0.16, ease: EASE_OUT },
                  }
            "
            :transition="
              reduce
                ? { duration: 0.12 }
                : {
                    ...SPRING_SWAP,
                    opacity: { duration: 0.16 },
                    filter: { duration: 0.2 },
                  }
            "
            :style="{ transformOrigin: rtl ? 'right center' : 'left center' }"
            :class="
              cn(
                'flex h-9 shrink-0 items-center gap-1 rounded-full ps-3 pe-1 text-sm text-foreground transition-[background-color,box-shadow] duration-150',
                marked === chip
                  ? 'bg-foreground/[0.12] ring-2 ring-inset ring-foreground/40'
                  : 'bg-foreground/[0.07]',
              )
            "
            ><span class="max-w-40 truncate" :title="chip">{{ chip }}</span
            ><button
              type="button"
              :disabled="disabled"
              :aria-label="'Remove filter ' + chip"
              class="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
              @click="remove(chip)"
            >
              <X aria-hidden="true" class="size-3.5" /></button
          ></motion.span>
        </AnimatePresence>
      </div>
      <motion.input
        ref="field"
        :layout="reduce ? false : 'position'"
        :transition="layout"
        type="text"
        role="combobox"
        :aria-label="label"
        :aria-expanded="panelOpen"
        :aria-controls="panelOpen && rows.length ? id + '-list' : undefined"
        aria-autocomplete="list"
        :aria-activedescendant="
          panelOpen && rows.length
            ? id + '-option-' + cursor.active.value
            : undefined
        "
        :aria-describedby="id + '-hint'"
        autocomplete="off"
        :spellcheck="false"
        enterkeyhint="search"
        :disabled="disabled"
        :value="query"
        :placeholder="placeholder"
        :style="
          open
            ? undefined
            : { width: `${Math.max(placeholder.length, 6) + 2}ch` }
        "
        :class="
          cn(
            'h-9 min-w-24 text-ellipsis bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
            open && 'flex-1',
          )
        "
        @input="
          query = ($event.target as HTMLInputElement).value;
          openState = true;
        "
        @focus="openState = true"
        @click="openState = true"
        @keydown="key"
      />
      <div
        v-if="actions || $slots.actions"
        class="flex shrink-0 items-center gap-1"
      >
        <slot name="actions"><RenderNode :node="actions" /></slot>
      </div>
    </motion.div>
    <template v-if="name"
      ><input
        v-for="chip in chips"
        :key="chip"
        type="hidden"
        :name="name"
        :value="chip"
    /></template>
    <span :id="id + '-hint'" class="sr-only"
      >Enter adds a filter. Backspace at the start of the field selects the last
      filter, and again removes it. Delete removes the highlighted recent
      search.</span
    ><span aria-live="polite" class="sr-only"
      >{{ announcement.text }}{{ announcement.count % 2 ? " " : "" }}</span
    >
  </div>
</template>
