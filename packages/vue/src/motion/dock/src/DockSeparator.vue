<script setup lang="ts">
import { cn } from "../../../lib/utils";
</script>
<template><span :class="cn('mx-1 h-6 w-px self-center bg-border', $attrs.class)"><slot /></span></template>
