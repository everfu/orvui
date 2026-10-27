<script setup lang="ts">
import { computed, h } from "vue";
import { CircleDashed, FileText } from "lucide-vue-next";
import {
  CommandPalette,
  type CommandItem,
} from "../../../../packages/vue/src/blocks/command-palette";
import { docsCatalog } from "./docs-routes";
import { buildSiteSearchIndex } from "./site-search-index";
import { useNewBadgeClock } from "./new-badge";
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
const items = computed<CommandItem[]>(() =>
  index.value.map((record) => ({
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
</script>
<template>
  <CommandPalette
    :open="open"
    :items="items"
    :placeholder="en ? 'Search components…' : '搜索组件…'"
    :empty-message="en ? 'No results found.' : '没有找到结果。'"
    @update:open="emit('update:open', $event)"
  />
</template>
