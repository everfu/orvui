<script setup lang="ts">
import { motion } from "motion-v";
import { resolveElement } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useMenu } from "./menu-state";
import { useMenuSurface } from "./menu-surface";
withDefaults(defineProps<{ ariaLabel?: string }>(), { ariaLabel: "Context menu" });
defineSlots<{ default(): unknown }>();
const ctx = useMenu();
const { mounted, position, morphReady, collapsed, visualOpen, key } = useMenuSurface(ctx);
</script>
<template>
  <Teleport v-if="mounted" to="body"
    ><div
      data-context-menu-portal
      :aria-hidden="!ctx.open.value"
      :inert="!ctx.open.value"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
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
        :initial="false"
        :animate="{
          opacity: visualOpen ? 1 : 0,
          clipPath:
            ctx.reduce.value || ctx.modality.value === 'keyboard' || visualOpen
              ? 'inset(0px 0px 0px 0px round 12px)'
              : collapsed,
        }"
        :transition="
          ctx.modality.value === 'keyboard'
            ? { duration: 0 }
            : ctx.reduce.value
              ? { duration: 0.1, ease: EASE_OUT }
              : {
                  clipPath: { duration: 0.3, ease: EASE_OUT },
                  opacity: { duration: 0.3, ease: EASE_OUT },
                }
        "
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
