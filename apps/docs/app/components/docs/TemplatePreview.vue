<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowUpRight, RotateCw } from "lucide-vue-next";
import {
  Button,
  ButtonLink,
} from "../../../../../packages/vue/src/motion/button";
import {
  findTemplate,
  type TemplateSlug,
} from "../../utils/docs/template-definitions";
import { useSiteShell } from "../../composables/site-shell-state";
import { useSitePreferences } from "../../composables/preferences";
const props = defineProps<{ slug: TemplateSlug; en: boolean }>();
const template = computed(() => findTemplate(props.slug)!);
const { theme } = useSiteShell();
const { colorTheme } = useSitePreferences();
const frame = ref<HTMLIFrameElement>(),
  failed = ref(false),
  loading = ref(true),
  source = ref(""),
  mobile = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let observer: MutationObserver | undefined;
const appearance = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";
function sync() {
  frame.value?.contentWindow?.postMessage(
    {
      type: "orvui:template-preferences",
      lang: props.en ? "en" : "zh",
      appearance: appearance(),
      palette: colorTheme.value,
    },
    new URL(template.value.previewUrl).origin,
  );
}
function load() {
  clearTimeout(timer);
  loading.value = true;
  failed.value = false;
  const url = new URL(template.value.previewUrl);
  url.searchParams.set("embed", "1");
  url.searchParams.set("lang", props.en ? "en" : "zh");
  url.searchParams.set("appearance", appearance());
  url.searchParams.set("palette", colorTheme.value);
  url.searchParams.set("parentOrigin", location.origin);
  url.searchParams.set("reload", String(Date.now()));
  source.value = url.href;
  timer = setTimeout(() => {
    if (loading.value) {
      failed.value = true;
      loading.value = false;
    }
  }, 20000);
}
function message(event: MessageEvent) {
  if (
    event.source !== frame.value?.contentWindow ||
    event.origin !== new URL(template.value.previewUrl).origin ||
    event.data?.type !== "orvui:template-ready"
  )
    return;
  clearTimeout(timer);
  loading.value = false;
  failed.value = false;
  sync();
}
watch(
  () => [props.en, theme.value, colorTheme.value],
  () => {
    if (source.value) sync();
  },
);
watch(
  () => props.slug,
  () => {
    if (source.value) load();
  },
);
onMounted(() => {
  window.addEventListener("message", message);
  observer = new MutationObserver(sync);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  load();
});
onBeforeUnmount(() => {
  window.removeEventListener("message", message);
  observer?.disconnect();
  clearTimeout(timer);
});
</script>
<template>
  <div class="template-live-preview">
    <div class="template-preview-toolbar">
      <div class="template-preview-size">
        <Button
          variant="ghost"
          size="sm"
          :aria-pressed="!mobile"
          @click="mobile = false"
          >{{ en ? "Desktop" : "桌面" }}</Button
        ><Button
          variant="ghost"
          size="sm"
          :aria-pressed="mobile"
          @click="mobile = true"
          >{{ en ? "Mobile" : "手机" }}</Button
        >
      </div>
      <div>
        <Button
          variant="ghost"
          size="sm"
          :aria-label="en ? 'Reload preview' : '重新加载预览'"
          @click="load"
          ><RotateCw :size="14" /></Button
        ><ButtonLink
          :href="template.previewUrl + '?lang=' + (en ? 'en' : 'zh')"
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
          >{{ en ? "Open preview" : "新窗口打开" }}<ArrowUpRight :size="14"
        /></ButtonLink>
      </div>
    </div>
    <div
      :class="['template-iframe-stage', { 'is-mobile': mobile }]"
      :aria-busy="loading"
    >
      <p v-if="loading" class="template-preview-status" role="status">
        {{ en ? "Loading live workspace…" : "正在加载在线工作台…" }}
      </p>
      <div v-if="failed" class="template-preview-status" role="alert">
        <p>
          {{
            en
              ? "The live preview could not be loaded."
              : "在线预览暂时无法加载。"
          }}
        </p>
        <Button variant="secondary" size="sm" @click="load">{{
          en ? "Retry" : "重试"
        }}</Button>
      </div>
      <iframe
        v-if="source"
        ref="frame"
        :src="source"
        :title="template.name + (en ? ' live application' : ' 在线应用')"
        loading="lazy"
        allow="clipboard-write"
        @error="
          failed = true;
          loading = false;
        "
      />
    </div>
  </div>
</template>
