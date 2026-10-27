<script setup lang="ts">
import { SharedLayoutBg } from "../../shared-layout-bg";
import { cn } from "../../../lib/utils";
const list = "flex w-full min-w-0 list-none flex-col gap-0.5";
</script>
<template>
  <SharedLayoutBg
    as="ul"
    :inset="0"
    pill-class-name="rounded-xl bg-muted/70"
    pill-container-class-name="inset-y-auto top-0 h-9"
    data-slot="sidebar-menu"
    :class="cn(list, $attrs.class)"
    ><slot
  /></SharedLayoutBg>
</template>
