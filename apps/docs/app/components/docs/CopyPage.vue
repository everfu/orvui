<script setup lang="ts">
import { Check, ChevronDown, Copy, FileDown, LoaderCircle, TriangleAlert } from "lucide-vue-next";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "../../../../../packages/vue/src/motion/popover";
import { usePageActions } from "../../composables/use-page-actions";
import { iconBodies } from "../../utils/docs/sourced-icons";
const props = withDefaults(defineProps<{ pageUrl: string; markdownPath: string; componentName: string; markdown?: string; en?: boolean }>(), { en: true });
const { open, copyState, trigger, menu, t, copyLabel, copyAriaLabel, actions, copyMarkdown, focusMenuItem, triggerKeyDown, menuKeyDown } = usePageActions(props);
</script>
<template>
  <MorphPopover v-model:open="open" class="copy-page">
    <div class="site-action-group">
      <button
        type="button"
        @click="copyMarkdown"
        :disabled="copyState === 'copying'"
        :aria-busy="copyState === 'copying'"
        :aria-label="copyAriaLabel"
        class="site-action site-action--sm"
      >
        <LoaderCircle
          v-if="copyState === 'copying'"
          class="h-3.5 w-3.5 motion-safe:animate-spin"
          aria-hidden="true"
        />
        <Check
          v-else-if="copyState === 'copied'"
          class="h-3.5 w-3.5 text-(--color-success)"
          aria-hidden="true"
        />
        <TriangleAlert
          v-else-if="copyState === 'error'"
          class="h-3.5 w-3.5 text-destructive"
          aria-hidden="true"
        />
        <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
        <span>{{ copyLabel }}</span>
      </button>
      <MorphPopoverTrigger>
        <button
          ref="trigger"
          type="button"
          :aria-label="t('More page actions', '更多页面操作')"
          @keydown="triggerKeyDown"
          class="site-action site-action--sm site-action--icon"
        >
          <ChevronDown
            :class="['h-3.5 w-3.5 transition-transform', open && 'rotate-180']"
            aria-hidden="true"
          />
        </button>
      </MorphPopoverTrigger>
    </div>
    <MorphPopoverContent align="end" class="w-56 p-1.5">
      <div
        ref="menu"
        role="menu"
        :aria-label="t('Page actions', '页面操作')"
        @keydown="menuKeyDown"
      >
        <a
          v-for="action in actions"
          :key="action.icon"
          :href="action.href"
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          @click="open = false"
          class="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span class="text-muted-foreground">
            <FileDown
              v-if="action.icon === 'file'"
              class="h-4 w-4"
              aria-hidden="true"
            />
            <svg
              v-else
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="h-4 w-4"
              fill="currentColor"
              v-html="iconBodies[action.icon]"
            />
          </span>
          {{ action.label }}
        </a>
      </div>
    </MorphPopoverContent>
  </MorphPopover>
</template>

<style scoped>
.copy-page {
  display: none;
}
@media (min-width: 640px) {
  .copy-page {
    display: inline-flex;
  }
}
</style>
