<script setup lang="ts">
import logo from "../../../../assets/brand/logo-horizontal.svg?raw";
import mark from "../../../../assets/brand/logo-mark.svg?raw";

// Trusted project asset; retain its paths and provenance, without repeated IDs.
const markup = logo.replace(/\s+id="[^"]*"/g, "");
const markMarkup = mark.replace(/\s+id="[^"]*"/g, "");
</script>

<template>
  <span class="site-logo" aria-hidden="true">
    <span class="site-logo-full" v-html="markup" />
    <span class="site-logo-mark" v-html="markMarkup" />
  </span>
</template>

<style scoped>
.site-logo {
  display: inline-flex;
  flex-shrink: 0;
  width: calc(var(--orvui-logo-height, 24px) * 3.75459375);
  height: var(--orvui-logo-height, 24px);
  line-height: 0;
}
.site-logo :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
.site-logo-full {
  display: block;
  width: 100%;
  height: 100%;
}
.site-logo-mark {
  display: none;
  width: 100%;
  height: 100%;
}
@media (max-width: 380px) {
  .site-logo--header {
    width: var(--orvui-logo-height, 24px);
  }
  .site-logo--header .site-logo-full {
    display: none;
  }
  .site-logo--header .site-logo-mark {
    display: block;
  }
}
</style>
