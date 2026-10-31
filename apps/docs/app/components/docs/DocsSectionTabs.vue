<script setup lang="ts">
import { useId, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";
import { BookOpen, Shapes, PanelsTopLeft, Rocket } from "lucide-vue-next";
import { ButtonLink } from "../../../../../packages/vue/src/motion/button";
import { useReducedMotion } from "../../../../../packages/vue/src/lib/composables";
import { SPRING_LAYOUT } from "../../../../../packages/vue/src/lib/ease";
import {
  documentationSections,
  type DocsSection,
} from "../../utils/docs/document-sections";
const props = defineProps<{ section?: DocsSection; en: boolean }>();
const emit = defineEmits<{ navigate: [] }>();
const id = useId();
const reduced = useReducedMotion();
const root = ref<HTMLElement>();
let frame = 0;
let mounted = false;
function reveal() {
  if (!mounted) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const nav = root.value;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav) return;
    if (!current) {
      nav.scrollLeft = 0;
      return;
    }
    const viewport = nav.getBoundingClientRect(),
      item = current.getBoundingClientRect();
    const delta =
      item.left < viewport.left
        ? item.left - viewport.left - 4
        : item.right > viewport.right
          ? item.right - viewport.right + 4
          : 0;
    if (delta)
      nav.scrollTo({
        left: nav.scrollLeft + delta,
        behavior: reduced.value ? "instant" : "smooth",
      });
  });
}
watch(() => [props.section, props.en], reveal, { flush: "post" });
onMounted(() => {
  mounted = true;
  reveal();
  window.addEventListener("resize", reveal);
  if (document.fonts) void document.fonts.ready.then(reveal);
});
onBeforeUnmount(() => {
  mounted = false;
  cancelAnimationFrame(frame);
  window.removeEventListener("resize", reveal);
});
const icons = {
  book: BookOpen,
  components: Shapes,
  templates: PanelsTopLeft,
  releases: Rocket,
};
</script>
<template>
  <nav
    ref="root"
    class="docs-section-tabs"
    :aria-label="en ? 'Documentation sections' : '文档分类'"
  >
    <ButtonLink
      v-for="item in documentationSections"
      :key="item.id"
      :href="(en ? '/en' : '') + item.path"
      variant="ghost"
      size="sm"
      :aria-current="section === item.id ? 'page' : undefined"
      class="docs-section-tab"
      @click="emit('navigate')"
    >
      <component :is="icons[item.icon]" :size="15" aria-hidden="true" /><span>{{
        en ? item.en : item.zh
      }}</span>
      <motion.span
        v-if="section === item.id"
        :layout-id="id + '-section'"
        :initial="false"
        :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"
        class="docs-section-indicator"
        aria-hidden="true"
      />
    </ButtonLink>
  </nav>
</template>
