<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { Bell, PanelTopOpen, RefreshCw } from "lucide-vue-next";
import { EASE_OUT, SPRING_PRESS } from "../../../../../packages/vue/src/lib/ease";
import { CONTINUITY_LABEL, CONTINUITY_SPRING } from "../../utils/docs/site-motion-data";
import { useMotionGuideScene } from "../../composables/motion-guide-scene";
withDefaults(defineProps<{ demo: "press" | "icon" | "reveal" | "layout" | "swap"; en?: boolean }>(), { en: false });
const { replay, iconActive, expanded, tab, id, reduce, canHover, setAttention, replayScene, toggleExpanded, chooseTab } = useMotionGuideScene();
const buttonClass = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
</script>
<template>
  <motion.button
    v-if="demo === 'press'"
    type="button"
    :while-press="reduce ? undefined : { scale: 0.97 }"
    :transition="SPRING_PRESS"
    :class="[
      'h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background',
      buttonClass,
    ]"
    >{{ en ? "Press me" : "按一下" }}</motion.button
  >
  <button
    v-else-if="demo === 'icon'"
    type="button"
    @mouseenter="setAttention(true)"
    @mouseleave="setAttention(false)"
    @focus="setAttention(true)"
    @blur="setAttention(false)"
    :class="[
      'inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground',
      buttonClass,
    ]"
  >
    <motion.span
      :animate="
        iconActive && canHover && !reduce
          ? { rotate: [0, 12, -8, 4, 0] }
          : { rotate: 0 }
      "
      :transition="{ duration: 0.28, ease: EASE_OUT }"
      style="transform-origin: top center"
      ><Bell class="size-4" aria-hidden="true" /></motion.span
    >{{ en ? "Hover bell" : "悬停铃铛" }}
  </button>
  <div v-else-if="demo === 'reveal'" class="flex w-full flex-col items-center">
    <motion.button
      type="button"
      @click="replayScene"
      :while-press="reduce ? undefined : { scale: 0.97 }"
      :transition="SPRING_PRESS"
      :class="[
        'inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground',
        buttonClass,
      ]"
      ><RefreshCw class="size-3" aria-hidden="true" />{{
        en ? "Replay" : "重播"
      }}</motion.button
    >
    <motion.div
      :key="replay"
      :initial="{
        opacity: 0,
        transform: reduce ? 'none' : 'translateY(8px)',
        filter: reduce ? 'none' : 'blur(4px)',
      }"
      :animate="{
        opacity: 1,
        transform: 'translateY(0px)',
        filter: 'blur(0px)',
      }"
      :transition="{ duration: 0.22, ease: EASE_OUT }"
      class="mt-3 w-48 rounded-xl border border-border bg-card p-3"
      ><p class="text-sm font-medium text-foreground">
        {{ en ? "New surface" : "新表面" }}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">
        {{ en ? "Ready before focus." : "在获得焦点前就绪。" }}
      </p></motion.div
    >
  </div>
  <motion.div
    v-else-if="demo === 'layout'"
    layout
    :transition="reduce ? { duration: 0 } : CONTINUITY_SPRING"
    class="inline-flex"
  >
    <motion.button
      layout
      type="button"
      :aria-expanded="expanded"
      :aria-label="
        en
          ? expanded
            ? 'Collapse panel'
            : 'Expand panel'
          : expanded
            ? '收起面板'
            : '展开面板'
      "
      @click="toggleExpanded"
      :while-press="reduce ? undefined : { scale: 0.97 }"
      :transition="reduce ? { duration: 0 } : CONTINUITY_SPRING"
      :style="{ borderRadius: 9999 }"
      :class="[
        'relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-border bg-card p-1 pr-1 text-sm font-medium text-foreground',
        buttonClass,
      ]"
    >
      <motion.span
        layout="position"
        :transition="reduce ? { duration: 0 } : CONTINUITY_SPRING"
        class="inline-grid size-9 shrink-0 place-items-center rounded-full bg-background"
        ><PanelTopOpen class="size-4" aria-hidden="true"
      /></motion.span>
      <AnimatePresence mode="popLayout" :initial="false"
        ><motion.span
          v-if="expanded"
          key="continuity-label"
          layout
          :variants="CONTINUITY_LABEL"
          :initial="reduce ? { opacity: 0 } : 'hidden'"
          :animate="reduce ? { opacity: 1 } : 'visible'"
          :exit="reduce ? { opacity: 0 } : 'exit'"
          :transition="reduce ? { duration: 0 } : CONTINUITY_SPRING"
          class="relative inline-flex w-max items-center whitespace-nowrap pr-3"
          >{{ en ? "Open panel" : "打开面板" }}</motion.span
        ></AnimatePresence
      >
    </motion.button>
  </motion.div>
  <div v-else class="w-full max-w-64 rounded-2xl bg-card p-2">
    <div
      role="tablist"
      :aria-label="en ? 'Example views' : '示例视图'"
      class="grid grid-cols-2 gap-1"
    >
      <button
        v-for="item in ['Preview', 'Code'] as const"
        :key="item"
        :id="`${id}-${item}-tab`"
        type="button"
        role="tab"
        :aria-selected="tab === item"
        :aria-controls="`${id}-panel`"
        @click="chooseTab(item)"
        :class="[
          'min-h-10 rounded-full px-3 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
          tab === item
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground',
        ]"
      >
        {{ en ? item : item === "Preview" ? "预览" : "代码" }}
      </button>
    </div>
    <AnimatePresence mode="wait" :initial="false"
      ><motion.div
        :key="tab"
        :id="`${id}-panel`"
        role="tabpanel"
        :aria-labelledby="`${id}-${tab}-tab`"
        :initial="{
          opacity: 0,
          transform: reduce ? 'none' : 'translateY(4px)',
        }"
        :animate="{ opacity: 1, transform: 'translateY(0px)' }"
        :exit="{
          opacity: 0,
          transform: reduce ? 'none' : 'translateY(-4px)',
          transition: { duration: 0.12, ease: EASE_OUT },
        }"
        :transition="{ duration: 0.18, ease: EASE_OUT }"
        class="mt-2 rounded-xl bg-background p-4 text-sm text-foreground"
        >{{
          en
            ? tab === "Preview"
              ? "Live component view"
              : "Copy-ready source"
            : tab === "Preview"
              ? "实时组件视图"
              : "可复制的源码"
        }}</motion.div
      ></AnimatePresence
    >
  </div>
</template>
