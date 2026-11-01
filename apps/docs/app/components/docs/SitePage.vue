<script setup lang="ts">
import { useDocsVersion } from "../../composables/docs-version";
const { href: docsHref, prefix: versionPrefix, channel } = useDocsVersion();
import { computed } from "vue";
import { ArrowUpRight, Rss } from "lucide-vue-next";
import CodePanel from "./CodePanel.vue";
import CopyPage from "./CopyPage.vue";
import GuideIntroductionPreview from "./GuideIntroductionPreview.vue";
import GuideInstallCommand from "./GuideInstallCommand.vue";
import { BouncyAccordion } from "../../../../../packages/vue/src/motion/bouncy-accordion";
import SiteMotionGuide from "./SiteMotionGuide.vue";
import {
  getSitePage,
  guideNextPages,
  localize,
  localSiteHtml,
  resolveSiteCode,
  siteOrigin,
  type SitePageSlug,
} from "../../utils/docs/site-page-data";
import {
  changelogAnchor,
  changelogEntries,
} from "../../utils/docs/site-changelog-data";
import { sitePageMarkdown } from "../../utils/docs/site-page-markdown";
const props = withDefaults(
  defineProps<{
    page: SitePageSlug;
    en?: boolean;
    siteUrl?: string;
  }>(),
  { en: false },
);
const data = computed(() => getSitePage(props.page, channel.value));
const locale = computed(() => (props.en ? "/en" : ""));
const markdownPath = computed(
  () => `${versionPrefix.value}${locale.value}${data.value.path}.md`,
);
const pageUrl = computed(
  () =>
    siteOrigin(props.siteUrl) +
    versionPrefix.value +
    locale.value +
    data.value.path,
);
const markdown = computed(() =>
  sitePageMarkdown(props.page, props.en, props.siteUrl, channel.value),
);
const t = (zh: string, en: string) => (props.en ? en : zh);
const html = (value: string) =>
  localSiteHtml(value, props.en).replace(
    /href="([^"\s]+)"/g,
    (_, href: string) => `href="${docsHref(href)}"`,
  );
const isInstallCommand = (code: string) =>
  code.startsWith("pnpm add ") && !code.includes("\n");
