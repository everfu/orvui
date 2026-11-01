<script setup lang="ts">
import { Expand, Minimize2 } from "lucide-vue-next";
import type {
  CatalogCategory,
  CatalogEntry,
} from "../../../../../tools/registry/types";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../../packages/vue/src/motion/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../../../../../packages/vue/src/motion/select";
import DemoPreview from "./DemoPreview.vue";
import CodePanel from "./CodePanel.vue";
import NewBadge from "./NewBadge.vue";
import CopyPage from "./CopyPage.vue";
import SiteInstallBlock from "./SiteInstallBlock.vue";
import PropsReference from "./PropsReference.vue";
import ComponentStateGuide from "./ComponentStateGuide.vue";
import ComponentDetails from "./ComponentDetails.vue";
import ComponentOverview from "./ComponentOverview.vue";
import { variantNames } from "../../utils/docs/i18n";
import { getVariantDescription } from "../../utils/docs/variant-descriptions";
import { useSiteShell } from "../../composables/site-shell-state";
import { createComponentDocument } from "../../composables/component-document-state";
const props = defineProps<{ category: CatalogCategory; entry: CatalogEntry }>();
const shell = useSiteShell();
const { en, t, pathname, addressPath, catalog, description } = shell;
const {
  tabs,
  selected,
  installMode,
  expanded,
  expand,
  closeExpanded,
  bindStage,
  examples,
  compositionFor,
  usage,
  installSlugs,
  extraDependencies,
  previewDependencies,
  allInstallSlugs,
  allExtraDependencies,
  allPreviewDependencies,
  sourcePath,
  sourceFor,
  filesFor,
  showApi,
  pageUrl,
  pageMarkdown,
} = createComponentDocument(
  () => props.category,
  () => props.entry,
  shell,
);
const views = ["preview", "usage", "source"];
const tabLabel = (view: string) =>
  view === "preview"
    ? t("预览", "Preview")
    : view === "usage"
      ? t("用法", "Usage")
      : t("源码", "Code");
