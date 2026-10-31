<script setup lang="ts">
import { ref } from "vue";
import { Check, Copy, Download, Eye, Pencil, Trash2 } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
} from "./index";
import { SPRING_SWAP } from "../../lib/ease";
import { useReducedMotion } from "../../lib/composables";
const message = ref<string | null>(null);
const offline = ref(false), reduce = useReducedMotion();
const items = [
  ["Open", Eye, "Folder opened", "↵"],
  ["Rename", Pencil, "Ready to rename", "R"],
  ["Duplicate", Copy, "Folder duplicated", "⌘D"],
  ["Download", Download, "Download started", undefined],
].map(([label, icon, message, shortcut]) => ({ label: label as string, icon, message: message as string, shortcut: shortcut as string | undefined }));
function checked(value: boolean) { offline.value = value; message.value = value ? "Available offline" : "Online only"; }
</script>
<template>
  <div class="flex min-h-[360px] w-full items-center justify-center">
    <ContextMenu
      ><ContextMenuTrigger
        ><button
          type="button"
          class="group flex flex-col items-center outline-none"
        >
          <div
            class="relative h-24 w-32 transition-transform duration-150 group-active:scale-[0.98] group-focus-visible:rounded-2xl group-focus-visible:ring-2 group-focus-visible:ring-foreground/20 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background"
          >
            <div
              class="absolute left-1 top-1 h-7 w-14 rounded-t-[10px] bg-[#d4a84f] dark:bg-[#a77d2f]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-5 rounded-[14px] bg-[#e7bb61] shadow-[0_14px_24px_-16px_rgba(90,58,8,0.75)] dark:bg-[#bd8d36]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-9 rounded-[14px] bg-[#efc86f] dark:bg-[#cb9a41]"
            />
            <div
              class="absolute inset-x-5 bottom-4 h-px bg-black/10 dark:bg-white/10"
            />
          </div>
          <span class="mt-4 text-sm font-medium text-foreground"
            >Right click on me</span
          >
          <div class="mt-1 h-4">
            <AnimatePresence mode="wait" :initial="false"
              ><motion.span
                v-if="message"
                :key="message"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 3, filter: 'blur(2px)' }
                "
                :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, filter: 'blur(2px)' }
                "
                :transition="reduce ? { duration: 0.1 } : SPRING_SWAP"
                class="flex items-center gap-1 text-[10px] text-muted-foreground"
                ><Check aria-hidden="true" class="h-3 w-3 text-success" />{{
                  message
                }}</motion.span
              ><motion.span v-else key="hint" class="text-[10px] text-muted-foreground"
                >or long-press · Shift + F10</motion.span
              ></AnimatePresence
            >
          </div>
        </button></ContextMenuTrigger
      ><ContextMenuContent ariaLabel="Folder actions" class="w-60"
        ><ContextMenuLabel>Project files</ContextMenuLabel
        ><ContextMenuItem
          v-for="item in items"
          :key="item.label"
          :text-value="item.label"
          @select="message = item.message"
          ><component :is="item.icon" aria-hidden="true" class="h-4 w-4" />{{
            item.label
          }}<ContextMenuShortcut v-if="item.shortcut">{{
            item.shortcut
          }}</ContextMenuShortcut></ContextMenuItem
        ><ContextMenuSeparator /><ContextMenuCheckboxItem
          text-value="Keep offline"
          :model-value="offline"
          :close-on-select="false"
          @update:model-value="checked"
          >Keep offline</ContextMenuCheckboxItem
        ><ContextMenuSeparator /><ContextMenuItem
          tone="destructive"
          text-value="Move to trash"
          @select="message = 'Moved to trash'"
          ><Trash2 aria-hidden="true" class="h-4 w-4" />Move to
          trash<ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem
        ></ContextMenuContent
      ></ContextMenu
    >
  </div>
</template>
