<script setup lang="ts">
import type { TableColumn } from "./types";
defineProps<{
  count: number;
  columns: TableColumn<any>[];
  selectable: boolean;
  rowHeight: number;
}>();
const alignment = (side?: string) =>
  side === "right"
    ? "text-right"
    : side === "center"
      ? "text-center"
      : "text-left";
</script>
<template>
  <tr
    v-for="row in count"
    :key="row"
    aria-hidden="true"
    :style="{ height: rowHeight + 'px' }"
    class="border-border/60 border-b"
  >
    <td v-if="selectable" />
    <td
      v-for="column in columns"
      :key="column.key"
      :class="['px-4', alignment(column.align)]"
    >
      <div
        :class="[
          'h-3 animate-pulse rounded-full bg-muted',
          column.align === 'right' ? 'ml-auto w-10' : 'w-2/3',
        ]"
      />
    </td>
    <td />
  </tr>
</template>
