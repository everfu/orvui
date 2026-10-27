<script setup lang="ts">
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
const layout =
  "relative flex min-h-svh min-w-0 flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-sm";
</script>
<template>
  <motion.main data-slot="sidebar-inset" :class="cn(layout, $attrs.class)"
    ><slot
  /></motion.main>
</template>
