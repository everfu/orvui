<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Copy, Check } from "lucide-vue-next";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import { ActionSwapCascadeText } from "../../../../../packages/vue/src/motion/action-swap";
import catalog from "../../../../../tools/catalog/components.json";
import { useSiteCopy } from "../../composables/use-site-copy";
import {
  registryBaseUrl,
  registryBaseForSite,
  shadcnVersion,
} from "../../../../../tools/distribution";
const props = defineProps<{ slug?: string; slugs?: string[]; en?: boolean }>();
const runners = {
  bun: "bunx --bun",
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};
type PM = keyof typeof runners;
const manager = ref<PM>("bun"),
  index = ref(0),
  registryBase = ref(registryBaseUrl);
const { copied, failed, copyText } = useSiteCopy(2000);
const catalogSlugs: string[] = [];
for (const category of catalog.categories)
  for (const component of category.components) {
    const examples = "examples" in component ? component.examples : undefined;
    if (examples?.length) {
      for (const example of examples)
        if (
          "installSlug" in example &&
          typeof example.installSlug === "string" &&
          example.installSlug
        )
          catalogSlugs.push(example.installSlug);
    } else catalogSlugs.push(component.slug);
  }
const fixedSlugs = computed(() =>
  Array.from(
    new Set(props.slugs?.map((value) => value.trim()).filter(Boolean)),
  ),
);
const targets = computed(() =>
  fixedSlugs.value.length
    ? fixedSlugs.value
    : [props.slug || catalogSlugs[index.value % catalogSlugs.length]!],
);
const encodeSlug = (value: string) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
const url = (value: string) =>
  `${registryBase.value}/${encodeSlug(value)}.json`;
const shellArgument = (value: string) =>
  /^[a-zA-Z0-9_./:%~+-]+$/.test(value)
    ? value
    : "'" + value.replaceAll("'", "'\"'\"'") + "'";
const urls = computed(() =>
  targets.value.map((value) => shellArgument(url(value))),
);
const slug = computed(() => encodeSlug(targets.value[0]!));
const animatedSingle = computed(
  () => targets.value.length === 1 && urls.value[0] === url(targets.value[0]!),
);
const runner = computed(() => runners[manager.value].split(" "));
const command = computed(
  () =>
    `${runners[manager.value]} shadcn-vue@${shadcnVersion} add ${urls.value.join(" ")}`,
);
const copy = () => copyText(command.value);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  registryBase.value = registryBaseForSite(window.location.href);
  timer = setInterval(() => {
    if (!props.slug && !fixedSlugs.value.length)
      index.value = (index.value + 1) % catalogSlugs.length;
  }, 1800);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
<template>
  <div class="site-install-command docs-code-frame">
    <div class="command-header">
      <Tabs v-model="manager" variant="segment"
        ><TabsList class="command-manager-tabs"
          ><TabsTrigger
            v-for="pm in Object.keys(runners) as PM[]"
            :key="pm"
            :value="pm"
            indicator-class-name="rounded-md bg-background border border-border shadow-none"
            class="command-manager-tab"
            >{{ pm }}</TabsTrigger
          ></TabsList
        ></Tabs
      >
      <button
        type="button"
        class="command-copy site-action site-action--sm site-action--icon"
        :aria-label="
          copied ? (en ? 'Copied' : '已复制') : en ? 'Copy code' : '复制命令'
        "
        @click="copy"
      >
        <Check v-if="copied" :size="14" /><Copy v-else :size="14" />
      </button>
    </div>
    <div class="command-overflow">
      <div class="command-text">
        <span class="command-prompt">$ </span
        ><span class="command-runner">{{ runner[0] }}</span
        ><span v-if="runner[1]" class="command-flag">{{ " " + runner[1] }}</span
        ><span class="command-tool">{{ ` shadcn-vue@${shadcnVersion} ` }}</span
        ><span class="command-add">add</span
        ><template v-if="animatedSingle"
          ><span class="command-prefix">{{ " " + registryBase + "/" }}</span
          ><ActionSwapCascadeText :value="slug" class="command-slug">{{
            slug
          }}</ActionSwapCascadeText
          ><span class="command-prefix">.json</span></template
        >
        <span v-else class="command-prefix">{{ " " + urls.join(" ") }}</span>
      </div>
    </div>
    <span v-if="failed" role="status" class="copy-error">{{
      en
        ? "Clipboard unavailable. Select and copy the command."
        : "剪贴板不可用，请选中并复制命令。"
    }}</span>
  </div>
</template>
<style scoped>
.site-install-command {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  border: 0;
  background: transparent;
  font-size: 14px;
}
.command-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  margin-bottom: 4px;
  padding: 0 8px;
}
.command-copy {
  margin-left: auto;
  width: 28px;
  height: 28px;
  min-height: 28px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted-foreground);
}
.command-copy:hover {
  background: var(--muted);
  color: var(--foreground);
}
.command-overflow {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  border-radius: 12px;
  background: color-mix(in oklab, var(--foreground) 4%, var(--background));
  box-shadow: inset 0 0 0 1px
    color-mix(in oklab, var(--border) 45%, transparent);
}
.command-overflow::-webkit-scrollbar {
  display: none;
}
.command-text {
  min-width: max-content;
  /* Animated letters must not enlarge the command's scrollable area. */
  overflow: clip;
  white-space: nowrap;
  padding: 14px 20px;
  font-family: var(--font-geist-mono);
  font-size: 13px;
  line-height: 20px;
}
.command-prompt {
  user-select: none;
  color: #6e7781;
}
.command-runner {
  color: #1f6feb;
}
.command-flag {
  color: #6f42c1;
}
.command-tool {
  color: #24292f;
}
.command-add {
  color: #0550ae;
}
.command-prefix {
  color: #24292fb3;
}
.command-slug {
  font-weight: 500;
  color: #0a3069;
}
.copy-error {
  display: block;
  padding: 0 20px 12px;
  font-size: 12px;
  color: var(--destructive);
}
.dark .command-prompt {
  color: #8b949e;
}
.dark .command-runner {
  color: #ffa657;
}
.dark .command-flag {
  color: #d2a8ff;
}
.dark .command-tool {
  color: #e6edf3;
}
.dark .command-add {
  color: #79c0ff;
}
.dark .command-prefix {
  color: #e6edf399;
}
.dark .command-slug {
  color: #a5d6ff;
}
</style>
