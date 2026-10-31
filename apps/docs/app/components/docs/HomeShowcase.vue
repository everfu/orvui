<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  watch,
  type Component,
} from "vue";
import { AnimatePresence, motion } from "motion-v";
import { useReducedMotion } from "../../../../../packages/vue/src/lib/composables";
import { EASE_OUT } from "../../../../../packages/vue/src/lib/ease";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import {
  ColorSelector,
  ColorSelectorItem,
  ColorSelectorLabel,
  ColorSelectorList,
} from "../../../../../packages/vue/src/motion/color-selector";
import HomeComponentsScene from "./HomeComponentsScene.vue";
import { useSiteShell } from "../../composables/site-shell-state";
import { useSitePreferences } from "../../composables/preferences";
import { THEME_LIST } from "../../utils/docs/themes";
import { themeNames } from "../../utils/docs/theme-names";
import "../../assets/css/home-showcase.css";

const sceneLoaders: Record<string, () => Promise<{ default: Component }>> = {
  components: async () => ({ default: HomeComponentsScene }),
  dashboard: () => import("./HomeDashboardScene.vue"),
  mail: () => import("./HomeMailScene.vue"),
  chat: () => import("./HomeChatScene.vue"),
  finances: () => import("./HomeFinancesScene.vue"),
  crm: () => import("./HomeCrmScene.vue"),
};
const { t, en } = useSiteShell();
const { colorTheme } = useSitePreferences();
const scene = ref("components");
const displayedScene = ref("components");
const sceneComponent = shallowRef<Component>(HomeComponentsScene);
const loadedScenes = new Map<string, Component>([
  ["components", HomeComponentsScene],
]);
const loading = ref(false);
const transitioning = ref(false);
const reduced = useReducedMotion();
const loadError = ref(false);
function finishTransition(target: unknown) {
  // An exiting view completes after the next view may already have started.
  if (
    target &&
    typeof target === "object" &&
    "opacity" in target &&
    target.opacity === 1
  )
    transitioning.value = false;
}
let request = 0;
let disposed = false;
watch(scene, async (value) => {
  const ticket = ++request;
  if (value === displayedScene.value) {
    loading.value = false;
    return;
  }
  const load = sceneLoaders[value];
  if (!load) return;
  loadError.value = false;
  loading.value = true;
  try {
    const component = loadedScenes.get(value) ?? (await load()).default;
    loadedScenes.set(value, component);
    if (disposed || ticket !== request) return;
    sceneComponent.value = component;
    displayedScene.value = value;
  } catch {
    if (!disposed && ticket === request) {
      loadError.value = true;
      scene.value = displayedScene.value;
    }
  } finally {
    if (!disposed && ticket === request) loading.value = false;
  }
});
onBeforeUnmount(() => {
  disposed = true;
  ++request;
});
const ready = ref(false);
onMounted(() => {
  ready.value = true;
});
const id = useId();
const scenes = [
  { value: "components", zh: "组件", en: "Components" },
  { value: "dashboard", zh: "仪表盘", en: "Dashboard" },
  { value: "mail", zh: "邮件", en: "Mail" },
  { value: "chat", zh: "聊天", en: "Chat" },
  { value: "finances", zh: "财务", en: "Finances" },
  { value: "crm", zh: "CRM", en: "CRM" },
];
</script>

<template>
  <section
    class="home-showcase"
    :data-ready="ready"
    :aria-label="t('交互组件展台', 'Interactive component showcase')"
  >
    <div class="home-showcase-toolbar">
      <Tabs v-model="scene" variant="segment">
        <TabsList
          :aria-label="t('展示场景', 'Showcase scenes')"
          class="home-scene-tabs"
        >
          <TabsTrigger
            v-for="item in scenes"
            :key="item.value"
            :value="item.value"
            :id="`${id}-tab-${item.value}`"
            :aria-controls="`${id}-panel`"
          >
            {{ t(item.zh, item.en) }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <ColorSelector class="home-palette" v-model="colorTheme">
        <ColorSelectorLabel class="sr-only">{{
          t("展台配色", "Showcase palette")
        }}</ColorSelectorLabel>
        <ColorSelectorList>
          <ColorSelectorItem
            v-for="theme in THEME_LIST"
            :key="theme.id"
            :value="theme.id"
            :color="theme.swatch"
            :label="t(...themeNames[theme.id])"
            :title="t(...themeNames[theme.id])"
            :data-palette="theme.id"
          />
        </ColorSelectorList>
      </ColorSelector>
    </div>
    <p v-if="loadError" role="alert" class="home-scene-error">
      {{
        t(
          "暂时无法加载此场景，请重新选择。",
          "This scene could not load. Please select it again.",
        )
      }}
    </p>
    <div
      :id="`${id}-panel`"
      role="tabpanel"
      :aria-labelledby="`${id}-tab-${displayedScene}`"
      :aria-busy="loading || transitioning"
      :inert="loading || transitioning || undefined"
      tabindex="0"
      class="home-scene-panel"
    >
      <AnimatePresence mode="wait" :initial="false">
        <motion.div
          :key="`${displayedScene}-${en}`"
          class="home-scene-view"
          :data-transitioning="transitioning"
          :initial="{
            opacity: 0,
            y: reduced ? 0 : 10,
            filter: reduced ? 'none' : 'blur(3px)',
          }"
          :animate="{ opacity: 1, y: 0, filter: 'none' }"
          :exit="{
            opacity: 0,
            y: reduced ? 0 : -4,
            filter: reduced ? 'none' : 'blur(2px)',
            transition: { duration: reduced ? 0.08 : 0.12, ease: EASE_OUT },
          }"
          :transition="{
            duration: reduced ? 0.08 : 0.32,
            ease: EASE_OUT,
            opacity: { duration: reduced ? 0.08 : 0.24 },
            filter: { duration: reduced ? 0.08 : 0.24 },
          }"
          @animation-start="transitioning = true"
          @animation-complete="finishTransition"
        >
          <component :is="sceneComponent" />
        </motion.div>
      </AnimatePresence>
    </div>
  </section>
</template>
