<script setup lang="ts">
import { useRoute, createError } from "#imports";
import DocsPageContent from "../components/docs/DocsPageContent.vue";

// Throw from page setup so an initial error-page hydration does not re-run a
// failing route validator during Nuxt's router initialization.
if (!useRoute().meta.orvuiPage)
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
</script>
<template><DocsPageContent /></template>
