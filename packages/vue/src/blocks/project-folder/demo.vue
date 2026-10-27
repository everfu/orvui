<script setup lang="ts">
import { h } from "vue";
import { ProjectFolder } from "./index";
const sheets = [
  ["emerald", "#a7f3d0"],
  ["orange", "#fed7aa"],
  ["sky", "#bae6fd"],
  ["violet", "#ddd6fe"],
  ["amber", "#fef3c7"],
];
const previews = sheets.map(([id, background], index) => ({
  id,
  content: h(
    "span",
    { class: "relative block h-full w-full", style: { background } },
    [
      h("span", {
        class: "absolute left-3 top-3 h-2 w-8 rounded-full bg-black/15",
      }),
      ...["top-8", "top-11"].map((top) =>
        h("span", { class: `absolute inset-x-3 ${top} h-px bg-black/10` }),
      ),
      h(
        "span",
        {
          class: "absolute bottom-3 right-3 text-sm font-medium text-black/50",
        },
        String.fromCharCode(65 + index),
      ),
    ],
  ),
}));
</script>
<template>
  <div class="flex min-h-80 w-full items-center justify-center px-6 py-10">
    <ProjectFolder
      title="Brand direction"
      description="Updated recently"
      :count="5"
      :previews="previews"
    />
  </div>
</template>
