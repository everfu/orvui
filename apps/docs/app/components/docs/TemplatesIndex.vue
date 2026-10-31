<script setup lang="ts">
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
            :href="(en ? '/en' : '') + '/templates/' + template.slug"
            class="template-screenshot-link"
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
              :href="(en ? '/en' : '') + '/templates/' + template.slug"
              variant="secondary"
              size="sm"
              >{{ en ? "View details" : "查看详情" }}</ButtonLink
            ><ButtonLink
              :href="template.previewUrl + '?lang=' + (en ? 'en' : 'zh')"
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="sm"
              >{{ en ? "Live preview" : "在线预览"
              }}<ArrowUpRight :size="14" aria-hidden="true"
            /></ButtonLink>
          </div>
        </article>
      </div>
    </section>
    <section id="choosing-template" class="template-gallery-guidance">
      <h2>{{ en ? "Choose your workspace" : "选择你的工作台" }}</h2>
      <p>
        {{
          en
            ? "Dashboard for analytics, Mail for correspondence, Chat for AI conversations, CRM for sales, and Finances for a portfolio overview. Every workspace includes real navigation and local sample interactions."
            : "Dashboard 用于数据分析，Mail 用于邮件工作，Chat 用于 AI 对话，CRM 用于销售管理，Finances 用于资产概览。每套工作空间均有独立导航与本地交互。"
        }}
      </p>
    </section>
    <section id="start-building" class="template-gallery-guidance">
      <h2>{{ en ? "Start exploring" : "开始体验" }}</h2>
      <p>
        {{
          en
            ? "Open a live preview or explore it inside the documentation. Live demos are public; complete sources are maintained in private repositories."
            : "打开在线预览，或直接在文档详情中体验。在线演示公开，完整模板源码在私有仓库维护。"
        }}
      </p>
    </section>
  </article>
</template>
