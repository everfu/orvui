<script setup lang="ts">
import { motion, AnimatePresence } from "motion-v";
import {
  Plus,
  X,
  FileText,
  LayoutGrid,
  Table,
  FolderClosed,
  Bell,
  Link,
} from "lucide-vue-next";
import { RenderNode, type Content } from "../../shared";
import { cn } from "../../../lib/utils";
import { useBloom } from "./use-bloom";
import BloomMenuItemContent from "./BloomMenuItemContent.vue";
export interface BloomMenuItem {
  label: string;
  icon: Content;
}
const props = withDefaults(
  defineProps<{ items?: BloomMenuItem[]; className?: string }>(),
  {
    items: () => [
      { label: "Doc", icon: FileText },
      { label: "Board", icon: LayoutGrid },
      { label: "Table", icon: Table },
      { label: "Folder", icon: FolderClosed },
      { label: "Reminder", icon: Bell },
      { label: "Link", icon: Link },
    ],
  },
);
const emit = defineEmits<{ select: [label: string] }>();
const {
  open,
  root,
  active,
  reduce,
  id,
  buttons,
  morph,
  close,
  setTrigger,
  show,
  gridKey,
  blur,
  delay,
  contentOpacity,
  clipPath,
} = useBloom(() => props.items.map((item) => item.label));
</script>
<template>
  <div ref="root" :class="cn('relative inline-flex', className)">
    <div class="h-11 w-36" aria-hidden="true" />
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 z-30 grid h-[300px] w-[min(86vw,420px)] -translate-x-1/2 -translate-y-1/2 place-items-center [&>*]:pointer-events-auto"
    >
      <AnimatePresence :initial="false" mode="popLayout">
        <motion.div
          v-if="open"
          key="panel"
          :layout-id="id + '-surface'"
          :transition="morph"
          :style="{ borderRadius: '16px' }"
          class="w-[min(86vw,420px)] overflow-hidden border border-border bg-card"
          @focusout="blur"
          ><motion.div
            layout
            :initial="false"
            :style="{ opacity: contentOpacity }"
            ><div
              class="flex items-center justify-between border-b border-border px-4 py-3"
            >
              <span
                :id="id + '-label'"
                class="text-sm font-medium text-muted-foreground"
                >Create</span
              ><button
                type="button"
                aria-label="Close menu"
                class="rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                @click="close(true)"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <motion.div
              :id="id"
              :style="{ clipPath }"
              role="menu"
              :aria-labelledby="id + '-label'"
              class="grid grid-cols-3"
              @keydown="gridKey"
              ><button
                v-for="(item, index) in items"
                :key="item.label"
                :ref="
                  (node) => {
                    if (node)
                      buttons.set(item.label, node as HTMLButtonElement);
                    else buttons.delete(item.label);
                  }
                "
                type="button"
                role="menuitem"
                :tabindex="index === active ? 0 : -1"
                :class="
                  cn(
                    'flex items-center justify-center px-3 py-6 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:bg-muted/60 focus-visible:text-foreground',
                    index % 3 !== 2 && 'border-r border-border',
                    index < 3 && 'border-b border-border',
                  )
                "
                @focus="active = index"
                @click="
                  emit('select', item.label);
                  close(true);
                "
              >
                <BloomMenuItemContent :reduce="reduce" :delay="delay(index)"
                  ><span class="[&_svg]:h-5 [&_svg]:w-5"
                    ><RenderNode :node="item.icon" /></span
                  ><span class="text-sm font-medium">{{
                    item.label
                  }}</span></BloomMenuItemContent
                >
              </button></motion.div
            ></motion.div
          ></motion.div
        >
        <motion.button
          v-else
          key="trigger"
          :ref="setTrigger"
          type="button"
          :layout-id="id + '-surface'"
          :transition="morph"
          :style="{ borderRadius: '16px' }"
          aria-haspopup="menu"
          :aria-expanded="open"
          :aria-controls="id"
          :while-press="reduce ? undefined : { scale: 0.97 }"
          class="inline-flex h-11 w-36 items-center justify-center border border-border bg-card text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="show"
          @keydown="
            if (['ArrowDown', 'ArrowUp'].includes($event.key)) {
              $event.preventDefault();
              show();
            }
          "
          ><motion.span
            layout
            class="inline-flex items-center gap-2 whitespace-nowrap"
            >Create<Plus class="h-4 w-4" /></motion.span
        ></motion.button>
      </AnimatePresence>
    </div>
  </div>
</template>
