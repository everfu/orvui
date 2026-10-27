<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Bell, CheckCircle2, GitPullRequest, MessageCircle } from "lucide-vue-next";
import { PullToRefresh } from "./index";
const activity = [
  { id: 1, icon: GitPullRequest, title: "Motion review approved", detail: "The pull request is ready to merge.", time: "4m" },
  { id: 2, icon: MessageCircle, title: "New component feedback", detail: "The spring feels much closer to native now.", time: "18m" },
  { id: 3, icon: CheckCircle2, title: "Registry checks passed", detail: "All component files resolved successfully.", time: "31m" },
  { id: 4, icon: Bell, title: "Preview deployed", detail: "The latest build is ready to inspect.", time: "1h" },
  { id: 5, icon: MessageCircle, title: "Docs comment resolved", detail: "The usage example now covers async refreshes.", time: "2h" },
];
const refreshes = ref(0);
const latest = ref<number | null>(null);
const updates = computed(() => latest.value ? [{ id: latest.value, icon: Bell, title: "You’re all caught up", detail: "The activity feed was refreshed just now.", time: "now" }, ...activity] : activity);
let timer: ReturnType<typeof setTimeout> | undefined;
let release: (() => void) | undefined;
let disposed = false;
function refresh() { return new Promise<void>(resolve => { release = resolve; timer = setTimeout(() => { if (!disposed) { refreshes.value++; latest.value = Date.now(); } release = undefined; resolve(); }, 900); }); }
onBeforeUnmount(() => { disposed = true; clearTimeout(timer); release?.(); });
</script>
<template><div class="flex min-h-[34rem] w-full items-center justify-center p-4"><div class="w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"><PullToRefresh ariaLabel="Activity feed" class="h-[30rem]" :on-refresh="refresh"><header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-md"><div><p class="font-semibold text-foreground">Activity</p><p class="text-xs text-muted-foreground">Pull down to check for updates</p></div><span class="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{{ refreshes ? `${refreshes} refreshed` : 'live' }}</span></header><div class="divide-y divide-border px-2 pb-3"><article v-for="update in updates" :key="update.id" class="flex gap-3 px-3 py-4"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm"><component :is="update.icon" class="h-4 w-4" /></div><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-3"><p class="text-sm font-medium text-foreground">{{ update.title }}</p><span class="shrink-0 font-mono text-[10px] text-muted-foreground">{{ update.time }}</span></div><p class="mt-1 text-xs leading-relaxed text-muted-foreground">{{ update.detail }}</p></div></article></div></PullToRefresh></div></div></template>
