<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./index";
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
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
