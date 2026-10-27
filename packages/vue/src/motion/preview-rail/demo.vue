<script setup lang="ts">
import { PreviewRail } from "./index";
const sections = [
  ["dashboard", "Dashboard", "Return to your workspace overview and recent activity."],
  ["components", "Components", "Browse motion primitives for Vue."],
  ["blocks", "Blocks", "Explore composed, product-ready interface blocks."],
  ["playground", "Playground", "Tune motion values and preview behavior live."],
  ["docs", "Documentation", "Read installation, usage, and API reference notes."],
  ["changelog", "Changelog", "Review newly launched components and improvements."],
  ["source", "Open source", "Explore the component source and implementation notes."],
  ["patterns", "Patterns", "Combine components in reusable interface patterns."],
  ["examples", "Examples", "See components composed in practical interface patterns."],
  ["templates", "Templates", "Start from polished layouts built with orvui components."],
  ["guides", "Guides", "Learn how to combine motion primitives effectively."],
  ["community", "Community", "Discover what other builders are creating with orvui."],
  ["github", "GitHub", "View the source, report issues, and contribute improvements."],
  ["about", "About", "Learn more about the ideas and people behind orvui."],
].map(([id, label, description]) => ({ id, label, description, href: `#${id}` }));
</script>
<template><div class="flex w-full flex-col gap-8"><PreviewRail v-for="orientation in ['vertical', 'horizontal'] as const" :key="orientation" :items="sections" :orientation="orientation" default-active-id="docs" :class="['mx-auto w-full max-w-2xl', orientation === 'vertical' ? 'h-[360px]' : 'h-[280px]']" /></div></template>
