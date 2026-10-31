<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpRight } from "lucide-vue-next";
import { ButtonLink } from "../../../../../packages/vue/src/motion/button";
import {
  findTemplate,
  templateDefinitions,
} from "../../utils/docs/template-definitions";
import { templateEditorial } from "../../utils/docs/template-editorial";
import { useSiteShell } from "../../composables/site-shell-state";
import TemplatePreview from "./TemplatePreview.vue";
import CopyPage from "./CopyPage.vue";
const props = defineProps<{ slug: string; en: boolean }>();
const { origin, pathname } = useSiteShell();
const template = computed(
  () => findTemplate(props.slug) ?? templateDefinitions[0],
);
const editorial = computed(() => templateEditorial[template.value.slug]);
const t = (zh: string, en: string) => (props.en ? en : zh);
</script>
<template>
  <article class="template-document">
    <header id="overview">
      <div class="page-title">
        <h1>{{ template.name }}</h1>
        <CopyPage
          :page-url="origin + pathname"
          :markdown-path="pathname + '.md'"
          :component-name="template.name"
          :en="en"
        />
      </div>
      <p class="page-description">
        {{ template.description[en ? "en" : "zh"] }}
      </p>
      <ButtonLink
        :href="template.previewUrl + '?lang=' + (en ? 'en' : 'zh')"
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="sm"
        >{{ t("在线预览", "Live preview") }}<ArrowUpRight :size="14"
      /></ButtonLink>
      <h2 id="template-use-cases" class="template-subheading">
        {{ t("适用场景", "When to use it") }}
      </h2>
      <p class="guide-copy">{{ editorial.purpose[en ? "en" : "zh"] }}</p>
    </header>
    <section id="preview" class="docs-content-section">
      <h2>{{ t("交互预览", "Interactive preview") }}</h2>
      <TemplatePreview :slug="template.slug" :en="en" />
      <h3 id="template-walkthrough" class="template-subheading">
        {{ t("试一试", "Try it") }}
      </h3>
      <ol class="docs-editorial-list">
        <li v-for="step in editorial.walkthrough" :key="step.en">
          {{ step[en ? "en" : "zh"] }}
        </li>
      </ol>
    </section>
    <section id="composition" class="docs-content-section">
      <h2>{{ t("页面组成", "Application pages") }}</h2>
      <ul class="template-page-list">
        <li v-for="page in template.pages" :key="page.id">
          {{ en ? page.en : page.zh }}
        </li>
      </ul>
    </section>
    <section id="notes" class="docs-content-section">
      <h2>{{ t("使用说明", "Usage notes") }}</h2>
      <p>
        {{
          t(
            "支持中英文、明暗模式和十一套配色。演示数据保存在当前浏览器；切换语言会保留编辑内容。设置中的重置演示可以恢复初始数据。",
            "Supports Chinese, English, light and dark appearance and eleven palettes. Demo data stays in this browser; changing language preserves edits. Reset demo in Settings restores the sample data.",
          )
        }}
      </p>
      <p>
        {{
          t(
            "邮件、AI 回复及财务操作仅更新本地样例状态。浏览器限制存储时仍可继续体验，刷新后这些更改可能丢失。",
            "Mail, AI responses and financial actions only update local sample state. If browser storage is restricted, the demo remains usable but changes may be lost after a refresh.",
          )
        }}
      </p>
      <p>
        {{
          t(
            "在线演示公开，完整模板源码仅在私有 GitHub 仓库维护。",
            "Live demos are public; complete template sources are maintained in private GitHub repositories.",
          )
        }}
      </p>
    </section>
    <section id="licenses" class="docs-content-section">
      <h2>{{ t("来源与许可", "Attribution and licenses") }}</h2>
      <p>
        {{
          t(
            "模板目录的展示参考 HeroUI，由本项目独立实现。orvui 组件、字体和相关资产保留各自的版权与许可声明。",
            "The gallery presentation references HeroUI and is independently implemented. orvui components, fonts and related assets retain their copyright and license notices.",
          )
        }}
      </p>
      <a href="/licenses/orvui-NOTICE.txt">NOTICE ↗</a>
    </section>
  </article>
</template>
