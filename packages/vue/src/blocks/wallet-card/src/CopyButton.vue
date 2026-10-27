<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Check, Copy } from "lucide-vue-next";
import { ActionSwapIcon } from "../../../motion/action-swap";
const props = defineProps<{ value: string }>(),
  copied = ref(false);
let reset: ReturnType<typeof setTimeout> | undefined,
  disposed = false;
async function copy() {
  try {
    await navigator.clipboard.writeText(props.value);
  } catch {}
  if (disposed) return;
  copied.value = true;
  clearTimeout(reset);
  reset = setTimeout(() => {
    copied.value = false;
  }, 1400);
}
onBeforeUnmount(() => {
  disposed = true;
  clearTimeout(reset);
});
</script>
<template>
  <button
    type="button"
    :aria-label="copied ? 'Copied' : 'Copy address'"
    class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
    @click.stop="copy"
  >
    <ActionSwapIcon
      :value="copied ? 'check' : 'copy'"
      animation="cascade"
      class="h-3.5 w-3.5"
      ><Check v-if="copied" class="h-3.5 w-3.5 text-emerald-500" /><Copy
        v-else
        class="h-3.5 w-3.5"
    /></ActionSwapIcon>
  </button>
</template>
