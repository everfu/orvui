<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { Check, Languages } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { useReducedMotion } from "../../../../../packages/vue/src/lib/composables";
import { SPRING_PANEL } from "../../../../../packages/vue/src/lib/ease";
import { useThemePanel } from "../../composables/use-theme-panel";

const props = defineProps<{
  en: boolean;
  currentHref: string;
  alternateHref: string;
}>();
const open = ref(false);
const id = useId(),
  reduce = useReducedMotion();
const { trigger, panel, mounted, positioned, position } = useThemePanel(
  () => open.value,
  close,
  { autoFocus: false, dismissOnFocus: false },
);
const menu = ref<HTMLElement | null>(null);
let focusEdge: "first" | "last" | "current" = "current";
let focusFrame: number | undefined;
let disposed = false;
const label = computed(() =>
  props.en ? "Choose language, current: English" : "选择语言，当前：简体中文",
);
const languages = computed(() => [
  {
    locale: "en",
    label: "English",
    current: props.en,
    href: props.en ? props.currentHref : props.alternateHref,
  },
  {
    locale: "zh-CN",
    label: "简体中文",
    current: !props.en,
    href: props.en ? props.alternateHref : props.currentHref,
  },
]);
const links = () =>
  Array.from(menu.value?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
function close(restore = false) {
  open.value = false;
  if (restore) trigger.value?.focus({ preventScroll: true });
}
function toggleLanguage() {
  // Touch activation does not consistently focus native buttons.
  trigger.value?.focus({ preventScroll: true });
  open.value = !open.value;
}
function cancelFocus() {
  if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
  focusFrame = undefined;
}
function focusLanguage() {
  void nextTick(() => {
    if (!open.value || disposed) return;
    cancelFocus();
    let remainingFrames = 8;
    // Motion applies portal visibility on its own frame schedule.
    const focusVisibleLanguage = () => {
      focusFrame = undefined;
      if (!open.value || disposed) return;
      const surface = menu.value?.parentElement;
      const document = surface?.ownerDocument;
      const active = document?.activeElement;
      if (
        active &&
        active !== document?.body &&
        active !== trigger.value &&
        !surface?.contains(active)
      )
        return;
      if (!surface?.isConnected) return;
      if (getComputedStyle(surface).visibility === "hidden") {
        if (remainingFrames-- > 0)
          focusFrame = requestAnimationFrame(focusVisibleLanguage);
        return;
      }
      const options = links();
      const target =
        focusEdge === "first"
          ? options[0]
          : focusEdge === "last"
            ? options.at(-1)
            : options.find((link) => link.hasAttribute("aria-current"));
      target?.focus({ preventScroll: true });
      if (
        target &&
        document?.activeElement !== target &&
        remainingFrames-- > 0
      ) {
        focusFrame = requestAnimationFrame(focusVisibleLanguage);
      }
    };
    focusFrame = requestAnimationFrame(focusVisibleLanguage);
  });
}
function triggerKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) {
    event.preventDefault();
    event.stopPropagation();
    close(true);
    return;
  }
  if (event.key === "Tab") {
    close();
    return;
  }
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  focusEdge = event.key === "ArrowUp" ? "last" : "first";
  if (open.value) focusLanguage();
  else open.value = true;
}
function menuKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    close(true);
    return;
  }
  if (event.key === "Tab") {
    close(true);
    return;
  }
  if (event.key === " ") {
    const active = menu.value?.ownerDocument.activeElement;
    if (active instanceof HTMLAnchorElement && menu.value?.contains(active)) {
      event.preventDefault();
      active.click();
    }
    return;
  }
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const options = links();
  if (!options.length) return;
  event.preventDefault();
  const index = options.indexOf(
    menu.value?.ownerDocument.activeElement as HTMLAnchorElement,
  );
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? options.length - 1
        : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
          options.length;
  options[next]?.focus({ preventScroll: true });
}
watch(positioned, (value) => {
  if (value && open.value) focusLanguage();
});
watch(open, (value) => {
  if (value) focusLanguage();
  else {
    cancelFocus();
    focusEdge = "current";
  }
});
onBeforeUnmount(() => {
  disposed = true;
  cancelFocus();
});
watch(
  () => [props.en, props.currentHref, props.alternateHref],
  () => {
    close(!!menu.value?.contains(menu.value.ownerDocument.activeElement));
  },
);
</script>

<template>
  <div class="language-switch">
    <button
      ref="trigger"
      type="button"
      class="language-trigger site-action site-action--icon header-control"
      :aria-label="label"
      :title="label"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? `${id}-languages` : undefined"
      @click="toggleLanguage"
      @keydown="triggerKeyDown"
    >
      <Languages :size="16" aria-hidden="true" />
    </button>
  </div>
  <Teleport v-if="mounted" to="body">
    <AnimatePresence>
      <motion.div
        v-if="open"
        :id="`${id}-languages`"
        ref="panel"
        role="dialog"
        :aria-label="en ? 'Choose language' : '选择语言'"
        class="language-panel"
        :style="{ ...position, visibility: positioned ? 'visible' : 'hidden' }"
        :initial="{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : -6 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :exit="{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }"
        :transition="reduce ? { duration: 0 } : SPRING_PANEL"
      >
        <nav
          ref="menu"
          :aria-label="en ? 'Language' : '语言'"
          @keydown="menuKeyDown"
        >
          <p class="language-heading">
            {{ en ? "Choose language" : "选择语言" }}
          </p>
          <a
            v-for="language in languages"
            :key="language.locale"
            class="language-option"
            :href="language.href"
            :lang="language.locale"
            :hreflang="language.locale"
            :aria-current="language.current ? 'page' : undefined"
            @click="close(true)"
          >
            <span class="language-check" aria-hidden="true"
              ><Check v-if="language.current" :size="14"
            /></span>
            <span>{{ language.label }}</span>
          </a>
        </nav>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<style scoped>
.language-switch {
  flex-shrink: 0;
}
.language-panel {
  position: fixed;
  z-index: 110;
  width: 220px;
  max-width: calc(100vw - 24px);
  max-height: calc(100dvh - 72px);
  overflow-y: auto;
  border-radius: 24px;
  box-shadow:
    inset 0 0 0 1px var(--border-strong),
    0 12px 36px rgb(0 0 0 / 0.12);
  padding: 6px;
  background: var(--popover);
  color: var(--popover-foreground);
}
.language-heading {
  margin: 0;
  padding: 4px 8px 6px;
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 18px;
}
.language-option {
  display: flex;
  min-height: 36px;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 10px;
  color: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition: background-color 150ms;
}

.language-option:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
.language-check {
  display: inline-flex;
  width: 14px;
  flex-shrink: 0;
  color: var(--muted-foreground);
}
@media (hover: hover) and (pointer: fine) {
  .language-option:hover {
    background: var(--muted);
  }
}
@media (prefers-reduced-motion: reduce) {
  .language-option {
    transition: none;
  }
}
</style>
