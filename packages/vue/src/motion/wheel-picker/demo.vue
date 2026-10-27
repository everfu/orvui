<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { WheelPicker } from "./index";
import { Switch } from "../switch";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, index) => String(index + 1980));
const month = ref("June");
const year = ref("2004");
const day = ref("9");
const sound = ref(false);
const days = computed(() => Array.from({ length: new Date(Number(year.value), months.indexOf(month.value) + 1, 0).getDate() }, (_, index) => String(index + 1)));
watch([day, days], () => { if (Number(day.value) > days.value.length) day.value = String(days.value.length); });
</script>
<template><div class="flex flex-col items-center gap-4"><span class="text-sm text-muted-foreground">Born <span class="font-medium text-foreground tabular-nums">{{ month }} {{ day }}, {{ year }}</span></span><div class="flex items-stretch gap-1 rounded-3xl border border-border bg-background p-2"><WheelPicker v-model="month" :options="months" class="w-32 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Month" /><WheelPicker v-model="day" :options="days" class="w-14 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Day" /><WheelPicker v-model="year" :options="years" class="w-20 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Year" /></div><Switch v-model="sound" label="Tick sound" class="origin-left scale-[0.85] [&_label]:text-sm" /></div></template>
