<script setup lang="ts">
import { computed, reactive } from "vue";
import { NuxtPage } from "#components";
import { useRoute, useRouter } from "#imports";
import type { DocsPage } from "../../../tools/docs/routes";
import SiteLayout from "./docs/SiteLayout.vue";
import { useDocsHead } from "./composables/page-head";

const route = useRoute();
const router = useRouter();
const page = computed(() => route.meta.orvuiPage as DocsPage | undefined);
const address = reactive({
  get path() {
    return route.path;
  },
});
const navigation = { go: (href: string) => router.push(href) };
useDocsHead(() => page.value);
</script>
<template>
  <!-- Keep Nuxt's page lifecycle mounted while the shared shell renders content. -->
  <NuxtPage />
  <SiteLayout
    :frontmatter="page?.frontmatter ?? {}"
    :route="address"
    :router="navigation"
  />
</template>
