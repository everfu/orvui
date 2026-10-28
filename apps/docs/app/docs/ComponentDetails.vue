<script setup lang="ts">
import { computed } from "vue";
import NewBadge from "./NewBadge.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleIndicator,
  CollapsibleTrigger,
} from "../../../../packages/vue/src/motion/collapsible";
import { descriptions } from "./i18n";
import {
  getComponentDetails,
  getComponentAbout,
  getComponentGuide,
  relatedComponents,
  componentDetails,
} from "./details";
const props = withDefaults(
  defineProps<{
    category: string;
    slug: string;
    en?: boolean;
    section?: "all" | "behavior" | "after";
  }>(),
  { en: false, section: "all" },
);
const text = (zh: string, en: string) => (props.en ? en : zh);
const current = computed(() => getComponentDetails(props.category, props.slug));
const guide = computed(() =>
  getComponentGuide(props.category, props.slug, props.en),
);
const related = computed(() =>
  relatedComponents(props.category, props.slug, 3),
);
const about = computed(() =>
  getComponentAbout(props.category, props.slug, props.en),
);
const route = (category: string, slug: string) =>
  `${props.en ? "/en" : ""}/${category === "charts" ? "charts" : `components/${category}`}/${slug}`;
const connectionRoute = (slug: string) => {
  const record = componentDetails.find((record) => record.slug === slug);
  return route(record?.category ?? "agents", slug);
};
const lowercaseFirst = (value: string) =>
  value.charAt(0).toLowerCase() + value.slice(1);
const credit = computed(() => {
  if (!current.value?.credit) return;
  return current.value.credit;
});
const date = computed(() => {
  const value = current.value?.dates.updatedAt;
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  const stamp = new Date(Date.UTC(year!, month! - 1, day!));
  return stamp.toLocaleDateString(props.en ? "en" : "zh-CN", {
    dateStyle: "medium",
    timeZone: "UTC",
  });
});
</script>
<template>
  <div v-if="current" class="component-details">
    <template v-if="guide && section !== 'after'">
      <section id="composition" class="details-section">
        <h2 class="guide-title">{{ text("组合结构", "Composition") }}</h2>
        <p class="guide-copy">{{ guide.composition.description }}</p>
        <pre
          class="composition-tree"
        ><code>{{guide.composition.tree}}</code></pre>
        <p v-if="guide.connections.length" class="guide-connections">
          <span class="connection-note">{{ text("说明：", "Note:") }}</span
          >{{ " "
          }}<span
            v-for="(connection, index) in guide.connections"
            :key="connection.slug"
            >{{ index > 0 ? " " : ""
            }}<a
              :href="connectionRoute(connection.slug)"
              class="connection-link"
              >{{ connection.name }}</a
            >{{ " " }}{{ lowercaseFirst(connection.description) }}</span
          >
        </p>
      </section>
      <section id="behavior" class="details-section">
        <h2 class="guide-title">{{ text("工作方式", "How it works") }}</h2>
        <p class="guide-copy">{{ guide.introduction }}</p>
      </section>
    </template>
    <template v-if="section !== 'behavior'">
      <section v-if="about" id="about" class="details-section details-about">
        <Collapsible>
          <h2 class="details-title">
            <CollapsibleTrigger class="details-about-trigger"
              >{{ text("关于 ", "About ") }}{{ current.name
              }}<CollapsibleIndicator
            /></CollapsibleTrigger>
          </h2>
          <CollapsibleContent
            ><div class="details-about-content" :lang="en ? 'en' : 'zh-CN'">
              <template v-if="section === 'all'"
                ><p>{{ about.overview }}</p>
                <h3>{{ text("适用场景", "When to use it") }}</h3>
                <ul>
                  <li v-for="item in about.useWhen" :key="item">{{ item }}</li>
                </ul></template
              >
              <h3>{{ text("无障碍", "Accessibility") }}</h3>
              <p class="about-copy">{{ about.accessibility }}</p>
              <h3>FAQ</h3>
              <dl class="about-faq">
                <div v-for="item in about.faq" :key="item.question">
                  <dt>{{ item.question }}</dt>
                  <dd>{{ item.answer }}</dd>
                </div>
              </dl>
            </div></CollapsibleContent
          >
        </Collapsible>
      </section>
      <section
        v-if="related.length"
        id="related-components"
        class="details-section"
      >
        <h2 class="details-title">
          {{ text("相关组件", "Related components") }}
        </h2>
        <div class="related-grid">
          <a
            v-for="item in related"
            :key="`${item.category}/${item.slug}`"
            :href="route(item.category, item.slug)"
            class="related-card"
          >
            <div class="related-card-heading">
              <h3>{{ item.name }}</h3>
              <NewBadge
                v-if="item.badge === 'new'"
                :launched-at="item.launchedAt"
              />
            </div>
            <div class="related-card-body">
              <p>
                {{
                  en
                    ? item.description
                    : descriptions[item.slug] || item.description
                }}
              </p>
            </div>
          </a>
        </div>
      </section>
      <section v-if="credit" class="details-section details-credit">
        <h2 class="details-title">{{ text("贡献者", "Contributed by") }}</h2>
        <a :href="credit.url" target="_blank" rel="noreferrer noopener"
          ><span>{{ credit.name }}</span></a
        >
      </section>
      <section
        v-if="category === 'blocks'"
        class="details-section details-note"
      >
        <h2 class="details-title">{{ text("请留意", "Keep in mind") }}</h2>
        <p>
          {{
            text(
              "部分组件参考了开源作品，相关署名与独立许可请参阅",
              "Some components reference open-source work. See the retained attribution and separate licenses in",
            )
          }}
          <a href="/licenses/orvui-NOTICE.txt">NOTICE</a>。
        </p>
      </section>
      <p class="details-updated">
        {{ text("更新于", "Updated") }}
        <time
          :datetime="current.dates.updatedAt"
          :title="
            text(
              'orvui 组件文档更新日期',
              'orvui component documentation update date',
            )
          "
          >{{ date }}</time
        >
      </p>
    </template>
  </div>
