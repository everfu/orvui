<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { SharedLayoutBg } from "./index";
const entries = [
  { title: "Inbox", body: "12 unread threads and 3 mentions today." }, { title: "Drafts", body: "4 posts are ready for a final review." },
  { title: "Releases", body: "Version 0.4.1 was released 2 days ago." }, { title: "Billing", body: "Your plan renews on the first next month." },
];
</script>
<template><div class="w-full max-w-lg px-2"><SharedLayoutBg>
  <button v-for="entry in entries" :key="entry.title" type="button" class="group flex flex-col gap-1 px-2 py-3 text-left"><div class="flex items-center justify-between gap-3"><span class="text-sm font-medium text-foreground">{{ entry.title }}</span><ArrowUpRight class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p class="text-sm text-muted-foreground">{{ entry.body }}</p></button>
</SharedLayoutBg></div></template>
