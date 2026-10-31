<script setup lang="ts">
import {
  componentGroups,
  groupedComponentPath,
} from "../../utils/docs/document-sections";
import { componentGroupGuidance } from "../../utils/docs/component-handbook";
import { componentIcon } from "../../utils/docs/navigation-icons";
import { ButtonLink } from "../../../../../packages/vue/src/motion/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleIndicator,
} from "../../../../../packages/vue/src/motion/collapsible";
import { ArrowUpRight } from "lucide-vue-next";
import { descriptions } from "../../utils/docs/i18n";
import DocsCatalogHeader from "./DocsCatalogHeader.vue";
import NewBadge from "./NewBadge.vue";
defineProps<{ en: boolean }>();
const entries = componentGroups.flatMap((group) => group.entries);
const exampleCount = entries.reduce(
  (count, entry) => count + (entry.examples?.length || 1),
  0,
);
</script>
<template>
  <article class="components-index">
    <DocsCatalogHeader
      :title="en ? 'Vue Components' : 'Vue 组件'"
      :description="
        en
          ? 'Find the building blocks for your next interface. Browse by purpose, explore the examples, then take the code into your project.'
          : '为你的下一个界面找到合适的组件。按用途浏览、体验示例，再将源码带入项目。'
      "
      :en="en"
    >
      <span>{{ entries.length }} {{ en ? "components" : "个组件" }}</span
      ><span>{{ exampleCount }} {{ en ? "examples" : "个示例" }}</span>
    </DocsCatalogHeader>
    <nav
      class="catalog-jump-links"
      :aria-label="en ? 'Jump to a component group' : '跳转到组件分组'"
    >
      <ButtonLink
        v-for="group in componentGroups"
        :key="group.id"
        :href="'#' + group.id"
        variant="secondary"
        size="sm"
        class="catalog-jump-link"
        >{{ en ? group.en : group.zh
        }}<span>{{ group.entries.length }}</span></ButtonLink
      >
    </nav>
    <section
      v-for="group in componentGroups"
      :id="group.id"
      :key="group.id"
      class="docs-catalog-section"
    >
      <h2>
        {{ en ? group.en : group.zh }}<span>{{ group.entries.length }}</span>
      </h2>
      <div class="docs-catalog-grid">
        <a
          v-for="entry in group.entries"
          :key="entry.slug"
          :href="groupedComponentPath(entry, en)"
          class="docs-catalog-card"
        >
          <span class="catalog-component-icon" aria-hidden="true"
            ><component
              :is="componentIcon(entry.slug, entry.category)"
              :size="21"
          /></span>
          <div class="docs-catalog-card-body">
            <div class="catalog-card-title">
              <h3>{{ entry.name }}</h3>
              <NewBadge
                v-if="entry.badge === 'new'"
                :launched-at="entry.launchedAt"
              />
            </div>
            <p>{{ en ? entry.description : descriptions[entry.slug] }}</p>
            <small
              >{{ entry.examples?.length || 1 }}
              {{
                en
                  ? (entry.examples?.length || 1) === 1
                    ? "example"
                    : "examples"
                  : "个示例"
              }}</small
            >
          </div>
          <ArrowUpRight
            :size="15"
            class="catalog-card-arrow"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
    <section id="choosing-components" class="catalog-help-section">
      <Collapsible>
        <h2>
          <CollapsibleTrigger class="catalog-help-trigger"
            >{{ en ? "Choose a component" : "如何选择组件"
            }}<CollapsibleIndicator
          /></CollapsibleTrigger>
        </h2>
        <CollapsibleContent
          ><div class="catalog-help-content">
            <p>
              {{
                en
                  ? "Start with the interaction you need, then explore its examples, state bindings and API. Start from an application template when you need a complete workspace."
                  : "先确定需要的交互，再查看示例、状态绑定和 API。完整工作台可以从应用模板开始。"
              }}
            </p>
            <dl>
              <div v-for="group in componentGroups" :key="group.id">
                <dt>{{ en ? group.en : group.zh }}</dt>
                <dd>
                  {{ componentGroupGuidance[group.id][en ? "en" : "zh"] }}
                </dd>
              </div>
            </dl>
            <div class="docs-inline-links">
              <ButtonLink
                :href="(en ? '/en' : '') + '/docs/installation'"
                variant="secondary"
                size="sm"
                >{{ en ? "Installation guide" : "安装指南" }}</ButtonLink
              ><ButtonLink
                :href="(en ? '/en' : '') + '/templates'"
                variant="ghost"
                size="sm"
                >{{ en ? "Application templates" : "应用模板" }} ↗</ButtonLink
              >
            </div>
          </div></CollapsibleContent
        >
      </Collapsible>
    </section>
  </article>
</template>