const dateLabel = (date: string) =>
  new Intl.DateTimeFormat(props.en ? "en" : "zh-CN", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
const entryHref = (href: string) =>
  props.en && href.startsWith("/") ? "/en" + href : href;
</script>
<template>
  <article
    v-if="page === 'changelog'"
    class="site-changelog mx-auto max-w-3xl px-4 py-16"
  >
    <header class="max-w-2xl">
      <p class="site-eyebrow">
        {{ localize(data.eyebrow, en) }}
      </p>
      <h1 class="mt-2 text-4xl font-semibold tracking-tight text-foreground">
        {{ localize(data.title, en) }}
      </h1>
      <p class="mt-3 text-muted-foreground">
        {{ localize(data.description, en) }}
      </p>
      <a
        href="/changelog/rss.xml"
        class="site-action site-action--lg site-action--primary mt-8"
        ><Rss aria-hidden="true" class="size-4" />{{
          t("RSS 订阅", "RSS feed")
        }}</a
      >
    </header>
    <ol class="mt-12">
      <li
        v-for="week in changelogEntries"
        :key="week.date"
        :id="changelogAnchor(week.date)"
        class="scroll-mt-24 border-t border-border py-8 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6"
      >
        <p class="text-sm text-muted-foreground">
          {{ t("所在周", "Week of")
          }}<time :datetime="week.date" class="block text-foreground">{{
            dateLabel(week.date)
          }}</time>
        </p>
        <div class="mt-2 min-w-0 sm:mt-0">
          <h2 class="text-lg font-medium tracking-tight text-foreground">
            <a
              :href="docsHref('#' + changelogAnchor(week.date))"
              class="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >{{ localize(week.title, en) }}</a
            >
          </h2>
          <p v-if="week.summary" class="mt-2 leading-7 text-muted-foreground">
            {{ localize(week.summary, en) }}
          </p>
          <ul class="mt-4 space-y-3">
            <li
              v-for="item in week.items"
              :key="item.text.en"
              class="flex items-start gap-3 text-sm leading-6"
            >
              <span
                :class="[
                  'mt-0.5 inline-flex w-[4.75rem] shrink-0 justify-center rounded-full border px-2 text-[11px] font-medium leading-5',
                  item.type === 'new'
                    ? 'border-accent/30 bg-accent/10 text-foreground'
                    : 'border-border bg-muted text-muted-foreground',
                ]"
                >{{
                  item.type === "new"
                    ? t("新增", "New")
                    : item.type === "improved"
                      ? t("改进", "Improved")
                      : t("修复", "Fixed")
                }}</span
              ><span class="min-w-0 text-muted-foreground"
                >{{ localize(item.text, en)
                }}<template v-if="item.href"
                  >{{ " "
                  }}<a
                    :href="docsHref(entryHref(item.href))"
                    class="whitespace-nowrap text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >{{
                      item.label
                        ? t("查看 ", "View ") + item.label
                        : t("了解更多", "Learn more")
                    }}</a
                  ></template
                ></span
              >
            </li>
          </ul>
        </div>
      </li>
    </ol>
  </article>
  <article
    v-else
    :class="[
      'support-page min-w-0',
      page === 'theme' && 'max-w-3xl',
      {
        'getting-started-page':
          page === 'introduction' || page === 'installation',
      },
    ]"
  >
    <header
      id="overview"
      :class="[
        'scroll-mt-24',
        page === 'motion-patterns' && 'border-b border-border pb-10',
      ]"
    >
      <p
        v-if="page !== 'introduction' && page !== 'installation'"
        class="site-eyebrow"
      >
        {{ localize(data.eyebrow, en) }}
      </p>
      <div
        class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <h1
          :class="[
            'text-3xl tracking-tight text-foreground',
            page === 'theme' ? 'font-semibold' : 'font-medium',
          ]"
        >
          {{ localize(data.title, en) }}
          <span
            v-if="data.status === 'preview'"
            class="docs-preview-badge align-middle"
            >Preview</span
          >
        </h1>
        <CopyPage
          v-if="page !== 'theme'"
          :page-url="pageUrl"
          :markdown-path="markdownPath"
          :component-name="localize(data.title, en)"
          :markdown="markdown"
          :en="en"
        />
      </div>
      <p
        class="guide-copy mt-3 max-w-2xl text-muted-foreground"
        v-html="html(localize(data.description, en))"
      />
    </header>
    <p
      v-if="data.lead"
      class="guide-lead guide-copy"
      v-html="html(localize(data.lead, en))"
    />
    <GuideIntroductionPreview
      v-if="data.illustration === 'components'"
      :en="en"
    />
    <SiteMotionGuide v-if="page === 'motion-patterns'" :en="en" />
    <template v-for="section in data.sections" :key="section.id"
      ><span
        v-for="id in section.legacyIds"
        :id="id"
        :key="id"
        class="guide-legacy-anchor"
        aria-hidden="true"
      />
      <h2
        :id="section.id"
        :class="[
          'mt-10 scroll-mt-24 text-xl tracking-tight text-foreground',
          page === 'theme' ? 'font-semibold' : 'font-medium',
        ]"
      >
        {{ localize(section.title, en) }}
      </h2>
      <template v-for="(block, index) in section.blocks" :key="index"
        ><p
          v-if="block.kind === 'paragraph'"
          :class="[
            'guide-copy text-muted-foreground',
            block.space === 4 ? 'mt-4' : block.space === 6 ? 'mt-6' : 'mt-2',
            block.small && 'text-sm',
          ]"
          v-html="html(localize(block.text, en))" />
        <dl v-else-if="block.kind === 'features'" class="guide-features">
          <div v-for="item in block.items" :key="item.title.en">
            <dt>{{ localize(item.title, en) }}</dt>
            <dd v-html="html(localize(item.text, en))" />
          </div>
        </dl>
        <BouncyAccordion
          v-else-if="block.kind === 'faq'"
          class="guide-faq"
          :items="
            block.items.map((item) => ({
              id: item.id,
              title: localize(item.question, en),
              description: localize(item.answer, en),
            }))
          " />
        <div
          v-else-if="block.kind === 'links' && block.layout === 'cards'"
          class="guide-link-cards"
        >
          <a
            v-for="item in block.items"
            :key="item.url"
            :href="
              docsHref((en && item.url.startsWith('/') ? '/en' : '') + item.url)
            "
            ><strong
              >{{ localize(item.label, en)
              }}<ArrowUpRight :size="16" aria-hidden="true" /></strong
            ><span>{{ localize(item.description, en) }}</span></a
          >
        </div>
        <GuideInstallCommand
          v-else-if="
            block.kind === 'code' &&
            page === 'installation' &&
            /^pnpm add [^\n]+$/.test(block.code)
          "
          :en="en"
          :code="resolveSiteCode(block.code, siteUrl, channel)" />
        <div v-else-if="block.kind === 'code'" class="mt-4">
          <CodePanel
            :en="en"
            :code="
              resolveSiteCode(
                en && block.codeEn ? block.codeEn : block.code,
                siteUrl,
                channel,
              )
            "
            :lang="block.lang"
            :filename="block.filename"
          />
        </div>
        <aside
          v-else-if="block.kind === 'callout'"
          class="docs-callout"
          :class="{ 'docs-callout--warning': block.tone === 'warning' }"
          :aria-label="
            block.tone === 'warning' ? t('注意事项', 'Note') : t('提示', 'Tip')
          "
        >
          <span class="docs-callout-label">{{
            block.tone === "warning" ? t("注意事项", "Note") : t("提示", "Tip")
          }}</span>
          <p v-html="html(localize(block.text, en))" />
        </aside>
        <ol v-else-if="block.kind === 'steps'" class="docs-steps">
          <li v-for="(step, stepIndex) in block.items" :key="stepIndex">
            <span class="docs-step-number" aria-hidden="true">{{
              stepIndex + 1
            }}</span>
            <div>
              <h3>{{ localize(step.title, en) }}</h3>
              <p v-html="html(localize(step.text, en))" />
            </div>
          </li>
        </ol>
        <ul
          v-else-if="block.kind === 'links'"
          class="mt-4 divide-y divide-border rounded-2xl border border-border bg-card"
        >
          <li
            v-for="item in block.items"
            :key="item.url"
            class="flex items-start justify-between gap-4 p-4"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <code
                  v-if="item.endpoint"
                  class="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground"
                  >{{ item.url }}</code
                ><span class="text-sm font-medium text-foreground">{{
                  localize(item.label, en)
                }}</span>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ localize(item.description, en) }}
              </p>
            </div>
            <a
              v-if="!item.url.includes('{')"
              :href="
                en && item.url.startsWith('/') && !item.endpoint
                  ? '/en' + item.url
                  : item.url
              "
              target="_blank"
              rel="noreferrer noopener"
              class="site-action site-action--sm shrink-0"
              >{{ t("打开", "Open")
              }}<ArrowUpRight class="h-3 w-3" aria-hidden="true"
            /></a>
          </li></ul></template
      ><slot :name="section.id" />
    </template>
    <nav
      v-if="guideNextPages(page).length"
      class="docs-next-guides"
      :aria-label="t('下一步', 'Next steps')"
    >
      <span>{{ t("下一步", "Next steps") }}</span
      ><a
        v-for="next in guideNextPages(page)"
        :key="next.slug"
        :href="docsHref(`${locale}${next.path}`)"
        >{{ localize(next.title, en) }}
        <ArrowUpRight :size="14" aria-hidden="true"
      /></a>
    </nav>
  </article>
