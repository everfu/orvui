<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";
const props = defineProps<{
  citationId: string;
  index: number;
  idPrefix: string;
  label?: string;
}>();
const targetId = computed(
  () => `${props.idPrefix}-${props.citationId.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
);
let pending: ReturnType<typeof setTimeout> | undefined;
function reveal(event: MouseEvent) {
  const row = document.getElementById(targetId.value);
  if (!row) return;
  event.preventDefault();
  row
    .closest("[data-citations]")
    ?.querySelector<HTMLButtonElement>('button[aria-expanded="false"]')
    ?.click();
  if (pending !== undefined) clearTimeout(pending);
  pending = setTimeout(() => {
    if (!row.isConnected) return;
    row.scrollIntoView?.({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
    row.focus({ preventScroll: true });
  }, 50);
}
onBeforeUnmount(() => {
  if (pending !== undefined) clearTimeout(pending);
});
</script>
<template>
  <a
    :href="`#${targetId}`"
    :aria-label="label || `View citation ${index}`"
    @click="reveal"
    class="mx-0.5 inline-flex min-w-4 -translate-y-0.5 items-center justify-center rounded-md bg-muted/60 px-1 py-0.5 text-[10px] font-semibold leading-none text-muted-foreground no-underline outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >{{ index }}</a
  >
</template>
