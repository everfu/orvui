<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { Globe2 } from "lucide-vue-next";
import { RenderNode, type Content } from "../../shared";
const props = defineProps<{ url?: string; icon?: Content }>();
const image = ref<HTMLImageElement>();
const failed = ref<string>();
const address = computed(() => {
  if (props.icon || !props.url) return undefined;
  try {
    return new URL("/favicon.ico", props.url).href;
  } catch {
    return undefined;
  }
});
let alive = false,
  revision = 0;
async function verify() {
  const request = ++revision;
  const url = address.value;
  if (!alive || !url) return;
  await nextTick();
  const candidate = image.value;
  if (!candidate || typeof candidate.decode !== "function") return;
  try {
    await candidate.decode();
  } catch {
    if (alive && request === revision) failed.value = url;
  }
}
watch(address, verify, { flush: "post" });
onMounted(() => {
  alive = true;
  verify();
});
onBeforeUnmount(() => {
  alive = false;
  revision++;
});
</script>
<template>
  <span
    aria-hidden="true"
    class="grid size-5 shrink-0 place-items-center text-muted-foreground [&>svg]:size-3.5"
  >
    <RenderNode v-if="icon" :node="icon" />
    <img
      v-else-if="address && failed !== address"
      ref="image"
      :src="address"
      alt=""
      width="16"
      height="16"
      referrerpolicy="no-referrer"
      class="size-4 rounded-sm object-contain"
      @error="failed = address"
    />
    <Globe2 v-else class="size-3.5" />
  </span>
</template>