const modeLabels = [
  { value: "registry", zh: "复制源码", en: "Registry source" },
  { value: "package", zh: "组件包", en: "Package" },
];
</script>
<template>
  <div id="overview" class="page-title">
    <div class="flex items-center gap-3">
      <h1>{{ entry.name }}</h1>
      <NewBadge
        v-if="entry.badge === 'new'"
        :launched-at="entry.launchedAt"
        class="mt-1"
      />
    </div>
    <CopyPage
      :page-url="pageUrl"
      :markdown-path="addressPath.replace(/\/$/, '') + '.md'"
      :component-name="entry.name"
      :markdown="pageMarkdown"
      :en="en"
    />
  </div>
  <p class="page-description">
    {{ description(entry.slug, entry.description) }}
  </p>
  <ComponentOverview
    :category="category.slug"
    :slug="entry.slug"
    :en="en"
    :summary="description(entry.slug, entry.description)"
  />
  <section id="install" class="component-install-section">
    <span
      v-for="example in examples"
      :key="example.slug"
      :id="`${example.slug}-install`"
      class="anchor-alias"
    />
    <h2>{{ t("安装", "Installation") }}</h2>
    <p class="guide-copy">
      {{
        t(
          "选择安装方式，用法示例将同步更新导入路径。",
          "Choose an installation source. Usage imports update to match.",
        )
      }}
    </p>
    <Tabs
      v-model="installMode"
      variant="segment"
      class="usage-installation-mode"
      ><TabsList
        :aria-label="t('安装方式', 'Installation source')"
        class="site-segmented"
        ><TabsTrigger
          v-for="mode in modeLabels"
          :key="mode.value"
          :value="mode.value"
          class="site-segmented-trigger"
          indicator-class-name="bg-foreground"
          >{{ en ? mode.en : mode.zh }}</TabsTrigger
        ></TabsList
      ></Tabs
    >
    <SiteInstallBlock
      :slug="entry.slug"
      :en="en"
      :mode="installMode"
      :install-slugs="allInstallSlugs"
      :extra-dependencies="allExtraDependencies"
      :demo-dependencies="allPreviewDependencies"
    />
  </section>
  <div id="examples" class="component-examples">
    <h2 class="docs-section-heading">{{ t("示例", "Examples") }}</h2>
    <section
      v-for="example in examples"
      :id="example.slug"
      :key="example.slug"
      class="example-section"
      :class="{
        'has-variants': !!entry.examples?.length,
        'is-expanded': expanded === example.slug,
      }"
    >
      <div v-if="entry.examples?.length" class="example-title">
        <div class="flex items-center gap-2">
          <h2>
            {{ en ? example.name : variantNames[example.slug] || example.name }}
          </h2>
          <NewBadge
            v-if="example.badge === 'new'"
            :launched-at="example.launchedAt"
          />
        </div>
        <code
          >{{
            example.slug === "default" ? entry.slug : example.slug
          }}.vue</code
        >
      </div>
      <h2 v-else class="sr-only">{{ t("预览", "Preview") }}</h2>
      <p v-if="example.description" class="example-description">
        {{
          getVariantDescription(
            category.slug,
            entry.slug,
            example.slug,
            en,
            example.description,
          )
        }}
      </p>
      <Tabs
        :model-value="tabs[example.slug] || 'preview'"
        variant="pill"
        @update:model-value="tabs[example.slug] = $event"
      >
        <div class="preview-toolbar">
          <TabsList :aria-label="example.name" class="site-segmented"
            ><TabsTrigger
              v-for="view in views"
              :key="view"
              :value="view"
              indicator-class-name="bg-foreground"
              class="site-segmented-trigger"
              >{{ tabLabel(view) }}</TabsTrigger
            ></TabsList
          >
          <button
            type="button"
            class="icon-button site-action site-action--icon"
            :aria-label="t('展开预览', 'Expand preview')"
            :aria-expanded="expanded === example.slug"
            :aria-controls="`${entry.slug}-${example.slug}-stage`"
            @click="expand(example.slug)"
          >
            <Expand :size="16" />
          </button>
        </div>
        <TabsContent value="preview">
          <div
            :id="`${entry.slug}-${example.slug}-stage`"
            :ref="(el) => bindStage(el, example.slug)"
            class="preview-stage"
            :class="{ expanded: expanded === example.slug }"
            :style="{ minHeight: entry.examples?.length ? '260px' : '320px' }"
            :role="expanded === example.slug ? 'dialog' : undefined"
            :aria-modal="expanded === example.slug ? true : undefined"
            :aria-label="expanded === example.slug ? entry.name : undefined"
            :tabindex="expanded === example.slug ? -1 : undefined"
          >
            <button
              v-if="expanded === example.slug"
              type="button"
              class="expand-close icon-button site-action site-action--icon"
              :aria-label="t('退出展开预览', 'Exit expanded preview')"
              :title="t('退出（Esc）', 'Exit (Esc)')"
              @click="closeExpanded"
            >
              <Minimize2 :size="16" aria-hidden="true" />
            </button>
            <DemoPreview
              :category="category.slug"
              :slug="entry.slug"
              :variant="example.slug === 'default' ? undefined : example.slug"
            />
          </div>
        </TabsContent>
        <TabsContent value="usage">
          <Tabs
            v-model="installMode"
            variant="segment"
            class="usage-installation-mode"
            ><TabsList
              :aria-label="t('用法安装方式', 'Usage installation source')"
              class="site-segmented"
              ><TabsTrigger
                v-for="mode in modeLabels"
                :key="mode.value"
                :value="mode.value"
                class="site-segmented-trigger"
                indicator-class-name="bg-foreground"
                >{{ en ? mode.en : mode.zh }}</TabsTrigger
              ></TabsList
            ></Tabs
          >
          <CodePanel
            :en="en"
            :code="usage(example.slug, installMode)"
            :filename="compositionFor(example.slug)?.demoFile"
            label="Vue"
          />
        </TabsContent>
        <TabsContent value="source">
          <Select
            :model-value="sourcePath(example.slug)"
            @update:model-value="selected[example.slug] = String($event)"
            ><SelectTrigger
              class="source-select"
              :aria-label="t('源文件', 'Source file')"
              ><SelectValue /></SelectTrigger
            ><SelectContent
              ><SelectItem
                v-for="[path] in filesFor(example.slug)"
                :key="path"
                :value="path"
                >{{ path.split("/").slice(-2).join("/") }}</SelectItem
              ></SelectContent
            ></Select
          >
          <CodePanel
            :en="en"
            :code="sourceFor(example.slug)"
            :filename="sourcePath(example.slug).replace(/^(\.\.\/)+/, '')"
            :label="sourcePath(example.slug).split('/').at(-1) || 'Vue'"
          />
        </TabsContent>
      </Tabs>
    </section>
  </div>
  <ComponentDetails
    :category="category.slug"
    :slug="entry.slug"
    :en="en"
    section="behavior"
  />
  <ComponentStateGuide :category="category.slug" :slug="entry.slug" :en="en" />
  <section class="component-api-reference">
    <h2 :id="entry.examples?.length ? 'api-reference' : undefined">
      {{ t("API 参考", "API Reference") }}
    </h2>
    <template v-for="example in examples" :key="example.slug">
      <div
        v-if="showApi(example.slug)"
        :id="
          entry.examples?.length
            ? `${example.slug}-api-reference`
            : 'api-reference'
        "
        class="component-api-section"
      >
        <p v-if="entry.examples?.length" class="api-variant-label">
          {{ en ? example.name : variantNames[example.slug] || example.name }}
        </p>
        <PropsReference
          :category="category.slug"
          :slug="entry.slug"
          :variant="entry.examples?.length ? example.slug : undefined"
          :en="en"
        />
      </div>
    </template>
  </section>
  <ComponentDetails
    :category="category.slug"
    :slug="entry.slug"
    :en="en"
    section="after"
  />
  <div id="licenses" class="source-attribution">
    <a href="/licenses/orvui-NOTICE.txt"
      >{{ t("来源与许可", "Attribution and licenses") }} ↗</a
    ><span>MIT · {{ catalog.product.version }}</span>
  </div>
</template>
