<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "../button";
import { Popover, PopoverTrigger, PopoverContent } from "./index";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
