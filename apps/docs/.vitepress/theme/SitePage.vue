<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpRight, Rss } from "lucide-vue-next";
import CodePanel from "./CodePanel.vue";
import CopyPage from "./CopyPage.vue";
import SiteMotionGuide from "./SiteMotionGuide.vue";
import {
  getSitePage,
  localize,
  localSiteHtml,
  resolveSiteCode,
  siteOrigin,
  type SitePageSlug,
} from "./site-page-data";
import { changelogAnchor, changelogEntries } from "./site-changelog-data";
import { sitePageMarkdown } from "./site-page-markdown";
const props = withDefaults(
  defineProps<{
    page: SitePageSlug;
    en?: boolean;
    siteUrl?: string;
  }>(),
  { en: false },
);
const data = computed(() => getSitePage(props.page));
const locale = computed(() => (props.en ? "/en" : ""));
const markdownPath = computed(() => `${locale.value}${data.value.path}.md`);
const pageUrl = computed(
  () => siteOrigin(props.siteUrl) + locale.value + data.value.path,
);
const markdown = computed(() =>
  sitePageMarkdown(props.page, props.en, props.siteUrl),
);
const t = (zh: string, en: string) => (props.en ? en : zh);
const html = (value: string) => localSiteHtml(value, props.en);
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
      <p class="site-eyebrow">{{ localize(data.eyebrow, en) }}</p>
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
              :href="'#' + changelogAnchor(week.date)"
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
                    :href="entryHref(item.href)"
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
    :class="['support-page min-w-0', page === 'theme' && 'max-w-3xl']"
  >
    <header
      id="overview"
      :class="[
        'scroll-mt-24',
        page === 'motion-patterns' && 'border-b border-border pb-10',
      ]"
    >
      <p class="site-eyebrow">{{ localize(data.eyebrow, en) }}</p>
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
    <SiteMotionGuide v-if="page === 'motion-patterns'" :en="en" />
    <template v-for="section in data.sections" :key="section.id"
      ><h2
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
        <div v-else-if="block.kind === 'code'" class="mt-4">
          <CodePanel
            :code="resolveSiteCode(block.code, siteUrl)"
            :lang="block.lang"
            :filename="block.filename"
          />
        </div>
        <ul
          v-else
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
  </article>
</template>
<style scoped>
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
