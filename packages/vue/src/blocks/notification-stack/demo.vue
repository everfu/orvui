<script setup lang="ts">
import { h } from "vue";
import { RotateCw } from "lucide-vue-next";
import { NotificationStack, type NotificationStackItem } from "./index";
const notices = [
  [
    "catalog-retry",
    "Catalog refresh paused",
    "42s · Gateway timeout in phase 2",
  ],
  ["queue-delay", "Queue delay", "2m 11s · Sample indexing"],
  ["media-restored", "Media preview recovered", "5m · Missing file in /media"],
] as const;
const items: NotificationStackItem[] = notices.map(
  ([id, title, description], index) => ({
    id,
    title,
    description,
    ...(index === 0
      ? {
          trailing: () =>
            h(
              "span",
              {
                class:
                  "inline-flex items-center gap-1 text-amber-500 dark:text-amber-400",
              },
              [h(RotateCw, { class: "h-3.5 w-3.5", "aria-hidden": true }), "2"],
            ),
        }
      : {}),
  }),
);
</script>
<template>
  <div class="flex w-full items-center justify-center pt-52 pb-6">
    <NotificationStack :items="items" />
  </div>
</template>
