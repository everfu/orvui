<script setup lang="ts">
import { NotFoundGlitch } from "../index";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundGlitch v-bind="navigation" /></div>
</template>
