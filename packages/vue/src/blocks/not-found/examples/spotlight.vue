<script setup lang="ts">
import { NotFoundSpotlight } from "../index";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundSpotlight v-bind="navigation" /></div>
</template>
