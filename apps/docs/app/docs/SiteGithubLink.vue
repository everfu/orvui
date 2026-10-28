<script setup lang="ts">
import GithubIcon from "./GithubIcon.vue";
import { formatGithubStars, githubRepository } from "./github";
defineProps<{ stars: number | null; en: boolean }>();
</script>
<template>
  <a
    :href="githubRepository"
    target="_blank"
    rel="noopener noreferrer"
    class="site-action header-control github-control"
    :aria-label="
      stars === null
        ? en
          ? 'orvui on GitHub'
          : '在 GitHub 查看 orvui'
        : en
          ? `orvui on GitHub, ${stars} stars`
          : `在 GitHub 查看 orvui，${stars} 颗星`
    "
  >
    <GithubIcon :size="14" />
    <span>{{ stars === null ? "GitHub" : formatGithubStars(stars) }}</span>
  </a>
</template>