</template>
<style scoped>
.getting-started-page > header > div {
  margin-top: 0;
}
.getting-started-page > header h1 {
  font-weight: 600;
}
.getting-started-page > header > .guide-copy {
  margin-top: 20px;
  max-width: none;
  font-size: 17px;
}
.guide-lead {
  margin-top: 26px;
  color: var(--foreground);
}
.guide-legacy-anchor {
  display: block;
  height: 0;
  scroll-margin-top: 140px;
}
.guide-features {
  display: grid;
  gap: 18px;
  margin: 24px 0 0;
}
.guide-features > div {
  font-size: 16px;
  line-height: 27px;
}
.guide-features dt {
  display: inline;
  font-weight: 500;
}
.guide-features dt::after {
  content: " — ";
  color: var(--muted-foreground);
  font-weight: 400;
}
.guide-features dd {
  display: inline;
  margin: 0;
  color: var(--muted-foreground);
}
.guide-link-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}
.guide-link-cards > a {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--background);
  color: var(--foreground);
  text-decoration: none;
}
.guide-link-cards > a:hover {
  background: var(--muted);
}
.guide-link-cards > a:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 3px;
}
.guide-link-cards strong {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  line-height: 22px;
  font-weight: 500;
}
.guide-link-cards strong > svg {
  flex-shrink: 0;
  color: var(--muted-foreground);
}
.guide-link-cards span {
  color: var(--muted-foreground);
  font-size: 14px;
  line-height: 24px;
}
.guide-faq {
  margin-top: 20px;
}
@media (max-width: 600px) {
  .guide-link-cards {
    grid-template-columns: 1fr;
  }
  .getting-started-page > header > .guide-copy {
    font-size: 16px;
  }
}

.site-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}
.guide-copy :deep(code) {
  border-radius: 0.25rem;
  background: color-mix(in oklab, var(--foreground) 5%, transparent);
  padding: 0.125rem 0.375rem;
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--foreground);
}
.guide-copy :deep(a) {
  color: var(--foreground);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--border);
}
.guide-copy :deep(a:hover) {
  text-decoration-color: var(--foreground);
}
</style>
