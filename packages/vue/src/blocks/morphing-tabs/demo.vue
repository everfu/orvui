<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { MorphingTabs, type MorphingTabsItem } from "./index";
const rooms: Record<
  string,
  { eyebrow: string; title: string; detail: string; accent: string }
> = {
  "room-2": {
    eyebrow: "quiet focus",
    title: "Room 2",
    detail:
      "A small space for the work that needs a little more air around it.",
    accent: "#db5b2f",
  },
  general: {
    eyebrow: "shared space",
    title: "General",
    detail:
      "The common room for notes, links and the ideas that are still finding their shape.",
    accent: "#1bb273",
  },
  archive: {
    eyebrow: "kept close",
    title: "Archive",
    detail:
      "Past rooms stay available without competing with the conversations in motion.",
    accent: "#7a6de2",
  },
};
const items = shallowRef<MorphingTabsItem[]>(
    Object.keys(rooms).map((id) => ({
      id,
      label: rooms[id].title,
      content: "",
    })),
  ),
  value = ref<string | null>("room-2");
function order(ids: string[]) {
  items.value = ids.flatMap((id) => {
    const item = items.value.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
}
function close(id: string) {
  items.value = items.value.filter((item) => item.id !== id);
  if (value.value === id) value.value = items.value[0]?.id ?? null;
}
</script>
<template>
  <div
    class="flex w-full min-w-0 items-center justify-center bg-[#242424] p-3 md:p-8"
  >
    <MorphingTabs
      v-model="value"
      :items="items"
      aria-label="Rooms"
      class="w-full max-w-5xl"
      @order-change="order"
      @close="close"
      ><template #content="{ item }"
        ><div
          class="relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#dfe2e3_1px,transparent_1.5px)] bg-[size:4.8rem_4.8rem] px-7 py-8 md:px-12 md:py-10"
        >
          <div class="relative max-w-xl">
            <p
              class="text-[.68rem] font-semibold uppercase tracking-[.24em] text-black/40"
            >
              {{ rooms[item.id].eyebrow }}
            </p>
            <h3
              class="mt-3 text-3xl font-light tracking-[-.055em] text-[#151515] md:text-5xl"
            >
              {{ rooms[item.id].title }}
            </h3>
            <p
              class="mt-4 max-w-md text-sm leading-6 text-black/55 md:text-base"
            >
              {{ rooms[item.id].detail }}
            </p>
            <div
              class="mt-8 flex items-center gap-3 text-xs font-medium text-black/50"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: rooms[item.id].accent }"
              />drag any room to reorder
            </div>
          </div>
        </div></template
      ></MorphingTabs
    >
  </div>
</template>
