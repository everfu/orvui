<script setup lang="ts">
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { submenuItemVariants } from "./transitions";
const base = "relative min-w-0";
</script>
<template>
  <motion.li
    :variants="submenuItemVariants"
    data-slot="sidebar-menu-sub-item"
    :class="cn(base, $attrs.class)"
    ><slot
  /></motion.li>
</template>
