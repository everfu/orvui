<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import {
  Check,
  Copy,
  FileIcon,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-vue-next";
import { Button } from "../../../../../packages/vue/src/motion/button";
import { ActionSwapCascadeIcon } from "../../../../../packages/vue/src/motion/action-swap";
import { getHighlighter, highlightCode } from "../../utils/docs/highlight";
import { useSiteCopy } from "../../composables/use-site-copy";
const props = withDefaults(
  defineProps<{
    code: string;
    label?: string;
    filename?: string;
    lang?: string;
    en?: boolean;
  }>(),
  { en: false },
);
const t = (zh: string, en: string) => (props.en ? en : zh);
const formats = new Map([
  ["vue", ["vue", "Vue"]],
  ["ts", ["typescript", "TypeScript"]],
  ["tsx", ["tsx", "TSX"]],
  ["js", ["javascript", "JavaScript"]],
  ["jsx", ["jsx", "JSX"]],
  ["css", ["css", "CSS"]],
  ["json", ["json", "JSON"]],
  ["sh", ["bash", "Terminal"]],
  ["bash", ["bash", "Terminal"]],
]);
const filename = computed(
  () =>
    props.filename ??
    (/\.[a-z]+$/i.test(props.label ?? "") ? props.label : undefined),
);
const format = computed(() => {
  const key =
    props.lang?.toLowerCase() ??
    (props.label === "Terminal" || filename.value === "terminal"
      ? "bash"
      : (filename.value?.split(".").at(-1)?.toLowerCase() ?? "vue"));
  return formats.get(key) ?? [key, key];
});
const language = computed(() => format.value[0]!);
const terminal = computed(() => language.value === "bash");
const title = computed(() =>
  filename.value && filename.value !== "terminal"
    ? filename.value
    : terminal.value
      ? t("终端", "Terminal")
      : format.value[1],
);
const fileDir = computed(() =>
  filename.value?.includes("/")
    ? filename.value.slice(0, filename.value.lastIndexOf("/"))
    : undefined,
);
const fileName = computed(() => filename.value?.split("/").at(-1));
const lines = computed(() => props.code.split("\n"));
const { copied, failed, copyText } = useSiteCopy(1500);
const copy = () => copyText(props.code);
const html = ref("");
const expanded = ref(false),
  canExpand = ref<boolean | null>(null);
const content = ref<HTMLElement | null>(null);
const id = useId();
let active = false,
  revision = 0;
let measurement: ResizeObserver | undefined;
const measure = () => {
  if (content.value) canExpand.value = content.value.scrollHeight > 320;
};
function toggleExpanded() {
  expanded.value = !expanded.value;
  if (!expanded.value && content.value) content.value.scrollTop = 0;
}
async function renderCode() {
  const token = ++revision;
  expanded.value = false;
  if (content.value) content.value.scrollTop = 0;
  if (!active) return;
  html.value = "";
  const source = props.code,
    syntax = language.value;
  try {
    const engine = await getHighlighter();
    if (active && revision === token)
      html.value = highlightCode(engine, source, syntax);
  } catch {
    /* Selectable source remains available if highlighting fails. */
  }
  await nextTick();
  if (active && revision === token) measure();
}
watch([() => props.code, language], renderCode);
onMounted(() => {
  active = true;
  measurement = new ResizeObserver(measure);
  if (content.value) measurement.observe(content.value);
  measure();
  void renderCode();
});
onBeforeUnmount(() => {
  active = false;
  ++revision;
  measurement?.disconnect();
});
</script>
<template>
  <figure class="code-panel docs-code-frame">
    <figcaption class="code-file-header">
      <div class="code-file-details" :title="title">
        <Terminal
          v-if="terminal"
          :size="14"
          aria-hidden="true"
          class="code-file-icon"
        />
        <FileIcon v-else :size="14" aria-hidden="true" class="code-file-icon" />
        <span class="code-file-path"
          ><template v-if="filename && filename !== 'terminal'"
            ><span v-if="fileDir">{{ fileDir }}/</span
            ><span class="code-file-name">{{ fileName }}</span></template
          ><template v-else>{{ title }}</template></span
        >
      </div>
      <Button
        class="code-copy-button site-action site-action--sm site-action--icon"
        variant="secondary"
        size="icon"
        :press-scale="0.97"
        :aria-label="
          copied ? t('已复制', 'Copied') : t('复制代码', 'Copy code')
        "
        :title="copied ? t('已复制', 'Copied') : t('复制代码', 'Copy code')"
        @click="copy"
      >
        <ActionSwapCascadeIcon
          :value="copied ? 'check' : 'copy'"
          class="code-copy-icon"
          ><Check v-if="copied" :size="14" aria-hidden="true" /><Copy
            v-else
            :size="14"
            aria-hidden="true"
        /></ActionSwapCascadeIcon>
      </Button>
    </figcaption>
    <div class="code-body">
      <div
        :id="`${id}-code`"
        ref="content"
        class="code-scroll"
        :class="
          expanded
            ? 'is-expanded'
            : canExpand === false
              ? 'is-short'
              : 'is-collapsed'
        "
        tabindex="0"
        role="region"
        :aria-label="title"
      >
        <div v-if="html" class="code-content" v-html="html" />
        <div v-else class="code-content code-fallback">
          <pre><code><template v-for="(line, index) in lines" :key="index"><span class="line">{{ line }}</span>{{ index < lines.length - 1 ? '\n' : '' }}</template></code></pre>
        </div>
      </div>
      <div
        v-if="canExpand"
        class="code-expand-controls"
        :class="{ 'code-expand-gradient': !expanded }"
      >
        <button
          type="button"
          class="code-expand-button site-action site-action--sm"
          :aria-expanded="expanded"
          :aria-controls="`${id}-code`"
          @click="toggleExpanded"
        >
          <ChevronUp
            v-if="expanded"
            :size="14"
            aria-hidden="true"
          /><ChevronDown v-else :size="14" aria-hidden="true" />{{
            expanded
              ? t("收起代码", "Collapse code")
              : t("展开代码", "Expand code")
          }}
        </button>
      </div>
    </div>
    <span v-if="failed" role="status" class="code-copy-failed">{{
      t(
        "无法访问剪贴板，请选中代码手动复制。",
        "Clipboard unavailable. Select and copy the code.",
      )
    }}</span>
    <span class="sr-only" role="status" aria-live="polite">{{
      copied ? t("代码已复制", "Code copied") : ""
    }}</span>
  </figure>
</template>
<style scoped>
.code-panel {
  min-width: 0;
  max-width: 100%;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--foreground);
}
.code-file-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  padding: 0 8px;
  margin-bottom: 4px;
}
.code-file-details {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--muted-foreground);
  font-family: var(--font-geist-sans);
  font-size: 13px;
  line-height: 20px;
}
.code-file-icon {
  flex-shrink: 0;
}
.code-file-path {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.code-file-name {
  font-weight: 400;
}
.code-copy-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  min-height: 32px;
  border-color: transparent;
  background: transparent;
  color: var(--muted-foreground);
}
.code-copy-button:hover {
  background: var(--muted);
  color: var(--foreground);
}
.code-copy-icon {
  width: 14px;
  height: 14px;
}
.code-body {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: color-mix(in oklab, var(--foreground) 4%, var(--background));
  box-shadow: inset 0 0 0 1px
    color-mix(in oklab, var(--border) 45%, transparent);
}
.code-scroll {
  min-width: 0;
  transition: max-height 200ms ease;
  outline-offset: -3px;
}
.code-scroll:focus-visible {
  outline: 2px solid var(--foreground);
}
.code-scroll.is-expanded {
  max-height: 640px;
  overflow: auto;
}
.code-scroll.is-short {
  max-height: none;
}
.code-scroll.is-collapsed {
  max-height: 320px;
  overflow: hidden;
}
.code-content {
  padding: 14px 0;
  font-family: var(--font-geist-mono, "Geist Mono", ui-monospace, monospace);
  font-size: 13px;
  line-height: 20px;
}
.code-content :deep(pre) {
  max-height: none;
  margin: 0;
  padding: 0 !important;
  overflow-x: auto;
  background: transparent !important;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
.code-content :deep(code) {
  display: block;
  width: max-content;
  min-width: 100%;
  font: inherit;
}
.code-content :deep(.line) {
  display: inline-block;
  min-width: 100%;
  padding: 0 20px;
}
.code-content :deep(.highlighted) {
  background: color-mix(in oklab, var(--foreground) 7%, transparent);
  border-left: 2px solid var(--primary);
  padding-left: 18px !important;
}
.code-content :deep(.diff.add) {
  background: color-mix(in oklab, var(--color-green-500) 10%, transparent);
  border-left: 2px solid var(--color-green-500);
  padding-left: 18px !important;
}
.code-content :deep(.diff.remove) {
  background: color-mix(in oklab, var(--color-red-500) 10%, transparent);
  border-left: 2px solid var(--color-red-500);
  padding-left: 18px !important;
}
.code-content :deep(.focused) {
  opacity: 1;
}
.code-content :deep(pre:has(.focused) .line:not(.focused)) {
  opacity: 0.4;
}
.code-expand-controls {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 12px;
}
.code-expand-gradient {
  position: absolute;
  inset: auto 0 0;
  height: 88px;
  background: linear-gradient(to top, var(--background), transparent);
}
.code-expand-button {
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
}
.code-copy-failed {
  display: block;
  padding: 8px;
  color: var(--muted-foreground);
  font-size: 13px;
  line-height: 20px;
}
@media (prefers-reduced-motion: reduce) {
  .code-scroll {
    transition: none;
  }
}
</style>
