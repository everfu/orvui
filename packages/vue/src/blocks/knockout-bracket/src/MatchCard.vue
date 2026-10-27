<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../../lib/utils";
import { finished } from "./bracket-model";
import TeamCrest from "./TeamCrest.vue";
import type { Match } from "./types";
const props = defineProps<{ match: Match }>();
const decided = computed(
  () => finished(props.match) && props.match.winner != null,
);
const badge = computed(
  () =>
    props.match.badge ??
    (finished(props.match)
      ? props.match.home.penalties != null || props.match.away.penalties != null
        ? "FT (P)"
        : "FT"
      : null),
);
</script>
<template>
  <div
    :style="{ width: '250px', height: '124px' }"
    class="rounded-2xl border border-border bg-card p-4"
  >
    <div class="mb-3 flex h-5 items-center justify-between gap-2">
      <span
        class="min-w-0 flex-1 truncate text-sm leading-5 text-muted-foreground"
        >{{ [match.date, match.time].filter(Boolean).join(", ") }}</span
      ><span
        v-if="badge"
        class="shrink-0 rounded-full bg-background px-2.5 text-xs font-medium leading-5 text-muted-foreground"
        >{{ badge }}</span
      >
    </div>
    <div class="space-y-2.5">
      <div
        v-for="side in ['home', 'away'] as const"
        :key="side"
        class="flex items-center gap-3"
      >
        <TeamCrest :team="match[side].team" /><span
          :class="
            cn(
              'min-w-0 flex-1 truncate text-base font-medium',
              decided && match.winner !== side && 'text-muted-foreground',
            )
          "
          >{{ match[side].team?.name ?? "TBD" }}</span
        ><span
          v-if="match[side].score != null"
          :class="
            cn(
              'shrink-0 text-base font-medium tabular-nums',
              decided && match.winner !== side && 'text-muted-foreground',
            )
          "
          >{{
            match[side].penalties == null
              ? match[side].score
              : `${match[side].score} (${match[side].penalties})`
          }}</span
        ><span class="flex w-1.5 shrink-0 items-center"
          ><svg
            v-if="decided && match.winner === side"
            viewBox="0 0 6 8"
            aria-hidden="true"
            class="h-2 w-1.5 shrink-0 fill-foreground"
          >
            <path d="M6 0 0 4 6 8Z" /></svg
        ></span>
      </div>
    </div>
  </div>
</template>
