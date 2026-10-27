<script setup lang="ts">
import { ref } from "vue";
import {
  MorphSelect,
  MorphSelectTrigger,
  MorphSelectValue,
  MorphSelectContent,
  MorphSelectItem,
} from "../index";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <MorphSelect v-model="selected"
      ><MorphSelectTrigger
        ><MorphSelectValue placeholder="Pick a Vue tool" /></MorphSelectTrigger
      ><MorphSelectContent
        ><MorphSelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</MorphSelectItem
        ></MorphSelectContent
      ></MorphSelect
    >
  </div>
</template>
