<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Check, Copy, FileIcon } from "lucide-vue-next";
import { Button } from "../../../../packages/vue/src/motion/button";
import { ActionSwapCascadeIcon } from "../../../../packages/vue/src/motion/action-swap";
import { getHighlighter, highlightCode } from "./highlight";
import { useSiteCopy } from "./use-site-copy";
const props = defineProps<{ code: string; label?: string; filename?: string; lang?: string }>();
const formats = new Map([
  ["vue", ["vue", "VUE"]], ["ts", ["typescript", "TS"]], ["tsx", ["tsx", "TSX"]],
  ["js", ["javascript", "JS"]], ["jsx", ["jsx", "JSX"]], ["css", ["css", "CSS"]],
  ["json", ["json", "JSON"]], ["sh", ["bash", "Shell"]], ["bash", ["bash", "Shell"]],
]);
const filename = computed(() => props.filename ?? (/\.[a-z]+$/i.test(props.label ?? "") ? props.label : undefined));
const format = computed(() => {
  const key = props.lang?.toLowerCase() ?? (props.label === "Terminal" ? "bash" : filename.value?.split(".").at(-1)?.toLowerCase() ?? "vue");
  return formats.get(key) ?? [key, key.toUpperCase()];
});
const language = computed(() => format.value[0]!);
const languageLabel = computed(() => format.value[1]);
const fileDir = computed(() => filename.value?.includes("/") ? filename.value.slice(0, filename.value.lastIndexOf("/")) : undefined);
const fileName = computed(() => filename.value?.split("/").at(-1));
const lines = computed(() => props.code.split("\n"));
const { copied, failed, copyText } = useSiteCopy(1500);
const copy = () => copyText(props.code);
const html = ref("");
const expanded = ref(false), canExpand = ref<boolean | null>(null);
const content = ref<HTMLElement | null>(null);
let active = false, revision = 0;
let measurement: ResizeObserver | undefined;
const measure = () => { if (content.value) canExpand.value = content.value.scrollHeight > 320; };
async function renderCode() {
  const token = ++revision;
  if (!active) return;
  html.value = "";
  const source = props.code, syntax = language.value;
  try {
    const engine = await getHighlighter();
    if (active && revision === token) html.value = highlightCode(engine, source, syntax);
  } catch { /* Keep selectable plain text when the optional highlighter fails. */ }
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
onBeforeUnmount(() => { active = false; ++revision; measurement?.disconnect(); });
</script>

<template>
  <div class="code-panel">
    <div v-if="filename" class="code-file-header">
      <div class="code-file-details">
        <span class="code-language">{{ languageLabel }}</span>
        <FileIcon :size="14" class="code-file-icon" />
        <span class="code-file-path"
          ><span v-if="fileDir">{{ fileDir }}/</span
          ><span class="code-file-name">{{ fileName }}</span></span
        >
      </div>
      <Button
        class="code-copy-button site-action site-action--sm site-action--icon"
        variant="secondary"
        size="icon"
        :press-scale="0.97"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy"
      >
        <ActionSwapCascadeIcon
          :value="copied ? 'check' : 'copy'"
          class="code-copy-icon"
        >
          <Check v-if="copied" :size="14" class="code-copy-success" /><Copy
            v-else
            :size="14"
          />
        </ActionSwapCascadeIcon>
      </Button>
    </div>
    <div v-else class="code-copy-floating">
      <Button
        class="code-copy-button site-action site-action--sm site-action--icon"
        variant="secondary"
        size="icon"
        :press-scale="0.97"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy"
      >
        <ActionSwapCascadeIcon
          :value="copied ? 'check' : 'copy'"
          class="code-copy-icon"
        >
          <Check v-if="copied" :size="14" class="code-copy-success" /><Copy
            v-else
            :size="14"
          />
        </ActionSwapCascadeIcon>
      </Button>
    </div>
    <div class="code-expandable">
      <div
        ref="content"
        class="code-scroll"
        :class="
          expanded
            ? 'is-expanded'
            : canExpand === false
              ? 'is-short'
              : 'is-collapsed'
        "
      >
        <div v-if="html" class="code-content" tabindex="0" v-html="html" />
        <div v-else class="code-content code-fallback" tabindex="0">
          <pre><code><template v-for="(line, index) in lines" :key="index"><span class="line">{{ line }}</span>{{ index < lines.length - 1 ? '\n' : '' }}</template></code></pre>
        </div>
      </div>
      <div v-if="!expanded && canExpand" class="code-expand-gradient">
        <button
          class="code-expand-button site-action site-action--sm"
          type="button"
          @click="expanded = true"
        >
          Expand Code
        </button>
      </div>
    </div>
    <span v-if="failed" role="status" class="code-copy-failed"
      >Clipboard unavailable. Select and copy the code.</span
    >
  </div>
</template>

<style scoped>
.code-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  font-family: var(--font-mono, "Geist Mono", ui-monospace, monospace);
  font-size: 13px;
  line-height: 1.625;
  margin: 0;
}
.code-file-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in oklab, var(--background) 60%, transparent);
  padding: 10px 16px;
}
.code-file-details {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  line-height: 16px;
}
.code-language {
  display: inline-flex;
  height: 20px;
  flex-shrink: 0;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--card);
  padding: 0 6px;
  color: var(--muted-foreground);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.code-file-icon {
  flex-shrink: 0;
  color: var(--muted-foreground);
}
.code-file-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--foreground);
}
.code-file-name {
  font-weight: 500;
}
.code-copy-floating {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}
.code-copy-icon {
  width: 14px;
  height: 14px;
}
.code-copy-success {
  color: var(--color-success);
}
.code-expandable {
  position: relative;
}
.code-scroll {
  transition: max-height 300ms cubic-bezier(0.23, 1, 0.32, 1);
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
  position: relative;
  padding: 16px 0;
  font-size: 13px;
  line-height: 1.625;
}
.code-content :deep(pre) {
  max-height: none;
  margin: 0;
  padding: 0 !important;
  overflow-x: auto;
  background: transparent !important;
  font-family: inherit;
  line-height: inherit;
}
.code-content :deep(code) {
  font-family: var(--font-mono, "Geist Mono", ui-monospace, monospace);
  font-size: 13px;
}
.code-content :deep(.line) {
  padding: 0 20px;
}
.code-content :deep(.highlighted) {
  background: color-mix(in oklab, var(--foreground) 7%, transparent);
  border-left: 2px solid var(--color-blue-500, #2b7fff);
  padding-left: 18px !important;
}
.code-content :deep(.diff.add) {
  background: color-mix(
    in oklab,
    var(--color-green-500, #00c950) 10%,
    transparent
  );
  border-left: 2px solid var(--color-green-500, #00c950);
  padding-left: 18px !important;
}
.code-content :deep(.diff.remove) {
  background: color-mix(
    in oklab,
    var(--color-red-500, #fb2c36) 10%,
    transparent
  );
  border-left: 2px solid var(--color-red-500, #fb2c36);
  padding-left: 18px !important;
}
.code-content :deep(.focused) {
  opacity: 1;
}
.code-content :deep(pre:has(.focused) .line:not(.focused)) {
  opacity: 0.3;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.code-expand-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 128px;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(to top in oklab, var(--card), transparent);
  padding-bottom: 16px;
}
.code-copy-failed {
  display: block;
  padding: 8px 16px;
  color: var(--muted-foreground);
  font-size: 12px;
}
</style>
