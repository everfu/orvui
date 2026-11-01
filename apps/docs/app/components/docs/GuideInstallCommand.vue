<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import CodePanel from "./CodePanel.vue";
const props = defineProps<{ code: string; en: boolean }>();
const manager = ref("pnpm");
const command = computed(() => {
  const packages = props.code.replace(/^pnpm add /, "");
  return `${manager.value === "npm" ? "npm install" : manager.value + " add"} ${packages}`;
});
</script>
<template>
  <div class="guide-install-command">
    <Tabs v-model="manager" variant="underline"
      ><TabsList
        class="guide-manager-list"
        :aria-label="en ? 'Package manager' : '包管理器'"
        ><TabsTrigger
          v-for="pm in ['pnpm', 'npm', 'yarn', 'bun']"
          :key="pm"
          :value="pm"
          >{{ pm }}</TabsTrigger
        ></TabsList
      ></Tabs
    >
    <CodePanel :code="command" :en="en" lang="bash" label="Terminal" />
  </div>
</template>
<style scoped>
.guide-install-command {
  margin-top: 16px;
  min-width: 0;
}
.guide-manager-list {
  gap: 16px;
}
.guide-install-command :deep(.code-panel) {
  margin-top: 8px;
}
</style>
