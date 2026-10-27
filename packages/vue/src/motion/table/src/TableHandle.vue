<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { MoreHorizontal, MoreVertical } from "lucide-vue-next";
import TableMenu, { type TableMenuItem } from "./TableMenu.vue";
const props = defineProps<{
    anchor: HTMLElement | null;
    orientation: "row" | "column";
    label: string;
    items: TableMenuItem[];
  }>(),
  emit = defineEmits(["enter", "leave"]);
const menuOpen = ref(false),
  rect = computed(() => props.anchor?.getBoundingClientRect());
const position = computed(() => {
  const box = rect.value;
  if (!box) return undefined;
  const row = props.orientation === "row";
  return {
    position: "fixed" as const,
    top: (row ? box.top + box.height / 2 : box.top) + "px",
    left: (row ? box.left : box.left + box.width / 2) + "px",
    transform: "translate(-50%,-50%)",
    zIndex: 40,
  };
});
function leave() {
  emit("leave");
}
function menuChange(open: boolean) {
  menuOpen.value = open;
  emit(open ? "enter" : "leave");
}
onMounted(() => {
  window.addEventListener("scroll", leave, true);
  window.addEventListener("resize", leave);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", leave, true);
  window.removeEventListener("resize", leave);
});
</script>
<template>
  <Teleport v-if="rect" to="body"
    ><div
      :style="position"
      @pointerenter="emit('enter')"
      @pointerleave="!menuOpen && emit('leave')"
    >
      <TableMenu
        :ariaLabel="label"
        :items="items"
        :trigger-class-name="
          orientation === 'row'
            ? 'flex h-6 w-2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
            : 'flex h-2 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
        "
        @open-change="menuChange"
        ><component
          :is="orientation === 'row' ? MoreVertical : MoreHorizontal"
          class="h-3 w-3"
      /></TableMenu></div
  ></Teleport>
</template>
