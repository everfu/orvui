<script setup lang="ts">
import { NotFoundMagnetic } from "../index";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundMagnetic v-bind="navigation" /></div>
</template>
