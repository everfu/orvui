<script setup lang="ts">
import { onBeforeUnmount, reactive } from "vue";
import { ArrowRight } from "lucide-vue-next";
import { StatefulButton, type ButtonState } from "../index";
const states = reactive<{ ok: ButtonState; err: ButtonState }>({ ok: "idle", err: "idle" });
const scheduled = new Set<ReturnType<typeof setTimeout>>();
function after(delay: number, callback: () => void) {
  const timer = setTimeout(() => { scheduled.delete(timer); callback(); }, delay);
  scheduled.add(timer);
}
function run(key: "ok" | "err") {
  if (states[key] === "loading") return;
  states[key] = "loading";
  after(1400, () => { states[key] = key === "ok" ? "success" : "error"; after(1800, () => { states[key] = "idle"; }); });
}
onBeforeUnmount(() => { scheduled.forEach(timer => clearTimeout(timer)); scheduled.clear(); });
</script>
<template><div class="flex flex-col items-center justify-center gap-3">
  <StatefulButton :state="states.ok" loading-text="Saving" success-text="Saved" :icon="ArrowRight" @click="run('ok')">Save changes</StatefulButton>
  <StatefulButton :state="states.err" variant="secondary" loading-text="Submitting" error-text="Failed" @click="run('err')">Submit</StatefulButton>
</div></template>
