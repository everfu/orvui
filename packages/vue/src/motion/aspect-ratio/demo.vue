<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { AspectRatio, AspectRatioImage } from "./index";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
const labels = ["21:9", "16:9", "3:2", "4:3", "1:1", "4:5", "3:4", "2:3", "9:16"];
const selected = ref("16:9"), id = useId();
const ratio = computed(() => { const [width, height] = selected.value.split(":").map(Number); return width! / height!; });
const panelId = `${id}-preview`;
</script>
<template>
  <div class="mx-auto w-full max-w-xl min-w-0 px-4 py-6"><Tabs v-model="selected">
    <TabsList aria-label="Aspect ratio" class="mx-auto bg-muted"><TabsTrigger v-for="label in labels" :key="label" :value="label"
      :id="`${id}-${label}`" :aria-controls="panelId" :tabindex="selected === label ? 0 : -1" indicator-class-name="bg-background"
      class="min-h-9 px-3 text-xs [&_[data-tabs-label]]:text-foreground">{{ label }}</TabsTrigger></TabsList>
    <div :id="panelId" role="tabpanel" :aria-labelledby="`${id}-${selected}`" :tabindex="0"
      class="mt-6 flex h-[25rem] w-full items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <AspectRatio :ratio="ratio" class="bg-muted" :style="{ maxWidth: `${Math.min(440, 360 * ratio)}px`, borderRadius: '16px' }">
        <AspectRatioImage src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80"
          alt="A lakeside cabin beneath mountains, reflected in the water" :width="1000" :height="667" />
      </AspectRatio>
    </div>
  </Tabs></div>
</template>
