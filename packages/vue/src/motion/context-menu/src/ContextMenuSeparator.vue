<script setup lang="ts">
import { h, useAttrs } from "vue";
import { cn } from "../../../lib/utils";
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();
const separatorGeometry = ["-mx-1", "my-1", "h-px", "border-0", "bg-border"];
const RenderFrame = () =>
  h("hr", { ...attrs, class: cn(separatorGeometry, attrs.class) });
</script>
<template><RenderFrame /></template>
