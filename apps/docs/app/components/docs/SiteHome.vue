<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowRight, Code2, ArrowUpRight } from "lucide-vue-next";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import { BouncyAccordion } from "../../../../../packages/vue/src/motion/bouncy-accordion";
import { ButtonLink } from "../../../../../packages/vue/src/motion/button";
import LandingCard from "./LandingCard.vue";
import HomeShowcase from "./HomeShowcase.vue";
import HeroBeam from "./HeroBeam.vue";
import SiteInstallCommand from "./SiteInstallCommand.vue";
import CodePanel from "./CodePanel.vue";
import SiteLogo from "./SiteLogo.vue";
import "../../assets/css/home-landing.css";
import { useSiteShell } from "../../composables/site-shell-state";
const { catalog, t, en, routeTo, description, locale, origin } = useSiteShell();
const installation = ref("registry");
const packageCommand = "pnpm add @orvui/vue";
const inventory = catalog.categories.flatMap((section) =>
  section.components.map((item) => ({ ...item, category: section.slug })),
);
const recent = computed(() =>
  inventory
    .filter((item) => item.launchedAt)
    .sort((left, right) =>
      (right.launchedAt ?? "").localeCompare(left.launchedAt ?? ""),
    ),
);
const sections = computed(() =>
  recent.value.length
    ? [
        {
          id: "recent",
          eyebrow: t("持续生长", "Always growing"),
          title: t("最近发布", "Recently launched"),
          items: recent.value.slice(0, 4),
        },
      ]
    : [],
);
const faqCopy = [
  {
    id: "free",
    zh: "可以用于商业项目吗？",
    en: "Can I use orvui in commercial projects?",
    answerZh:
      "MIT 授权的组件源码允许商业使用与修改，请保留版权和许可声明。Paper Design Shader 核心及其派生参数保留独立的 PolyForm Shield 许可，使用前请阅读 NOTICE。",
    answerEn:
      "MIT-licensed component source permits commercial use and modification. Keep the copyright and license notice. The Paper Design shader core and adapted uniforms retain their separate PolyForm Shield license; see NOTICE.",
  },
  {
    id: "install",
    zh: "如何安装组件？",
    en: "How do I install a component?",
    answerZh:
      "进入组件页面，运行当前站点提供的 shadcn-vue 安装命令。npm 发布后也可以安装 @orvui/vue 组件包。",
    answerEn:
      "Open a component page and run its shadcn-vue command. After npm publication, you can also install the @orvui/vue package.",
  },
  {
    id: "stack",
    zh: "项目需要哪些依赖？",
    en: "What does my project need?",
    answerZh:
      "Vue 3.5、Tailwind CSS 4 和 Motion for Vue。组件所需的其他依赖会随注册表安装，公共主题与令牌请参考安装指南。",
    answerEn:
      "Vue 3.5, Tailwind CSS 4 and Motion for Vue. Additional component dependencies are included by the registry; the setup guide covers shared theme tokens.",
  },
  {
    id: "customize",
    zh: "可以修改样式和动画吗？",
    en: "Can I change the design and animations?",
    answerZh:
      "可以。源码保存在你的项目中，可以直接修改样式、动效、行为以及主题令牌。",
    answerEn:
      "Yes. The source lives in your project. Change styles, motion, behavior and theme tokens directly.",
  },
  {
    id: "nuxt",
    zh: "Nuxt 支持进度如何？",
    en: "What about Nuxt?",
    answerZh:
      "本期提供确定的 SSR 初始结构、浏览器资源清理及 hydration 检查。Nuxt 专用模块与自动导入将在后续阶段提供。",
    answerEn:
      "This release includes deterministic server structure, browser resource cleanup and hydration checks. A dedicated Nuxt module and auto-imports are planned separately.",
  },
];
const faqs = computed(() =>
  faqCopy.map((item) => ({
    id: item.id,
    title: t(item.zh, item.en),
    description: t(item.answerZh, item.answerEn),
  })),
);
</script>
<template>
  <main class="landing landing--showcase">
    <section class="landing-hero">
      <HeroBeam
        ><div class="hero-count">
          <a
            :href="`${locale}/components`"
            :aria-label="t('浏览组件', 'Browse components')"
            ><Code2 :size="16" aria-hidden="true" /></a
          ><a :href="`${locale}/components`"
            ><strong>{{ inventory.length }}</strong> Vue
            {{ t("组件，等你探索", "components to explore")
            }}<ArrowRight :size="13" aria-hidden="true"
          /></a></div
      ></HeroBeam>
      <h1 :class="{ 'hero-title--en': en }">
        <span class="hero-brand"
          ><SiteLogo /><span class="sr-only">orvui — </span></span
        >
        <span class="hero-headline">{{
          t("让界面，自然生动。", "Bring your interface to life.")
        }}</span>
      </h1>
      <p class="hero-description">
        {{
          t(
            "为 Vue 打造的动效组件。复制源码，自由组合，把细节变成你的风格。",
            "Animated components for Vue. Copy the source, compose freely, and make every detail your own.",
          )
        }}
      </p>
      <div class="hero-actions">
        <ButtonLink :href="`${locale}/guide`" size="md" class="primary-link"
          >{{ t("开始使用", "Get started")
          }}<ArrowRight :size="15" aria-hidden="true" /></ButtonLink
        ><a
          :href="`${locale}/components`"
          class="secondary-link site-action site-action--lg"
          >{{ t("浏览组件", "Browse components")
          }}<ArrowUpRight :size="15" aria-hidden="true"
        /></a>
      </div>
      <ul class="hero-stack" :aria-label="t('技术栈', 'Built with')">
        <li>Vue 3.5</li>
        <li>Motion</li>
        <li>Tailwind CSS 4</li>
        <li>TypeScript</li>
      </ul>
    </section>
    <section class="home-install">
      <div class="home-install-inner">
        <Tabs v-model="installation" variant="pill"
          ><TabsList
            :aria-label="t('安装方式', 'Install with')"
            class="home-install-tabs"
            ><TabsTrigger value="registry" class="home-install-tab"
              >shadcn-vue</TabsTrigger
            ><TabsTrigger value="package" class="home-install-tab"
              >npm</TabsTrigger
            ></TabsList
          ></Tabs
        >
        <SiteInstallCommand
          v-show="installation === 'registry'"
          :en="en"
          class="w-full"
        /><CodePanel
          :en="en"
          v-show="installation === 'package'"
          :code="packageCommand"
          label="Terminal"
        />
      </div>
    </section>
    <HomeShowcase />
    <section
      v-for="section in sections"
      :key="section.id"
      class="landing-section home-releases"
    >
      <div class="section-heading">
        <div>
          <p>{{ section.eyebrow }}</p>
          <h2>{{ section.title }}</h2>
        </div>
        <a :href="`${locale}/components`"
          >{{ t("浏览全部组件", "Browse all components")
          }}<ArrowRight :size="14" aria-hidden="true"
        /></a>
      </div>
      <div class="showcase-grid">
        <LandingCard
          v-for="item in section.items"
          :key="item.slug"
          :category="item.category"
          :slug="item.slug"
          :name="item.name"
          :description="description(item.slug, item.description)"
          :href="routeTo(item.category, item.slug)"
          :launched-at="section.id === 'recent' ? item.launchedAt : undefined"
          :fresh="section.id === 'recent'"
        />
      </div>
    </section>
    <section class="home-faq">
      <div>
        <p>FAQ</p>
        <h2>{{ t("你可能想了解", "A few things to know") }}</h2>
        <p class="home-faq-description">
          {{
            t(
              "从第一次安装，到每一次自由创作。",
              "From your first install to your next idea.",
            )
          }}
        </p>
        <a :href="`${locale}/guide`" class="home-text-link"
          >{{ t("阅读使用指南", "Read the guide")
          }}<ArrowUpRight :size="15" aria-hidden="true"
        /></a>
      </div>
      <BouncyAccordion :items="faqs"
        ><template #content="{ item }"
          >{{ item.description }}
          <template v-if="item.id === 'free'"
            ><a
              href="/licenses/MIT.txt"
              target="_blank"
              rel="noreferrer noopener"
              class="underline underline-offset-4"
              >{{ t("阅读 MIT 许可", "Read the MIT license") }}</a
            >
            ·
            <a
              href="/licenses/paper-design-PolyForm-Shield.txt"
              target="_blank"
              rel="noreferrer noopener"
              class="underline underline-offset-4"
              >{{ t("Shader 许可", "Shader license") }}</a
            ></template
          >
          <template v-else-if="item.id === 'install'"
            ><code class="rounded bg-muted px-1 py-0.5 text-xs"
              >pnpm dlx shadcn-vue@2.8.2 add {{ origin }}/r/button.json</code
            ></template
          >
          <a
            v-else-if="item.id === 'stack'"
            :href="`${locale}/docs/theme`"
            class="underline underline-offset-4"
            >{{ t("主题配置指南", "Theme setup guide") }}</a
          >
        </template></BouncyAccordion
      >
    </section>
  </main>
</template>
