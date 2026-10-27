<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { Check } from "lucide-vue-next";
import {
  MorphPopover,
  MorphPopoverContent,
  MorphPopoverTrigger,
} from "../../../../packages/vue/src/motion/popover";
import SiteLanguageFlag from "./SiteLanguageFlag.vue";

const props = defineProps<{
  en: boolean;
  currentHref: string;
  alternateHref: string;
}>();
const open = ref(false);
const trigger = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLElement | null>(null);
let focusEdge: "first" | "last" | "current" = "current";
let focusFrame: number | undefined;
let disposed = false;
const label = computed(() =>
  props.en ? "Choose language, current: English" : "选择语言，当前：简体中文",
);
const languages = computed(() => [
  {
    locale: "zh-CN",
    label: "简体中文",
    en: false,
    current: !props.en,
    href: props.en ? props.alternateHref : props.currentHref,
  },
  {
    locale: "en",
    label: "English",
    en: true,
    current: props.en,
    href: props.en ? props.currentHref : props.alternateHref,
  },
]);
const links = () =>
  Array.from(menu.value?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
function close(restore = false) {
  open.value = false;
  if (restore) trigger.value?.focus({ preventScroll: true });
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
watch(open, (value) => {
  if (!value) {
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
  <MorphPopover v-model:open="open" class="language-switch">
    <MorphPopoverTrigger>
      <button
        ref="trigger"
        type="button"
        class="language-trigger site-action site-action--icon"
        :aria-label="label"
        :title="label"
        @keydown="triggerKeyDown"
      >
        <SiteLanguageFlag :en="en" />
      </button>
    </MorphPopoverTrigger>
    <MorphPopoverContent
      align="end"
      class="language-panel"
      :radius="16"
      :on-open-auto-focus="focusLanguage"
    >
      <nav
        ref="menu"
        :aria-label="en ? 'Language' : '语言'"
        @keydown="menuKeyDown"
      >
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
          <SiteLanguageFlag :en="language.en" />
          <span>{{ language.label }}</span>
          <Check
            v-if="language.current"
            class="language-check"
            :size="14"
            aria-hidden="true"
          />
        </a>
      </nav>
    </MorphPopoverContent>
  </MorphPopover>
</template>

<style scoped>
.language-switch {
  flex-shrink: 0;
}
:global(.language-panel) {
  width: 176px;
  padding: 6px;
  background: var(--popover);
  color: var(--popover-foreground);
}
.language-option {
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  color: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition: background-color 150ms;
}
.language-option[aria-current="page"] {
  background: var(--muted);
}
.language-option:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
.language-check {
  margin-left: auto;
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
