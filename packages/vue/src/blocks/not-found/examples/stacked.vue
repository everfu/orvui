<script setup lang="ts">
import { NotFoundStacked } from "../index";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundStacked v-bind="navigation" /></div>
</template>
