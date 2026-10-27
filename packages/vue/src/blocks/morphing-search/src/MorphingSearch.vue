<script setup lang="ts">
import { motion, AnimatePresence } from "motion-v";
import { Search } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { RenderNode, type Content } from "../../shared";
import { useSearchOverlay } from "./use-search-overlay";
export interface MorphingSearchItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  icon?: Content;
  onSelect?: () => void;
}
const props = withDefaults(
  defineProps<{
    items: MorphingSearchItem[];
    placeholder?: string;
    shortcut?: string;
    iconOnly?: boolean;
    emptyMessage?: string;
    open?: boolean;
    defaultOpen?: boolean;
  }>(),
  {
    open: undefined,
    placeholder: "Search",
    shortcut: "f",
    emptyMessage: "No results found.",
    defaultOpen: false,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
  queryChange: [query: string];
  select: [item: MorphingSearchItem];
}>();
defineOptions({ inheritAttrs: false });
const {
  open,
  reduce,
  query,
  present,
  anchor,
  trigger,
  root,
  input,
  list,
  id,
  shellId,
  filtered,
  active,
  moveTo,
  resultsHeight,
  collapsedClip,
  morph,
  clipTransition,
  shellStyle,
  openSearch,
  close,
  select,
  key,
} = useSearchOverlay(props, {
  open(value) {
    emit("update:open", value);
    emit("openChange", value);
  },
  query(value) {
    emit("queryChange", value);
  },
  select(value) {
    emit("select", value);
  },
});
const listVariants = {
  closed: {
    opacity: 0,
    transform: "translateY(6px)",
    transition: { duration: 0.16, delay: 0.18, ease: EASE_OUT },
  },
  open: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.16, ease: EASE_OUT },
  },
};
</script>
<template>
  <div
    ref="anchor"
    v-bind="$attrs"
    :class="cn('relative', iconOnly ? 'size-12' : 'h-12 w-72 max-w-full')"
  >
    <motion.button
      v-if="!open"
      ref="trigger"
      key="trigger"
      :layout-id="shellId"
      type="button"
      aria-haspopup="dialog"
      aria-expanded="false"
      :aria-label="placeholder"
      :transition="morph"
      :style="{ boxShadow: 'inset 0 0 0 1px var(--search-trigger-stroke)' }"
      :class="
        cn(
          'flex size-full items-center rounded-xl bg-background/60 text-left backdrop-blur-md outline-none [--search-trigger-stroke:var(--color-border)] hover:[--search-trigger-stroke:var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-ring',
          iconOnly ? 'cursor-pointer justify-center' : 'cursor-text px-3.5',
        )
      "
      @click="openSearch"
    />
    <motion.div
      aria-hidden="true"
      :initial="false"
      :animate="{ opacity: open ? 0 : 1 }"
      :transition="
        reduce
          ? { duration: 0 }
          : { duration: 0.1, delay: open ? 0.1 : 0.12, ease: EASE_OUT }
      "
      :class="
        cn(
          'pointer-events-none absolute inset-0 flex items-center',
          present && 'z-[60]',
          iconOnly ? 'justify-center' : 'gap-2.5 px-3.5',
        )
      "
    >
      <Search class="size-4 shrink-0 text-muted-foreground" /><template
        v-if="!iconOnly"
        ><span class="min-w-0 flex-1 truncate text-sm text-muted-foreground">{{
          placeholder
        }}</span
        ><kbd
          v-if="shortcut"
          class="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md border border-border px-2 text-xs text-muted-foreground"
          >{{ shortcut.toUpperCase() }}</kbd
        ></template
      >
    </motion.div>
  </div>
  <Teleport to="body" :disabled="!present"
    ><div
      :aria-hidden="!open"
      :inert="!open"
      class="pointer-events-none fixed left-0 top-0 z-50 size-0"
    >
      <AnimatePresence
        :initial="false"
        mode="popLayout"
        as="div"
        class="contents"
        @exit-complete="present = false"
      >
        <motion.div v-if="open" key="overlay" class="fixed left-0 top-0 size-0">
          <button
            type="button"
            tabindex="-1"
            aria-label="Close search"
            class="pointer-events-auto fixed inset-0 cursor-default bg-transparent"
            @click="close"
          />
          <motion.div
            :layout-id="shellId"
            aria-hidden="true"
            class="fixed z-10 rounded-xl bg-background/90 backdrop-blur-xl"
            :style="{
              ...shellStyle,
              height: 48 + resultsHeight + 'px',
              boxShadow: 'inset 0 0 0 1px var(--color-border)',
            }"
            :transition="morph"
          />
          <motion.div
            ref="root"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            :initial="reduce ? false : { opacity: 0, clipPath: collapsedClip }"
            :animate="{
              opacity: 1,
              clipPath: 'inset(0px 0px 0px 0px round 12px)',
            }"
            :exit="{ opacity: 0, clipPath: collapsedClip }"
            :transition="clipTransition"
            class="pointer-events-auto fixed z-20 overflow-hidden rounded-xl"
            :style="shellStyle"
            @keydown="key"
          >
            <div
              :class="
                cn(
                  'flex h-12 items-center gap-2.5 border-b border-border',
                  iconOnly ? 'px-4' : 'px-3.5',
                )
              "
            >
              <span class="shrink-0"
                ><Search class="size-4 text-muted-foreground"
              /></span>
              <div class="flex h-10 min-w-0 flex-1 items-center">
                <input
                  ref="input"
                  v-model="query"
                  role="combobox"
                  :aria-label="placeholder"
                  aria-expanded="true"
                  :aria-controls="id + '-results'"
                  aria-autocomplete="list"
                  :aria-activedescendant="
                    filtered.length ? id + '-option-' + active : undefined
                  "
                  :placeholder="placeholder"
                  class="size-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <kbd
                class="flex h-7 shrink-0 items-center rounded-md border border-border px-2 text-xs text-muted-foreground"
                >Esc</kbd
              >
            </div>
            <motion.div
              ref="list"
              :id="id + '-results'"
              role="listbox"
              aria-label="Search results"
              :variants="reduce ? undefined : listVariants"
              :initial="
                reduce ? { opacity: 1, transform: 'translateY(0px)' } : 'closed'
              "
              :animate="
                reduce ? { opacity: 1, transform: 'translateY(0px)' } : 'open'
              "
              :exit="reduce ? undefined : 'closed'"
              :transition="reduce ? { duration: 0 } : undefined"
              class="overscroll-contain overflow-y-auto p-2"
              :style="{ maxHeight: resultsHeight + 'px' }"
            >
              <button
                v-for="(item, index) in filtered"
                :id="id + '-option-' + index"
                :key="item.id"
                type="button"
                role="option"
                :aria-selected="index === active"
                :data-index="index"
                class="relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                @mousemove="moveTo(item.id)"
                @focus="moveTo(item.id)"
                @click="select(item)"
              >
                <motion.span
                  v-if="index === active"
                  :layout-id="id + '-active-result'"
                  class="absolute inset-0 rounded-lg bg-foreground/5"
                  :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
                /><span
                  v-if="item.icon"
                  class="relative size-4 shrink-0 text-muted-foreground [&_svg]:size-4"
                  ><RenderNode :node="item.icon" /></span
                ><span class="relative min-w-0"
                  ><span
                    class="block truncate text-sm font-medium text-foreground"
                    >{{ item.title }}</span
                  ><span
                    v-if="item.description"
                    class="block truncate text-xs text-muted-foreground"
                    >{{ item.description }}</span
                  ></span
                >
              </button>
              <p
                v-if="!filtered.length"
                class="px-3 py-8 text-center text-sm text-muted-foreground"
              >
                {{ emptyMessage }}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div></Teleport
  >
</template>