</template>
<style scoped>
.component-details {
  min-width: 0;
}
.details-section {
  margin-top: 3rem;
  scroll-margin-top: 6rem;
  border-top: 1px solid var(--border);
  padding-top: 2rem;
}
.guide-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
  letter-spacing: -0.025em;
  color: var(--foreground);
}
.guide-copy {
  margin: 0.75rem 0 0;
  font-size: 1rem;
  line-height: 1.75rem;
  color: var(--muted-foreground);
}
.composition-tree {
  margin: 1rem 0 0;
  width: 100%;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: var(--muted);
  padding: 1.25rem;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.5rem;
  color: var(--foreground);
}
.composition-tree code {
  font: inherit;
  white-space: pre;
}
.guide-connections {
  margin: 1.25rem 0 0;
  font-size: 1rem;
  line-height: 1.75rem;
  color: var(--muted-foreground);
}
.connection-note {
  font-weight: 500;
  color: var(--foreground);
}
.connection-link {
  border-radius: 0.25rem;
  background: var(--muted);
  padding: 0.125rem 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--foreground);
  text-decoration: underline;
  text-decoration-color: var(--border);
  text-underline-offset: 2px;
}
.connection-link:hover {
  text-decoration-color: var(--foreground);
}
.connection-link:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
.details-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: var(--foreground);
}
.related-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
}
.related-card {
  position: relative;
  display: flex;
  height: 10rem;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.5rem;
  background: var(--card);
  color: inherit;
  text-decoration: none;
  contain: paint;
  transition: background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.related-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.related-card-heading {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
}
.related-card-heading h3 {
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  color: var(--foreground);
}
.related-card-body {
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: flex-start;
  overflow: hidden;
  margin: 0 0.5rem 0.5rem;
  border-radius: 1.5rem;
  background: var(--background);
  padding: 1rem;
  transition: background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.related-card:hover .related-card-body,
.related-card:focus-visible .related-card-body {
  background: color-mix(in srgb, var(--background) 80%, transparent);
}
.related-card-body p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.625;
  color: var(--muted-foreground);
}
.details-about {
  padding-top: 1.5rem;
}
.details-about :deep(.details-about-trigger) {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  width: calc(100% + 1.5rem);
}
.details-about-content {
  padding-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: var(--muted-foreground);
}
.details-about-content p {
  margin: 0;
}
.details-about-content h3 {
  margin: 1.5rem 0 0;
  font-size: inherit;
  font-weight: 500;
  line-height: inherit;
  color: var(--foreground);
}
.details-about-content ul {
  margin: 0.5rem 0 0;
  list-style: disc;
  padding-left: 1.25rem;
}
.details-about-content li + li {
  margin-top: 0.375rem;
}
.details-about-content p.about-copy {
  margin-top: 0.5rem;
}
.about-faq {
  margin: 0.5rem 0 0;
}
.about-faq > div + div {
  margin-top: 1rem;
}
.about-faq dt {
  font-weight: 500;
  color: var(--foreground);
}
.about-faq dd {
  margin: 0.25rem 0 0;
}
.details-credit > a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
}
.details-credit > a span {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.details-note > p {
  max-width: 42rem;
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: var(--muted-foreground);
}
.details-note a {
  color: var(--foreground);
  text-underline-offset: 2px;
}
.details-note a:hover {
  text-decoration: underline;
}
.details-updated {
  margin: 1.5rem 0 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--muted-foreground);
}
@media (min-width: 640px) {
  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
