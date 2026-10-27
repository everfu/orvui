<script setup lang="ts">
import { computed, ref } from "vue";
import { Shield } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { crestSrc, initials } from "./wheel-model";
import type { Team } from "./types";
const props = defineProps<{ team: Team | null }>(),
  failed = ref<string | null>(null);
const src = computed(() => {
  const url = props.team ? crestSrc(props.team) : null;
  return failed.value === url ? null : url;
});
</script>
<template>
  <span class="flex h-5 w-7 shrink-0 items-center justify-center"
    ><img
      v-if="src"
      :src="src"
      alt=""
      loading="lazy"
      :draggable="false"
      :class="
        cn(
          'shrink-0 rounded-[4px] border border-border/40',
          team?.logo
            ? 'h-5 w-5 border-transparent object-contain'
            : 'h-5 w-7 object-cover',
        )
      "
      @error="failed = src" /><span
      v-else-if="team"
      class="grid size-5 place-items-center rounded-full bg-foreground/10 text-[10px] font-semibold leading-none text-foreground"
      >{{ initials(team.name) }}</span
    ><Shield v-else class="size-5 fill-current text-muted-foreground/50"
  /></span>
</template>
