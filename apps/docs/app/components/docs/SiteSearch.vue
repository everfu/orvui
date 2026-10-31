<script setup lang="ts">
import { computed, h, ref, useId, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Search } from "lucide-vue-next";
import { useReducedMotion } from "../../../../../packages/vue/src/lib/composables";
import { SPRING_PANEL } from "../../../../../packages/vue/src/lib/ease";
import { useCommands } from "../../../../../packages/vue/src/blocks/command-palette/src/use-commands";
import { RenderNode } from "../../../../../packages/vue/src/blocks/shared";
import { CircleDashed, FileText } from "lucide-vue-next";
import { type CommandItem } from "../../../../../packages/vue/src/blocks/command-palette";
import { docsCatalog } from "../../utils/docs/docs-routes";
import { buildSiteSearchIndex } from "../../utils/docs/site-search-index";
import { useNewBadgeClock } from "../../composables/new-badge";
import NewBadge from "./NewBadge.vue";
const props = defineProps<{ open: boolean; en: boolean }>();
const emit = defineEmits<{
  "update:open": [value: boolean];
  navigate: [href: string];
}>();
const clock = useNewBadgeClock(() =>
  docsCatalog.flatMap((category) =>
    category.components.flatMap((component) => [
      component,
      ...(component.examples ?? []),
    ]),
  ),
);
const index = computed(() => buildSiteSearchIndex(docsCatalog, props.en));
const defaults = [
  "introduction",
  "installation",
  "theme",
  "motion-patterns",
  "ai-agents",
];
const id = useId(),
  reduce = useReducedMotion();
const open = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});
const searchTerm = ref("");
const items = computed<CommandItem[]>(() =>
  (searchTerm.value.trim()
    ? index.value
    : defaults.flatMap((id) => index.value.filter((record) => record.id === id))
  ).map((record) => ({
    id: record.id,
    label: record.label,
    group: record.group,
    keywords: record.keywords,
    icon: () =>
      h(record.kind === "page" ? FileText : CircleDashed, { class: "h-4 w-4" }),
    ...(record.status && clock.isNew(record.status)
      ? { badge: () => h(NewBadge, { launchedAt: record.status!.launchedAt }) }
      : {}),
    onSelect: () => emit("navigate", record.href),
  })),
);
const { query, root, input, list, rows, active, moveTo, select, keydown } =
  useCommands(
    {
      get items() {
        return items.value;
      },
      shortcut: "k",
    },
    open,
    () => {},
  );
watch(
  query,
  (value) => {
    searchTerm.value = value;
  },
  { flush: "sync" },
);
</script>
<template>
  <Teleport to="body" :disabled="!open">
    <AnimatePresence :initial="false">
      <motion.button
        v-if="open"
        key="backdrop"
        type="button"
        tabindex="-1"
        class="site-search-backdrop"
        :aria-label="en ? 'Close search' : '关闭搜索'"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: reduce ? 0 : 0.18 }"
        @click="open = false"
      />
      <div v-if="open" key="search" class="site-search-layer">
        <motion.div
          ref="root"
          role="dialog"
          aria-modal="true"
          :aria-label="en ? 'Search' : '搜索'"
          class="site-search-panel"
          :initial="{
            opacity: 0,
            scale: reduce ? 1 : 0.97,
            y: reduce ? 0 : -8,
          }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : -4 }"
          :transition="reduce ? { duration: 0 } : SPRING_PANEL"
          @keydown="keydown"
        >
          <div class="site-search-field">
            <Search :size="20" aria-hidden="true" />
            <input
              ref="input"
              v-model="query"
              role="combobox"
              aria-expanded="true"
              :aria-label="en ? 'Search documentation' : '搜索文档'"
              :aria-controls="`${id}-results`"
              :aria-activedescendant="
                rows.length ? `${id}-option-${active}` : undefined
              "
              aria-autocomplete="list"
              :placeholder="en ? 'Search components…' : '搜索组件…'"
            />
            <kbd>ESC</kbd>
          </div>
          <div
            :id="`${id}-results`"
            ref="list"
            role="listbox"
            :aria-label="en ? 'Search results' : '搜索结果'"
            class="site-search-results"
          >
            <p v-if="!rows.length" class="site-search-empty" role="status">
              {{ en ? "No results found." : "没有找到结果。" }}
            </p>
            <button
              v-for="(item, index) in rows"
              :id="`${id}-option-${index}`"
              :key="item.id"
              type="button"
              role="option"
              :aria-selected="index === active"
              :data-index="index"
              class="site-search-result"
              @mouseenter="moveTo(item.id)"
              @click="select(item)"
            >
              <RenderNode v-if="item.icon" :node="item.icon" />
              <span class="site-search-result-label">{{ item.label }}</span>
              <RenderNode v-if="item.badge" :node="item.badge" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
<style scoped>
.site-search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  border: 0;
  background: rgb(0 0 0 / 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.site-search-layer {
  position: fixed;
  inset: max(16px, calc(50dvh - 250px)) 16px 16px;
  z-index: 101;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  pointer-events: none;
}
.site-search-panel {
  width: 640px;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  color: var(--popover-foreground);
  background: var(--popover);
  box-shadow:
    inset 0 0 0 1px var(--border),
    0 20px 64px rgb(0 0 0 / 0.18);
  pointer-events: auto;
}
.site-search-field {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
  padding: 12px 14px;
  color: var(--muted-foreground);
}
.site-search-field input {
  flex: 1;
  min-width: 0;
  height: 36px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--foreground);
  font-size: 18px;
  line-height: 24px;
}
.site-search-field input::placeholder {
  color: var(--muted-foreground);
}
.site-search-field kbd {
  padding: 2px 7px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--foreground) 6%, var(--popover));
  font-family: inherit;
  font-size: 12px;
}
.site-search-results {
  padding: 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.site-search-result {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 38px;
  padding: 8px 10px;
  border: 0;
  border-radius: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 22px;
  background: transparent;
  color: var(--muted-foreground);
}
.site-search-result-label {
  flex: 1;
  min-width: 0;
}
.site-search-result[aria-selected="true"],
.site-search-result:hover {
  background: color-mix(in srgb, var(--foreground) 5%, var(--popover));
  color: var(--foreground);
}
.site-search-result:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
.site-search-empty {
  padding: 28px 12px;
  text-align: center;
  font-size: 14px;
  color: var(--muted-foreground);
}
@media (max-width: 767px) {
  .site-search-layer {
    top: 16px;
  }
  .site-search-field input {
    font-size: 16px;
  }
}
</style>
