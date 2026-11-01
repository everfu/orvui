<script setup lang="ts">
import { useDocsVersion } from "../../composables/docs-version";
const { href: docsHref } = useDocsVersion();
import { ArrowUpRight } from "lucide-vue-next";
import DocsCatalogHeader from "./DocsCatalogHeader.vue";
import { ButtonLink } from "../../../../../packages/vue/src/motion/button";
import { templateDefinitions } from "../../utils/docs/template-definitions";
defineProps<{ en: boolean }>();
</script>
<template>
  <article class="templates-index">
    <DocsCatalogHeader
      :title="en ? 'Templates' : '应用模板'"
      :description="
        en
          ? 'Ready-to-use, full-page applications built with orvui. Explore the workspaces and find your next starting point.'
          : '用 orvui 构建的完整应用模板。探索在线工作空间，为下一个项目寻找起点。'
      "
      :en="en"
      ><span
        >{{ templateDefinitions.length }}
        {{ en ? "templates" : "套模板" }}</span
      ><span>Vue 3.5</span></DocsCatalogHeader
    >
    <section id="applications" class="template-gallery">
      <h2 class="sr-only">{{ en ? "Workspaces" : "应用工作台" }}</h2>
      <div class="template-card-grid">
        <article
          v-for="template in templateDefinitions"
          :key="template.slug"
          class="template-gallery-card"
        >
          <a
            :href="
              docsHref(template.previewUrl + '?lang=' + (en ? 'en' : 'zh'))
            "
            class="template-screenshot-link"
            target="_blank"
            rel="noopener noreferrer"
            ><img
              :src="template.screenshot"
              :alt="en ? template.en : template.zh"
              width="1440"
              height="1000"
              loading="lazy"
          /></a>
          <h3>{{ template.name }}</h3>
          <p>{{ template.description[en ? "en" : "zh"] }}</p>
          <div class="template-gallery-actions">
            <ButtonLink
              :href="
                docsHref(template.previewUrl + '?lang=' + (en ? 'en' : 'zh'))
              "
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              >{{ en ? "Live preview" : "在线预览"
              }}<ArrowUpRight :size="14" aria-hidden="true"
            /></ButtonLink>
            <span class="template-source-status">{{
              en ? "Source not yet available" : "暂未开放源码"
            }}</span>
          </div>
        </article>
      </div>
    </section>
  </article>
</template>
