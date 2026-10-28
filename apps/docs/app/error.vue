<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRequestURL, clearError } from "#imports";
import SiteLayout from "./docs/SiteLayout.vue";
import { NotFound } from "../../../packages/vue/src/blocks/not-found";
import { useDocsHead } from "./composables/page-head";

const props = defineProps<{ error: { statusCode: number; url?: string } }>();
const request = useRequestURL();
const address = reactive({
  get path() {
    return props.error.url?.split(/[?#]/)[0] ?? request.pathname;
  },
});
const en = computed(() => address.path.startsWith("/en/"));
const prefix = computed(() => (en.value ? "/en" : ""));
const navigation = { go: (href: string) => clearError({ redirect: href }) };
useDocsHead(
  () => undefined,
  () => en.value,
);
</script>
<template>
  <SiteLayout :frontmatter="{}" :route="address" :router="navigation">
    <NotFound
      :code="String(error.statusCode)"
      :title="en ? 'Page not found' : '页面未找到'"
      :description="
        en
          ? 'The page you are looking for moved, vanished, or never existed.'
          : '你访问的页面已移动、已移除或不存在。'
      "
      :home-href="`${prefix}/`"
      :home-label="en ? 'Back home' : '返回首页'"
      :browse-href="`${prefix}/components/motion`"
      :browse-label="en ? 'Browse components' : '浏览组件'"
    />
  </SiteLayout>
</template>
