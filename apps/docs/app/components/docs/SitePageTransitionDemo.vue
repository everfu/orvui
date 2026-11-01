<script setup lang="ts">
import { motion } from "motion-v";
import { ArrowRight, BookOpen, Palette } from "lucide-vue-next";
import { useMotionGuideScene } from "../../composables/motion-guide-scene";
const props = withDefaults(defineProps<{ en?: boolean }>(), { en: false });
const { tab, swapLayers, id, reduce, chooseTab } = useMotionGuideScene();
const pages = ["Preview", "Code"] as const;
const title = (page: (typeof pages)[number]) =>
  page === "Preview"
    ? props.en
      ? "Installation"
      : "安装"
    : props.en
      ? "Theming"
      : "主题";
function key(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? "Preview"
      : event.key === "End"
        ? "Code"
        : tab.value === "Preview"
          ? "Code"
          : "Preview";
  chooseTab(next);
  document.getElementById(`${id}-${next}-trigger`)?.focus();
}
</script>
<template>
  <div class="page-motion-demo">
    <div class="page-motion-demo-toolbar">
      <span class="page-motion-demo-mark">orvui</span
      ><span>{{ en ? "Documentation" : "文档" }}</span>
    </div>
    <div class="page-motion-demo-body">
      <div
        class="page-motion-demo-navigation"
        role="tablist"
        :aria-label="en ? 'Page transition example' : '页面切换示例'"
        @keydown="key"
      >
        <button
          v-for="page in pages"
          :id="`${id}-${page}-trigger`"
          :key="page"
          type="button"
          role="tab"
          :aria-selected="tab === page"
          :aria-controls="`${id}-${page}-panel`"
          :tabindex="tab === page ? 0 : -1"
          @click="chooseTab(page)"
        >
          <BookOpen
            v-if="page === 'Preview'"
            :size="15"
            aria-hidden="true"
          /><Palette v-else :size="15" aria-hidden="true" />{{ title(page) }}
        </button>
      </div>
      <div class="page-motion-demo-stage">
        <motion.div
          v-for="page in pages"
          :id="`${id}-${page}-panel`"
          :key="page"
          role="tabpanel"
          :aria-labelledby="`${id}-${page}-trigger`"
          :aria-hidden="tab !== page"
          :inert="tab !== page"
          :tabindex="tab === page ? 0 : -1"
          :initial="false"
          :style="{
            opacity: swapLayers[page].opacity,
            y: reduce ? '0px' : swapLayers[page].y,
          }"
          class="page-motion-demo-content"
        >
          <span>{{ en ? "Getting Started" : "开始使用" }}</span>
          <h3>{{ title(page) }}</h3>
          <p v-if="page === 'Preview'">
            {{
              en
                ? "Add a component, load its styles and connect your application state."
                : "添加组件、加载样式，再连接应用状态。"
            }}
          </p>
          <p v-else>
            {{
              en
                ? "Choose a palette and appearance. Customize with semantic variables."
                : "选择配色与明暗模式，再用语义变量定制主题。"
            }}
          </p>
          <div class="page-motion-demo-code">
            <code>{{
              page === "Preview"
                ? "pnpm add @orvui/vue"
                : "--primary: oklch(0.6 0.2 250);"
            }}</code>
          </div>
          <span class="page-motion-demo-next"
            >{{ en ? "Ready to continue" : "准备继续"
            }}<ArrowRight :size="14" aria-hidden="true"
          /></span>
        </motion.div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-motion-demo {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--background);
}
.page-motion-demo-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  color: var(--muted-foreground);
}
.page-motion-demo-mark {
  color: var(--foreground);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.04em;
}
.page-motion-demo-body {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
}
.page-motion-demo-navigation {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
  border-right: 1px solid var(--border);
}
.page-motion-demo-navigation button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 38px;
  padding: 8px 10px;
  border-radius: 10px;
  background: transparent;
  color: var(--muted-foreground);
  text-align: left;
  font-size: 13px;
}
.page-motion-demo-navigation button[aria-selected="true"] {
  color: var(--foreground);
  background: var(--muted);
}
.page-motion-demo-navigation button:focus-visible,
.page-motion-demo-content:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: -2px;
}
.page-motion-demo-stage {
  display: grid;
  min-width: 0;
}
.page-motion-demo-content {
  grid-area: 1 / 1;
  min-width: 0;
  padding: 28px;
}
.page-motion-demo-content > span:first-child {
  font-size: 11px;
  color: var(--muted-foreground);
}
.page-motion-demo-content h3 {
  margin: 8px 0 12px;
  font-size: 23px;
  line-height: 1.3;
  font-weight: 500;
}
.page-motion-demo-content p {
  min-height: 52px;
  margin: 0;
  font-size: 13px;
  line-height: 24px;
  color: var(--muted-foreground);
}
.page-motion-demo-code {
  overflow-x: auto;
  margin-top: 20px;
  padding: 12px;
  border-radius: 10px;
  background: var(--muted);
  font-size: 11px;
  white-space: nowrap;
}
.page-motion-demo-next {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 18px;
  font-size: 12px;
  color: var(--foreground);
}
@media (max-width: 600px) {
  .page-motion-demo-body {
    grid-template-columns: 1fr;
  }
  .page-motion-demo-navigation {
    flex-direction: row;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }
  .page-motion-demo-navigation button {
    width: auto;
  }
  .page-motion-demo-content {
    padding: 20px;
  }
}
</style>
