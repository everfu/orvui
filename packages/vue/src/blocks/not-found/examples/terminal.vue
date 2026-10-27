<script setup lang="ts">
import { NotFoundTerminal } from "../index";
const navigation = { homeHref: "/", browseHref: "/components/motion" };
</script>
<template>
  <div class="w-full"><NotFoundTerminal v-bind="navigation" /></div>
</template>
