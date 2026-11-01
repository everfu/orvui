<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { Check, ChevronDown } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { useReducedMotion } from "../../../../../packages/vue/src/lib/composables";
import { SPRING_PANEL } from "../../../../../packages/vue/src/lib/ease";
import { useThemePanel } from "../../composables/use-theme-panel";

import {
  releaseChannels,
  versionHref,
  type ReleaseChannel,
} from "../../../../../tools/release-channels";

const props = defineProps<{
  en: boolean;
  currentHref: string;
  channel: ReleaseChannel;
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
const label = computed(() => (props.en ? "Choose version" : "选择版本"));
const current = computed(() =>
  releaseChannels.find((release) => release.id === props.channel)!,
);
const versions = computed(() =>
  releaseChannels.map((release) => ({
    ...release,
    current: release.id === props.channel,
    href: versionHref(props.currentHref, release.id),
  })),
);
const links = () =>
  Array.from(menu.value?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
// Keep opacity frame-driven so native animation cleanup cannot flash its base value.
function onPanelFrame() {}
function close(restore = false) {
  open.value = false;
  if (restore) trigger.value?.focus({ preventScroll: true });
}
function toggleVersion() {
  // Touch activation does not consistently focus native buttons.
  trigger.value?.focus({ preventScroll: true });
  open.value = !open.value;
}
function cancelFocus() {
  if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
  focusFrame = undefined;
}
function focusVersion() {
  void nextTick(() => {
    if (!open.value || disposed) return;
    cancelFocus();
    let remainingFrames = 8;
    // Motion applies portal visibility on its own frame schedule.
    const focusVisibleVersion = () => {
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
          focusFrame = requestAnimationFrame(focusVisibleVersion);
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
        focusFrame = requestAnimationFrame(focusVisibleVersion);
      }
    };
    focusFrame = requestAnimationFrame(focusVisibleVersion);
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
  if (open.value) focusVersion();
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
  if (value && open.value) focusVersion();
});
watch(open, (value) => {
  if (value) focusVersion();
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
  () => [props.en, props.currentHref, props.channel],
  () => {
    close(!!menu.value?.contains(menu.value.ownerDocument.activeElement));
  },
);
</script>

<template>
  <div class="version-switch">
    <button
      ref="trigger"
      type="button"
      class="version-trigger site-action site-action--sm header-control"
      :aria-label="label"
      :title="label"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? `${id}-versions` : undefined"
      @click="toggleVersion"
      @keydown="triggerKeyDown"
    >
      <span>v{{ current.version }}</span
      ><ChevronDown :size="12" aria-hidden="true" />
    </button>
  </div>
  <Teleport v-if="mounted" to="body">
    <AnimatePresence>
      <motion.div
        v-if="open"
        :id="`${id}-versions`"
        ref="panel"
        role="dialog"
        :aria-label="en ? 'Choose version' : '选择版本'"
        class="version-panel"
        :style="{ ...position, visibility: positioned ? 'visible' : 'hidden' }"
        :initial="{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : -6 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :exit="{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }"
        :transition="reduce ? { duration: 0 } : SPRING_PANEL"
        :on-update="onPanelFrame"
      >
        <nav
          ref="menu"
          :aria-label="en ? 'Version' : '版本'"
          @keydown="menuKeyDown"
        >
          <p class="version-heading">
            {{ en ? "Versions" : "文档版本" }}
          </p>
          <a
            v-for="version in versions"
            :key="version.id"
            class="version-option"
            :href="version.href"
            :aria-current="version.current ? 'page' : undefined"
            @click="close(true)"
          >
            <span class="version-check" aria-hidden="true"
              ><Check v-if="version.current" :size="14"
            /></span>
            <span class="version-description"
              ><strong>v{{ version.version }}</strong
              ><small
                >Vue {{ version.id === "beta" ? "3.6" : version.vue }}</small
              ></span
            >
            <span class="version-badge">{{
              version.id === "beta" ? "Beta" : en ? "Stable" : "稳定版"
            }}</span>
          </a>
        </nav>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<style scoped>
.version-switch {
  flex-shrink: 0;
  margin-left: 10px;
}
.version-trigger {
  gap: 6px;
  padding-inline: 10px;
  font-size: 12px;
}
.version-description {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.version-description strong {
  font-weight: 500;
}
.version-description small {
  color: var(--muted-foreground);
  font-size: 12px;
}
.version-badge {
  padding: 0 6px;
  border-radius: 6px;
  background: var(--muted);
  font-size: 11px;
}
@media (max-width: 767px) {
  .version-switch {
    margin-left: 6px;
  }
  .version-trigger {
    padding-inline: 8px;
  }
}
.version-panel {
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
.version-heading {
  margin: 0;
  padding: 4px 8px 6px;
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 18px;
}
.version-option {
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

.version-option:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
.version-check {
  display: inline-flex;
  width: 14px;
  flex-shrink: 0;
  color: var(--muted-foreground);
}
@media (hover: hover) and (pointer: fine) {
  .version-option:hover {
    background: var(--muted);
  }
}
@media (prefers-reduced-motion: reduce) {
  .version-option {
    transition: none;
  }
}
</style>
