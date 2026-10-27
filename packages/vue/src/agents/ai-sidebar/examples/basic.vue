<script setup lang="ts">
import { ref } from "vue";
import { AISidebar, type SidebarResource } from "../index";
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarProvider,
} from "../../../motion/animated-sidebar";
const items = ref<SidebarResource[]>([
  {
    id: "project",
    label: "Website redesign",
    kind: "project",
    children: [
      { id: "brief", label: "Project brief", kind: "file" },
      { id: "research", label: "Research links", kind: "bookmark" },
    ],
  },
  { id: "archive", label: "Archive", kind: "folder" },
]);
async function saveResourceMove(_move: unknown) {
  await Promise.resolve();
}
</script>
<template>
  <AnimatedSidebarProvider class="min-h-0 h-80"
    ><AnimatedSidebar aria-label="Project resources" collapsible="offcanvas"
      ><AnimatedSidebarContent
        ><AnimatedSidebarGroup
          ><AnimatedSidebarGroupLabel>Resources</AnimatedSidebarGroupLabel
          ><AnimatedSidebarGroupContent
            ><AISidebar
              v-model:items="items"
              :default-expanded-ids="['project']"
              :on-move="
                saveResourceMove
              " /></AnimatedSidebarGroupContent></AnimatedSidebarGroup></AnimatedSidebarContent></AnimatedSidebar
  ></AnimatedSidebarProvider>
</template>
