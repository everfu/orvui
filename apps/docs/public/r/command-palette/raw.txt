<script setup lang="ts">
import { useId } from "vue";
import { motion } from "motion-v";
import { Search } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import { useCommands } from "./use-commands";
import { useCommandSurface } from "./use-command-surface";
export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  hint?: string;
  keywords?: string[];
  icon?: Content;
  badge?: Content;
  onSelect?: () => void;
  disabled?: boolean;
}
const props = withDefaults(
  defineProps<{
    items: CommandItem[];
    shortcut?: string;
    placeholder?: string;
    emptyMessage?: string;
    open?: boolean;
    defaultOpen?: boolean;
  }>(),
  {
    open: undefined,
    shortcut: "k",
    placeholder: "Type a command or search…",
    emptyMessage: "No results found.",
    defaultOpen: false,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
  select: [item: CommandItem];
}>();
const open = useControllable(
  () => props.open,
  props.defaultOpen,
  (value) => {
    emit("update:open", value);
    emit("openChange", value);
  },
);
const reduce = useReducedMotion(),
  touch = useMediaQuery("(pointer: coarse)"),
  id = useId();
const {
  query,
  root,
  input,
  list,
  grouped,
  rows,
  hasIcons,
  active,
  moveTo,
  select,
  keydown,
} = useCommands(props, open, (item) => emit("select", item));
const { present, opacity, backdropOpacity, y, scale } = useCommandSurface(
  open,
  reduce,
);
</script>
<template>
  <slot name="trigger" :open="() => (open = true)" />
  <Teleport to="body" :disabled="!present"
    ><div v-if="present" class="contents" :inert="!open" :aria-hidden="!open">
      <motion.button
        type="button"
        tabindex="-1"
        aria-label="Close command palette"
        :style="{ opacity: backdropOpacity }"
        class="pointer-events-auto fixed inset-0 z-[100] bg-background/5 [backdrop-filter:blur(12px)_saturate(140%)] [-webkit-backdrop-filter:blur(12px)_saturate(140%)]"
        @click="open = false"
      />
      <div
        class="pointer-events-none fixed inset-x-4 bottom-4 top-[18vh] z-[100] flex items-start justify-center"
      >
        <motion.div
          ref="root"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          :style="{ opacity, y, scale }"
          class="pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl will-change-transform"
          @keydown="keydown"
        >
          <div class="flex items-center gap-3 border-b border-border px-4">
            <Search class="h-4 w-4 text-muted-foreground" /><input
              ref="input"
              v-model="query"
              :placeholder="placeholder"
              role="combobox"
              aria-expanded="true"
              :aria-controls="id + '-list'"
              :aria-activedescendant="
                rows.length ? id + '-opt-' + active : undefined
              "
              aria-autocomplete="list"
              :class="
                cn(
                  'h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
                  touch ? 'text-base' : '',
                )
              "
            /><kbd
              class="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block"
              >ESC</kbd
            >
          </div>
          <div
            ref="list"
            :id="id + '-list'"
            role="listbox"
            aria-label="Commands"
            class="max-h-[60vh] overflow-y-auto overscroll-contain p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              v-if="!rows.length"
              class="p-8 text-center text-sm text-muted-foreground"
            >
              {{ emptyMessage }}
            </div>
            <div
              v-for="[group, members] in grouped"
              :key="group"
              class="mb-1 last:mb-0"
            >
              <div
                aria-hidden="true"
                class="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {{ group }}
              </div>
              <button
                v-for="item in members"
                :key="item.id"
                type="button"
                :id="id + '-opt-' + rows.indexOf(item)"
                role="option"
                :aria-selected="rows.indexOf(item) === active"
                :data-index="rows.indexOf(item)"
                :class="
                  cn(
                    'relative isolate flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
                    rows.indexOf(item) === active
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )
                "
                @mouseenter="moveTo(item.id)"
                @click="select(item)"
              >
                <motion.span
                  v-if="rows.indexOf(item) === active"
                  :layout-id="id + '-active'"
                  class="absolute inset-0 z-0 rounded-md bg-muted"
                  :transition="
                    reduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 480, damping: 38 }
                  "
                /><span v-if="item.icon" class="relative z-10 [&_svg]:size-4"
                  ><RenderNode :node="item.icon" /></span
                ><span
                  v-else-if="hasIcons"
                  class="relative z-10 h-4 w-4"
                /><span class="relative z-10 flex-1 truncate">{{
                  item.label
                }}</span
                ><span v-if="item.badge" class="relative z-10 shrink-0"
                  ><RenderNode :node="item.badge" /></span
                ><kbd
                  v-if="item.hint"
                  class="relative z-10 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >{{ item.hint }}</kbd
                >
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div></Teleport
  >
</template>
