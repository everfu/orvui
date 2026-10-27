<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { AgentActivity, type AgentActivityItem } from "../index";
// SVG bodies: @iconify-json/simple-icons 1.2.100, Simple Icons 16.35.0, CC0-1.0. See ../LICENSE.simple-icons.
const brandBodies = [
  '<path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133c-1.147 1.147-2.933 2.4-6.053 2.4c-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0C5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36c2.16-2.16 2.84-5.213 2.84-7.667c0-.76-.053-1.467-.173-2.053z"/>',
  '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  '<path fill="currentColor" d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728c-.616 1.074-1.127.931-1.532.029c-1.406-3.321-4.293-9.144-5.651-12.409c-.251-.601-.441-.987-.619-1.139q-.27-.225-1.122-.271q-.314-.034-.313-.159v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434q0 .177-.225.176l-.564.031c-.485.029-.727.164-.727.436c0 .135.053.33.166.601c1.082 2.646 4.818 10.521 4.818 10.521l.136.046l2.411-4.81l-.482-1.067l-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617c-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252l1.758-3.504c.293-.64.233-.801.111-.947c-.07-.084-.305-.22-.812-.24l-.201-.021a.23.23 0 0 1-.145-.051a.15.15 0 0 1-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178c-.646.03-.782.095-1.023.439c-.12.186-.375.589-.646 1.039l-2.301 4.273l-.065.135l2.792 5.712l.17.048l4.396-10.438c.154-.422.129-.722-.064-.895c-.197-.172-.346-.273-.857-.295l-.42-.016a.26.26 0 0 1-.152-.045c-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18c-.648.03-1.127.18-1.443.421c-.314.255-.557.616-.736 1.067c0 0-4.043 9.258-5.426 12.339c-.525 1.007-1.053.917-1.503-.031c-.571-1.171-1.773-3.786-2.646-5.71z"/>',
  '<path fill="currentColor" d="m12 1.608l12 20.784H0Z"/>',
];
const logos = brandBodies.map(
  (body) => () =>
    h("svg", {
      "aria-hidden": true,
      viewBox: "0 0 24 24",
      class: "size-3.5",
      fill: "currentColor",
      innerHTML: body,
    }),
);
const SEARCH_RESULTS = [
  {
    id: "google",
    title: "Google for Developers",
    domain: "developers.google.com",
    icon: logos[0],
  },
  { id: "github", title: "GitHub", domain: "github.com", icon: logos[1] },
  {
    id: "wikipedia",
    title: "Wikipedia",
    domain: "wikipedia.org",
    icon: logos[2],
  },
  {
    id: "vercel",
    title: "Vercel Docs",
    domain: "vercel.com/docs",
    icon: logos[3],
  },
];
const complete = ref(false),
  run = ref(0),
  reduce = ref(false);
const visible = ref(0);
const items = computed<AgentActivityItem[]>(() => [
  {
    id: "search",
    type: "search",
    query: "accessible animation patterns for Vue",
    results: SEARCH_RESULTS.slice(0, visible.value),
    moreCount: visible.value === SEARCH_RESULTS.length ? 7 : undefined,
  },
]);
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  run.value++;
  complete.value = false;
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  visible.value = 0;
  if (reduce.value) {
    visible.value = SEARCH_RESULTS.length;
    complete.value = true;
    return;
  }
  SEARCH_RESULTS.forEach((_, index) =>
    later(650 + 650 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(3900, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <AgentActivity
      :key="run"
      :items="items"
      :status="complete ? 'complete' : 'working'"
      :default-open="reduce"
      :collapse-on-complete="!reduce"
      content-type="search"
      :max-height="220"
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
