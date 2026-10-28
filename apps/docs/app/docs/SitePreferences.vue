<script setup lang="ts">
import { computed, defineComponent, h, useId, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Check, Copy, PaintBucket } from "lucide-vue-next";
import {
  resolveElement,
  useReducedMotion,
} from "../../../../packages/vue/src/lib/composables";
import { SPRING_PANEL } from "../../../../packages/vue/src/lib/ease";
import { useSitePreferences } from "./preferences";
import { themeNames } from "./theme-names";
import { useThemePanel } from "./use-theme-panel";
import { useSiteCopy } from "./use-site-copy";
import {
  THEME_LIST,
  themeExportCss,
  themesStylesheet,
  type ColorTheme,
} from "./themes";
const props = withDefaults(defineProps<{ open: boolean; lang?: string }>(), {
  lang: "zh-CN",
});
const emit = defineEmits<{ "update:open": [open: boolean] }>();
const text = (zh: string, en: string) =>
  props.lang.startsWith("en") ? en : zh;
const { colorTheme, setColorTheme } = useSitePreferences();
const themeName = (theme: ColorTheme) => text(...themeNames[theme]);
const id = useId(),
  reduce = useReducedMotion();
function close(restore = false) {
  emit("update:open", false);
  if (restore) trigger.value?.focus({ preventScroll: true });
}
const { trigger, panel, mounted, positioned, position } = useThemePanel(
  () => props.open,
  close,
);
const stylesheet = themesStylesheet();
const ThemeStyles = defineComponent({
  name: "OrvuiThemeStyles",
  setup: () => () =>
    h("style", { "data-orvui-theme-presets": "", innerHTML: stylesheet }),
});
function moveTheme(event: KeyboardEvent, index: number) {
  const delta = new Map([
    ["ArrowRight", 1],
    ["ArrowLeft", -1],
    ["ArrowDown", 4],
    ["ArrowUp", -4],
  ]).get(event.key);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? THEME_LIST.length - 1
        : delta === undefined
          ? undefined
          : (index + delta + THEME_LIST.length) % THEME_LIST.length;
  if (next === undefined) return;
  event.preventDefault();
  resolveElement(panel.value)
    ?.querySelectorAll<HTMLButtonElement>("[data-theme-option]")
    [next]?.focus();
}
// Keep the frame-driven opacity path when an interrupted spring exits.
function onPanelFrame() {}
const { copied, failed: copyError, copyText, invalidate } = useSiteCopy(2000);
const copyTheme = () => copyText(themeExportCss(colorTheme.value));
watch(colorTheme, invalidate, { flush: "sync" });
</script>
<template>
  <ThemeStyles />
  <div class="preferences-wrap">
    <button
      ref="trigger"
      type="button"
      class="preferences-trigger site-action header-control"
      :aria-label="text('自定义主题', 'Customize theme')"
      :title="text('自定义主题', 'Customize theme')"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? `${id}-themes` : undefined"
      @click="open ? close(true) : emit('update:open', true)"
      @keydown.down.prevent="emit('update:open', true)"
    >
      <PaintBucket :size="16" aria-hidden="true" />
      <span class="preferences-trigger-label">{{ text("主题", "Theme") }}</span>
    </button>
  </div>
  <Teleport v-if="mounted" to="body">
    <AnimatePresence>
      <motion.div
        v-if="open"
        :id="`${id}-themes`"
        ref="panel"
        role="dialog"
        :aria-label="text('自定义主题', 'Customize theme')"
        class="theme-popover"
        :style="{ ...position, visibility: positioned ? 'visible' : 'hidden' }"
        :initial="{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : -6 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :exit="{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }"
        :transition="reduce ? { duration: 0 } : SPRING_PANEL"
        :on-update="onPanelFrame"
      >
        <div
          class="theme-grid"
          role="group"
          :aria-label="text('主题配色', 'Theme palettes')"
        >
          <button
            v-for="(theme, index) in THEME_LIST"
            :key="theme.id"
            type="button"
            data-theme-option
            :data-theme-id="theme.id"
            class="theme-option"
            :aria-pressed="colorTheme === theme.id"
            :aria-label="themeName(theme.id)"
            @click="setColorTheme(theme.id)"
            @keydown="moveTheme($event, index)"
          >
            <span
              class="theme-orb"
              :style="{
                backgroundColor: theme.swatch,
                '--swatch': theme.swatch,
              }"
              aria-hidden="true"
            />
            <span class="theme-name">{{ themeName(theme.id) }}</span>
          </button>
        </div>
        <div class="theme-popover-footer">
          <button
            type="button"
            class="theme-copy site-action site-action--sm"
            @click="copyTheme"
          >
            <span>{{
              copied ? text("已复制", "Copied") : text("复制 CSS", "Copy CSS")
            }}</span>
            <Check v-if="copied" :size="15" aria-hidden="true" /><Copy
              v-else
              :size="15"
              aria-hidden="true"
            />
          </button>
          <p v-if="copyError" role="status" class="theme-copy-error">
            {{ text("复制失败", "Copy failed") }}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>
<style scoped>
.preferences-trigger {
  flex-shrink: 0;
}
@media (max-width: 1023px) {
  .preferences-trigger-label {
    display: none;
  }
  .preferences-trigger {
    width: 32px;
    padding: 0;
  }
}
.theme-popover {
  position: fixed;
  z-index: 110;
  width: 248px;
  max-width: calc(100vw - 16px);
  max-height: calc(100dvh - 72px);
  overflow-y: auto;
  padding: 16px;
  border-radius: 24px;
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    inset 0 0 0 1px var(--border-strong),
    0 12px 36px rgb(0 0 0 / 0.12);
  scrollbar-width: thin;
}
.theme-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 4px;
}
.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  border-radius: 12px;
}
.theme-orb {
  display: block;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-image:
    radial-gradient(ellipse at 28% 8%, rgb(255 255 255 / 0.5), transparent 65%),
    linear-gradient(145deg, transparent 30%, rgb(0 0 0 / 0.4));
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08);
  transition:
    transform 180ms,
    box-shadow 180ms;
}
.theme-option:hover .theme-orb {
  transform: scale(1.08);
}
.theme-option:active .theme-orb {
  transform: scale(0.96);
}
.theme-option[aria-pressed="true"] {
  color: var(--foreground);
}
.theme-option[aria-pressed="true"] .theme-orb {
  box-shadow:
    0 0 0 2px var(--popover),
    0 0 0 4px var(--swatch);
}
.theme-name {
  max-width: 48px;
  min-height: 14px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
}
.theme-popover-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.theme-copy {
  width: 100%;
  justify-content: space-between;
  text-align: left;
}
.theme-copy-error {
  margin: 6px 4px 0;
  font-size: 11px;
  color: var(--destructive);
}
@media (prefers-reduced-motion: reduce) {
  .preferences-trigger,
  .theme-orb {
    transition: none;
  }
}
</style>
