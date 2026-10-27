<script setup lang="ts">
import { motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
const layout = "position" as const;
</script>
<template>
  <motion.li
    :layout="layout"
    :transition="SPRING_LAYOUT"
    data-slot="sidebar-menu-item"
    :class="cn('relative', $attrs.class)"
    ><slot
  /></motion.li>
</template>
