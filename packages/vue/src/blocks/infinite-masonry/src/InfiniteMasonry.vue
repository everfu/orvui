<script setup lang="ts" generic="T">
import { getCurrentInstance } from "vue";
import { AlertCircle, Inbox } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { RenderNode, type Content } from "../../shared";
import { useMasonry } from "./use-masonry";
import MasonryItemReveal from "./MasonryItemReveal.vue";
const props = withDefaults(
  defineProps<{
    items: readonly T[];
    getItemKey: (item: T, index: number) => string | number | bigint;
    hasMore: boolean;
    onLoadMore?: () => void | Promise<void>;
    loading?: boolean;
    error?: Content;
    estimateSize?: (item: T, index: number) => number;
    minColumnWidth?: number;
    maxColumns?: number;
    gap?: number;
    overscan?: number;
    prefetch?: number;
    animateItems?: boolean;
    ariaLabel?: string;
    contentClassName?: string;
    itemClassName?: string;
    emptyState?: Content;
    endState?: Content;
  }>(),
  {
    error: undefined,
    minColumnWidth: 208,
    maxColumns: 4,
    gap: 12,
    overscan: 4,
    prefetch: 3,
    animateItems: true,
    ariaLabel: "Infinite masonry feed",
  },
);
const emit = defineEmits<{ retry: [] }>(),
  instance = getCurrentInstance(),
  hasRetry = () => !!instance?.vnode.props?.onRetry;
const {
  root,
  content,
  reduce,
  initialCount,
  revealed,
  hasError,
  rows,
  total,
  columnWidth,
  measure,
} = useMasonry(props);
</script>
<template>
  <section
    v-if="!items.length && !hasMore && !loading && !hasError"
    :aria-label="ariaLabel"
    class="w-full overflow-hidden rounded-3xl border border-border bg-background"
  >
    <slot name="empty"
      ><RenderNode v-if="emptyState" :node="emptyState" />
      <div
        v-else
        class="flex h-full min-h-64 flex-col items-center justify-center px-6 text-center"
      >
        <Inbox class="size-8 text-muted-foreground" aria-hidden="true" />
        <p class="mt-3 text-sm font-medium text-foreground">No items yet</p>
        <p class="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
          New items will appear here when they become available.
        </p>
      </div></slot
    >
  </section>
  <section
    v-else
    ref="root"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    class="w-full contain-[layout_paint] overflow-y-auto overscroll-none rounded-3xl border border-border bg-background p-3 [overflow-anchor:none] [scrollbar-gutter:stable]"
  >
    <div
      ref="content"
      :class="cn('relative w-full', contentClassName)"
      :style="{ height: total + 'px' }"
    >
      <div
        v-for="row in rows"
        :key="String(row.key)"
        :ref="measure"
        :data-index="row.index"
        :class="
          cn(
            'absolute left-0 top-0 will-change-transform',
            row.index < items.length && itemClassName,
          )
        "
        :style="{
          width: columnWidth + 'px',
          transform: `translate3d(${row.lane * (columnWidth + gap)}px, ${row.start}px, 0)`,
        }"
      >
        <template v-if="row.index >= items.length"
          ><div
            v-if="hasError"
            class="flex min-h-36 flex-col items-start justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <div class="flex items-center gap-2 text-destructive">
              <AlertCircle class="size-4" aria-hidden="true" />
              <p class="text-sm font-medium">Couldn't load more</p>
            </div>
            <div class="mt-2 text-xs leading-5 text-muted-foreground">
              <RenderNode :node="error" />
            </div>
            <button
              v-if="hasRetry()"
              type="button"
              class="mt-3 min-h-10 rounded-full border border-border bg-background px-4 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              @click="emit('retry')"
            >
              Try again
            </button>
          </div>
          <slot v-else name="loading" :index="row.index - items.length"
            ><div
              aria-hidden="true"
              class="animate-pulse rounded-2xl border border-border bg-card p-3"
              :style="{
                minHeight: 144 + ((row.index - items.length) % 3) * 36 + 'px',
              }"
            >
              <div class="h-3 w-2/3 rounded-full bg-muted" />
              <div class="mt-3 h-2 w-full rounded-full bg-muted" />
              <div class="mt-2 h-2 w-4/5 rounded-full bg-muted" /></div></slot
        ></template>
        <MasonryItemReveal
          v-else
          :item-key="row.key"
          :lane="row.lane"
          :revealed="revealed"
          :animate="animateItems && !reduce && row.index >= initialCount"
          ><slot :item="items[row.index]!" :index="row.index"
        /></MasonryItemReveal>
      </div>
    </div>
    <div
      v-if="!hasMore && items.length && ($slots.end || endState)"
      class="py-4 text-center text-xs text-muted-foreground"
    >
      <slot name="end"><RenderNode :node="endState" /></slot>
    </div>
    <span class="sr-only" aria-live="polite">{{
      loading ? "Loading more items" : null
    }}</span>
  </section>
</template>
