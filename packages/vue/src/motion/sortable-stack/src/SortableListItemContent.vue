<script setup lang="ts">
import { cn } from "../../../lib/utils";
</script>
<template><div :class="cn('min-w-0 flex-1 text-sm', $attrs.class)"><slot /></div></template>
