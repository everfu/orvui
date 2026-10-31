<script setup lang="ts">
import { motion } from "motion-v";
import { resolveElement } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { useMenu } from "./menu-state";
import { useMenuSurface } from "./menu-surface";
withDefaults(defineProps<{ ariaLabel?: string }>(), {
  ariaLabel: "Context menu",
});
defineSlots<{ default(): unknown }>();
const ctx = useMenu();
const { mounted, position, morphReady, opacity, clipPath, key } =
  useMenuSurface(ctx);
</script>
<template>
  <Teleport v-if="mounted" to="body"
    ><div
      data-context-menu-portal
      :aria-hidden="!ctx.open.value"
      :inert="!ctx.open.value"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        visibility: ctx.open.value && !morphReady ? 'hidden' : undefined,
      }"
      :class="
        cn(
          'fixed z-[100] [filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.2))]',
          ctx.open.value ? 'pointer-events-auto' : 'pointer-events-none',
        )
      "
    >
      <motion.div
        :ref="(el: unknown) => (ctx.contentRef.value = resolveElement(el))"
        :id="ctx.id"
        role="menu"
        :aria-label="ariaLabel"
        :data-morph-ready="morphReady ? 'true' : 'false'"
        tabindex="-1"
        :style="{ opacity, clipPath }"
        @keydown="key"
        @contextmenu.prevent
        :class="
          cn(
            'min-w-56 overflow-hidden rounded-xl border border-border bg-card p-1.5 text-foreground outline-none',
            $attrs.class,
          )
        "
        ><slot
      /></motion.div></div
  ></Teleport>
</template>
